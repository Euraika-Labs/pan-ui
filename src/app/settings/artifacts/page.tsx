import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { ArtifactsBrowser } from '@/features/settings/components/artifacts-browser';

export default async function ArtifactsPage() {
  await requireAdmin();
  return <AppShell><ArtifactsBrowser /></AppShell>;
}
