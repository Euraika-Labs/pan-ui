'use client';

import { useMemo, useState } from 'react';
import { useRuntimeApprovals } from '@/features/chat/api/use-runtime-history';
import { useUIStore } from '@/lib/store/ui-store';

export function ApprovalsBrowser() {
  const { activeSessionId } = useUIStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('pending');
  const approvalsQuery = useRuntimeApprovals(activeSessionId, query, status);
  const approvals = approvalsQuery.data ?? [];
  const pendingCount = useMemo(() => approvals.filter((approval) => approval.status === 'pending').length, [approvals]);
  const resolvedCount = approvals.length - pendingCount;

  async function updateApproval(toolCallId: string, nextStatus: 'approved' | 'rejected') {
    await fetch(`/api/runtime/approvals/${toolCallId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    await approvalsQuery.refetch();
  }

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect and resolve pending approvals for the active session or across the runtime if no session is selected.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Scope</p>
          <p className="mt-2 font-semibold">{activeSessionId ? 'Active session' : 'All runtime sessions'}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Pending</p>
          <p className="mt-2 font-semibold">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Resolved</p>
          <p className="mt-2 font-semibold">{resolvedCount}</p>
        </div>
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
        {approvals.map((approval) => (
          <div key={approval.toolCallId} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{approval.toolName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{approval.summary}</p>
              </div>
              <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">{approval.status}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
              <p><strong className="text-foreground">Session:</strong> {approval.sessionId || 'none'}</p>
              <p><strong className="text-foreground">Tool call:</strong> {approval.toolCallId}</p>
            </div>
            {approval.status === 'pending' ? (
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => void updateApproval(approval.toolCallId, 'approved')} className="rounded-lg border border-border px-3 py-2 text-sm">
                  Approve
                </button>
                <button type="button" onClick={() => void updateApproval(approval.toolCallId, 'rejected')} className="rounded-lg border border-border px-3 py-2 text-sm text-danger">
                  Reject
                </button>
              </div>
            ) : null}
          </div>
        ))}
        {!approvals.length ? <p className="text-sm text-muted-foreground">No approvals matched the current filter.</p> : null}
      </div>
    </div>
  );
}
