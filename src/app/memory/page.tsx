import { AppShell } from '@/components/layout/app-shell';
import { MemoryScreen } from '@/features/memory/components/memory-screen';
import { requireAuth } from '@/server/auth/guards';

export default async function MemoryPage() {
  await requireAuth();

  return (
    <AppShell>
      <MemoryScreen />
    </AppShell>
  );
}
