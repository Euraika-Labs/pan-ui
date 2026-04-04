import { execFileSync } from 'node:child_process';

export class ServerBridgeError extends Error {
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = 'ServerBridgeError';
  }
}

export function execPython(script: string, args: string[] = [], options?: { timeout?: number; suppressStderr?: boolean }) {
  try {
    return execFileSync('python3', ['-c', script, ...args], {
      encoding: 'utf-8',
      timeout: options?.timeout,
      stdio: options?.suppressStderr ? ['ignore', 'pipe', 'ignore'] : undefined,
    });
  } catch (error) {
    throw new ServerBridgeError('Python bridge execution failed', {
      args,
      timeout: options?.timeout,
      suppressStderr: options?.suppressStderr,
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

export function execPythonJson<T>(script: string, args: string[] = [], options?: { timeout?: number; suppressStderr?: boolean }) {
  const output = execPython(script, args, options);
  try {
    return JSON.parse(output) as T;
  } catch (error) {
    throw new ServerBridgeError('Python bridge returned invalid JSON', {
      output,
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}
