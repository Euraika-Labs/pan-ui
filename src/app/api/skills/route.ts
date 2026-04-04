import { NextResponse } from 'next/server';
import { listSkills } from '@/server/skills/skill-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { listRealSkills } from '@/server/hermes/real-skills';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const installedOnly = searchParams.get('installed') === 'true';
  const profileId = await getSelectedProfileFromCookie();
  const mockSkills = listSkills({ installedOnly });
  const realSkills = listRealSkills(profileId);
  const seen = new Set(realSkills.map((s) => s.id));
  const merged = [...realSkills, ...mockSkills.filter((s) => !seen.has(s.id))];
  return NextResponse.json({ skills: installedOnly ? merged.filter((s) => s.installed) : merged });
}
