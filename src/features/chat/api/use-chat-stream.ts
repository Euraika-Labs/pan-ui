'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChatStreamEvent } from '@/lib/types/chat';
import { parseSSEChunk } from '@/server/hermes/stream-parser';

type SendMessageArgs = {
  sessionId: string;
  message: string;
  attachmentIds?: string[];
  onEvent?: (event: ChatStreamEvent) => void;
};

export function useChatStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, message, attachmentIds, onEvent }: SendMessageArgs) => {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message, attachmentIds }),
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? 'Unable to stream response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffered = '';

      let doneReading = false;

      while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;
        if (done || !value) break;
        buffered += decoder.decode(value, { stream: true });
        const chunks = buffered.split('\n\n');
        buffered = chunks.pop() ?? '';

        for (const chunk of chunks) {
          for (const event of parseSSEChunk(`${chunk}\n\n`) as ChatStreamEvent[]) {
            onEvent?.(event);
          }
        }
      }

      return sessionId;
    },
    onSuccess: async (sessionId) => {
      await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      await queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
}
