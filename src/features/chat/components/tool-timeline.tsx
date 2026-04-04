'use client';

import type { ChatStreamEvent } from '@/lib/types/chat';

type ToolTimelineProps = {
  events: ChatStreamEvent[];
};

export function ToolTimeline({ events }: ToolTimelineProps) {
  const items = events.filter((event) => event.type !== 'assistant.delta');

  return (
    <div className="space-y-2">
      {items.length === 0 ? <p className="text-sm text-muted-foreground">No tool events yet.</p> : null}
      {items.map((event, index) => (
        <div key={`${event.type}-${index}`} className="rounded-lg border border-border bg-background p-3 text-sm">
          <p className="font-medium">{event.type}</p>
          <p className="mt-1 text-muted-foreground">
            {'toolName' in event ? event.toolName : event.type === 'artifact.emitted' ? event.label : event.type === 'error' ? event.message : ''}
          </p>
        </div>
      ))}
    </div>
  );
}
