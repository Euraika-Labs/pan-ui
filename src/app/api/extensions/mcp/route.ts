import { NextResponse } from 'next/server';
import { addAuditEvent } from '@/server/audit/audit-store';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { addRealMcpExtension } from '@/server/hermes/real-extensions';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    command?: string;
    url?: string;
    args?: string[];
    env?: Record<string, string>;
    authType?: 'none' | 'api-key' | 'oauth';
    token?: string;
  };

  if (!body.name || (!body.command && !body.url)) {
    return NextResponse.json({ error: 'name plus command or url is required' }, { status: 400 });
  }

  const profileId = await getSelectedProfileFromCookie();
  const extension = addRealMcpExtension(profileId, {
    name: body.name,
    command: body.command,
    url: body.url,
    args: body.args,
    env: body.env,
  });

  addAuditEvent('extension_added', 'extension', extension.id, `Added MCP extension ${extension.name}.`);
  return NextResponse.json({ extension }, { status: 201 });
}
