import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { readRealSkillLinkedFile } from '@/server/hermes/real-skills';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const profileId = await getSelectedProfileFromCookie();
  const { id: skillId } = await params;
  const url = new URL(request.url);
  const filePath = url.searchParams.get('path');
  if (!filePath) {
    return NextResponse.json({ error: 'Missing ?path= query parameter' }, { status: 400 });
  }
  const content = readRealSkillLinkedFile(profileId, skillId, filePath);
  if (content === null) {
    return NextResponse.json({ error: 'File not found or not accessible' }, { status: 404 });
  }
  return NextResponse.json({ path: filePath, content });
}
