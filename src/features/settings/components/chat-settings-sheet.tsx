'use client';

import { useEffect, useState } from 'react';
import type { ChatSessionSettings } from '@/lib/types/chat';
import { ModelSwitcher } from '@/features/settings/components/model-switcher';

type ChatSettingsSheetProps = {
  open: boolean;
  settings: ChatSessionSettings;
  onClose: () => void;
  onSave: (settings: Partial<ChatSessionSettings>) => Promise<void> | void;
};

export function ChatSettingsSheet({ open, settings, onClose, onSave }: ChatSettingsSheetProps) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-md border-l border-border bg-background p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Chat settings</h3>
            <p className="text-sm text-muted-foreground">Control model, policy preset, and memory mode for this session.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-border px-3 py-2 text-sm">Close</button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="chat-model" className="text-sm font-medium">Model</label>
            <div id="chat-model">
              <ModelSwitcher
                value={draft.model}
                onChange={(model, provider) => setDraft((current) => ({ ...current, model, provider }))}
                ariaLabel="Settings model switcher"
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
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
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
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              <option value="standard">Standard</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => void onSave(draft)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
