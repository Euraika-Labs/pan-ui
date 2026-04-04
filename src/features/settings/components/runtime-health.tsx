'use client';

import { useState } from 'react';
import { LoadingState } from '@/components/feedback/states';
import { useRuntimeHealth } from '@/features/settings/api/use-runtime-health';
import { RuntimeExportPanel } from '@/features/settings/components/runtime-export';

export function RuntimeHealthPanel() {
  const [query, setQuery] = useState('');
  const healthQuery = useRuntimeHealth(query);

  if (healthQuery.isLoading) return <LoadingState message="Running Hermes health diagnostics…" />;
  const data = healthQuery.data;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Runtime health</h2>
        <p className="mt-1 text-sm text-muted-foreground">Configuration, provider, MCP, and Hermes doctor diagnostics.</p>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter checks" className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Object.entries(data.checks).map(([key, ok]) => (
            <div key={key} className="rounded-xl border border-border bg-background p-4 text-sm">
              <p className="font-medium">{key}</p>
              <p className="mt-1 text-muted-foreground">{ok ? 'ok' : 'not ok'}</p>
            </div>
          ))}
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">{data.doctorOutput}</pre>
      </section>
      <RuntimeExportPanel />
    </div>
  );
}
