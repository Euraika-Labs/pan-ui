import { NextResponse } from 'next/server';
import { forkSession } from '@/server/chat/session-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { forkRealSession, getRealSession } from '@/server/hermes/real-sessions';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const profileId = await getSelectedProfileFromCookie();
    const session = getRealSession(profileId, id) ? forkRealSession(profileId, id).session : forkSession(id);
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to fork session' }, { status: 404 });
  }
}
