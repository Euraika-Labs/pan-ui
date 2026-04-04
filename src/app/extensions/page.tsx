import { AppShell } from '@/components/layout/app-shell';
import { requireAuth } from '@/server/auth/guards';
import { ExtensionsScreen } from '@/features/extensions/components/extensions-screen';

export default async function ExtensionsPage() {
  await requireAuth();

  return (
    <AppShell>
      <ExtensionsScreen />
    </AppShell>
  );
}
