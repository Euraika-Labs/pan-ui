import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { AuditBrowser } from '@/features/settings/components/audit-browser';

export default async function AuditPage() {
  await requireAdmin();
  return <AppShell><AuditBrowser /></AppShell>;
}
