'use client';

import type { ChatStreamEvent } from '@/lib/types/chat';

type ApprovalCardProps = {
  event: Extract<ChatStreamEvent, { type: 'tool.awaiting_approval' }>;
  onApprove: (toolCallId: string) => void;
  onReject: (toolCallId: string) => void;
};

export function ApprovalCard({ event, onApprove, onReject }: ApprovalCardProps) {
  return (
    <div className="rounded-2xl border border-approval/40 bg-approval/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Approval needed</p>
          <h4 className="text-sm font-semibold">{event.toolName}</h4>
          <p className="mt-2 text-sm text-foreground">{event.summary}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onApprove(event.toolCallId)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => onReject(event.toolCallId)}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
