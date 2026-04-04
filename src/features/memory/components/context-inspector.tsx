'use client';

import { useContextInspector } from '@/features/memory/api/use-memory';
import { useUIStore } from '@/lib/store/ui-store';

export function ContextInspectorPanel() {
  const { selectedProfileId, activeSessionId } = useUIStore();
  const contextQuery = useContextInspector(selectedProfileId, activeSessionId);
  const context = contextQuery.data;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Context inspector</h2>
      <p className="mt-1 text-sm text-muted-foreground">See what Hermes is currently using as session and profile context.</p>
      {context ? (
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-xl border border-border bg-background p-4">
            <p><strong>Profile:</strong> {context.activeProfileId ?? 'none'}</p>
            <p><strong>Session:</strong> {context.activeSessionTitle ?? context.activeSessionId ?? 'none'}</p>
            <p><strong>Model:</strong> {context.model ?? 'n/a'} · <strong>Provider:</strong> {context.provider ?? 'n/a'}</p>
            <p><strong>Policy:</strong> {context.policyPreset ?? 'n/a'} · <strong>Memory mode:</strong> {context.memoryMode ?? 'n/a'}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="font-medium">Loaded skills</p>
            <p className="mt-1 text-muted-foreground">{context.loadedSkillIds.length ? context.loadedSkillIds.join(', ') : 'None'}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
