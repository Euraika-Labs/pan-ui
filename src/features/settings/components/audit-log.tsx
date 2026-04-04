'use client';

import { useAudit } from '@/features/settings/api/use-audit';

export function AuditLog() {
  const auditQuery = useAudit();

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Audit log</h2>
      <p className="mt-1 text-sm text-muted-foreground">Recent approvals, config changes, and profile or memory updates.</p>
      <div className="mt-4 space-y-3">
        {(auditQuery.data ?? []).map((event) => (
          <div key={event.id} className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium">{event.action}</p>
            <p className="mt-1 text-xs text-muted-foreground">{event.targetType} · {event.targetId} · {new Date(event.createdAt).toLocaleString()}</p>
            <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
