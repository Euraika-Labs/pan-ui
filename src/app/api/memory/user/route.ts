import { NextResponse } from 'next/server';
import { addAuditEvent } from '@/server/audit/audit-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { readRealMemory, readRealMemoryRaw, readGlobalMemory, readGlobalMemoryRaw, writeRealMemory } from '@/server/hermes/real-memory';

export async function GET() {
  const profileId = await getSelectedProfileFromCookie();
  const entries = readRealMemory(profileId, 'user');
  const raw = readRealMemoryRaw(profileId, 'user');
  const globalEntries = readGlobalMemory('user');
  const globalRaw = readGlobalMemoryRaw('user');
  return NextResponse.json({ entries, raw, globalEntries, globalRaw });
}

export async function PATCH(request: Request) {
  const profileId = await getSelectedProfileFromCookie();
  const body = (await request.json()) as { content?: string };
  const entries = writeRealMemory(profileId, 'user', body.content ?? '');
  const raw = readRealMemoryRaw(profileId, 'user');
  addAuditEvent('memory_updated', 'memory', 'user', 'Updated user prompt memory entries.');
  return NextResponse.json({ entries, raw });
}
