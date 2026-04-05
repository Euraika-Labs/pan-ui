import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { listRealExtensionTools, listRealExtensions } from '@/server/hermes/real-extensions';

export async function GET() {
  const profileId = await getSelectedProfileFromCookie();
  return NextResponse.json({
    extensions: listRealExtensions(profileId),
    tools: listRealExtensionTools(profileId),
  });
}
