'use client';

import Link from 'next/link';
import type { ChatSource } from '@/lib/types/source';
import { StatusBadge } from '@/components/feedback/status-badge';
import { provenanceTone } from '@/lib/types/runtime-status';

export function SourceCard({ source }: { source: ChatSource }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/60 p-3 shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{source.title}</p>
          <p className="mt-1 text-xs uppercase tracking-label text-muted-foreground">{source.sourceType}</p>
        </div>
        <StatusBadge label={source.provenance} tone={provenanceTone(source.provenance)} />
      </div>
      {source.snippet ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{source.snippet}</p> : null}
      {source.note ? <p className="mt-2 text-xs text-muted-foreground">{source.note}</p> : null}
      {source.href ? (
        <Link href={source.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline">
          Open source
        </Link>
      ) : null}
    </div>
  );
}
