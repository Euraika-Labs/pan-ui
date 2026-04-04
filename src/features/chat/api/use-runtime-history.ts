'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { ChatArtifact, ChatStreamEvent } from '@/lib/types/chat';

export function useRuntimeTimeline(sessionId: string | null, query = '') {
  return useQuery({
    queryKey: ['runtime-timeline', sessionId, query],
    queryFn: () => apiFetch<{ events: ChatStreamEvent[] }>(`/api/runtime/timeline?sessionId=${encodeURIComponent(sessionId || '')}&query=${encodeURIComponent(query)}`),
    select: (data) => data.events,
    enabled: Boolean(sessionId),
  });
}

export function useRuntimeArtifacts(sessionId: string | null, query = '') {
  return useQuery({
    queryKey: ['runtime-artifacts', sessionId, query],
    queryFn: () => apiFetch<{ artifacts: ChatArtifact[] }>(`/api/runtime/artifacts?sessionId=${encodeURIComponent(sessionId || '')}&query=${encodeURIComponent(query)}`),
    select: (data) => data.artifacts,
    enabled: Boolean(sessionId),
  });
}

export function useRuntimeApprovals(sessionId: string | null, query = '', status = '') {
  return useQuery({
    queryKey: ['runtime-approvals', sessionId, query, status],
    queryFn: () => apiFetch<{ approvals: Array<Record<string, string>> }>(`/api/runtime/approvals?sessionId=${encodeURIComponent(sessionId || '')}&query=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`),
    select: (data) => data.approvals,
    enabled: Boolean(sessionId),
  });
}
