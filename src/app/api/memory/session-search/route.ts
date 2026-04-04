import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { searchRealSessions } from '@/server/hermes/real-memory';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = await getSelectedProfileFromCookie();
  const query = searchParams.get('query') ?? '';
  return NextResponse.json({ results: searchRealSessions(profileId, query) });
}
