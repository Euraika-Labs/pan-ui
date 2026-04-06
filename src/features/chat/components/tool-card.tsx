'use client';

import type { ChatStreamEvent } from '@/lib/types/chat';
import { StatusBadge } from '@/components/feedback/status-badge';
import { provenanceTone, riskTone } from '@/lib/types/runtime-status';

type ToolCardProps = {
  event: Extract<ChatStreamEvent, { type: 'tool.started' | 'tool.completed' }>;
};

export function ToolCard({ event }: ToolCardProps) {
  const isStarted = event.type === 'tool.started';

  return (
    <div className="rounded-lg border border-border/70 bg-background/80 p-4 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-label text-muted-foreground">Tool activity</p>
          <h4 className="mt-1 text-sm font-semibold text-foreground">{event.toolName}</h4>
          <p className="mt-1 text-xs text-muted-foreground">Call {event.toolCallId}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={isStarted ? 'Running' : 'Completed'} tone={isStarted ? 'warning' : 'success'} />
          {event.riskLevel ? <StatusBadge label={`${event.riskLevel} risk`} tone={riskTone(event.riskLevel)} /> : null}
          {event.type === 'tool.started' && event.provenance ? <StatusBadge label={event.provenance} tone={provenanceTone(event.provenance)} /> : null}
        </div>
      </div>
      {!isStarted && event.output ? (
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border/70 bg-card/80 p-3 text-xs leading-6 text-muted-foreground">{event.output}</pre>
      ) : null}
    </div>
  );
}
