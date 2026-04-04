import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { RunsBrowser } from '@/features/settings/components/runs-browser';

export default async function RunsPage() {
  await requireAdmin();
  return <AppShell><RunsBrowser /></AppShell>;
}
