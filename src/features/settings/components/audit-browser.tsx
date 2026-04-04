'use client';

import { useState } from 'react';
import { useAudit } from '@/features/settings/api/use-audit';

export function AuditBrowser() {
  const [query, setQuery] = useState('');
  const auditQuery = useAudit(query);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit browser</h1>
        <p className="mt-2 text-sm text-muted-foreground">Search durable audit events and operational history.</p>
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter audit events" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      <div className="space-y-3">
        {(auditQuery.data ?? []).map((event) => (
          <div key={event.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium">{event.action}</p>
            <p className="mt-1 text-xs text-muted-foreground">{event.targetType} · {event.targetId} · {new Date(event.createdAt).toLocaleString()}</p>
            <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
