'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { Skill } from '@/lib/types/skill';

type SkillsResponse = { skills: Skill[] };
type SkillResponse = { skill: Skill };

export function useSkills(installedOnly = true) {
  return useQuery({
    queryKey: ['skills', installedOnly],
    queryFn: () => apiFetch<SkillsResponse>(`/api/skills${installedOnly ? '?installed=true' : ''}`),
    select: (data) => data.skills,
  });
}

export function useSkill(skillId: string | null) {
  return useQuery({
    queryKey: ['skill', skillId],
    queryFn: () => apiFetch<SkillResponse>(`/api/skills/${skillId}`),
    select: (data) => data.skill,
    enabled: Boolean(skillId),
  });
}

function invalidateSkills(queryClient: ReturnType<typeof useQueryClient>, skill: Skill) {
  queryClient.invalidateQueries({ queryKey: ['skills'] });
  queryClient.setQueryData(['skill', skill.id], { skill });
}

export function useInstallSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) => apiFetch<SkillResponse>(`/api/skills/${skillId}/install`, { method: 'POST' }),
    onSuccess: ({ skill }) => invalidateSkills(queryClient, skill),
  });
}

export function useEnableSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ skillId, enabled }: { skillId: string; enabled: boolean }) =>
      apiFetch<SkillResponse>(`/api/skills/${skillId}/enable`, {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      }),
    onSuccess: ({ skill }) => invalidateSkills(queryClient, skill),
  });
}

export function useUpdateSkillContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ skillId, content }: { skillId: string; content: string }) =>
      apiFetch<SkillResponse>(`/api/skills/${skillId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      }),
    onSuccess: ({ skill }) => invalidateSkills(queryClient, skill),
  });
}

export function useLoadSkillIntoSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ skillId, sessionId }: { skillId: string; sessionId: string }) =>
      apiFetch<SkillResponse>(`/api/skills/${skillId}/load`, {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      }),
    onSuccess: ({ skill }, variables) => {
      invalidateSkills(queryClient, skill);
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId] });
    },
  });
}

export function useUninstallSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) => apiFetch<SkillResponse>(`/api/skills/${skillId}`, { method: 'DELETE' }),
    onSuccess: ({ skill }) => invalidateSkills(queryClient, skill),
  });
}
