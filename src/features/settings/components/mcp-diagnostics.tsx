'use client';

import { useMcpProbeResults } from '@/features/settings/api/use-runtime-runs';
import { useRuntimeStatus } from '@/features/settings/api/use-runtime-status';

export function McpDiagnosticsPanel() {
  const runtimeQuery = useRuntimeStatus();
  const probeQuery = useMcpProbeResults();
  const status = runtimeQuery.data;
  const probes = probeQuery.data ?? [];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">MCP diagnostics</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect configured MCP servers, last probe results, active profile context, and remediation hints.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Runtime profile</p>
          <p className="mt-2 font-semibold">{status?.profileContext?.label ?? status?.activeProfile ?? 'unknown'}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Configured servers</p>
          <p className="mt-2 font-semibold">{status?.mcpServers.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-sm shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Probe records</p>
          <p className="mt-2 font-semibold">{probes.length}</p>
        </div>
      </div>
      <div className="space-y-3">
        {(status?.mcpServers ?? []).map((server) => {
          const probe = probes.find((item) => item.serverName === server.name) as Record<string, unknown> | undefined;
          return (
            <div key={server.name} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{server.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{server.url || server.command || 'No transport configured'}</p>
                </div>
                <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">{probe ? (probe.success ? 'success' : 'failed') : 'unknown'}</span>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                <p><strong>Last probe:</strong> {probe ? String(probe.probedAt) : 'never'}</p>
                <p><strong>Error:</strong> {probe && probe.errorText ? String(probe.errorText) : 'none captured'}</p>
                <p><strong>Tools seen:</strong> {probe && Array.isArray(probe.tools) ? probe.tools.length : 0}</p>
              </div>
            </div>
          );
        })}
        {!(status?.mcpServers.length ?? 0) ? <p className="text-sm text-muted-foreground">No MCP servers are currently configured.</p> : null}
      </div>
    </div>
  );
}
