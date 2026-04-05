import type { Extension, ExtensionApprovalPolicy, ExtensionAuthState, ExtensionCapability, ExtensionGovernanceState, ExtensionHealth, ExtensionRiskLevel, ToolInventoryItem } from '@/lib/types/extension';
import { invalidateMcpProbe, probeMcpServer } from '@/server/hermes/mcp-probe';
import { getProfileConfigPath } from '@/server/hermes/paths';
import { readYamlFile, writeYamlFile } from '@/server/hermes/yaml-config';

type MappedMcpConfig = {
  command?: string;
  url?: string;
  args?: string[];
  env?: Record<string, string>;
  timeout?: number;
  auth?: { type?: 'none' | 'api-key' | 'oauth'; token?: string };
  tools?: { include?: string[]; exclude?: string[] };
};

type ConfigShape = {
  mcp_servers?: Record<string, MappedMcpConfig>;
  ui_policy_preset?: 'safe-chat' | 'research' | 'builder' | 'full-power';
};

function isLocalUrl(url?: string) {
  return Boolean(url && /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(url));
}

function inferRiskLevel(name: string, description: string): ExtensionRiskLevel {
  const hay = `${name} ${description}`.toLowerCase();
  if (/delete|admin|sudo|shell|exec|run|deploy/.test(hay)) return 'admin';
  if (/write|update|create|patch|push|commit/.test(hay)) return 'write';
  if (/search|fetch|read|list|query|inspect/.test(hay)) return 'read';
  return 'execute';
}

function inferApprovalPolicy(riskLevel: ExtensionRiskLevel): ExtensionApprovalPolicy {
  if (riskLevel === 'read') return 'auto';
  if (riskLevel === 'write') return 'on-request';
  return 'always';
}

function inferAuthState(cfg: MappedMcpConfig | undefined, errorText?: string): ExtensionAuthState {
  const authType = cfg?.auth?.type ?? 'none';
  const token = cfg?.auth?.token;
  const message = (errorText || '').toLowerCase();
  if (message.includes('expired') || message.includes('401')) return 'expired';
  if (authType !== 'none' && !token) return 'needs-auth';
  return 'connected';
}

function inferGovernanceState(capabilities: ExtensionCapability[], authState: ExtensionAuthState): ExtensionGovernanceState {
  if (capabilities.length > 0 && capabilities.every((capability) => !capability.enabled)) return 'blocked';
  if (authState !== 'connected') return 'policy-limited';
  if (capabilities.some((capability) => (capability.approvalPolicy ?? 'auto') !== 'auto')) return 'approval-gated';
  return 'enabled';
}

function inferHealth(cfg: MappedMcpConfig | undefined, probe: ReturnType<typeof probeMcpServer>, governance: ExtensionGovernanceState): ExtensionHealth {
  if (!(cfg?.command || cfg?.url) || governance === 'blocked') return 'blocked';
  if (probe.success) return 'healthy';
  if (probe.errorText) return 'failed';
  return 'degraded';
}

function capabilitiesFromConfig(profileId: string | null | undefined, id: string, cfg: MappedMcpConfig | undefined): ExtensionCapability[] {
  const probe = probeMcpServer(profileId, id);
  const probed = probe.tools;
  const include = new Set(cfg?.tools?.include || []);
  const exclude = new Set(cfg?.tools?.exclude || []);
  const names = probed.length > 0 ? probed.map((tool) => tool.name) : Array.from(include);

  return names.map((name) => {
    const description = probed.find((tool) => tool.name === name)?.description || 'Configured MCP tool';
    const riskLevel = inferRiskLevel(name, description);
    return {
      id: `${id}:${name}`,
      name,
      description,
      enabled: include.size ? include.has(name) : !exclude.has(name),
      riskLevel,
      scope: 'profile',
      approvalPolicy: inferApprovalPolicy(riskLevel),
    };
  });
}

function mapMcpToExtension(profileId: string | null | undefined, id: string, cfg: MappedMcpConfig | undefined): Extension {
  const probe = probeMcpServer(profileId, id);
  const capabilities = capabilitiesFromConfig(profileId, id, cfg);
  const authState = inferAuthState(cfg, probe.errorText);
  const governance = inferGovernanceState(capabilities, authState);
  const riskLevel = capabilities.reduce<ExtensionRiskLevel>((highest, capability) => {
    const ranking: Record<ExtensionRiskLevel, number> = {
      low: 0,
      read: 1,
      medium: 2,
      write: 3,
      high: 4,
      execute: 5,
      admin: 6,
    };
    return ranking[capability.riskLevel] > ranking[highest] ? capability.riskLevel : highest;
  }, 'read');
  const approvalPolicy = capabilities.some((capability) => capability.approvalPolicy === 'always')
    ? 'always'
    : capabilities.some((capability) => capability.approvalPolicy === 'on-request')
      ? 'on-request'
      : 'auto';

  return {
    id,
    name: id,
    description: 'Configured MCP server from Hermes config.yaml',
    health: inferHealth(cfg, probe, governance),
    riskLevel,
    authState,
    governance,
    provenance: cfg?.command ? 'local-process' : isLocalUrl(cfg?.url) ? 'self-hosted' : 'custom',
    approvalPolicy,
    type: 'mcp',
    installed: true,
    config: {
      command: cfg?.command,
      url: cfg?.url,
      authType: cfg?.auth?.type ?? 'none',
      token: cfg?.auth?.token,
    },
    capabilities,
    toolCount: capabilities.length,
    profilesUsing: profileId ? [profileId] : ['default'],
    diagnostics: {
      source: probe.source,
      errorText: probe.errorText || null,
      remediation: probe.remediation,
      discoveredTools: probe.tools.length,
      probedAt: probe.probedAt,
    },
  };
}

export function listRealExtensions(profileId: string | null | undefined): Extension[] {
  const config = readYamlFile<ConfigShape>(getProfileConfigPath(profileId));
  return Object.entries(config.mcp_servers || {}).map(([id, cfg]) => mapMcpToExtension(profileId, id, cfg));
}

export function getRealExtension(profileId: string | null | undefined, extensionId: string): Extension | null {
  return listRealExtensions(profileId).find((item) => item.id === extensionId) || null;
}

export function listRealExtensionTools(profileId: string | null | undefined): ToolInventoryItem[] {
  return listRealExtensions(profileId).flatMap((extension) =>
    extension.capabilities.map((capability) => ({
      id: capability.id,
      name: capability.name,
      sourceExtensionId: extension.id,
      sourceExtensionName: extension.name,
      category: extension.type,
      riskLevel: capability.riskLevel,
      enabled: capability.enabled,
      approvalPolicy: capability.approvalPolicy ?? extension.approvalPolicy ?? 'on-request',
      lastUsedAt: capability.lastUsedAt,
      scope: capability.scope,
    })),
  );
}

export function addRealMcpExtension(
  profileId: string | null | undefined,
  payload: { name: string; command?: string; url?: string; authType?: 'none' | 'api-key' | 'oauth'; token?: string },
) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<ConfigShape>(configPath);
  const id = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  config.mcp_servers = config.mcp_servers || {};
  config.mcp_servers[id] = {
    command: payload.command,
    url: payload.url,
    auth: payload.authType && payload.authType !== 'none' ? { type: payload.authType, token: payload.token } : undefined,
  };
  writeYamlFile(configPath, config);
  invalidateMcpProbe(profileId, id);
  return getRealExtension(profileId, id)!;
}

export function updateRealExtension(
  profileId: string | null | undefined,
  extensionId: string,
  patch: { command?: string; url?: string; authType?: 'none' | 'api-key' | 'oauth'; token?: string },
) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<ConfigShape>(configPath);
  config.mcp_servers = config.mcp_servers || {};
  const current = config.mcp_servers[extensionId] || {};
  config.mcp_servers[extensionId] = {
    ...current,
    command: patch.command ?? current.command,
    url: patch.url ?? current.url,
    auth: patch.authType ? (patch.authType === 'none' ? undefined : { type: patch.authType, token: patch.token ?? current.auth?.token }) : current.auth,
  };
  writeYamlFile(configPath, config);
  invalidateMcpProbe(profileId, extensionId);
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
  invalidateMcpProbe(profileId, extensionId);
  return getRealExtension(profileId, extensionId)!;
}

export function reprobeRealExtension(profileId: string | null | undefined, extensionId: string) {
  invalidateMcpProbe(profileId, extensionId);
  probeMcpServer(profileId, extensionId, { force: true });
  return getRealExtension(profileId, extensionId);
}
