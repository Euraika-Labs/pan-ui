import { NextResponse } from 'next/server';
import { listRuns } from '@/server/runtime/run-orchestrator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || undefined;
  return NextResponse.json({ runs: listRuns(sessionId) });
}
