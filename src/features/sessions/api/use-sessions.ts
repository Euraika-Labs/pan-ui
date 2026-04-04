'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { ChatSession, ChatSessionSettings, ChatSessionSummary } from '@/lib/types/chat';

type SessionsResponse = { sessions: ChatSessionSummary[] };
type SessionResponse = { session: ChatSession };

export function useSessions(search = '') {
  return useQuery({
    queryKey: ['sessions', search],
    queryFn: () => apiFetch<SessionsResponse>(`/api/chat/sessions${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    select: (data) => data.sessions,
  });
}

export function useSession(sessionId: string | null) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => apiFetch<SessionResponse>(`/api/chat/sessions/${sessionId}`),
    select: (data) => data.session,
    enabled: Boolean(sessionId),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiFetch<SessionResponse>('/api/chat/sessions', { method: 'POST' }),
    onSuccess: async ({ session }) => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.setQueryData(['session', session.id], { session });
    },
  });
}

export function useRenameSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) =>
      apiFetch<SessionResponse>(`/api/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      }),
    onSuccess: async ({ session }) => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.setQueryData(['session', session.id], { session });
    },
  });
}

export function useArchiveSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<SessionResponse>(`/api/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ archived: true }),
      }),
    onSuccess: async ({ session }) => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.setQueryData(['session', session.id], { session });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<{ ok: true }>(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useForkSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<SessionResponse>(`/api/chat/sessions/${sessionId}/fork`, {
        method: 'POST',
      }),
    onSuccess: async ({ session }) => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.setQueryData(['session', session.id], { session });
    },
  });
}

export function useUpdateSessionSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, settings }: { sessionId: string; settings: Partial<ChatSessionSettings> }) =>
      apiFetch<SessionResponse>(`/api/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ settings }),
      }),
    onSuccess: async ({ session }) => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.setQueryData(['session', session.id], { session });
    },
  });
}
