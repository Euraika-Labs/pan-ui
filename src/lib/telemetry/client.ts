'use client';

export function trackClientEvent(event: string, payload?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, source: 'client', payload: payload ?? {} }),
      keepalive: true,
    }).catch(() => undefined);
    // eslint-disable-next-line no-console
    console.debug('[telemetry]', event, payload ?? {});
  }
}
