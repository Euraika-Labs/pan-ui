export type MemoryEntry = {
  id: string;
  content: string;
  updatedAt?: string;
  scope: 'user' | 'agent';
};

export type ContextInspector = {
  activeProfileId: string | null;
  activeSessionId: string | null;
  activeSessionTitle?: string;
  activeSessionPreview?: string;
  loadedSkillIds: string[];
  model?: string;
  provider?: string;
  policyPreset?: 'safe-chat' | 'research' | 'builder' | 'full-power';
  memoryMode?: 'standard' | 'minimal';
  userMemory: string[];
  agentMemory: string[];
};
