'use client';

import { useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import type { Profile } from '@/lib/types/profile';
import { useAiOptimizeProfile } from '@/features/profiles/api/use-profiles';

type CreateProfileDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; policyPreset?: Profile['policyPreset']; aiPurpose?: string }) => Promise<void> | void;
};

export function CreateProfileDialog({ open, onClose, onSubmit }: CreateProfileDialogProps) {
  const [name, setName] = useState('');
  const [policyPreset, setPolicyPreset] = useState<NonNullable<Profile['policyPreset']>>('safe-chat');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ policy?: string; explanation?: string } | null>(null);
  const aiOptimize = useAiOptimizeProfile();

  if (!open) return null;

  const nameValid = /^[a-z0-9][a-z0-9_-]{0,63}$/.test(name);

  async function handleAiSuggest() {
    if (!purpose.trim()) return;
    setAiSuggesting(true);
    try {
      // We don't have a profile yet, so we call with a temp name; the API will return suggestions
      const result = await aiOptimize.mutateAsync({ profileId: 'default', purpose, mode: 'create' });
      const suggested = result.suggestion;
      // Map to policy preset
      if (suggested.policyPreset) {
        const validPresets = ['safe-chat', 'research', 'builder', 'full-power'];
        if (validPresets.includes(suggested.policyPreset)) {
          setPolicyPreset(suggested.policyPreset as NonNullable<Profile['policyPreset']>);
        }
      }
      // Suggest a name from purpose if empty
      if (!name && purpose) {
        const slug = purpose.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32);
        if (slug) setName(slug);
      }
      setAiSuggestion({ policy: suggested.policyPreset, explanation: result.explanation });
    } catch {
      setAiSuggestion({ explanation: 'AI suggestion failed. You can still create the profile manually.' });
    } finally {
      setAiSuggesting(false);
    }
  }

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
      await onSubmit({ name, policyPreset, aiPurpose: purpose || undefined });
      setName('');
      setPurpose('');
      setError(null);
      setAiSuggestion(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes('already exists') ? `Profile '${name}' already exists.` : msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    onClose();
    setName('');
    setPurpose('');
    setError(null);
    setAiSuggestion(null);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Create profile</h3>
        <p className="mt-1 text-sm text-muted-foreground">Each profile is an isolated workspace with its own sessions, skills, memory, and API keys.</p>

        {/* AI Purpose field */}
        <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <p className="text-xs font-medium text-purple-300">AI-Assisted Setup</p>
          </div>
          <p className="mt-1 text-2xs text-muted-foreground">Describe what this profile is for and AI will suggest the best settings.</p>
          <div className="mt-2 flex gap-2">
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && purpose.trim() && !aiSuggesting) void handleAiSuggest(); }}
              placeholder="e.g. 'React developer with full terminal access'"
              className="flex-1 rounded-lg border border-purple-500/20 bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-purple-500/40"
            />
            <button
              type="button"
              onClick={() => void handleAiSuggest()}
              disabled={aiSuggesting || !purpose.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
            >
              {aiSuggesting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />}
              {aiSuggesting ? 'Thinking…' : 'Suggest'}
            </button>
          </div>
          {aiSuggestion?.explanation && (
            <div className="mt-2 rounded-lg border border-purple-500/20 bg-purple-500/10 p-2 text-xs text-purple-200">
              <Sparkles className="mr-1 inline h-3 w-3" />
              {aiSuggestion.explanation}
            </div>
          )}
        </div>

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
            <label className="text-xs font-medium text-muted-foreground">Policy preset {aiSuggestion?.policy && <span className="text-purple-400">(AI suggested: {aiSuggestion.policy})</span>}</label>
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
          <button type="button" onClick={handleClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
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
