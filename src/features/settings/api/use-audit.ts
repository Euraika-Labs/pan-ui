'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { AuditEvent } from '@/lib/types/audit';

type AuditResponse = { events: AuditEvent[] };

export function useAudit(query = '') {
  return useQuery({
    queryKey: ['audit', query],
    queryFn: () => apiFetch<AuditResponse>(`/api/audit?query=${encodeURIComponent(query)}`),
    select: (data) => data.events,
  });
}
