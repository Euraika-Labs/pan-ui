/**
 * Gateway Lifecycle Manager
 *
 * Automatically detects and starts the Hermes gateway when Pan boots.
 * If the gateway is already running (e.g. via systemd), it leaves it alone.
 * If not, it spawns `hermes gateway run` as a child process that stops
 * when Pan stops.
 *
 * Works for any user/profile — no hardcoded paths or profile names.
 * Hermes uses its own active profile detection.
 */

import { spawn, execSync, type ChildProcess } from 'child_process';
import { hermesConfig } from '@/server/hermes/config';

let gatewayProcess: ChildProcess | null = null;
let healthCheckInterval: ReturnType<typeof setInterval> | null = null;

/** Check if the gateway is reachable */
async function isGatewayHealthy(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${hermesConfig.baseUrl}/health`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

/** Find the hermes binary, returns null if not installed */
function findHermesBinary(): string | null {
  try {
    const bin = execSync('which hermes', { encoding: 'utf-8', timeout: 5000 }).trim();
    return bin || null;
  } catch {
    return null;
  }
}

/** Spawn the gateway as a child process */
function spawnGateway(hermesBin: string): ChildProcess {
  console.log('[gateway-manager] Starting hermes gateway...');

  const child = spawn(hermesBin, ['gateway', 'run'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
    env: {
      ...process.env,
      API_SERVER_ENABLED: 'true',
      API_SERVER_PORT: String(new URL(hermesConfig.baseUrl).port || '8642'),
      API_SERVER_CORS_ORIGINS: [
        'http://localhost:3199',
        'http://127.0.0.1:3199',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ].join(','),
    },
  });

  child.stdout?.on('data', (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg) console.log(`[hermes-gateway] ${msg}`);
  });

  child.stderr?.on('data', (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg) console.error(`[hermes-gateway] ${msg}`);
  });

  child.on('exit', (code, signal) => {
    console.log(`[gateway-manager] Gateway exited (code=${code}, signal=${signal})`);
    gatewayProcess = null;
  });

  return child;
}

/**
 * Initialize the gateway manager.
 * Call this once at Pan startup (e.g. from instrumentation.ts).
 */
export async function ensureGateway(): Promise<void> {
  // Already running externally (systemd, manual, etc.)?
  if (await isGatewayHealthy()) {
    console.log('[gateway-manager] Gateway already running at', hermesConfig.baseUrl);
    return;
  }

  // Find hermes
  const hermesBin = findHermesBinary();
  if (!hermesBin) {
    console.warn(
      '[gateway-manager] hermes CLI not found in PATH. Chat will not work.\n' +
      '  Install: pip install hermes-agent   or   pipx install hermes-agent'
    );
    return;
  }

  // Spawn it
  gatewayProcess = spawnGateway(hermesBin);

  // Wait for it to become healthy (up to 15s)
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await isGatewayHealthy()) {
      console.log('[gateway-manager] Gateway is ready at', hermesConfig.baseUrl);
      return;
    }
    // Process died?
    if (gatewayProcess?.exitCode !== null) {
      console.error('[gateway-manager] Gateway process exited unexpectedly');
      gatewayProcess = null;
      return;
    }
  }

  console.warn('[gateway-manager] Gateway did not become healthy within 15s');
}

/**
 * Start periodic health checks and auto-restart if the gateway dies.
 * Only restarts if Pan originally spawned it (not external).
 */
export function startHealthMonitor(): void {
  if (healthCheckInterval) return;

  healthCheckInterval = setInterval(async () => {
    // Only auto-restart if we were the ones who spawned it
    if (gatewayProcess && gatewayProcess.exitCode !== null) {
      console.log('[gateway-manager] Gateway died, restarting...');
      const hermesBin = findHermesBinary();
      if (hermesBin) {
        gatewayProcess = spawnGateway(hermesBin);
      }
    }
  }, 30_000);
}

/** Gracefully stop the managed gateway (called on Pan shutdown) */
export function stopGateway(): void {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
  if (gatewayProcess && gatewayProcess.exitCode === null) {
    console.log('[gateway-manager] Stopping gateway...');
    gatewayProcess.kill('SIGTERM');
    // Force kill after 5s
    setTimeout(() => {
      if (gatewayProcess && gatewayProcess.exitCode === null) {
        gatewayProcess.kill('SIGKILL');
      }
    }, 5000);
  }
}

// Cleanup on process exit
process.on('SIGINT', stopGateway);
process.on('SIGTERM', stopGateway);
process.on('exit', stopGateway);
