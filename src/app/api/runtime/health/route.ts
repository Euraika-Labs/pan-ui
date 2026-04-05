import { NextResponse } from 'next/server';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { getHermesRuntimeStatus } from '@/server/hermes/runtime-bridge';

export async function GET(request: Request) {
  const runtime = await getHermesRuntimeStatus();
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') || '').toLowerCase();
  let doctorOutput = '';
  let doctorOk = false;
  try {
    doctorOutput = execFileSync('hermes', ['doctor'], { encoding: 'utf-8', timeout: 20000 });
    doctorOk = true;
  } catch (error) {
    doctorOutput = error instanceof Error ? error.message : 'doctor failed';
  }

  const checks = [
    {
      key: 'hermes-binary',
      ok: Boolean(runtime.hermesPath),
      detail: runtime.hermesPath ? `Detected Hermes binary at ${runtime.hermesPath}.` : 'Hermes binary was not detected on PATH.',
      remediation: 'Install Hermes locally and make sure `hermes` is available on PATH.',
    },
    {
      key: 'config-home',
      ok: Boolean(runtime.configPath && fs.existsSync(runtime.configPath)),
      detail: runtime.configPath ? `Config path: ${runtime.configPath}` : 'Runtime config path is unavailable.',
      remediation: 'Confirm HERMES_HOME and restore config.yaml for the selected runtime home.',
    },
    {
      key: 'api-reachability',
      ok: runtime.apiReachable,
      detail: runtime.apiMessage,
      remediation: 'Start or reconnect the Hermes API before sending new chat requests.',
    },
    {
      key: 'profile-context',
      ok: Boolean(runtime.profileContext?.usingRequestedProfile),
      detail: runtime.profileContext?.label || 'Profile context unavailable.',
      remediation: 'Switch profiles again if the requested WebUI profile differs from the active Hermes runtime profile.',
    },
    {
      key: 'memory-files',
      ok: Boolean(runtime.memoryFilesPresent?.length),
      detail: runtime.memoryFilesPresent?.length ? `Detected memory files: ${runtime.memoryFilesPresent.join(', ')}.` : 'No USER.md or MEMORY.md files were detected.',
      remediation: 'Create memory files if your profile depends on persisted memory context.',
    },
    {
      key: 'mcp-config',
      ok: runtime.mcpServers.length > 0,
      detail: runtime.mcpServers.length ? `${runtime.mcpServers.length} MCP server(s) configured.` : 'No MCP servers configured for this profile.',
      remediation: 'Add or validate MCP servers in config.yaml, then probe them from Settings → Diagnostics.',
    },
    {
      key: 'doctor',
      ok: doctorOk,
      detail: doctorOk ? 'Hermes doctor completed successfully.' : runtime.lastFailureText || 'Hermes doctor failed.',
      remediation: 'Inspect the doctor output below for exact runtime failure details.',
    },
  ].filter((check) => (!query ? true : `${check.key} ${check.detail} ${check.remediation}`.toLowerCase().includes(query)));

  return NextResponse.json({
    runtime,
    checks,
    doctorOutput,
    summary: {
      okCount: checks.filter((check) => check.ok).length,
      failingCount: checks.filter((check) => !check.ok).length,
    },
  });
}
