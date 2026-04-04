import { AppShell } from '@/components/layout/app-shell';
import { requireAdmin } from '@/server/auth/guards';
import { McpDiagnosticsPanel } from '@/features/settings/components/mcp-diagnostics';

export default async function McpDiagnosticsPage() {
  await requireAdmin();
  return <AppShell><McpDiagnosticsPanel /></AppShell>;
}
