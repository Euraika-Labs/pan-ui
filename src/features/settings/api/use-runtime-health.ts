'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';

export function useRuntimeHealth(query = '') {
  return useQuery({
    queryKey: ['runtime-health', query],
    queryFn: () => apiFetch<{
      runtime: Record<string, unknown>;
      checks: Record<string, boolean>;
      doctorOutput: string;
    }>(`/api/runtime/health?query=${encodeURIComponent(query)}`),
  });
}
