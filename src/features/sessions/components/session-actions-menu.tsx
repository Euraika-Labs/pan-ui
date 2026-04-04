'use client';

import { useState } from 'react';

type SessionActionsMenuProps = {
  onRename: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onFork: () => void;
};

export function SessionActionsMenu({ onRename, onArchive, onDelete, onFork }: SessionActionsMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
      >
        Manage
      </button>
      {open ? (
        <div className="absolute right-0 top-10 z-10 w-40 rounded-xl border border-border bg-background p-2 shadow-lg">
          <button type="button" onClick={() => { setOpen(false); onRename(); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">Rename</button>
          <button type="button" onClick={() => { setOpen(false); onFork(); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">Fork</button>
          <button type="button" onClick={() => { setOpen(false); onArchive(); }} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted">Archive</button>
          <button type="button" onClick={() => { setOpen(false); onDelete(); }} className="block w-full rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-muted">Delete</button>
        </div>
      ) : null}
    </div>
  );
}
