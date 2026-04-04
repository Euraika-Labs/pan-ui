import { NextResponse } from 'next/server';
import { disableSkill } from '@/server/skills/skill-store';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const skill = disableSkill(id);
    return NextResponse.json({ skill });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to disable skill' }, { status: 404 });
  }
}
