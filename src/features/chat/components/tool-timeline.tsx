'use client';

import type { ChatStreamEvent } from '@/lib/types/chat';

function describeEvent(event: ChatStreamEvent) {
  switch (event.type) {
    case 'run.phase':
      return event.label;
    case 'tool.started':
      return `${event.toolName} started`;
    case 'tool.awaiting_approval':
      return event.summary;
    case 'tool.completed':
      return event.output || `${event.toolName} completed`;
    case 'artifact.emitted':
      return event.label;
    case 'source.emitted':
      return event.source.title;
    case 'error':
      return event.message;
    default:
      return '';
  }
}

export function ToolTimeline({ events }: { events: ChatStreamEvent[] }) {
  const items = events.filter((event) => event.type !== 'assistant.delta');

  return (
    <div className="space-y-2">
      {items.length === 0 ? <p className="text-sm text-muted-foreground">No activity yet.</p> : null}
      {items.map((event, index) => (
        <div key={`${event.type}-${index}`} className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm shadow-[var(--shadow-card)]">
          <p className="font-medium text-foreground">{event.type.replace('.', ' ')}</p>
          <p className="mt-1 leading-6 text-muted-foreground">{describeEvent(event)}</p>
        </div>
      ))}
    </div>
  );
}
