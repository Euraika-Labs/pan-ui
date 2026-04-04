'use client';

import { useMemo, useState } from 'react';
import { useRuntimeRun, useRuntimeRunEvents } from '@/features/settings/api/use-runtime-run-detail';

export function RunDetail({ runId }: { runId: string }) {
  const runQuery = useRuntimeRun(runId);
  const run = runQuery.data;
  const [query, setQuery] = useState('');
  const eventsQuery = useRuntimeRunEvents(run?.session_id ?? null, query);
  const events = eventsQuery.data ?? [];
  const grouped = useMemo(() => events.map((event, index) => ({ key: `${event.type}-${index}`, event })), [events]);

  if (!run) {
    return <div className="p-4 lg:p-6 text-sm text-muted-foreground">Loading run…</div>;
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Run detail</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect run state and related runtime events.</p>
      </div>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm text-sm">
        <p><strong>Run:</strong> {String(run.id)}</p>
        <p><strong>Session:</strong> {String(run.session_id)}</p>
        <p><strong>Status:</strong> {String(run.status)}</p>
        <p><strong>Source:</strong> {String(run.source)}</p>
        <p><strong>Started:</strong> {String(run.started_at)}</p>
        <p><strong>Updated:</strong> {String(run.updated_at)}</p>
        {run.last_error ? <p className="text-danger"><strong>Error:</strong> {String(run.last_error)}</p> : null}
      </section>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Event drilldown</h2>
            <p className="text-sm text-muted-foreground">Filter runtime events associated with this run’s session.</p>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter events" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 space-y-3">
          {grouped.map(({ key, event }) => (
            <div key={key} className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium">{event.type}</p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(event, null, 2)}</pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
