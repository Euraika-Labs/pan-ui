export type ExtensionHealth =
  | 'healthy'
  | 'needs_configuration'
  | 'auth_expired'
  | 'incompatible'
  | 'test_failed'
  | 'disabled_by_policy';

export type ExtensionCapability = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  scope: 'global' | 'profile' | 'session';
};

export type ExtensionConfig = {
  command?: string;
  url?: string;
  authType?: 'none' | 'api-key' | 'oauth';
  token?: string;
};

export type Extension = {
  id: string;
  name: string;
  description: string;
  health: ExtensionHealth;
  riskLevel: 'low' | 'medium' | 'high';
  type: 'mcp' | 'native' | 'builtin';
  installed: boolean;
  config: ExtensionConfig;
  capabilities: ExtensionCapability[];
  version?: string;
  updatedAt?: string;
};
