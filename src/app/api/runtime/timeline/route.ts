import { NextResponse } from 'next/server';
import { listTimeline } from '@/server/runtime/runtime-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const query = searchParams.get('query') || '';
  if (!sessionId) return NextResponse.json({ events: [] });
  return NextResponse.json({ events: listTimeline(sessionId, query) });
}
