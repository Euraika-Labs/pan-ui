'use client';

import { useEffect } from 'react';
import { useProfiles, useUpdateProfile } from '@/features/profiles/api/use-profiles';
import { useUIStore } from '@/lib/store/ui-store';

export function ProfileSwitcher() {
  const profilesQuery = useProfiles();
  const updateProfile = useUpdateProfile();
  const { selectedProfileId, setSelectedProfileId } = useUIStore();

  useEffect(() => {
    if (!selectedProfileId && profilesQuery.data?.length) {
      const active = profilesQuery.data.find((profile) => profile.active) ?? profilesQuery.data[0];
      setSelectedProfileId(active.id);
    }
  }, [profilesQuery.data, selectedProfileId, setSelectedProfileId]);

  return (
    <select
      value={selectedProfileId ?? ''}
      onChange={async (event) => {
        const profileId = event.target.value;
        setSelectedProfileId(profileId);
        await updateProfile.mutateAsync({ profileId, action: 'activate' });
      }}
      className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
      aria-label="Profile switcher"
    >
      {(profilesQuery.data ?? []).map((profile) => (
        <option key={profile.id} value={profile.id}>
          {profile.name}
        </option>
      ))}
    </select>
  );
}
