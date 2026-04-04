import { persistTelemetry } from '@/server/runtime/runtime-store';

export function trackServerEvent(event: string, payload?: Record<string, unknown>) {
  persistTelemetry(event, 'server', payload);
  // eslint-disable-next-line no-console
  console.debug('[server-telemetry]', event, payload ?? {});
}
