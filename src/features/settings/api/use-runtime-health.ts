'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';

export function useRuntimeHealth(query = '') {
  return useQuery({
    queryKey: ['runtime-health', query],
    queryFn: () => apiFetch<{
      runtime: Record<string, unknown>;
      checks: Array<{ key: string; ok: boolean; detail: string; remediation?: string }>;
      doctorOutput: string;
      summary: { okCount: number; failingCount: number };
    }>(`/api/runtime/health?query=${encodeURIComponent(query)}`),
  });
}
