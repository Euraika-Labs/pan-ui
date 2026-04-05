'use client';

import { BrainCircuit, Database, FolderKanban, Settings2, Shield, Sparkles } from 'lucide-react';
import { SessionActionsMenu } from '@/features/sessions/components/session-actions-menu';
import { ModelSwitcher } from '@/features/settings/components/model-switcher';
import { StatusBadge } from '@/components/feedback/status-badge';
import type { ChatSessionSettings } from '@/lib/types/chat';
import { connectivityTone } from '@/lib/types/runtime-status';

export function ChatHeader({
  title,
  settings,
  profileLabel,
  loadedSkillIds,
  runtimeConnected,
  controlsDisabled,
  isPersisted,
  archived,
  runtimeSummary,
  hasMessages,
  onOpenSettings,
  onRename,
  onArchive,
  onDelete,
  onFork,
  onModelChange,
}: {
  title: string;
  settings: ChatSessionSettings;
  profileLabel: string;
  loadedSkillIds?: string[];
  runtimeConnected: boolean;
  controlsDisabled?: boolean;
  isPersisted: boolean;
  archived?: boolean;
  runtimeSummary?: string;
  hasMessages?: boolean;
  onOpenSettings: () => void;
  onRename: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onFork: () => void;
  onModelChange: (model: string, provider: string) => void;
}) {
  const visibleLoadedSkills = (loadedSkillIds ?? []).filter((skillId) => skillId !== 'skill-authoring');

  return (
    <div className={`shrink-0 border-b border-border/70 bg-card/88 px-5 ${hasMessages ? 'py-2.5' : 'py-4'}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Workspace conversation</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">{title}</h2>
              {archived ? <StatusBadge label="Archived" tone="warning" /> : null}
              {isPersisted ? <StatusBadge label="Saved" tone="success" /> : <StatusBadge label="Draft" tone="warning" />}
            </div>
            {runtimeSummary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{runtimeSummary}</p> : null}
          </div>

          {!hasMessages ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <StatusBadge label={profileLabel} tone="accent" icon={<FolderKanban className="h-3.5 w-3.5 text-accent" />} />
            <StatusBadge label={runtimeConnected ? 'Runtime connected' : 'Runtime degraded'} tone={connectivityTone(runtimeConnected ? 'healthy' : 'degraded')} />
            <StatusBadge label={settings.provider} tone="muted" icon={<BrainCircuit className="h-3.5 w-3.5 text-primary" />} />
            <StatusBadge label={settings.policyPreset} tone="muted" icon={<Shield className="h-3.5 w-3.5 text-approval" />} />
            <StatusBadge label={settings.memoryMode} tone="muted" icon={<Database className="h-3.5 w-3.5 text-success" />} />
          </div>
          ) : null}

          {!hasMessages ? (
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
            <div className="rounded-[1.35rem] border border-border/70 bg-background/70 p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Loaded skills</p>
              {visibleLoadedSkills.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {visibleLoadedSkills.map((skillId) => (
                    <StatusBadge key={skillId} label={skillId} tone="success" icon={<Sparkles className="h-3.5 w-3.5 text-success" />} />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No skills pinned to this session yet. Add one from Skills or load it directly in chat.</p>
              )}
            </div>
            <div className="grid min-w-[220px] grid-cols-2 gap-3">
              <div className="rounded-[1.35rem] border border-border/70 bg-background/70 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Session type</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{isPersisted ? 'Saved session' : 'Temporary session'}</p>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-background/70 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Model</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{settings.model || 'Default'}</p>
              </div>
            </div>
          </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:max-w-[360px] lg:justify-end">
          <ModelSwitcher value={settings.model} provider={settings.provider} onChange={onModelChange} ariaLabel="Header model switcher" disabled={controlsDisabled} />
          <button
            type="button"
            onClick={onOpenSettings}
            disabled={controlsDisabled}
            aria-label="Settings"
            className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-3 py-2.5 text-sm font-medium text-foreground shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:bg-card disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Settings2 className="h-4 w-4" />
            Settings
          </button>
          <SessionActionsMenu onRename={onRename} onArchive={onArchive} onDelete={onDelete} onFork={onFork} />
        </div>
      </div>
    </div>
  );
}
