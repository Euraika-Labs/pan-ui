import { describe, expect, it } from 'vitest';
import { chatStreamEventSchema } from '@/lib/schemas/chat';

describe('chatStreamEventSchema', () => {
  it('parses assistant delta events', () => {
    const parsed = chatStreamEventSchema.parse({
      type: 'assistant.delta',
      delta: 'hello',
    });

    expect(parsed.type).toBe('assistant.delta');
  });

  it('rejects invalid events', () => {
    expect(() => chatStreamEventSchema.parse({ type: 'assistant.delta' })).toThrow();
  });
});
