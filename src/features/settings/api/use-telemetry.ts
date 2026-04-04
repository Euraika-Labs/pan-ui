'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';

export function useTelemetry(query = '', limit = 200) {
  return useQuery({
    queryKey: ['telemetry', query, limit],
    queryFn: () => apiFetch<{ events: Array<Record<string, unknown>> }>(`/api/runtime/telemetry?query=${encodeURIComponent(query)}&limit=${limit}`),
    select: (data) => data.events,
  });
}
