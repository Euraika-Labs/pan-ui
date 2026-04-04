'use client';

import type { ChatArtifact, ChatStreamEvent } from '@/lib/types/chat';
import type { Message } from '@/lib/types/message';
import { ApprovalCard } from '@/features/chat/components/approval-card';
import { ArtifactCard } from '@/features/chat/components/artifact-card';
import { MessageBubble } from '@/features/chat/components/message-bubble';
import { ToolCard } from '@/features/chat/components/tool-card';

type ChatTranscriptProps = {
  messages: Message[];
  runEvents: ChatStreamEvent[];
  artifacts: ChatArtifact[];
  streamingMessage?: string;
  isStreaming?: boolean;
  isLoading?: boolean;
  onApprove: (toolCallId: string) => void;
  onReject: (toolCallId: string) => void;
  onOpenArtifact: (artifactId: string) => void;
};

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
}: ChatTranscriptProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card/50 p-8 text-sm text-muted-foreground">
          Loading conversation…
        </div>
      ) : null}
      {!isLoading && messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-sm text-muted-foreground">
          Start the conversation. Ask Hermes to research, plan, debug, or build.
        </div>
      ) : null}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {runEvents.map((event, index) => {
        if (event.type === 'tool.started' || event.type === 'tool.completed') {
          return <ToolCard key={`${event.type}-${event.toolCallId}-${index}`} event={event} />;
        }
        if (event.type === 'tool.awaiting_approval') {
          return (
            <ApprovalCard
              key={`${event.type}-${event.toolCallId}-${index}`}
              event={event}
              onApprove={onApprove}
              onReject={onReject}
            />
          );
        }
        if (event.type === 'artifact.emitted') {
          const artifact = artifacts.find((item) => item.artifactId === event.artifactId) ?? event;
          return <ArtifactCard key={`${event.type}-${event.artifactId}-${index}`} artifact={artifact} onOpen={onOpenArtifact} />;
        }
        if (event.type === 'error') {
          return (
            <div key={`${event.type}-${index}`} className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm">
              {event.message}
            </div>
          );
        }
        return null;
      })}
      {isStreaming ? (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
            <p className="whitespace-pre-wrap leading-6">{streamingMessage || '…'}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">Hermes is responding…</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
