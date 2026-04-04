import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { RuntimeHealthPanel } from '@/features/settings/components/runtime-health';

export default async function RuntimeHealthPage() {
  await requireAdmin();
  return (
    <AppShell>
      <div className="p-4 lg:p-6">
        <RuntimeHealthPanel />
      </div>
    </AppShell>
  );
}
