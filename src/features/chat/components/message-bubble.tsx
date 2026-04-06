import { Bot, UserRound } from 'lucide-react';
import type { Message } from '@/lib/types/message';
import { TTSButton } from '@/features/chat/components/tts-button';
import { AttachmentChip } from '@/features/chat/components/attachment-chip';
import { cn } from '@/lib/utils';

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex w-full gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser ? (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-primary-foreground shadow-[var(--shadow-card)]">
          <Bot className="h-4 w-4" />
        </div>
      ) : null}
      <div className={cn('max-w-[88%] space-y-2', isUser && 'items-end')}>
        <div className="flex items-center gap-2 px-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{isUser ? 'You' : 'Pan'}</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div
          className={cn(
            'rounded-[1.5rem] border px-4 py-3 text-sm shadow-[var(--shadow-card)]',
            isUser
              ? 'border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary))/0.98,hsl(var(--accent))/0.92)] text-primary-foreground'
              : 'border-border/70 bg-card/92 text-card-foreground',
          )}
        >
          <p className="whitespace-pre-wrap leading-7">{message.content}</p>
          {message.attachments?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <AttachmentChip key={attachment.id} attachment={attachment} />
              ))}
            </div>
          ) : null}
          {!isUser ? (
            <div className="mt-3 flex items-center gap-2">
              <TTSButton text={message.content} />
            </div>
          ) : null}
        </div>
      </div>
      {isUser ? (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-background/80 text-foreground shadow-[var(--shadow-card)]">
          <UserRound className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}
