export type Profile = {
  id: string;
  name: string;
  modelDefault?: string;
  policyPreset?: 'safe-chat' | 'research' | 'builder' | 'full-power';
  sessionCount?: number;
  skillCount?: number;
  extensionCount?: number;
  integrationsCount?: number;
  runtimeProvider?: string;
  runtimeSummary?: string;
  trustMode?: string;
  runtimeHealth?: 'healthy' | 'degraded' | 'offline';
  profileContextLabel?: string;
  active?: boolean;
};

/** Editable subset of a profile's config.yaml + SOUL.md */
export type ProfileConfig = {
  modelDefault?: string;
  modelProvider?: string;
  modelBaseUrl?: string;
  maxTurns?: number;
  reasoningEffort?: string;
  toolUseEnforcement?: string;
  policyPreset?: string;
  toolsets?: string[];
  terminalBackend?: string;
  terminalTimeout?: number;
  displayCompact?: boolean;
  displayStreaming?: boolean;
  displayShowCost?: boolean;
  displayPersonality?: string;
  memoryEnabled?: boolean;
  userProfileEnabled?: boolean;
  approvalsMode?: string;
  compressionEnabled?: boolean;
  compressionThreshold?: number;
  soul?: string;
};
