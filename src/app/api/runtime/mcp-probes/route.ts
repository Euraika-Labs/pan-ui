import { NextResponse } from 'next/server';
import { listMcpProbeResults } from '@/server/runtime/runtime-store';

export async function GET() {
  return NextResponse.json({ results: listMcpProbeResults() });
}
