'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { ChatStreamEvent } from '@/lib/types/chat';

export function useRuntimeRun(runId: string | null) {
  return useQuery({
    queryKey: ['runtime-run', runId],
    queryFn: () => apiFetch<{ run: Record<string, string | null> }>(`/api/runtime/runs/${runId}`),
    select: (data) => data.run,
    enabled: Boolean(runId),
  });
}

export function useRuntimeRunEvents(sessionId: string | null, query = '') {
  return useQuery({
    queryKey: ['runtime-run-events', sessionId, query],
    queryFn: () => apiFetch<{ events: ChatStreamEvent[] }>(`/api/runtime/timeline?sessionId=${encodeURIComponent(sessionId || '')}&query=${encodeURIComponent(query)}`),
    select: (data) => data.events,
    enabled: Boolean(sessionId),
  });
}
