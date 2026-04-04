import { NextResponse } from 'next/server';
import { addAuditEvent } from '@/server/audit/audit-store';
import { PROFILE_COOKIE_NAME, getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { createRealProfile } from '@/server/hermes/real-profile-actions';
import { listRealProfiles } from '@/server/hermes/real-profiles';

export async function GET() {
  const activeProfile = await getSelectedProfileFromCookie();
  return NextResponse.json({ profiles: listRealProfiles(activeProfile) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; policyPreset?: 'safe-chat' | 'research' | 'builder' | 'full-power' };
  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const profile = createRealProfile(body.name.trim(), body.policyPreset);
  addAuditEvent('profile_created', 'profile', profile.id, `Created profile ${profile.name}.`);
  const response = NextResponse.json({ profile }, { status: 201 });
  response.cookies.set(PROFILE_COOKIE_NAME, profile.id, { path: '/' });
  return response;
}
