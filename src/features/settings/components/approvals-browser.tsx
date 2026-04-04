'use client';

import { useState } from 'react';
import { useUIStore } from '@/lib/store/ui-store';
import { useRuntimeApprovals } from '@/features/chat/api/use-runtime-history';

export function ApprovalsBrowser() {
  const { activeSessionId } = useUIStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const approvalsQuery = useRuntimeApprovals(activeSessionId, query, status);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse persisted approval requests and decisions for the active session.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter approvals" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="space-y-3">
        {(approvalsQuery.data ?? []).map((approval) => (
          <div key={approval.toolCallId} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium">{approval.toolName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{approval.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground">{approval.status} · {approval.toolCallId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
