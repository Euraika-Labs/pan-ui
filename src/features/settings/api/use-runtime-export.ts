'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';

export function useRuntimeExport(sessionId: string | null, query = '', status = '') {
  return useQuery({
    queryKey: ['runtime-export', sessionId, query, status],
    queryFn: () =>
      apiFetch<{
        meta: { sessionId: string | null; query: string; status: string; exportedAt: string };
        timeline: unknown[];
        artifacts: unknown[];
        approvals: unknown[];
        telemetry: unknown[];
        audit: unknown[];
      }>(`/api/runtime/export?sessionId=${encodeURIComponent(sessionId || '')}&query=${encodeURIComponent(query)}&status=${encodeURIComponent(status)}`),
    enabled: Boolean(sessionId),
  });
}
