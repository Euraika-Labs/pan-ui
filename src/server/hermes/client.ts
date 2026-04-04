import { hermesConfig } from '@/server/hermes/config';
import { HermesConnectionError, HermesResponseError } from '@/server/hermes/errors';

export async function hermesFetch(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), hermesConfig.timeoutMs);

  try {
    const response = await fetch(`${hermesConfig.baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(hermesConfig.apiKey ? { Authorization: `Bearer ${hermesConfig.apiKey}` } : {}),
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new HermesResponseError(response.status);
    }

    return response;
  } catch (error) {
    if (error instanceof HermesResponseError) {
      throw error;
    }
    throw new HermesConnectionError(error instanceof Error ? error.message : undefined);
  } finally {
    clearTimeout(timeout);
  }
}
