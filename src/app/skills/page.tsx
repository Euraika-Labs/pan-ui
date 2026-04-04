import { AppShell } from '@/components/layout/app-shell';
import { requireAuth } from '@/server/auth/guards';
import { SkillsScreen } from '@/features/skills/components/skills-screen';

export default async function SkillsPage() {
  await requireAuth();

  return (
    <AppShell>
      <SkillsScreen />
    </AppShell>
  );
}
