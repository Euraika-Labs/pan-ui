import { NextResponse } from 'next/server';
import { addAuditEvent } from '@/server/audit/audit-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { readRealMemory, writeRealMemory } from '@/server/hermes/real-memory';

export async function GET() {
  const profileId = await getSelectedProfileFromCookie();
  return NextResponse.json({ entries: readRealMemory(profileId, 'agent') });
}

export async function PATCH(request: Request) {
  const profileId = await getSelectedProfileFromCookie();
  const body = (await request.json()) as { content?: string };
  const entries = writeRealMemory(profileId, 'agent', body.content ?? '');
  addAuditEvent('memory_updated', 'memory', 'agent', 'Updated agent prompt memory entries.');
  return NextResponse.json({ entries });
}
