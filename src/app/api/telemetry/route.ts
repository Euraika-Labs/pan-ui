import { NextResponse } from 'next/server';
import { persistTelemetry } from '@/server/runtime/runtime-store';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { event?: string; source?: string; payload?: Record<string, unknown> };
  if (!body.event) return NextResponse.json({ error: 'event is required' }, { status: 400 });
  persistTelemetry(body.event, body.source || 'client', body.payload);
  return NextResponse.json({ ok: true });
}
