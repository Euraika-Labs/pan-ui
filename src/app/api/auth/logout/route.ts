import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/server/auth/session';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url), { status: 302 });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
