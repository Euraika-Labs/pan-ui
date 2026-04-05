export type ExtensionHealth = 'healthy' | 'degraded' | 'blocked' | 'failed' | 'needs_configuration' | 'auth_expired' | 'incompatible' | 'test_failed' | 'disabled_by_policy';
export type ExtensionRiskLevel = 'read' | 'write' | 'execute' | 'admin' | 'low' | 'medium' | 'high';
export type ExtensionAuthState = 'connected' | 'needs-auth' | 'expired' | 'none' | 'unknown';
export type ExtensionGovernanceState = 'enabled' | 'blocked' | 'approval-gated' | 'policy-limited';
export type ExtensionProvenance = 'built-in' | 'verified' | 'custom' | 'self-hosted' | 'local-process';
export type ExtensionApprovalPolicy = 'auto' | 'on-request' | 'always';

export type ExtensionCapability = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  riskLevel: ExtensionRiskLevel;
  scope: 'global' | 'profile' | 'session';
  approvalPolicy?: ExtensionApprovalPolicy;
  lastUsedAt?: string;
};

export type ExtensionConfig = {
  command?: string;
  url?: string;
  authType?: 'none' | 'api-key' | 'oauth';
  token?: string;
};

export type ToolInventoryItem = {
  id: string;
  name: string;
  sourceExtensionId: string;
  sourceExtensionName: string;
  category: 'mcp' | 'builtin' | 'native';
  riskLevel: ExtensionRiskLevel;
  enabled: boolean;
  approvalPolicy: ExtensionApprovalPolicy;
  lastUsedAt?: string;
  scope: 'global' | 'profile' | 'session';
};

export type Extension = {
  id: string;
  name: string;
  description: string;
  health: ExtensionHealth;
  riskLevel: ExtensionRiskLevel;
  authState?: ExtensionAuthState;
  governance?: ExtensionGovernanceState;
  provenance?: ExtensionProvenance;
  approvalPolicy?: ExtensionApprovalPolicy;
  type: 'mcp' | 'native' | 'builtin';
  installed: boolean;
  config: ExtensionConfig;
  capabilities: ExtensionCapability[];
  toolCount?: number;
  profilesUsing?: string[];
  diagnostics?: {
    source: 'live' | 'cache' | 'persisted' | 'failed';
    errorText?: string | null;
    remediation?: string[];
    discoveredTools?: number;
    probedAt?: string;
  };
  version?: string;
  updatedAt?: string;
};
