import { NextResponse } from 'next/server';
import { listApprovals } from '@/server/runtime/runtime-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || '';
  if (!sessionId) return NextResponse.json({ approvals: [] });
  return NextResponse.json({ approvals: listApprovals(sessionId, query, status) });
}
