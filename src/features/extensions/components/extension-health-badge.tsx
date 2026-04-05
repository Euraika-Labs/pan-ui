import type { ExtensionHealth } from '@/lib/types/extension';
import { StatusBadge } from '@/components/feedback/status-badge';
import { authTone, connectivityTone, governanceTone, humanizeStatus, normalizeExtensionHealth } from '@/lib/types/runtime-status';

export function ExtensionHealthBadge({ health }: { health: ExtensionHealth }) {
  const normalized = normalizeExtensionHealth(health);
  const tone = normalized === 'healthy' || normalized === 'degraded' || normalized === 'unreachable'
    ? connectivityTone(normalized)
    : normalized === 'connected' || normalized === 'needs-auth' || normalized === 'expired'
      ? authTone(normalized)
      : governanceTone(normalized);

  return <StatusBadge label={humanizeStatus(health)} tone={tone} />;
}
