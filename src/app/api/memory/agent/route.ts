import { NextResponse } from 'next/server';
import { addAuditEvent } from '@/server/audit/audit-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { readRealMemory, readRealMemoryRaw, readGlobalMemory, readGlobalMemoryRaw, writeRealMemory } from '@/server/hermes/real-memory';

export async function GET() {
  const profileId = await getSelectedProfileFromCookie();
  const entries = readRealMemory(profileId, 'agent');
  const raw = readRealMemoryRaw(profileId, 'agent');
  const globalEntries = readGlobalMemory('agent');
  const globalRaw = readGlobalMemoryRaw('agent');
  return NextResponse.json({ entries, raw, globalEntries, globalRaw });
}

export async function PATCH(request: Request) {
  const profileId = await getSelectedProfileFromCookie();
  const body = (await request.json()) as { content?: string };
  const entries = writeRealMemory(profileId, 'agent', body.content ?? '');
  const raw = readRealMemoryRaw(profileId, 'agent');
  addAuditEvent('memory_updated', 'memory', 'agent', 'Updated agent prompt memory entries.');
  return NextResponse.json({ entries, raw });
}
