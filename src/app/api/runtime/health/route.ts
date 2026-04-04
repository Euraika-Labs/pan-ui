import { NextResponse } from 'next/server';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { getHermesRuntimeStatus } from '@/server/hermes/runtime-bridge';

export async function GET(request: Request) {
  const runtime = getHermesRuntimeStatus();
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

  const checks = {
    hermesBinary: Boolean(runtime.hermesPath),
    configExists: Boolean(runtime.configPath && fs.existsSync(runtime.configPath)),
    userMemoryExists: Boolean(runtime.userMemoryPath && fs.existsSync(runtime.userMemoryPath)),
    agentMemoryExists: Boolean(runtime.agentMemoryPath && fs.existsSync(runtime.agentMemoryPath)),
    mcpConfigured: runtime.mcpServers.length > 0,
    doctorOk,
  };
  const filteredChecks = query
    ? Object.fromEntries(Object.entries(checks).filter(([key, value]) => `${key} ${value}`.toLowerCase().includes(query)))
    : checks;

  return NextResponse.json({
    runtime,
    checks: filteredChecks,
    doctorOutput,
  });
}
