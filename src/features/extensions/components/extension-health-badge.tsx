import type { ExtensionHealth } from '@/lib/types/extension';

export function ExtensionHealthBadge({ health }: { health: ExtensionHealth }) {
  const styles: Record<ExtensionHealth, string> = {
    healthy: 'bg-success/15 text-foreground',
    needs_configuration: 'bg-warning/15 text-foreground',
    auth_expired: 'bg-danger/15 text-foreground',
    incompatible: 'bg-danger/15 text-foreground',
    test_failed: 'bg-danger/15 text-foreground',
    disabled_by_policy: 'bg-muted text-muted-foreground',
  };

  return <span className={`rounded-full px-2 py-1 text-xs ${styles[health]}`}>{health.replaceAll('_', ' ')}</span>;
}
