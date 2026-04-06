'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import type { ChatArtifact, ChatStreamEvent } from '@/lib/types/chat';
import type { Message } from '@/lib/types/message';
import { ApprovalCard } from '@/features/chat/components/approval-card';
import { ArtifactCard } from '@/features/chat/components/artifact-card';
import { MessageBubble } from '@/features/chat/components/message-bubble';
import { ToolCard } from '@/features/chat/components/tool-card';
import { StatusBadge } from '@/components/feedback/status-badge';

function streamingLabel(events: ChatStreamEvent[]) {
  const lastPhase = [...events].reverse().find((event) => event.type === 'run.phase');
  if (lastPhase?.type === 'run.phase') return lastPhase.label;
  const awaitingApproval = [...events].reverse().find((event) => event.type === 'tool.awaiting_approval');
  if (awaitingApproval) return 'Waiting for approval before the agent can continue.';
  const latestTool = [...events].reverse().find((event) => event.type === 'tool.started');
  if (latestTool?.type === 'tool.started') return `${latestTool.toolName} is running.`;
  return 'Pan is responding…';
}

export function ChatTranscript({
  messages,
  runEvents,
  artifacts,
  streamingMessage,
  isStreaming,
  isLoading,
  onApprove,
  onReject,
  onOpenArtifact,
}: {
  messages: Message[];
  runEvents: ChatStreamEvent[];
  artifacts: ChatArtifact[];
  streamingMessage?: string;
  isStreaming?: boolean;
  isLoading?: boolean;
  onApprove: (toolCallId: string) => void;
  onReject: (toolCallId: string) => void;
  onOpenArtifact: (artifactId: string) => void;
}) {
  const visibleEvents = runEvents.filter((event) => event.type !== 'assistant.delta' && event.type !== 'source.emitted');
  const latestPhase = [...runEvents].reverse().find((event) => event.type === 'run.phase');
  const approvalCount = runEvents.filter((event) => event.type === 'tool.awaiting_approval').length;

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  // Detect when the user manually scrolls away from the bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      userScrolledUp.current = distanceFromBottom > 80;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-scroll to bottom when new content arrives (unless user scrolled up)
  useEffect(() => {
    if (userScrolledUp.current) return;
    const el = scrollRef.current;
    if (!el) return;
    // Use instant scroll during streaming (fires every token), smooth for
    // discrete events like a new message appearing.
    el.scrollTo({ top: el.scrollHeight, behavior: isStreaming ? 'instant' : 'smooth' });
  }, [messages, streamingMessage, isStreaming, runEvents.length]);

  return (
    <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
      {isLoading ? (
        <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-8 text-sm text-muted-foreground shadow-[var(--shadow-card)]">
          Loading conversation…
        </div>
      ) : null}

      {!isLoading && messages.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-border/70 p-8 text-sm text-muted-foreground shadow-[var(--shadow-card)]" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--accent) / 0.03))' }}>
          <div className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="font-semibold">Start a conversation</p>
          </div>
          <p className="mt-3 max-w-2xl leading-7">
            Research, plan, debug, or build. Runtime activity, approvals, sources, and generated outputs stay legible instead of being buried inside assistant prose.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge label="Chat-first" tone="accent" />
            <StatusBadge label="Tool-aware" tone="success" />
            <StatusBadge label="Approval-ready" tone="warning" />
          </div>
        </div>
      ) : null}

      {(isStreaming || visibleEvents.length > 0) && !isLoading ? (
        <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Runtime activity</p>
              <p className="mt-1 text-sm font-medium text-foreground">{isStreaming ? streamingLabel(runEvents) : latestPhase?.label ?? 'No active tool run'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {latestPhase?.type === 'run.phase' ? <StatusBadge label={latestPhase.phase} tone="accent" /> : null}
              <StatusBadge label={`${visibleEvents.length} events`} tone="muted" />
              {approvalCount ? <StatusBadge label={`${approvalCount} approvals`} tone="warning" /> : null}
            </div>
          </div>
        </div>
      ) : null}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {visibleEvents.map((event, index) => {
        if (event.type === 'tool.started' || event.type === 'tool.completed') {
          return <ToolCard key={`${event.type}-${event.toolCallId}-${index}`} event={event} />;
        }
        if (event.type === 'tool.awaiting_approval') {
          return <ApprovalCard key={`${event.type}-${event.toolCallId}-${index}`} event={event} onApprove={onApprove} onReject={onReject} />;
        }
        if (event.type === 'artifact.emitted') {
          const artifact = artifacts.find((item) => item.artifactId === event.artifactId) ?? event;
          return <ArtifactCard key={`${event.type}-${event.artifactId}-${index}`} artifact={artifact} onOpen={onOpenArtifact} />;
        }
        if (event.type === 'run.phase') {
          return (
            <div key={`${event.type}-${index}`} className="rounded-[1.3rem] border border-border/70 bg-background/75 px-4 py-3 text-sm text-muted-foreground shadow-[var(--shadow-card)]">
              {event.label}
            </div>
          );
        }
        if (event.type === 'error') {
          return (
            <div key={`${event.type}-${index}`} className="rounded-[1.5rem] border border-danger/30 bg-danger/10 p-4 text-sm text-foreground shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-danger" />
                <p>{event.message}</p>
              </div>
            </div>
          );
        }
        return null;
      })}

      {isStreaming ? (
        <div className="flex justify-start gap-3">
          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-primary-foreground shadow-[var(--shadow-card)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="max-w-[88%] rounded-[1.55rem] border border-border/70 bg-card/92 px-4 py-3 text-sm shadow-[var(--shadow-card)]">
            <p className="whitespace-pre-wrap leading-7">{streamingMessage || '…'}</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{streamingLabel(runEvents)}</p>
          </div>
        </div>
      ) : null}

      {/* Scroll anchor — auto-scroll targets this element */}
      <div ref={bottomRef} aria-hidden="true" className="h-px shrink-0" />
    </div>
  );
}
