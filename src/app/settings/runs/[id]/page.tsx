import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { RunDetail } from '@/features/settings/components/run-detail';

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  return <AppShell><RunDetail runId={id} /></AppShell>;
}
