'use client';

import { useState } from 'react';
import { useCreateProfile, useDeleteProfile, useProfiles, useUpdateProfile } from '@/features/profiles/api/use-profiles';
import { CreateProfileDialog } from '@/features/profiles/components/create-profile-dialog';
import { PolicyPresetSelector } from '@/features/settings/components/policy-preset-selector';
import { useUIStore } from '@/lib/store/ui-store';

export function ProfilesScreen() {
  const { selectedProfileId, setSelectedProfileId } = useUIStore();
  const profilesQuery = useProfiles();
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Profiles</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create, switch, clone, and delete isolated Hermes workspaces.</p>
        </div>
        <button type="button" onClick={() => setDialogOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Create profile</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(profilesQuery.data ?? []).map((profile) => (
          <div key={profile.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{profile.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Model: {profile.modelDefault ?? 'n/a'}</p>
              </div>
              {profile.active ? <span className="rounded-full bg-success/15 px-2 py-1 text-xs">Active</span> : null}
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Sessions: {profile.sessionCount ?? 0}</p>
              <p>Skills: {profile.skillCount ?? 0}</p>
              <p>Extensions: {profile.extensionCount ?? 0}</p>
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
              <button type="button" onClick={async () => { setSelectedProfileId(profile.id); await updateProfile.mutateAsync({ profileId: profile.id, action: 'activate' }); }} className="rounded-lg border border-border px-3 py-2 text-sm">Switch</button>
              <button type="button" onClick={() => void updateProfile.mutateAsync({ profileId: profile.id, action: 'clone' })} className="rounded-lg border border-border px-3 py-2 text-sm">Clone</button>
              <button type="button" onClick={() => void deleteProfile.mutateAsync(profile.id)} className="rounded-lg border border-border px-3 py-2 text-sm text-danger">Delete</button>
            </div>
            {selectedProfileId === profile.id ? <p className="mt-3 text-xs text-muted-foreground">Selected in UI</p> : null}
          </div>
        ))}
      </div>
      <CreateProfileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (payload) => {
          await createProfile.mutateAsync(payload);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
