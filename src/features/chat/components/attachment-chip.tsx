import type { MessageAttachment } from '@/lib/types/message';

type AttachmentChipProps = {
  attachment: MessageAttachment;
  onRemove?: (attachmentId: string) => void;
};

export function AttachmentChip({ attachment, onRemove }: AttachmentChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
      <span>{attachment.name}</span>
      <span>{Math.max(1, Math.round(attachment.size / 1024))} KB</span>
      {onRemove ? (
        <button type="button" onClick={() => onRemove(attachment.id)} className="text-foreground">
          ×
        </button>
      ) : null}
    </div>
  );
}
