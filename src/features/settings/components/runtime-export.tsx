'use client';

import { useMemo, useState } from 'react';
import { useUIStore } from '@/lib/store/ui-store';
import { useRuntimeExport } from '@/features/settings/api/use-runtime-export';

export function RuntimeExportPanel() {
  const { activeSessionId } = useUIStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const exportQuery = useRuntimeExport(activeSessionId, query, status);
  const exportText = useMemo(() => JSON.stringify(exportQuery.data ?? {}, null, 2), [exportQuery.data]);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Runtime exports</h2>
      <p className="mt-1 text-sm text-muted-foreground">Filter and export runtime timeline, artifacts, approvals, and telemetry for the active session.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter query" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="">All approval states</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="mt-4 flex gap-2">
        <a
          href={`data:application/json;charset=utf-8,${encodeURIComponent(exportText)}`}
          download={`runtime-export-${activeSessionId || 'global'}.json`}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Download JSON
        </a>
        <a
          href={`/api/runtime/export?sessionId=${encodeURIComponent(activeSessionId || '')}&query=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}&format=csv`}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Download CSV
        </a>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">{exportText}</pre>
    </section>
  );
}
