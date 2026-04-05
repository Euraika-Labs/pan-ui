import { NextResponse } from 'next/server';
import { listSkills } from '@/server/skills/skill-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { listRealSkills } from '@/server/hermes/real-skills';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const installedOnly = searchParams.get('installed') === 'true';
  const profileId = await getSelectedProfileFromCookie();
  const realSkills = listRealSkills(profileId);
  const fallbackSkills = listSkills();
  const merged = [...realSkills];
  for (const skill of fallbackSkills) {
    if (!merged.some((item) => item.id === skill.id)) {
      merged.push(skill);
    }
  }
  const skills = (installedOnly ? merged.filter((s) => s.installed) : merged).sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json({ skills });
}
