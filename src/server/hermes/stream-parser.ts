import type { HermesStreamEvent } from '@/server/hermes/event-types';

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function parseSSEChunk(rawChunk: string): HermesStreamEvent[] {
  const events: HermesStreamEvent[] = [];
  const blocks = rawChunk.split('\n\n');

  for (const block of blocks) {
    const dataLines = block.split('\n').filter((line) => line.startsWith('data:'));
    for (const line of dataLines) {
      const payload = line.replace(/^data:\s*/, '').trim();
      if (!payload || payload === '[DONE]') continue;
      const parsed = safeJsonParse(payload) as Record<string, any> | null;
      if (!parsed) continue;

      if (parsed.type === 'assistant.delta' || parsed.type === 'tool.started' || parsed.type === 'tool.awaiting_approval' || parsed.type === 'tool.completed' || parsed.type === 'artifact.emitted' || parsed.type === 'error') {
        events.push(parsed as HermesStreamEvent);
        continue;
      }

      if (parsed.type === 'response.output_text.delta' && parsed.delta) {
        events.push({ type: 'assistant.delta', delta: String(parsed.delta) });
        continue;
      }

      if (parsed.type === 'response.output_item.added' && parsed.item?.type === 'function_call') {
        events.push({
          type: 'tool.started',
          toolCallId: String(parsed.item.call_id || parsed.item.id || 'tool-call'),
          toolName: String(parsed.item.name || 'function_call'),
        });
        continue;
      }

      if (parsed.type === 'response.output_item.done' && parsed.item?.type === 'function_call') {
        events.push({
          type: 'tool.completed',
          toolCallId: String(parsed.item.call_id || parsed.item.id || 'tool-call'),
          toolName: String(parsed.item.name || 'function_call'),
          output: typeof parsed.item.arguments === 'string' ? parsed.item.arguments : JSON.stringify(parsed.item.arguments || {}),
        });
        continue;
      }

      if ((parsed.type === 'response.completed' || parsed.type === 'response.output_item.done') && Array.isArray(parsed.response?.output)) {
        for (const item of parsed.response.output) {
          if (item?.type === 'message' && Array.isArray(item.content)) {
            for (const part of item.content) {
              if ((part?.type === 'output_text' || part?.type === 'text') && part.text) {
                events.push({ type: 'assistant.delta', delta: String(part.text) });
              }
            }
          }
          if (item?.type === 'function_call') {
            events.push({
              type: 'tool.completed',
              toolCallId: String(item.call_id || item.id || 'tool-call'),
              toolName: String(item.name || 'function_call'),
              output: typeof item.arguments === 'string' ? item.arguments : JSON.stringify(item.arguments || {}),
            });
          }
        }
      }
    }
  }

  return events;
}
