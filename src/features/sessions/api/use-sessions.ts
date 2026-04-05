'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import type { ChatSession, ChatSessionSettings, ChatSessionSummary } from '@/lib/types/chat';

type SessionsResponse = { sessions: ChatSessionSummary[] };
type SessionResponse = { session: ChatSession };

function toSummary(session: ChatSession): ChatSessionSummary {
  return {
    id: session.id,
    title: session.title,
    updatedAt: session.updatedAt,
    preview: session.preview,
    workspaceLabel: session.archived ? 'Archived' : session.parentSessionId ? 'Forks' : 'Active workspace',
    pinned: !session.archived && !session.parentSessionId,
    archived: session.archived,
    parentSessionId: session.parentSessionId,
  };
}

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
      queryClient.setQueryData<SessionsResponse | undefined>(['sessions', ''], (current) =>
        current
          ? {
              sessions: current.sessions.map((item) => (item.id === session.id ? { ...item, ...toSummary(session) } : item)),
            }
          : current,
      );
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
      queryClient.setQueryData<SessionsResponse | undefined>(['sessions', ''], (current) =>
        current
          ? {
              sessions: [toSummary(session), ...current.sessions.filter((item) => item.id !== session.id)],
            }
          : { sessions: [toSummary(session)] },
      );
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
