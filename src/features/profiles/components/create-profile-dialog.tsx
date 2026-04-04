'use client';

import { useState } from 'react';
import type { Profile } from '@/lib/types/profile';

type CreateProfileDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; policyPreset?: Profile['policyPreset'] }) => Promise<void> | void;
};

export function CreateProfileDialog({ open, onClose, onSubmit }: CreateProfileDialogProps) {
  const [name, setName] = useState('');
  const [policyPreset, setPolicyPreset] = useState<NonNullable<Profile['policyPreset']>>('safe-chat');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Create profile</h3>
        <div className="mt-4 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Profile name" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <select value={policyPreset} onChange={(e) => setPolicyPreset(e.target.value as NonNullable<Profile['policyPreset']>)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="safe-chat">Safe Chat</option>
            <option value="research">Research</option>
            <option value="builder">Builder</option>
            <option value="full-power">Full Power</option>
          </select>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="button" onClick={() => void onSubmit({ name, policyPreset })} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create</button>
        </div>
      </div>
    </div>
  );
}
