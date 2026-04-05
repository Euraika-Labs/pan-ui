'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileCode, FileText, FolderOpen, Tag, Terminal } from 'lucide-react';
import { useSession } from '@/features/sessions/api/use-sessions';
import { useEnableSkill, useInstallSkill, useLoadSkillIntoSession, useSkill, useSkillLinkedFile, useUninstallSkill, useUpdateSkillContent } from '@/features/skills/api/use-skills';
import { SkillActionBar } from '@/features/skills/components/skill-action-bar';
import { SkillEditor } from '@/features/skills/components/skill-editor';
import { describeSkillProvenance, describeSkillScope } from '@/lib/presentation/capability-labels';
import { useUIStore } from '@/lib/store/ui-store';

function LinkedFileViewer({ skillId, filePath }: { skillId: string; filePath: string }) {
  const fileQuery = useSkillLinkedFile(skillId, filePath);

  if (fileQuery.isLoading) {
    return <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">Loading {filePath}…</div>;
  }

  if (fileQuery.error || !fileQuery.data) {
    return <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-muted-foreground">Failed to load {filePath}</div>;
  }

  return (
    <div className="rounded-xl border border-border/70 bg-background/60">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2 text-xs text-muted-foreground">
        <FileCode className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{filePath}</span>
        <span className="ml-auto">{fileQuery.data.content.split('\n').length} lines</span>
      </div>
      <pre className="max-h-[400px] overflow-auto px-4 py-3 text-xs leading-6">
        <code>{fileQuery.data.content}</code>
      </pre>
    </div>
  );
}

const FILE_GROUP_ICONS: Record<string, React.ReactNode> = {
  references: <FileText className="h-3.5 w-3.5" />,
  templates: <FolderOpen className="h-3.5 w-3.5" />,
  scripts: <Terminal className="h-3.5 w-3.5" />,
  assets: <FileCode className="h-3.5 w-3.5" />,
};

export function SkillDetail({ skillId }: { skillId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedSessionId = searchParams.get('session');
  const skillQuery = useSkill(skillId);
  const installSkill = useInstallSkill();
  const enableSkill = useEnableSkill();
  const updateContent = useUpdateSkillContent();
  const loadSkill = useLoadSkillIntoSession();
  const uninstallSkill = useUninstallSkill();
  const { activeSessionId, setActiveSessionId, rememberLoadedSkillInSession } = useUIStore();
  const targetSessionId = requestedSessionId ?? activeSessionId;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (!requestedSessionId) return;
    if (requestedSessionId !== activeSessionId) {
      setActiveSessionId(requestedSessionId);
    }
    router.replace(`/skills/${skillId}`, { scroll: false });
  }, [activeSessionId, requestedSessionId, router, setActiveSessionId, skillId]);

  const activeSessionQuery = useSession(targetSessionId);

  if (skillQuery.isLoading || !skillQuery.data) {
    return <div className="p-4 text-sm text-muted-foreground lg:p-6">Loading skill…</div>;
  }

  const skill = skillQuery.data;
  const activeLoaded = Boolean(activeSessionQuery.data?.loadedSkillIds?.includes(skill.id));
  const readOnly = skill.scope === 'builtin';

  // Group linked files
  const filesByGroup: Record<string, typeof skill.linkedFiles> = {};
  for (const file of skill.linkedFiles ?? []) {
    if (!filesByGroup[file.group]) filesByGroup[file.group] = [];
    filesByGroup[file.group]!.push(file);
  }

  return (
    <div className="h-full overflow-y-auto space-y-6 p-4 lg:p-6">
      <Link href={targetSessionId ? `/skills?session=${encodeURIComponent(targetSessionId)}` : '/skills'} className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to Skills
      </Link>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-2 py-1">{describeSkillScope(skill.scope, skill.ownerProfileId)}</span>
          <span className="rounded-full border border-border px-2 py-1">{describeSkillProvenance(skill.provenance)}</span>
          <span className="rounded-full border border-border px-2 py-1">v{skill.version ?? 'unversioned'}</span>
          <span className="rounded-full border border-border px-2 py-1">{skill.enabled ? 'Enabled' : 'Disabled'}</span>
          {activeLoaded ? <span className="rounded-full bg-primary/10 px-2 py-1 text-foreground">Loaded in current session</span> : null}
          {skill.category ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-1">
              <FolderOpen className="h-3 w-3" />
              {skill.category}
            </span>
          ) : null}
          {skill.author ? (
            <span className="rounded-full border border-border px-2 py-1">by {skill.author}</span>
          ) : null}
        </div>
        <h1 className="text-2xl font-semibold">{skill.name}</h1>
        <p className="text-sm text-muted-foreground">{skill.description}</p>

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {skill.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-primary/8 px-2 py-1 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <SkillActionBar
          skill={skill}
          hasActiveSession={Boolean(targetSessionId)}
          onInstall={() => void installSkill.mutateAsync(skill.id)}
          onEnableToggle={() => void enableSkill.mutateAsync({ skillId: skill.id, enabled: !skill.enabled })}
          onLoadIntoSession={() => {
            if (!targetSessionId) return;
            setActiveSessionId(targetSessionId);
            rememberLoadedSkillInSession(targetSessionId, skill.id);
            router.replace(`/skills/${skillId}?session=${encodeURIComponent(targetSessionId)}&loadedSkill=${encodeURIComponent(skill.id)}`, { scroll: false });
            void loadSkill.mutateAsync({ skillId: skill.id, sessionId: targetSessionId });
          }}
          onUninstall={() => void uninstallSkill.mutateAsync(skill.id)}
        />
        {targetSessionId ? (
          <p className="text-xs text-muted-foreground">Current chat session available: {targetSessionId}{activeLoaded ? ' · skill already loaded' : ''}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Open Chat and select a session before loading a skill into it.</p>
        )}
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {/* SKILL.md source */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Skill source</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              SKILL.md — {skill.content.split('\n').length} lines
              {skill.filePath ? ` · ${skill.filePath}` : ''}
            </p>
            <div className="mt-4">
              <SkillEditor
                content={skill.content}
                readOnly={readOnly}
                targetPath={skill.filePath}
                scopeLabel={describeSkillScope(skill.scope, skill.ownerProfileId)}
                onSave={async (content) => {
                  await updateContent.mutateAsync({ skillId: skill.id, content });
                }}
              />
            </div>
          </div>

          {/* Linked files */}
          {Object.keys(filesByGroup).length > 0 ? (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Linked files</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Supporting references, templates, and scripts bundled with this skill.
              </p>

              <div className="mt-4 space-y-3">
                {Object.entries(filesByGroup).map(([group, files]) => (
                  <div key={group}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {FILE_GROUP_ICONS[group] ?? <FileCode className="h-3.5 w-3.5" />}
                      {group} ({files!.length})
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {files!.map((file) => (
                        <button
                          key={file.path}
                          type="button"
                          onClick={() => setSelectedFile(selectedFile === file.path ? null : file.path)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                            selectedFile === file.path
                              ? 'border-primary/40 bg-primary/10 text-foreground'
                              : 'border-border/60 text-muted-foreground hover:bg-muted/40'
                          }`}
                        >
                          {file.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedFile ? (
                <div className="mt-4">
                  <LinkedFileViewer skillId={skillId} filePath={selectedFile} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Session impact</h2>
            <p className="mt-2 text-sm text-muted-foreground">Skills attach reusable instructions and can imply tool requirements for the current workspace.</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Owner:</strong> {describeSkillScope(skill.scope, skill.ownerProfileId)}</p>
              <p><strong className="text-foreground">Updated:</strong> {skill.updatedAt ? new Date(skill.updatedAt).toLocaleString() : 'Unknown'}</p>
              <p><strong className="text-foreground">Loaded sessions:</strong> {skill.loadedInSessions?.length ? skill.loadedInSessions.join(', ') : 'None recorded yet'}</p>
              {skill.linkedFiles?.length ? (
                <p><strong className="text-foreground">Linked files:</strong> {skill.linkedFiles.length} ({Object.entries(filesByGroup).map(([g, f]) => `${f!.length} ${g}`).join(', ')})</p>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Tool expectations</h2>
            <p className="mt-2 text-sm text-muted-foreground">Rendered only from available metadata. No capability assumptions are fabricated.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(skill.impliedTools?.length ? skill.impliedTools : ['No declared tool dependencies']).map((item) => (
                <span key={item} className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* Related skills */}
          {skill.relatedSkills && skill.relatedSkills.length > 0 ? (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Related skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skill.relatedSkills.map((related) => (
                  <Link
                    key={related}
                    href={`/skills/${related}`}
                    className="rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
                  >
                    {related}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
