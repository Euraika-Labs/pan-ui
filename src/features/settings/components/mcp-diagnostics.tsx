'use client';

import { useRuntimeStatus } from '@/features/settings/api/use-runtime-status';
import { useMcpProbeResults } from '@/features/settings/api/use-runtime-runs';

export function McpDiagnosticsPanel() {
  const runtimeQuery = useRuntimeStatus();
  const probeQuery = useMcpProbeResults();
  const status = runtimeQuery.data;

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">MCP diagnostics</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect configured MCP servers, last probe results, and explicit failure reasons.</p>
      </div>
      <div className="space-y-3">
        {(status?.mcpServers ?? []).map((server) => {
          const probe = (probeQuery.data ?? []).find((item) => item.serverName === server.name);
          return (
            <div key={server.name} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm font-medium">{server.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{server.url || server.command || 'No transport configured'}</p>
              <div className="mt-3 rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                <p><strong>Last probe:</strong> {probe ? String(probe.probedAt) : 'never'}</p>
                <p><strong>Status:</strong> {probe ? (probe.success ? 'success' : 'failed') : 'unknown'}</p>
                <p><strong>Error:</strong> {probe && probe.errorText ? String(probe.errorText) : 'none captured'}</p>
                <p className="mt-3">Potential issue hints:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Missing Python MCP HTTP transport support for streamable HTTP servers</li>
                  <li>Invalid URL or command in config.yaml</li>
                  <li>Missing credentials or env vars required by the server</li>
                  <li>Probe fallback active when live discovery is unavailable</li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
