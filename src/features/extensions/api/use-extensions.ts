'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { normalizeExtension, normalizeExtensions, normalizeToolInventory } from '@/lib/api/normalizers';
import { trackClientEvent } from '@/lib/telemetry/client';
import type { Extension, ToolInventoryItem } from '@/lib/types/extension';

type ExtensionsResponse = { extensions: Extension[]; tools: ToolInventoryItem[] };
type ExtensionResponse = { extension: Extension };

export function useExtensions() {
  return useQuery({
    queryKey: ['extensions'],
    queryFn: () => apiFetch<ExtensionsResponse>('/api/extensions'),
    select: (data) => ({
      extensions: normalizeExtensions(data.extensions),
      tools: normalizeToolInventory(data.tools),
    }),
  });
}

export function useExtension(extensionId: string | null) {
  return useQuery({
    queryKey: ['extension', extensionId],
    queryFn: () => apiFetch<ExtensionResponse>(`/api/extensions/${extensionId}`),
    select: (data) => normalizeExtension(data.extension),
    enabled: Boolean(extensionId),
  });
}

function writeExtension(queryClient: ReturnType<typeof useQueryClient>, extension: Extension) {
  const normalized = normalizeExtension(extension);
  queryClient.invalidateQueries({ queryKey: ['extensions'] });
  queryClient.setQueryData(['extension', normalized.id], { extension: normalized });
}

export function useAddMcpExtension() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; command?: string; url?: string; args?: string[]; env?: Record<string, string>; authType?: 'none' | 'api-key' | 'oauth'; token?: string }) =>
      apiFetch<ExtensionResponse>('/api/extensions/mcp', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: ({ extension }) => {
      trackClientEvent('extension.updated', { extensionId: extension.id });
      writeExtension(queryClient, extension);
    },
  });
}

export function useUpdateExtension() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ extensionId, patch }: { extensionId: string; patch: { command?: string; url?: string; authType?: 'none' | 'api-key' | 'oauth'; token?: string } }) =>
      apiFetch<ExtensionResponse>(`/api/extensions/${extensionId}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
    onSuccess: ({ extension }) => {
      trackClientEvent('extension.config.updated', { extensionId: extension.id });
      writeExtension(queryClient, extension);
    },
  });
}

export function useTestExtension() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (extensionId: string) => apiFetch<ExtensionResponse>(`/api/extensions/${extensionId}/test`, { method: 'POST' }),
    onSuccess: ({ extension }) => {
      trackClientEvent('extension.tested', { extensionId: extension.id, health: extension.health });
      writeExtension(queryClient, extension);
    },
  });
}

export function useUpdateCapability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ extensionId, capabilityId, patch }: { extensionId: string; capabilityId: string; patch: { enabled?: boolean; scope?: 'global' | 'profile' | 'session' } }) =>
      apiFetch<ExtensionResponse>(`/api/extensions/${extensionId}/capabilities/${capabilityId}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
    onSuccess: ({ extension }) => {
      trackClientEvent('extension.capability.updated', { extensionId: extension.id });
      writeExtension(queryClient, extension);
    },
  });
}
