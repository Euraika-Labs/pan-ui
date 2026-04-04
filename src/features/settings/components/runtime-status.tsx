'use client';

import { useRuntimeStatus } from '@/features/settings/api/use-runtime-status';
import { LoadingState, EmptyState } from '@/components/feedback/states';

export function RuntimeStatusPanel() {
  const runtimeQuery = useRuntimeStatus();

  if (runtimeQuery.isLoading) {
    return <LoadingState message="Inspecting Hermes runtime…" />;
  }

  if (!runtimeQuery.data?.available) {
    return (
      <EmptyState
        title="Hermes runtime not detected"
        description="Set HERMES_HOME or install Hermes locally to enable deeper runtime-backed views."
      />
    );
  }

  const status = runtimeQuery.data;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Real Hermes runtime</h2>
      <p className="mt-1 text-sm text-muted-foreground">This panel is reading the installed Hermes runtime and home directory directly.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4 text-sm">
          <p><strong>Version:</strong> {status.hermesVersion}</p>
          <p><strong>Binary:</strong> {status.hermesPath}</p>
          <p><strong>Home:</strong> {status.hermesHome}</p>
          <p><strong>Config:</strong> {status.configPath}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 text-sm">
          <p><strong>Default model:</strong> {status.modelDefault ?? 'n/a'}</p>
          <p><strong>Provider:</strong> {status.provider ?? 'n/a'}</p>
          <p><strong>Memory provider:</strong> {status.memoryProvider ?? 'n/a'}</p>
          <p><strong>MCP servers:</strong> {status.mcpServers.length}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-4 text-sm">
          <p className="font-medium">Profiles</p>
          <p className="mt-2 text-muted-foreground">{status.profiles.join(', ') || 'None'}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 text-sm">
          <p className="font-medium">Installed skills</p>
          <p className="mt-2 text-muted-foreground">{status.skillsCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 text-sm">
          <p className="font-medium">Persisted sessions</p>
          <p className="mt-2 text-muted-foreground">{status.sessionsCount}</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm">
        <p className="font-medium">Recent real sessions</p>
        <div className="mt-3 space-y-3">
          {status.recentSessions.map((session) => (
            <div key={session.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{session.title || 'Untitled session'}</p>
              <p className="mt-1 text-muted-foreground">{session.preview || 'No preview available.'}</p>
              <p className="mt-2 text-xs text-muted-foreground">{session.id} · {session.model || 'unknown model'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
