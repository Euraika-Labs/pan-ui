'use client';

import type { Skill } from '@/lib/types/skill';

type SkillActionBarProps = {
  skill: Skill;
  hasActiveSession: boolean;
  onInstall: () => void;
  onEnableToggle: () => void;
  onLoadIntoSession: () => void;
  onUninstall: () => void;
};

export function SkillActionBar({ skill, hasActiveSession, onInstall, onEnableToggle, onLoadIntoSession, onUninstall }: SkillActionBarProps) {
  const canEditDirectly = skill.scope !== 'builtin';

  return (
    <div className="flex flex-wrap gap-2">
      {skill.scope === 'builtin' ? (
        <button type="button" onClick={onInstall} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          {canEditDirectly ? 'Install' : 'Copy to profile scope'}
        </button>
      ) : null}
      {!skill.scope || skill.scope !== 'builtin' ? (
        <button type="button" onClick={onEnableToggle} className="rounded-lg border border-border px-4 py-2 text-sm">
          {skill.enabled ? 'Disable' : 'Enable'}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onLoadIntoSession}
        disabled={!hasActiveSession}
        className="rounded-lg border border-border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Load into current session
      </button>
      {skill.scope !== 'builtin' ? (
        <button type="button" onClick={onUninstall} className="rounded-lg border border-border px-4 py-2 text-sm text-danger">
          Remove local copy
        </button>
      ) : null}
    </div>
  );
}
