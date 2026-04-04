'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { ContextInspector, MemoryEntry } from '@/lib/types/memory';

type MemoryResponse = { entries: MemoryEntry[] };
type SessionSearchResponse = { results: Array<{ id: string; title: string; preview?: string }> };
type ContextResponse = { context: ContextInspector };

export function useMemory(scope: 'user' | 'agent') {
  return useQuery({
    queryKey: ['memory', scope],
    queryFn: () => apiFetch<MemoryResponse>(`/api/memory/${scope}`),
    select: (data) => data.entries,
  });
}

export function useUpdateMemory(scope: 'user' | 'agent') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => apiFetch<MemoryResponse>(`/api/memory/${scope}`, { method: 'PATCH', body: JSON.stringify({ content }) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['memory', scope] });
      await queryClient.invalidateQueries({ queryKey: ['audit'] });
    },
  });
}

export function useSessionSearch(query: string) {
  return useQuery({
    queryKey: ['memory-session-search', query],
    queryFn: () => apiFetch<SessionSearchResponse>(`/api/memory/session-search?query=${encodeURIComponent(query)}`),
    select: (data) => data.results,
    enabled: query.trim().length > 0,
  });
}

export function useContextInspector(profileId: string | null, sessionId: string | null) {
  return useQuery({
    queryKey: ['context-inspector', profileId, sessionId],
    queryFn: () => apiFetch<ContextResponse>(`/api/memory/context-inspector?profileId=${encodeURIComponent(profileId ?? '')}&sessionId=${encodeURIComponent(sessionId ?? '')}`),
    select: (data) => data.context,
  });
}
