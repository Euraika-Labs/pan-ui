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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const nameValid = /^[a-z0-9][a-z0-9_-]{0,63}$/.test(name);

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Profile name is required.');
      return;
    }
    if (!nameValid) {
      setError('Name must be lowercase alphanumeric (a-z, 0-9, hyphens, underscores). Max 64 chars.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ name, policyPreset });
      setName('');
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes('already exists') ? `Profile '${name}' already exists.` : msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Create profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">Each profile is an isolated workspace with its own sessions, skills, memory, and API keys.</p>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Profile name</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')); setError(null); }}
              placeholder="my-project"
              className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm ${error ? 'border-red-500/70' : 'border-input'}`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && void handleSubmit()}
            />
            {name && !nameValid ? (
              <p className="mt-1 text-xs text-amber-400">Must start with a letter or number. Only a-z, 0-9, hyphens, underscores.</p>
            ) : null}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Policy preset</label>
            <select value={policyPreset} onChange={(e) => setPolicyPreset(e.target.value as NonNullable<Profile['policyPreset']>)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="safe-chat">Safe Chat — read-only tools, no filesystem writes</option>
              <option value="research">Research — web access, read files, no installs</option>
              <option value="builder">Builder — full dev workflow, requires approval for risky ops</option>
              <option value="full-power">Full Power — all tools enabled, no guardrails</option>
            </select>
          </div>
        </div>
        {error ? (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</div>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => { onClose(); setName(''); setError(null); }} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting || !name.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
