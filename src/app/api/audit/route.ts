import { NextResponse } from 'next/server';
import { listAuditEvents } from '@/server/audit/audit-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') || '').toLowerCase();
  const events = listAuditEvents().filter((event) => {
    if (!query) return true;
    const hay = `${event.action} ${event.targetType} ${event.targetId} ${event.detail}`.toLowerCase();
    return hay.includes(query);
  });
  return NextResponse.json({ events });
}
