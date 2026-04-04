'use client';

import Link from 'next/link';
import { useUIStore } from '@/lib/store/ui-store';
import { useRuntimeRuns } from '@/features/settings/api/use-runtime-runs';

export function RunsBrowser() {
  const { activeSessionId } = useUIStore();
  const runsQuery = useRuntimeRuns(activeSessionId);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Runs explorer</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect durable run state for the active session.</p>
      </div>
      <div className="space-y-3">
        {(runsQuery.data ?? []).map((run) => (
          <Link key={String(run.id)} href={`/settings/runs/${String(run.id)}`} className="block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:bg-muted/30">
            <p className="text-sm font-medium">Run {String(run.id).slice(0, 8)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Status: {String(run.status)} · Source: {String(run.source)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Started: {String(run.started_at)} · Updated: {String(run.updated_at)}</p>
            {run.last_error ? <p className="mt-2 text-sm text-danger">{String(run.last_error)}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
