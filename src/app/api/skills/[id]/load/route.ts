import { NextResponse } from 'next/server';
import { loadSkillIntoSession } from '@/server/skills/skill-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { addRealSessionLoadedSkill } from '@/server/hermes/real-sessions';
import { getRealSkill, loadRealSkillIntoSession } from '@/server/hermes/real-skills';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { sessionId?: string };
  if (!body.sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }
  try {
    const profileId = await getSelectedProfileFromCookie();
    const realSkill = getRealSkill(profileId, id);
    const skill = realSkill
      ? { ...realSkill, loadedInSessions: [body.sessionId] }
      : loadSkillIntoSession(id, body.sessionId);
    if (realSkill) {
      loadRealSkillIntoSession(profileId, body.sessionId, id);
      addRealSessionLoadedSkill(profileId, body.sessionId, id);
    }
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load skill into session' }, { status: 404 });
  }
}
