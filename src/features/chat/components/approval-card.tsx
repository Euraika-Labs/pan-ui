'use client';

import type { ChatStreamEvent } from '@/lib/types/chat';
import { StatusBadge } from '@/components/feedback/status-badge';
import { governanceTone, riskTone } from '@/lib/types/runtime-status';

type ApprovalCardProps = {
  event: Extract<ChatStreamEvent, { type: 'tool.awaiting_approval' }>;
  onApprove: (toolCallId: string) => void;
  onReject: (toolCallId: string) => void;
};

export function ApprovalCard({ event, onApprove, onReject }: ApprovalCardProps) {
  return (
    <div className="rounded-[1.35rem] border border-approval/35 bg-approval/10 p-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Approval needed</p>
          <h4 className="mt-1 text-sm font-semibold text-foreground">{event.toolName}</h4>
          <p className="mt-2 text-sm leading-6 text-foreground">{event.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={event.governance ?? 'approval-gated'} tone={governanceTone(event.governance ?? 'approval-gated')} />
          {event.riskLevel ? <StatusBadge label={`${event.riskLevel} risk`} tone={riskTone(event.riskLevel)} /> : null}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onApprove(event.toolCallId)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)]"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => onReject(event.toolCallId)}
          className="rounded-xl border border-border px-4 py-2 text-sm text-foreground"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
