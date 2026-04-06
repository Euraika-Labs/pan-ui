'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRuntimeArtifacts, useRuntimeApprovals } from '@/features/chat/api/use-runtime-history';
import { useRuntimeRun, useRuntimeRunEvents } from '@/features/settings/api/use-runtime-run-detail';

export function RunDetail({ runId }: { runId: string }) {
  const runQuery = useRuntimeRun(runId);
  const run = runQuery.data;
  const [query, setQuery] = useState('');
  const eventsQuery = useRuntimeRunEvents(run?.session_id ?? null, query);
  const artifactsQuery = useRuntimeArtifacts(run?.session_id ?? null);
  const approvalsQuery = useRuntimeApprovals(run?.session_id ?? null);
  const events = eventsQuery.data ?? [];
  const grouped = useMemo(() => events.map((event, index) => ({ key: `${event.type}-${index}`, event })), [events]);

  if (!run) {
    return <div className="p-4 lg:p-6 text-sm text-muted-foreground">Loading run…</div>;
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <Link href="/settings/runs" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to runs
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">Run detail</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect run state, artifacts, approvals, and related runtime events.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Run</p>
          <p className="mt-2 font-semibold">{String(run.id).slice(0, 8)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Status</p>
          <p className="mt-2 font-semibold">{String(run.status)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Approvals</p>
          <p className="mt-2 font-semibold">{(approvalsQuery.data ?? []).length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Artifacts</p>
          <p className="mt-2 font-semibold">{(artifactsQuery.data ?? []).length}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm text-sm">
        <p><strong>Run:</strong> {String(run.id)}</p>
        <p><strong>Session:</strong> {String(run.session_id)}</p>
        <p><strong>Status:</strong> {String(run.status)}</p>
        <p><strong>Source:</strong> {String(run.source)}</p>
        <p><strong>Started:</strong> {String(run.started_at)}</p>
        <p><strong>Updated:</strong> {String(run.updated_at)}</p>
        {run.last_error ? <p className="text-danger"><strong>Error:</strong> {String(run.last_error)}</p> : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
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
            {!grouped.length ? <p className="text-sm text-muted-foreground">No events matched this filter.</p> : null}
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Approvals encountered</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {(approvalsQuery.data ?? []).slice(0, 5).map((approval) => (
                <div key={approval.toolCallId} className="rounded-xl border border-border bg-background p-4">
                  <p className="font-medium text-foreground">{approval.toolName}</p>
                  <p className="mt-1">{approval.summary}</p>
                  <p className="mt-2 text-xs">{approval.status}</p>
                </div>
              ))}
              {!(approvalsQuery.data ?? []).length ? <p>No approvals were recorded for this run.</p> : null}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Artifacts emitted</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {(artifactsQuery.data ?? []).slice(0, 5).map((artifact) => (
                <div key={artifact.artifactId} className="rounded-xl border border-border bg-background p-4">
                  <p className="font-medium text-foreground">{artifact.label}</p>
                  <p className="mt-1">{artifact.artifactType}</p>
                </div>
              ))}
              {!(artifactsQuery.data ?? []).length ? <p>No artifacts were emitted for this run.</p> : null}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
