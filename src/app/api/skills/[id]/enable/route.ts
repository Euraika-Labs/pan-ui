import { NextResponse } from 'next/server';
import { disableSkill, enableSkill } from '@/server/skills/skill-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { getRealSkill, setRealSkillEnabled } from '@/server/hermes/real-skills';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { enabled?: boolean };
  try {
    const profileId = await getSelectedProfileFromCookie();
    const realSkill = getRealSkill(profileId, id);
    const skill = realSkill
      ? setRealSkillEnabled(profileId, id, body.enabled === false ? false : true)
      : body.enabled === false
        ? disableSkill(id)
        : enableSkill(id);
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to change skill state' }, { status: 404 });
  }
}
