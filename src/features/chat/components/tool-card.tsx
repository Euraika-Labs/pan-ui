'use client';

import type { ChatStreamEvent } from '@/lib/types/chat';

type ToolCardProps = {
  event: Extract<ChatStreamEvent, { type: 'tool.started' | 'tool.completed' }>;
};

export function ToolCard({ event }: ToolCardProps) {
  const isStarted = event.type === 'tool.started';

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Tool</p>
          <h4 className="text-sm font-semibold">{event.toolName}</h4>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${isStarted ? 'bg-warning/15 text-foreground' : 'bg-success/15 text-foreground'}`}>
          {isStarted ? 'Running' : 'Completed'}
        </span>
      </div>
      {!isStarted && 'output' in event && event.output ? (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-background p-3 text-xs text-muted-foreground">{event.output}</pre>
      ) : null}
    </div>
  );
}
