'use client';

import Link from 'next/link';
import { useUIStore } from '@/lib/store/ui-store';
import { useEnableSkill, useInstallSkill, useLoadSkillIntoSession, useSkill, useUninstallSkill, useUpdateSkillContent } from '@/features/skills/api/use-skills';
import { SkillActionBar } from '@/features/skills/components/skill-action-bar';
import { SkillEditor } from '@/features/skills/components/skill-editor';

export function SkillDetail({ skillId }: { skillId: string }) {
  const skillQuery = useSkill(skillId);
  const installSkill = useInstallSkill();
  const enableSkill = useEnableSkill();
  const updateContent = useUpdateSkillContent();
  const loadSkill = useLoadSkillIntoSession();
  const uninstallSkill = useUninstallSkill();
  const activeSessionId = useUIStore((state) => state.activeSessionId);

  if (skillQuery.isLoading || !skillQuery.data) {
    return <div className="p-4 lg:p-6 text-sm text-muted-foreground">Loading skill…</div>;
  }

  const skill = skillQuery.data;
  const readOnly = skill.source === 'bundled';

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <Link href="/skills" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Skills
      </Link>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-2 py-1">{skill.source}</span>
          <span className="rounded-full border border-border px-2 py-1">v{skill.version ?? '0.0.0'}</span>
          <span className="rounded-full border border-border px-2 py-1">{skill.installed ? 'Installed' : 'Available'}</span>
          <span className="rounded-full border border-border px-2 py-1">{skill.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
        <h1 className="text-2xl font-semibold">{skill.name}</h1>
        <p className="text-sm text-muted-foreground">{skill.description}</p>
        <SkillActionBar
          skill={skill}
          hasActiveSession={Boolean(activeSessionId)}
          onInstall={() => void installSkill.mutateAsync(skill.id)}
          onEnableToggle={() => void enableSkill.mutateAsync({ skillId: skill.id, enabled: !skill.enabled })}
          onLoadIntoSession={() => {
            if (!activeSessionId) return;
            void loadSkill.mutateAsync({ skillId: skill.id, sessionId: activeSessionId });
          }}
          onUninstall={() => void uninstallSkill.mutateAsync(skill.id)}
        />
        {activeSessionId ? (
          <p className="text-xs text-muted-foreground">Current chat session available: {activeSessionId}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Open Chat and select a session before loading a skill into it.</p>
        )}
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Skill source</h2>
        <p className="mt-1 text-sm text-muted-foreground">Inspect or edit the SKILL.md-style content for this mock skill record.</p>
        <div className="mt-4">
          <SkillEditor
            content={skill.content}
            readOnly={readOnly}
            onSave={async (content) => {
              await updateContent.mutateAsync({ skillId: skill.id, content });
            }}
          />
        </div>
      </section>
    </div>
  );
}
