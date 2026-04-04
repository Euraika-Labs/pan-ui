import { AppShell } from '@/components/layout/app-shell';
import { SkillDetail } from '@/features/skills/components/skill-detail';
import { requireAuth } from '@/server/auth/guards';

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  return (
    <AppShell>
      <SkillDetail skillId={id} />
    </AppShell>
  );
}
