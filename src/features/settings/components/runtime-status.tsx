'use client';

import { RefreshCcw } from 'lucide-react';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/states';
import { useRuntimeStatus } from '@/features/settings/api/use-runtime-status';
import { cn } from '@/lib/utils';

export function RuntimeStatusPanel() {
  const runtimeQuery = useRuntimeStatus();

  if (runtimeQuery.isLoading) return <LoadingState message="Inspecting runtime…" />;
  if (runtimeQuery.isError) return <ErrorState message={(runtimeQuery.error as Error).message} />;
  if (!runtimeQuery.data?.available) {
    return <EmptyState title="Runtime not detected" description="Set HERMES_HOME and install the Hermes runtime to enable live chat, skill, and extension views." action={<button type="button" onClick={() => void runtimeQuery.refetch()} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground">Retry detection</button>} />;
  }

  const status = runtimeQuery.data;
  return (
    <section className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Runtime status</h2>
          <p className="mt-1 text-sm text-muted-foreground">Installed runtime, profile context, API reachability, memory files, and recent persisted sessions.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium', status.apiReachable ? 'border-success/30 bg-success/10 text-foreground' : 'border-warning/30 bg-warning/10 text-foreground')}>
            {status.apiReachable ? 'API reachable' : 'API unavailable'}
          </span>
          <button type="button" onClick={() => void runtimeQuery.refetch()} className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-3 py-2 text-sm font-medium text-foreground"><RefreshCcw className="h-4 w-4" />Refresh</button>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border/70 bg-background/80 p-4 text-sm shadow-[var(--shadow-card)]">
          <p><strong>Version:</strong> {status.hermesVersion}</p>
          <p><strong>Binary:</strong> {status.hermesPath}</p>
          <p><strong>Home:</strong> {status.hermesHome}</p>
          <p><strong>Config:</strong> {status.configPath}</p>
          <p><strong>Profile context:</strong> {status.profileContext?.label ?? 'n/a'}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-background/80 p-4 text-sm shadow-[var(--shadow-card)]">
          <p><strong>Default model:</strong> {status.modelDefault ?? 'n/a'}</p>
          <p><strong>Provider:</strong> {status.provider ?? 'n/a'}</p>
          <p><strong>Memory provider:</strong> {status.memoryProvider ?? 'n/a'}</p>
          <p><strong>Memory files:</strong> {status.memoryFilesPresent?.join(', ') || 'none detected'}</p>
          <p><strong>API status:</strong> {status.apiMessage}</p>
        </div>
      </div>
      {status.remediationHints?.length ? <div className="mt-4 rounded-lg border border-border/70 bg-background/80 p-4 text-sm shadow-[var(--shadow-card)]"><p className="font-medium text-foreground">Remediation hints</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{status.remediationHints.map((hint) => <li key={hint}>{hint}</li>)}</ul></div> : null}
    </section>
  );
}