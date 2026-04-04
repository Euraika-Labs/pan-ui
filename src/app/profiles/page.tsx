import { AppShell } from '@/components/layout/app-shell';
import { ProfilesScreen } from '@/features/profiles/components/profiles-screen';
import { requireAuth } from '@/server/auth/guards';

export default async function ProfilesPage() {
  await requireAuth();

  return (
    <AppShell>
      <ProfilesScreen />
    </AppShell>
  );
}
