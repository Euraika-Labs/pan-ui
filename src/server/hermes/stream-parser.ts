import type { HermesStreamEvent } from '@/server/hermes/event-types';
import type { ChatSource } from '@/lib/types/source';

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function inferProvenance(value: unknown): ChatSource['provenance'] {
  switch (String(value || '').toLowerCase()) {
    case 'builtin':
    case 'built-in':
      return 'built-in';
    case 'verified':
      return 'verified';
    case 'self-hosted':
    case 'self_hosted':
      return 'self-hosted';
    case 'local-process':
    case 'local_process':
      return 'local-process';
    case 'custom':
    default:
      return 'custom';
  }
}

function inferSourceType(value: unknown): ChatSource['sourceType'] {
  switch (String(value || '').toLowerCase()) {
    case 'web':
    case 'url':
      return 'web';
    case 'file':
      return 'file';
    case 'workspace':
      return 'workspace';
    case 'integration':
      return 'integration';
    default:
      return 'unknown';
  }
}

function normalizeSource(candidate: Record<string, any> | null): ChatSource | null {
  if (!candidate) return null;
  const title = candidate.title || candidate.label || candidate.name || candidate.href || candidate.url;
  if (!title) return null;

  return {
    id: String(candidate.id || candidate.href || candidate.url || candidate.label || title),
    title: String(title),
    href: candidate.href || candidate.url ? String(candidate.href || candidate.url) : undefined,
    snippet: candidate.snippet || candidate.quote || candidate.description ? String(candidate.snippet || candidate.quote || candidate.description) : undefined,
    sourceType: inferSourceType(candidate.sourceType || candidate.kind || candidate.type),
    provenance: inferProvenance(candidate.provenance),
    note: candidate.note ? String(candidate.note) : undefined,
    label: candidate.label ? String(candidate.label) : undefined,
  };
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

      if (
        parsed.type === 'assistant.delta' ||
        parsed.type === 'run.phase' ||
        parsed.type === 'tool.started' ||
        parsed.type === 'tool.awaiting_approval' ||
        parsed.type === 'tool.completed' ||
        parsed.type === 'artifact.emitted' ||
        parsed.type === 'source.emitted' ||
        parsed.type === 'error'
      ) {
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
          riskLevel: 'execute',
          provenance: 'local-process',
        });
        continue;
      }

      if (parsed.type === 'response.output_item.done' && parsed.item?.type === 'function_call') {
        events.push({
          type: 'tool.completed',
          toolCallId: String(parsed.item.call_id || parsed.item.id || 'tool-call'),
          toolName: String(parsed.item.name || 'function_call'),
          output: typeof parsed.item.arguments === 'string' ? parsed.item.arguments : JSON.stringify(parsed.item.arguments || {}),
          riskLevel: 'execute',
        });
        continue;
      }

      if (parsed.type === 'response.output_item.added' && parsed.item?.type === 'file_search_call') {
        events.push({
          type: 'tool.started',
          toolCallId: String(parsed.item.call_id || parsed.item.id || 'file-search'),
          toolName: 'file_search',
          riskLevel: 'read',
          provenance: 'built-in',
        });
        continue;
      }

      const directSource = normalizeSource(parsed.source || parsed.citation || parsed.metadata?.source || null);
      if (directSource) {
        events.push({ type: 'source.emitted', source: directSource });
      }

      if ((parsed.type === 'response.completed' || parsed.type === 'response.output_item.done') && Array.isArray(parsed.response?.output)) {
        for (const item of parsed.response.output) {
          if (item?.type === 'message' && Array.isArray(item.content)) {
            for (const part of item.content) {
              if ((part?.type === 'output_text' || part?.type === 'text') && part.text) {
                events.push({ type: 'assistant.delta', delta: String(part.text) });
              }
              const partSource = normalizeSource(part?.source || part?.citation || null);
              if (partSource) {
                events.push({ type: 'source.emitted', source: partSource });
              }
            }
          }
          if (item?.type === 'function_call') {
            events.push({
              type: 'tool.completed',
              toolCallId: String(item.call_id || item.id || 'tool-call'),
              toolName: String(item.name || 'function_call'),
              output: typeof item.arguments === 'string' ? item.arguments : JSON.stringify(item.arguments || {}),
              riskLevel: 'execute',
            });
          }
        }
      }
    }
  }

  return events;
}
