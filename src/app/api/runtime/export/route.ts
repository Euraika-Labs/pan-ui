import { NextResponse } from 'next/server';
import { listAuditEvents } from '@/server/audit/audit-store';
import { listArtifacts, listApprovals, listTelemetry, listTimeline } from '@/server/runtime/runtime-store';

function toCsv(section: string, rows: unknown[]) {
  const normalized = rows.map((row) => (typeof row === 'object' && row !== null ? row : { value: row }));
  const keys = Array.from(new Set(normalized.flatMap((row) => Object.keys(row as Record<string, unknown>))));
  const lines = [section, keys.join(',')];
  for (const row of normalized) {
    const record = row as Record<string, unknown>;
    lines.push(keys.map((key) => JSON.stringify(record[key] ?? '')).join(','));
  }
  return lines.join('\n');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || '';
  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || '';
  const format = searchParams.get('format') || 'json';
  const audit = listAuditEvents().filter((event) => {
    if (!query) return true;
    const haystack = `${event.action} ${event.targetType} ${event.targetId} ${event.detail}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const payload = {
    meta: {
      sessionId: sessionId || null,
      query,
      status,
      exportedAt: new Date().toISOString(),
    },
    timeline: sessionId ? listTimeline(sessionId, query) : [],
    artifacts: sessionId ? listArtifacts(sessionId, query) : [],
    approvals: listApprovals(sessionId || null, query, status),
    telemetry: listTelemetry(200, query),
    audit,
  };

  if (format === 'csv') {
    const csv = [
      toCsv('meta', [payload.meta]),
      '',
      toCsv('timeline', payload.timeline),
      '',
      toCsv('artifacts', payload.artifacts),
      '',
      toCsv('approvals', payload.approvals),
      '',
      toCsv('telemetry', payload.telemetry),
      '',
      toCsv('audit', payload.audit),
    ].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="runtime-export-${sessionId || 'global'}.csv"`,
      },
    });
  }

  return NextResponse.json(payload);
}
