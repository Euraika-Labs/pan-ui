import { AppShell } from '@/components/layout/app-shell';
import { requireAuth } from '@/server/auth/guards';
import { ExtensionsScreen } from '@/features/extensions/components/extensions-screen';

export default async function ExtensionsPage({ searchParams }: { searchParams?: Promise<{ tab?: string }> }) {
  await requireAuth();
  const params = searchParams ? await searchParams : undefined;
  const tab = params?.tab;
  const initialTab = tab === 'mcp' || tab === 'tools' || tab === 'approvals' || tab === 'diagnostics' ? tab : 'installed';

  return (
    <AppShell>
      <ExtensionsScreen initialTab={initialTab} />
    </AppShell>
  );
}
