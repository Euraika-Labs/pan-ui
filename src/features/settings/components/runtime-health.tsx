'use client';

import { useState } from 'react';
import { LoadingState } from '@/components/feedback/states';
import { useRuntimeHealth } from '@/features/settings/api/use-runtime-health';
import { RuntimeExportPanel } from '@/features/settings/components/runtime-export';

export function RuntimeHealthPanel() {
  const [query, setQuery] = useState('');
  const healthQuery = useRuntimeHealth(query);

  if (healthQuery.isLoading) return <LoadingState message="Running health diagnostics…" />;
  const data = healthQuery.data;
  if (!data) return null;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Runtime health</h2>
            <p className="mt-1 text-sm text-muted-foreground">Configuration, provider, MCP, profile context, memory files, and runtime diagnostics.</p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p><strong>Passing:</strong> {data.summary.okCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p><strong>Needs attention:</strong> {data.summary.failingCount}</p>
            </div>
          </div>
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter checks" className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.checks.map((check) => (
            <div key={check.key} className="rounded-xl border border-border bg-background p-4 text-sm">
              <p className="font-medium">{check.key}</p>
              <p className="mt-1 text-muted-foreground">{check.detail}</p>
              <p className="mt-2 text-xs">Status: {check.ok ? 'ok' : 'needs attention'}</p>
              {check.remediation ? <p className="mt-2 text-xs text-muted-foreground">Hint: {check.remediation}</p> : null}
            </div>
          ))}
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">{data.doctorOutput}</pre>
      </section>
      <RuntimeExportPanel />
    </div>
  );
}
