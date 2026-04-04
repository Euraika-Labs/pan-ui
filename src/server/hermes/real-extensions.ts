import type { Extension, ExtensionCapability } from '@/lib/types/extension';
import { getProfileConfigPath } from '@/server/hermes/paths';
import { probeMcpTools } from '@/server/hermes/mcp-probe';
import { readYamlFile, writeYamlFile } from '@/server/hermes/yaml-config';

type MappedMcpConfig = {
  command?: string;
  url?: string;
  args?: string[];
  env?: Record<string, string>;
  timeout?: number;
  tools?: { include?: string[]; exclude?: string[] };
};

type ConfigShape = {
  mcp_servers?: Record<string, MappedMcpConfig>;
  ui_policy_preset?: 'safe-chat' | 'research' | 'builder' | 'full-power';
};

function capabilitiesFromConfig(profileId: string | null | undefined, id: string, cfg: MappedMcpConfig | undefined): ExtensionCapability[] {
  const probed = probeMcpTools(profileId, id);
  const toolNames = probed.map((t) => t.name);
  const include = new Set(cfg?.tools?.include || []);
  const exclude = new Set(cfg?.tools?.exclude || []);

  if (toolNames.length === 0) {
    const names = include.size ? Array.from(include) : ['all_tools'];
    return names.map((name, index) => ({
      id: `${id}-${index}`,
      name,
      description: 'Configured MCP tool',
      enabled: !exclude.has(name),
      riskLevel: 'medium',
      scope: 'profile',
    }));
  }

  return toolNames.map((name, index) => ({
    id: `${id}-${index}`,
    name,
    description: probed.find((t) => t.name === name)?.description || 'Configured MCP tool',
    enabled: include.size ? include.has(name) : !exclude.has(name),
    riskLevel: 'medium',
    scope: 'profile',
  }));
}

function mapMcpToExtension(profileId: string | null | undefined, id: string, cfg: MappedMcpConfig | undefined): Extension {
  const capabilities = capabilitiesFromConfig(profileId, id, cfg);
  return {
    id,
    name: id,
    description: 'Configured MCP server from Hermes config.yaml',
    health: cfg?.command || cfg?.url ? 'healthy' : 'needs_configuration',
    riskLevel: 'medium',
    type: 'mcp',
    installed: true,
    config: { command: cfg?.command, url: cfg?.url, authType: 'none' },
    capabilities,
  };
}

export function listRealExtensions(profileId: string | null | undefined): Extension[] {
  const config = readYamlFile<ConfigShape>(getProfileConfigPath(profileId));
  return Object.entries(config.mcp_servers || {}).map(([id, cfg]) => mapMcpToExtension(profileId, id, cfg));
}

export function getRealExtension(profileId: string | null | undefined, extensionId: string): Extension | null {
  return listRealExtensions(profileId).find((item) => item.id === extensionId) || null;
}

export function addRealMcpExtension(profileId: string | null | undefined, payload: { name: string; command?: string; url?: string }) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<ConfigShape>(configPath);
  const id = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  config.mcp_servers = config.mcp_servers || {};
  config.mcp_servers[id] = {
    command: payload.command,
    url: payload.url,
  };
  writeYamlFile(configPath, config);
  return getRealExtension(profileId, id)!;
}

export function updateRealExtension(profileId: string | null | undefined, extensionId: string, patch: { command?: string; url?: string }) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<ConfigShape>(configPath);
  config.mcp_servers = config.mcp_servers || {};
  const current = config.mcp_servers[extensionId] || {};
  config.mcp_servers[extensionId] = { ...current, ...patch };
  writeYamlFile(configPath, config);
  return getRealExtension(profileId, extensionId)!;
}

export function updateRealExtensionCapability(
  profileId: string | null | undefined,
  extensionId: string,
  capabilityName: string,
  patch: { enabled?: boolean; scope?: 'global' | 'profile' | 'session' },
) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<ConfigShape>(configPath);
  config.mcp_servers = config.mcp_servers || {};
  const current = config.mcp_servers[extensionId];
  if (!current) throw new Error('Extension not found');
  current.tools = current.tools || {};
  const include = new Set(current.tools.include || []);
  const exclude = new Set(current.tools.exclude || []);

  if (patch.enabled === true) {
    exclude.delete(capabilityName);
    if (include.size || current.tools.include) include.add(capabilityName);
  } else if (patch.enabled === false) {
    include.delete(capabilityName);
    exclude.add(capabilityName);
  }

  if (include.size) current.tools.include = Array.from(include).sort();
  else delete current.tools.include;

  if (exclude.size) current.tools.exclude = Array.from(exclude).sort();
  else delete current.tools.exclude;

  config.mcp_servers[extensionId] = current;
  writeYamlFile(configPath, config);
  return getRealExtension(profileId, extensionId)!;
}
