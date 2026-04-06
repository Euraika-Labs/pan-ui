'use client';

import { useMemo, useState } from 'react';
import { Pencil, Sparkles } from 'lucide-react';
import { CreateProfileDialog } from '@/features/profiles/components/create-profile-dialog';
import { ProfileEditorDialog } from '@/features/profiles/components/profile-editor-dialog';
import { useCreateProfile, useDeleteProfile, useProfiles, useUpdateProfile, useAiOptimizeProfile, useUpdateProfileConfig } from '@/features/profiles/api/use-profiles';
import { PolicyPresetSelector } from '@/features/settings/components/policy-preset-selector';
import { useRuntimeStatus } from '@/features/settings/api/use-runtime-status';
import { useUIStore } from '@/lib/store/ui-store';

export function ProfilesScreen() {
  const { selectedProfileId, setSelectedProfileId } = useUIStore();
  const profilesQuery = useProfiles();
  const runtimeQuery = useRuntimeStatus();
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const aiOptimize = useAiOptimizeProfile();
  const updateConfig = useUpdateProfileConfig();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editorProfileId, setEditorProfileId] = useState<string | null>(null);

  const profiles = profilesQuery.data ?? [];
  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? profiles.find((profile) => profile.active) ?? profiles[0],
    [profiles, selectedProfileId],
  );

  async function handleCreateWithAi(payload: { name: string; policyPreset?: 'safe-chat' | 'research' | 'builder' | 'full-power'; aiPurpose?: string }) {
    // 1. Create the profile via CLI
    await createProfile.mutateAsync({ name: payload.name, policyPreset: payload.policyPreset });

    // 2. If AI purpose was given, generate and apply optimized config
    if (payload.aiPurpose?.trim()) {
      try {
        const result = await aiOptimize.mutateAsync({ profileId: payload.name, purpose: payload.aiPurpose, mode: 'create' });
        if (result.suggestion && Object.keys(result.suggestion).length > 0) {
          await updateConfig.mutateAsync({ profileId: payload.name, config: result.suggestion });
        }
      } catch {
        // Non-fatal: profile is created, AI config is bonus
      }
    }

    setDialogOpen(false);
  }

  return (
    <div className="h-full overflow-y-auto space-y-6 p-4 lg:p-6 pb-8 lg:pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profiles</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Each profile is its own workspace boundary. Keep identity, policy, model defaults, and integration trust visible before you start a run.</p>
        </div>
        <button type="button" onClick={() => setDialogOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Create profile
        </button>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Selected profile posture</h2>
          <p className="mt-1 text-sm text-muted-foreground">The UI selection and the runtime-selected profile should match. This panel makes any drift obvious.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">UI selection</p>
              <p className="mt-2 font-semibold">{selectedProfile?.name ?? 'No profile selected'}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Runtime context</p>
              <p className="mt-2 font-semibold">{runtimeQuery.data?.profileContext?.label ?? runtimeQuery.data?.activeProfile ?? 'Unknown runtime profile'}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Profiles available</p>
              <p className="mt-2 font-semibold">{profiles.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Runtime health</p>
              <p className="mt-2 font-semibold">{selectedProfile?.runtimeHealth ?? 'offline'}</p>
            </div>
          </div>
          {selectedProfile ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Policy:</strong> {selectedProfile.policyPreset ?? 'safe-chat'}</p>
              <p><strong className="text-foreground">Model:</strong> {selectedProfile.modelDefault ?? 'n/a'}</p>
              <p><strong className="text-foreground">Provider:</strong> {selectedProfile.runtimeProvider ?? 'unknown'}</p>
              <p className="mt-2">{selectedProfile.runtimeSummary ?? 'No runtime summary available.'}</p>
            </div>
          ) : null}
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Scope semantics</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-medium text-foreground">Profile switches requery runtime-backed data</p>
              <p className="mt-1">Sessions, skills, extensions, memory context, approvals, and diagnostics are invalidated together when you activate a new profile.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-medium text-foreground">Policy presets are defaults, not hidden magic</p>
              <p className="mt-1">Every preset influences tool approvals, memory behavior, and extension access. The rest of the workspace should reflect the same selected profile immediately.</p>
            </div>
          </div>
        </section>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {profiles.map((profile) => {
          const isSelected = selectedProfileId === profile.id;
          const isRuntimeActive = profile.active;

          return (
            <div key={profile.id} className={`rounded-2xl border bg-card p-5 shadow-sm ${isSelected ? 'border-primary/50' : 'border-border'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{profile.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{profile.profileContextLabel || 'Profile context unavailable'}</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs">
                  {isRuntimeActive ? <span className="rounded-full bg-success/15 px-2 py-1 text-foreground">Active runtime</span> : null}
                  {isSelected ? <span className="rounded-full bg-primary/10 px-2 py-1 text-foreground">Selected in UI</span> : null}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <p>Sessions: {profile.sessionCount ?? 0}</p>
                <p>Skills: {profile.skillCount ?? 0}</p>
                <p>Integrations: {profile.integrationsCount ?? profile.extensionCount ?? 0}</p>
                <p>Runtime: {profile.runtimeHealth ?? 'offline'}</p>
              </div>
              <div className="mt-4 rounded-xl border border-border bg-background p-3 text-sm">
                <p><strong>Model:</strong> {profile.modelDefault ?? 'n/a'}</p>
                <p><strong>Trust:</strong> {profile.trustMode ?? profile.policyPreset ?? 'safe-chat'}</p>
                <p><strong>Provider:</strong> {profile.runtimeProvider ?? 'unknown'}</p>
                <p className="mt-2 text-muted-foreground">{profile.runtimeSummary ?? 'No runtime summary available.'}</p>
              </div>
              <div className="mt-4">
                <label className="text-xs text-muted-foreground">Policy preset</label>
                <div className="mt-1">
                  <PolicyPresetSelector
                    value={profile.policyPreset ?? 'safe-chat'}
                    onChange={(value) => void updateProfile.mutateAsync({ profileId: profile.id, policyPreset: value })}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEditorProfileId(profile.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-300 transition hover:bg-purple-500/20"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                  <Sparkles className="h-3 w-3 text-purple-400" />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setSelectedProfileId(profile.id);
                    await updateProfile.mutateAsync({ profileId: profile.id, action: 'activate' });
                  }}
                  className="rounded-lg border border-border px-3 py-2 text-sm"
                >
                  Switch
                </button>
                <button type="button" onClick={() => void updateProfile.mutateAsync({ profileId: profile.id, action: 'clone' })} className="rounded-lg border border-border px-3 py-2 text-sm">
                  Clone
                </button>
                <button type="button" onClick={() => void deleteProfile.mutateAsync(profile.id)} className="rounded-lg border border-border px-3 py-2 text-sm text-danger">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CreateProfileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateWithAi}
      />

      {editorProfileId && (
        <ProfileEditorDialog
          profileId={editorProfileId}
          profileName={profiles.find((p) => p.id === editorProfileId)?.name ?? editorProfileId}
          open={!!editorProfileId}
          onClose={() => setEditorProfileId(null)}
        />
      )}
    </div>
  );
}
