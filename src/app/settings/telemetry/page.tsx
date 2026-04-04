import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { TelemetryBrowser } from '@/features/settings/components/telemetry-browser';

export default async function TelemetryPage() {
  await requireAdmin();
  return <AppShell><TelemetryBrowser /></AppShell>;
}
