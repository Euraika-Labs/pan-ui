import { NextResponse } from 'next/server';
import { createSession, listSessions } from '@/server/chat/session-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { createRealSession, listRealSessions } from '@/server/hermes/real-sessions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') ?? undefined;
  const profileId = await getSelectedProfileFromCookie();
  const mockSessions = listSessions(search);
  const realSessions = listRealSessions(profileId, search);
  const seen = new Set(mockSessions.map((s) => s.id));
  const merged = [...mockSessions, ...realSessions.filter((s) => !seen.has(s.id))];
  return NextResponse.json({ sessions: merged });
}

export async function POST() {
  const profileId = await getSelectedProfileFromCookie();
  try {
    const { session } = createRealSession(profileId);
    return NextResponse.json({ session }, { status: 201 });
  } catch {
    const session = createSession();
    return NextResponse.json({ session }, { status: 201 });
  }
}
