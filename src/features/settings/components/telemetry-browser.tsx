'use client';

import { useState } from 'react';
import { useTelemetry } from '@/features/settings/api/use-telemetry';

export function TelemetryBrowser() {
  const [query, setQuery] = useState('');
  const telemetryQuery = useTelemetry(query, 200);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Telemetry browser</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect persisted client and server telemetry events.</p>
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter telemetry" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      <div className="space-y-3">
        {(telemetryQuery.data ?? []).map((event) => (
          <div key={String(event.id)} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium">{String(event.event)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{String(event.source)} · {String(event.createdAt)}</p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(event.payload, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
