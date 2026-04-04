import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { getRealExtension, updateRealExtension } from '@/server/hermes/real-extensions';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileId = await getSelectedProfileFromCookie();
  const extension = getRealExtension(profileId, id);
  if (!extension) {
    return NextResponse.json({ error: 'Extension not found' }, { status: 404 });
  }
  return NextResponse.json({ extension });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as {
    command?: string;
    url?: string;
    authType?: 'none' | 'api-key' | 'oauth';
    token?: string;
  };
  try {
    const profileId = await getSelectedProfileFromCookie();
    const extension = updateRealExtension(profileId, id, body);
    return NextResponse.json({ extension });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update extension' }, { status: 404 });
  }
}
