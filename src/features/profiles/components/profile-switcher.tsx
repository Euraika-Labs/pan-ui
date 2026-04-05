'use client';

import { ChevronDown } from 'lucide-react';
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
    <div className="relative min-w-[13rem]">
      <select
        value={selectedProfileId ?? ''}
        onChange={async (event) => {
          const profileId = event.target.value;
          const previous = selectedProfileId;
          setSelectedProfileId(profileId);
          try {
            await updateProfile.mutateAsync({ profileId, action: 'activate' });
          } catch {
            setSelectedProfileId(previous ?? null);
          }
        }}
        className="w-full appearance-none rounded-2xl border border-border/70 bg-background/80 px-4 py-2.5 pr-10 text-sm font-medium shadow-[var(--shadow-card)] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-label="Profile switcher"
      >
        {(profilesQuery.data ?? []).map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
