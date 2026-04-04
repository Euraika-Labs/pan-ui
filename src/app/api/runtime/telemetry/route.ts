import { NextResponse } from 'next/server';
import { listTelemetry } from '@/server/runtime/runtime-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const limit = Number(searchParams.get('limit') || 200);
  return NextResponse.json({ events: listTelemetry(limit, query) });
}
