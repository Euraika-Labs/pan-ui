import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { listRealSkillCategories } from '@/server/hermes/real-skills';

export async function GET() {
  const profileId = await getSelectedProfileFromCookie();
  const categories = listRealSkillCategories(profileId);
  return NextResponse.json({ categories });
}
