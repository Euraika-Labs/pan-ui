import { NextResponse } from 'next/server';
import { addAuditEvent } from '@/server/audit/audit-store';
import { installSkill } from '@/server/skills/skill-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { installRealSkill } from '@/server/hermes/real-skills';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const profileId = await getSelectedProfileFromCookie();
    const skill = (() => {
      try {
        return installRealSkill(profileId, id);
      } catch {
        return installSkill(id);
      }
    })();
    addAuditEvent('skill_installed', 'skill', skill.id, `Installed skill ${skill.name}.`);
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to install skill' }, { status: 404 });
  }
}
