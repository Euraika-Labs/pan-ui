import Link from 'next/link';
import type { Extension } from '@/lib/types/extension';
import { ExtensionHealthBadge } from '@/features/extensions/components/extension-health-badge';

export function ExtensionCard({ extension }: { extension: Extension }) {
  return (
    <Link href={`/extensions/${extension.id}`} className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{extension.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{extension.description}</p>
        </div>
        <div className="space-y-2 text-right">
          <ExtensionHealthBadge health={extension.health} />
          <p className="text-xs text-muted-foreground">{extension.type} · risk {extension.riskLevel}</p>
        </div>
      </div>
    </Link>
  );
}
