'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useUIStore } from '@/lib/store/ui-store';
import { useRuntimeRuns } from '@/features/settings/api/use-runtime-runs';

export function RunsBrowser() {
  const { activeSessionId } = useUIStore();
  const runsQuery = useRuntimeRuns(activeSessionId);
  const [query, setQuery] = useState('');
  const runs = runsQuery.data ?? [];
  const filtered = useMemo(() => runs.filter((run) => JSON.stringify(run).toLowerCase().includes(query.toLowerCase())), [query, runs]);
  const failedCount = filtered.filter((run) => run.status === 'failed').length;

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Runs explorer</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect durable run state for the active session or the wider runtime.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Scope</p>
          <p className="mt-2 font-semibold">{activeSessionId ? 'Active session' : 'All sessions'}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Runs</p>
          <p className="mt-2 font-semibold">{filtered.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Failures</p>
          <p className="mt-2 font-semibold">{failedCount}</p>
        </div>
      </div>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter runs" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />

      <div className="space-y-3">
        {filtered.map((run) => (
          <Link key={String(run.id)} href={`/settings/runs/${String(run.id)}`} className="block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:bg-muted/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Run {String(run.id).slice(0, 8)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Source: {String(run.source)} · Session: {String(run.session_id ?? 'n/a')}</p>
              </div>
              <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">{String(run.status)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Started: {String(run.started_at)} · Updated: {String(run.updated_at)}</p>
            {run.last_error ? <p className="mt-2 text-sm text-danger">{String(run.last_error)}</p> : null}
          </Link>
        ))}
        {!filtered.length ? <p className="text-sm text-muted-foreground">No runs matched the current filter.</p> : null}
      </div>
    </div>
  );
}
