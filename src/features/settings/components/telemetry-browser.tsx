'use client';

import { useMemo, useState } from 'react';
import { useTelemetry } from '@/features/settings/api/use-telemetry';

export function TelemetryBrowser() {
  const [query, setQuery] = useState('');
  const telemetryQuery = useTelemetry(query, 200);
  const events = telemetryQuery.data ?? [];
  const sourceCounts = useMemo(() => events.reduce<Record<string, number>>((acc, event) => {
    const key = String(event.source ?? 'unknown');
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {}), [events]);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Telemetry browser</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect persisted client and server telemetry events.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Events returned</p>
          <p className="mt-2 font-semibold">{events.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:col-span-2">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Sources</p>
          <p className="mt-2 text-sm text-muted-foreground">{Object.entries(sourceCounts).map(([source, count]) => `${source}: ${count}`).join(' · ') || 'No telemetry sources yet'}</p>
        </div>
      </div>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter telemetry" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      <div className="space-y-3">
        {events.map((event) => (
          <div key={String(event.id)} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{String(event.event)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{String(event.source)} · {String(event.createdAt)}</p>
              </div>
            </div>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(event.payload, null, 2)}</pre>
          </div>
        ))}
        {!events.length ? <p className="text-sm text-muted-foreground">No telemetry matched the current filter.</p> : null}
      </div>
    </div>
  );
}
