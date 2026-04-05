export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => '');

    const message = typeof payload === 'string'
      ? payload || `API request failed with status ${response.status}`
      : (payload as { error?: string; message?: string } | null)?.error
          || (payload as { error?: string; message?: string } | null)?.message
          || `API request failed with status ${response.status}`;

    const code = typeof payload === 'object' && payload !== null && 'code' in payload
      ? String((payload as { code?: string }).code)
      : undefined;

    throw new ApiError(response.status, message, code, payload);
  }

  return (await response.json()) as T;
}
