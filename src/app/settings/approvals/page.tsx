import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { ApprovalsBrowser } from '@/features/settings/components/approvals-browser';

export default async function ApprovalsPage() {
  await requireAdmin();
  return <AppShell><ApprovalsBrowser /></AppShell>;
}
