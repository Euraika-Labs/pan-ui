import { NextResponse } from 'next/server';
import { listArtifacts } from '@/server/runtime/runtime-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const query = searchParams.get('query') || '';
  if (!sessionId) return NextResponse.json({ artifacts: [] });
  return NextResponse.json({ artifacts: listArtifacts(sessionId, query) });
}
