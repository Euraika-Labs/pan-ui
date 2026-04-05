'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { Profile } from '@/lib/types/profile';

type ProfilesResponse = { profiles: Profile[] };
type ProfileResponse = { profile: Profile };

async function invalidateProfileScopedQueries(queryClient: ReturnType<typeof useQueryClient>) {
  const keys = [
    ['profiles'],
    ['audit'],
    ['runtime-status'],
    ['runtime-health'],
    ['sessions'],
    ['session'],
    ['skills'],
    ['skill'],
    ['extensions'],
    ['extension'],
    ['memory'],
    ['context-inspector'],
    ['runtime-runs'],
    ['runtime-run'],
    ['runtime-run-events'],
    ['runtime-approvals'],
    ['runtime-artifacts'],
    ['runtime-timeline'],
    ['mcp-probe-results'],
    ['telemetry'],
  ] as const;

  await Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
}

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
      await invalidateProfileScopedQueries(queryClient);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, action, policyPreset }: { profileId: string; action?: 'activate' | 'clone'; policyPreset?: Profile['policyPreset'] }) =>
      apiFetch<ProfileResponse>(`/api/profiles/${profileId}`, { method: 'PATCH', body: JSON.stringify({ action, policyPreset }) }),
    onSuccess: async () => {
      await invalidateProfileScopedQueries(queryClient);
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId: string) => apiFetch<ProfileResponse>(`/api/profiles/${profileId}`, { method: 'DELETE' }),
    onSuccess: async () => {
      await invalidateProfileScopedQueries(queryClient);
    },
  });
}

// ── Profile Config (full editable config.yaml + SOUL.md) ──

import type { ProfileConfig } from '@/lib/types/profile';

type ConfigResponse = { config: ProfileConfig };
type AiOptimizeResponse = { suggestion: Partial<ProfileConfig>; explanation: string; currentConfig: ProfileConfig };

export function useProfileConfig(profileId: string | null) {
  return useQuery({
    queryKey: ['profile-config', profileId],
    queryFn: () => apiFetch<ConfigResponse>(`/api/profiles/${profileId}/config`),
    select: (data) => data.config,
    enabled: !!profileId,
  });
}

export function useUpdateProfileConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, config }: { profileId: string; config: Partial<ProfileConfig> }) =>
      apiFetch<ConfigResponse>(`/api/profiles/${profileId}/config`, { method: 'PATCH', body: JSON.stringify({ config }) }),
    onSuccess: async () => {
      await invalidateProfileScopedQueries(queryClient);
    },
  });
}

export function useAiOptimizeProfile() {
  return useMutation({
    mutationFn: ({ profileId, purpose, mode }: { profileId: string; purpose?: string; mode?: 'optimize' | 'create' }) =>
      apiFetch<AiOptimizeResponse>(`/api/profiles/${profileId}/config`, { method: 'POST', body: JSON.stringify({ purpose, mode }) }),
  });
}

