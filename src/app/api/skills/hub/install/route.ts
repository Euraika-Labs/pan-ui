import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { installHubSkill } from '@/server/hermes/hub-skills';

export async function POST(request: Request) {
  await getSelectedProfileFromCookie();
  const body = await request.json() as { identifier: string; category?: string; force?: boolean };

  if (!body.identifier) {
    return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
  }

  const result = await installHubSkill(body.identifier, body.category, body.force === true);
  if (!result.success) {
    const message = result.error ?? 'Install failed';
    const blockedByScan = message.toLowerCase().includes('use --force to override');
    return NextResponse.json(
      {
        error: message,
        code: blockedByScan ? 'blocked_scan' : 'install_failed',
        canOverride: blockedByScan,
      },
      { status: blockedByScan ? 409 : 500 },
    );
  }
  return NextResponse.json({ success: true, identifier: body.identifier });
}
