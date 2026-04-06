'use client';

import { useEffect, useState } from 'react';
import type { ChatSessionSettings } from '@/lib/types/chat';
import { ModelSwitcher } from '@/features/settings/components/model-switcher';

type ChatSettingsSheetProps = {
  open: boolean;
  settings: ChatSessionSettings;
  saving?: boolean;
  error?: string | null;
  disabled?: boolean;
  onClose: () => void;
  onSave: (settings: Partial<ChatSessionSettings>) => Promise<void> | void;
};

export function ChatSettingsSheet({ open, settings, saving, error, disabled, onClose, onSave }: ChatSettingsSheetProps) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/45 backdrop-blur-sm">
      <div className="h-full w-full max-w-md border-l border-border/70 bg-background/95 p-5 shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Session controls</h3>
            <p className="text-sm text-muted-foreground">Model selection is runtime-backed. Policy and memory settings are session guidance stored with this chat.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl border border-border/70 bg-background/80 px-3 py-2 text-sm font-medium text-foreground">Close</button>
        </div>

        <div className="mt-6 space-y-5 rounded-lg border border-border/70 bg-card/60 p-4 shadow-[var(--shadow-card)]">
          <div className="space-y-2">
            <label htmlFor="chat-model" className="text-sm font-medium">Model</label>
            <div id="chat-model">
              <ModelSwitcher
                value={draft.model}
                provider={draft.provider}
                onChange={(model, provider) => setDraft((current) => ({ ...current, model, provider }))}
                ariaLabel="Settings model switcher"
                disabled={disabled || saving}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="policy-preset" className="text-sm font-medium">Policy preset</label>
            <select
              id="policy-preset"
              value={draft.policyPreset}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  policyPreset: event.target.value as ChatSessionSettings['policyPreset'],
                }))
              }
              className="w-full rounded-2xl border border-input bg-background/85 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={disabled || saving}
            >
              <option value="safe-chat">Safe Chat</option>
              <option value="research">Research</option>
              <option value="builder">Builder</option>
              <option value="full-power">Full Power</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="memory-mode" className="text-sm font-medium">Memory mode</label>
            <select
              id="memory-mode"
              value={draft.memoryMode}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  memoryMode: event.target.value as ChatSessionSettings['memoryMode'],
                }))
              }
              className="w-full rounded-2xl border border-input bg-background/85 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={disabled || saving}
            >
              <option value="standard">Standard</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-foreground">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => void onSave(draft)}
            disabled={disabled || saving}
            className="rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
