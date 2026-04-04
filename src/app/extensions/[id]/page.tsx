import { AppShell } from '@/components/layout/app-shell';
import { requireAuth } from '@/server/auth/guards';
import { ExtensionDetail } from '@/features/extensions/components/extension-detail';

export default async function ExtensionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  return (
    <AppShell>
      <ExtensionDetail extensionId={id} />
    </AppShell>
  );
}
