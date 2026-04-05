import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { reprobeRealExtension } from '@/server/hermes/real-extensions';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const profileId = await getSelectedProfileFromCookie();
    const extension = reprobeRealExtension(profileId, id);
    if (!extension) throw new Error('Extension not found');
    return NextResponse.json({ extension });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to test extension' }, { status: 404 });
  }
}
