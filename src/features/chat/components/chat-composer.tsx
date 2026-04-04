'use client';

import { useRef, useState } from 'react';
import { trackClientEvent } from '@/lib/telemetry/client';
import type { MessageAttachment } from '@/lib/types/message';
import { useUploadAttachment } from '@/features/chat/api/use-upload';
import { AttachmentChip } from '@/features/chat/components/attachment-chip';
import { MicButton } from '@/features/chat/components/mic-button';

type ChatComposerProps = {
  disabled?: boolean;
  onSend: (message: string, attachmentIds?: string[]) => Promise<void> | void;
};

export function ChatComposer({ disabled, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadAttachment = useUploadAttachment();

  const handleFile = async (file: File) => {
    const attachment = await uploadAttachment.mutateAsync(file);
    setAttachments((current) => [...current, attachment]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && attachments.length === 0) || disabled) return;
    const attachmentIds = attachments.map((item) => item.id);
    setValue('');
    setAttachments([]);
    trackClientEvent('chat.send', { attachmentCount: attachmentIds.length });
    await onSend(trimmed || 'Sent with attachments only.', attachmentIds);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-background p-3 md:p-4">
      <div
        className="rounded-2xl border border-border bg-card p-3 shadow-sm"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) {
            void handleFile(file);
          }
        }}
      >
        {attachments.length ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <AttachmentChip
                key={attachment.id}
                attachment={attachment}
                onRemove={(attachmentId) => setAttachments((current) => current.filter((item) => item.id !== attachmentId))}
              />
            ))}
          </div>
        ) : null}
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Message Hermes…"
          className="min-h-24 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={disabled}
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                await handleFile(file);
                event.currentTarget.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground"
            >
              Attach
            </button>
            <MicButton disabled={disabled} onTranscript={(text) => setValue((current) => `${current}${current ? ' ' : ''}${text}`)} />
            <p className="text-xs text-muted-foreground">Shift+Enter newline support and real voice recording can be improved later.</p>
          </div>
          <button
            type="submit"
            disabled={disabled || (!value.trim() && attachments.length === 0)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}
