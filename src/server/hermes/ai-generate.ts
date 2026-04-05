import { hermesFetch } from '@/server/hermes/client';

/**
 * Simple server-side AI text generation via the Hermes API.
 * Non-streaming — returns the full completion text.
 */
export async function aiGenerate(prompt: string, options?: { system?: string; temperature?: number; maxTokens?: number }): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [];
  if (options?.system) {
    messages.push({ role: 'system', content: options.system });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await hermesFetch('/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model: 'hermes-agent',
      messages,
      stream: false,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI generation failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? '';
}

/**
 * AI-powered JSON generation. Prompts the model and parses the response as JSON.
 * Retries once on parse failure with a stricter prompt.
 */
export async function aiGenerateJSON<T = unknown>(prompt: string, options?: { system?: string; temperature?: number }): Promise<T> {
  const systemBase = options?.system ?? '';
  const jsonSystem = `${systemBase}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown fences, no explanation, no preamble. Just the JSON object.`;

  const text = await aiGenerate(prompt, { ...options, system: jsonSystem, temperature: options?.temperature ?? 0.4 });

  // Strip potential markdown fences
  const cleaned = text.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Retry with even stricter prompt
    const retry = await aiGenerate(
      `The following text was supposed to be valid JSON but failed to parse. Fix it and return ONLY the corrected JSON:\n\n${cleaned}`,
      { system: 'You are a JSON repair tool. Output ONLY valid JSON. Nothing else.', temperature: 0.1 },
    );
    const retryCleaned = retry.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim();
    return JSON.parse(retryCleaned) as T;
  }
}
