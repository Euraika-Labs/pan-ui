import { AppShell } from '@/components/layout/app-shell';
import { SettingsScreen } from '@/features/settings/components/settings-screen';
import { requireAdmin } from '@/server/auth/guards';

export default async function SettingsPage() {
  await requireAdmin();

  return (
    <AppShell>
      <SettingsScreen />
    </AppShell>
  );
}
