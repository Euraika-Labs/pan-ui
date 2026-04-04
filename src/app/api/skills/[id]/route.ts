import { NextResponse } from 'next/server';
import { getSkill, uninstallSkill, updateSkillContent } from '@/server/skills/skill-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { getRealSkill, uninstallRealSkill, updateRealSkill } from '@/server/hermes/real-skills';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileId = await getSelectedProfileFromCookie();
  const skill = getRealSkill(profileId, id) ?? getSkill(id);
  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
  }
  return NextResponse.json({ skill });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { content?: string };
  try {
    const profileId = await getSelectedProfileFromCookie();
    const skill = getRealSkill(profileId, id) ? updateRealSkill(profileId, id, body.content ?? '') : updateSkillContent(id, body.content ?? '');
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update skill' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const profileId = await getSelectedProfileFromCookie();
    const skill = (() => {
      if (getRealSkill(profileId, id)) {
        uninstallRealSkill(profileId, id);
        return { id, name: id, installed: false, enabled: false };
      }
      return uninstallSkill(id);
    })();
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to uninstall skill' }, { status: 404 });
  }
}
