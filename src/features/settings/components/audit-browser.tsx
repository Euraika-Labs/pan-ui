'use client';

import { useMemo, useState } from 'react';
import { useAudit } from '@/features/settings/api/use-audit';

export function AuditBrowser() {
  const [query, setQuery] = useState('');
  const auditQuery = useAudit(query);
  const events = auditQuery.data ?? [];
  const actionCounts = useMemo(() => events.reduce<Record<string, number>>((acc, event) => {
    acc[event.action] = (acc[event.action] ?? 0) + 1;
    return acc;
  }, {}), [events]);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit browser</h1>
        <p className="mt-2 text-sm text-muted-foreground">Search durable audit events and operational history.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Events</p>
          <p className="mt-2 font-semibold">{events.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Actions seen</p>
          <p className="mt-2 text-sm text-muted-foreground">{Object.entries(actionCounts).map(([action, count]) => `${action}: ${count}`).join(' · ') || 'No audit actions yet'}</p>
        </div>
      </div>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter audit events" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{event.action}</p>
                <p className="mt-1 text-xs text-muted-foreground">{event.targetType} · {event.targetId} · {new Date(event.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p>
          </div>
        ))}
        {!events.length ? <p className="text-sm text-muted-foreground">No audit events matched the current filter.</p> : null}
      </div>
    </div>
  );
}
