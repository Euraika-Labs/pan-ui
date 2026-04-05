import { NextResponse } from 'next/server';
import { getSkill, uninstallSkill, updateSkillContent } from '@/server/skills/skill-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { getRealSkill, uninstallRealSkill, updateRealSkill } from '@/server/hermes/real-skills';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileId = await getSelectedProfileFromCookie();
  const realSkill = getRealSkill(profileId, id);
  const skill = realSkill ?? getSkill(id);
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
    const realSkill = getRealSkill(profileId, id);
    const skill = realSkill ? updateRealSkill(profileId, id, body.content ?? '') : updateSkillContent(id, body.content ?? '');
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update skill' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const profileId = await getSelectedProfileFromCookie();
    const realSkill = getRealSkill(profileId, id);
    const skill = (() => {
      if (realSkill) {
        const prior = realSkill;
        uninstallRealSkill(profileId, id);
        return {
          ...prior,
          installed: false,
          enabled: false,
          loadedInSessions: [],
          updatedAt: new Date().toISOString(),
        };
      }
      return uninstallSkill(id);
    })();
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to uninstall skill' }, { status: 404 });
  }
}
