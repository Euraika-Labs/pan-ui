import { NextResponse } from 'next/server';
import { authCookieOptions, AUTH_COOKIE_NAME, createSessionToken, verifyCredentials } from '@/server/auth/session';

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!verifyCredentials(username, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, createSessionToken(username), authCookieOptions);
  return response;
}
