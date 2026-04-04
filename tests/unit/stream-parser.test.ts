import { describe, expect, it } from 'vitest';
import { parseSSEChunk } from '@/server/hermes/stream-parser';

describe('parseSSEChunk', () => {
  it('parses valid SSE data lines', () => {
    const raw = 'data: {"type":"assistant.delta","delta":"hello"}\n\n';
    const parsed = parseSSEChunk(raw);

    expect(parsed).toEqual([{ type: 'assistant.delta', delta: 'hello' }]);
  });

  it('parses tool and artifact events', () => {
    const raw = [
      'data: {"type":"tool.started","toolCallId":"t1","toolName":"web_search"}',
      '',
      'data: {"type":"artifact.emitted","artifactId":"a1","artifactType":"text/markdown","label":"Plan","content":"hello"}',
      '',
    ].join('\n');

    const parsed = parseSSEChunk(raw);
    expect(parsed).toEqual([
      { type: 'tool.started', toolCallId: 't1', toolName: 'web_search' },
      { type: 'artifact.emitted', artifactId: 'a1', artifactType: 'text/markdown', label: 'Plan', content: 'hello' },
    ]);
  });

  it('ignores done markers', () => {
    const raw = 'data: [DONE]\n\n';
    expect(parseSSEChunk(raw)).toEqual([]);
  });
});
