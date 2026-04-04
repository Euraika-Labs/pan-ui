import { NextResponse } from 'next/server';
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
  const payload = {
    timeline: sessionId ? listTimeline(sessionId, query) : [],
    artifacts: sessionId ? listArtifacts(sessionId, query) : [],
    approvals: sessionId ? listApprovals(sessionId, query, status) : [],
    telemetry: listTelemetry(200, query),
  };

  if (format === 'csv') {
    const csv = [
      toCsv('timeline', payload.timeline),
      '',
      toCsv('artifacts', payload.artifacts),
      '',
      toCsv('approvals', payload.approvals),
      '',
      toCsv('telemetry', payload.telemetry),
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
