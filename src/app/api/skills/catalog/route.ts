import { NextResponse } from 'next/server';
import { listSkills } from '@/server/skills/skill-store';

export async function GET() {
  return NextResponse.json({ skills: listSkills() });
}
