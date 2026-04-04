'use client';

import { Settings2 } from 'lucide-react';
import { SessionActionsMenu } from '@/features/sessions/components/session-actions-menu';
import { ModelSwitcher } from '@/features/settings/components/model-switcher';
import type { ChatSessionSettings } from '@/lib/types/chat';
import { useUIStore } from '@/lib/store/ui-store';

type ChatHeaderProps = {
  title: string;
  settings: ChatSessionSettings;
  loadedSkillIds?: string[];
  onOpenSettings: () => void;
  onRename: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onFork: () => void;
  onModelChange: (model: string, provider: string) => void;
};

export function ChatHeader({
  title,
  settings,
  loadedSkillIds,
  onOpenSettings,
  onRename,
  onArchive,
  onDelete,
  onFork,
  onModelChange,
}: ChatHeaderProps) {
  const selectedProfileId = useUIStore((state) => state.selectedProfileId);

  return (
    <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Profile: {selectedProfileId ?? 'default'} · Provider: {settings.provider} · Policy: {settings.policyPreset}
        </p>
        {loadedSkillIds?.length ? (
          <p className="mt-1 text-xs text-muted-foreground">Loaded skills: {loadedSkillIds.join(', ')}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ModelSwitcher value={settings.model} onChange={onModelChange} ariaLabel="Header model switcher" />
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted"
        >
          <Settings2 className="h-4 w-4" />
          Settings
        </button>
        <SessionActionsMenu onRename={onRename} onArchive={onArchive} onDelete={onDelete} onFork={onFork} />
      </div>
    </div>
  );
}
