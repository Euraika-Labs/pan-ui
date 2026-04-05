'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { useUIStore } from '@/lib/store/ui-store';

export type RuntimeStatus = {
  available: boolean;
  mockMode?: boolean;
  hermesPath?: string;
  hermesVersion?: string;
  hermesHome?: string;
  activeProfile?: string;
  configPath?: string;
  modelDefault?: string;
  provider?: string;
  memoryProvider?: string;
  apiBaseUrl: string;
  apiReachable: boolean;
  apiMessage: string;
  apiStatus?: number;
  modelOptions: Array<{
    id: string;
    label: string;
    provider: string;
    source: 'runtime-default' | 'catalog' | 'session-history';
  }>;
  mcpServers: Array<{ name: string; command?: string; url?: string }>;
  profiles: string[];
  skillsCount: number;
  sessionsCount: number;
  recentSessions: Array<{ id: string; title: string | null; preview: string | null; started_at: number; model: string | null }>;
  userMemoryPath?: string;
  agentMemoryPath?: string;
  profileContext?: {
    requestedProfile: string;
    activeProfile: string;
    usingRequestedProfile: boolean;
    label: string;
  };
  memoryFilesPresent?: string[];
  binaryDetected?: boolean;
  configDetected?: boolean;
  lastFailureText?: string;
  remediationHints?: string[];
};

export function useRuntimeStatus() {
  const selectedProfileId = useUIStore((state) => state.selectedProfileId);

  return useQuery({
    queryKey: ['runtime-status', selectedProfileId],
    queryFn: () => apiFetch<{ status: RuntimeStatus }>('/api/runtime/status'),
    select: (data) => data.status,
  });
}
