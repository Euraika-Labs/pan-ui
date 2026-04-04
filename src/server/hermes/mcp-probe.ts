import { execCli } from '@/server/core/cli';
import { getProfileConfigPath } from '@/server/hermes/paths';
import { getMcpProbeResult, persistMcpProbeResult } from '@/server/runtime/runtime-store';

type McpTool = { name: string; description: string };

declare global {
  // eslint-disable-next-line no-var
  var __hermesWorkspaceMcpProbeCache: Map<string, McpTool[]> | undefined;
}

const probeCache = globalThis.__hermesWorkspaceMcpProbeCache ?? new Map<string, McpTool[]>();
globalThis.__hermesWorkspaceMcpProbeCache = probeCache;

export function probeMcpTools(profileId: string | null | undefined, serverName: string): Array<{ name: string; description: string }> {
  const configPath = getProfileConfigPath(profileId);
  const cacheKey = `${configPath}:${serverName}`;
  if (probeCache.has(cacheKey)) {
    return probeCache.get(cacheKey)!;
  }
  const persisted = getMcpProbeResult(cacheKey);
  if (persisted?.tools) {
    const tools = persisted.tools as McpTool[];
    probeCache.set(cacheKey, tools);
    return tools;
  }
  try {
    const out = execCli(
      'python3',
      [
        '-c',
        `import json, sys, yaml
from pathlib import Path
sys.path.insert(0, str(Path.home()/'.hermes'/'hermes-agent'))
from hermes_cli.mcp_config import _probe_single_server
cfg = yaml.safe_load(Path(sys.argv[1]).read_text()) or {}
server = (cfg.get('mcp_servers') or {}).get(sys.argv[2])
if not server:
    print('[]')
    raise SystemExit
print(json.dumps([{'name': n, 'description': d} for n,d in _probe_single_server(sys.argv[2], server)]))
`,
        configPath,
        serverName,
      ],
      { timeout: 15000, suppressStderr: true },
    );
    const parsed = JSON.parse(out) as McpTool[];
    probeCache.set(cacheKey, parsed);
    persistMcpProbeResult({ cacheKey, profileId, serverName, success: true, tools: parsed });
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MCP probe error';
    probeCache.set(cacheKey, []);
    persistMcpProbeResult({ cacheKey, profileId, serverName, success: false, tools: [], errorText: message });
    return [];
  }
}
