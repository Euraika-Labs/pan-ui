'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';

type RuntimeStatus = {
  available: boolean;
  hermesPath?: string;
  hermesVersion?: string;
  hermesHome?: string;
  activeProfile?: string;
  configPath?: string;
  modelDefault?: string;
  provider?: string;
  memoryProvider?: string;
  mcpServers: Array<{ name: string; command?: string; url?: string }>;
  profiles: string[];
  skillsCount: number;
  sessionsCount: number;
  recentSessions: Array<{ id: string; title: string | null; preview: string | null; started_at: number; model: string | null }>;
  userMemoryPath?: string;
  agentMemoryPath?: string;
};

export function useRuntimeStatus() {
  return useQuery({
    queryKey: ['runtime-status'],
    queryFn: () => apiFetch<{ status: RuntimeStatus }>('/api/runtime/status'),
    select: (data) => data.status,
  });
}
