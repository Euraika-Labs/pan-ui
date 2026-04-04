import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { buildRealContext } from '@/server/hermes/real-memory';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookieProfileId = await getSelectedProfileFromCookie();
  const activeProfileId = searchParams.get('profileId') || cookieProfileId;
  const activeSessionId = searchParams.get('sessionId');
  return NextResponse.json({ context: buildRealContext(activeProfileId, activeSessionId) });
}
