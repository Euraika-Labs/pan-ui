'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { Profile } from '@/lib/types/profile';

type ProfilesResponse = { profiles: Profile[] };
type ProfileResponse = { profile: Profile };

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => apiFetch<ProfilesResponse>('/api/profiles'),
    select: (data) => data.profiles,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; policyPreset?: Profile['policyPreset'] }) =>
      apiFetch<ProfileResponse>('/api/profiles', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['audit'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, action, policyPreset }: { profileId: string; action?: 'activate' | 'clone'; policyPreset?: Profile['policyPreset'] }) =>
      apiFetch<ProfileResponse>(`/api/profiles/${profileId}`, { method: 'PATCH', body: JSON.stringify({ action, policyPreset }) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['audit'] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId: string) => apiFetch<ProfileResponse>(`/api/profiles/${profileId}`, { method: 'DELETE' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      await queryClient.invalidateQueries({ queryKey: ['audit'] });
    },
  });
}
