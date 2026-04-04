'use client';

type ConfirmSessionActionDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmClassName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function ConfirmSessionActionDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmClassName,
  onClose,
  onConfirm,
}: ConfirmSessionActionDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="button" onClick={() => void onConfirm()} className={confirmClassName ?? 'rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
