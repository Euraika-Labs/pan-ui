'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';

export function useRuntimeRuns(sessionId: string | null = null) {
  return useQuery({
    queryKey: ['runtime-runs', sessionId],
    queryFn: () => apiFetch<{ runs: Array<Record<string, string | null>> }>(`/api/runtime/runs${sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : ''}`),
    select: (data) => data.runs,
  });
}

export function useMcpProbeResults() {
  return useQuery({
    queryKey: ['mcp-probe-results'],
    queryFn: () => apiFetch<{ results: Array<Record<string, unknown>> }>('/api/runtime/mcp-probes'),
    select: (data) => data.results,
  });
}
