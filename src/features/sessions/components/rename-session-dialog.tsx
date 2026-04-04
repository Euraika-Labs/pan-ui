'use client';

import { useEffect, useState } from 'react';

type RenameSessionDialogProps = {
  open: boolean;
  initialTitle: string;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void> | void;
};

export function RenameSessionDialog({ open, initialTitle, onClose, onSubmit }: RenameSessionDialogProps) {
  const [value, setValue] = useState(initialTitle);

  useEffect(() => {
    setValue(initialTitle);
  }, [initialTitle]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Rename session</h3>
        <p className="mt-1 text-sm text-muted-foreground">Give this conversation a clearer title.</p>
        <input
          aria-label="Rename session input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="button" onClick={() => void onSubmit(value)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}
