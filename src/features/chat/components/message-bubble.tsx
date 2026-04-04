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
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl border px-4 py-3 text-sm shadow-sm',
          isUser
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-card-foreground',
        )}
      >
        <p className="whitespace-pre-wrap leading-6">{message.content}</p>
        {message.attachments?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <AttachmentChip key={attachment.id} attachment={attachment} />
            ))}
          </div>
        ) : null}
        <div className="mt-2 flex items-center gap-2">
          <p className={cn('text-[11px]', isUser ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {!isUser ? <TTSButton text={message.content} /> : null}
        </div>
      </div>
    </div>
  );
}
