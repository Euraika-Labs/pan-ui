import type { Message } from '@/lib/types/message';

export type ChatSessionSummary = {
  id: string;
  title: string;
  updatedAt: string;
  preview?: string;
};

export type ChatSessionSettings = {
  model: string;
  provider: string;
  policyPreset: 'safe-chat' | 'research' | 'builder' | 'full-power';
  memoryMode: 'standard' | 'minimal';
};

export type ChatSession = ChatSessionSummary & {
  messages: Message[];
  archived?: boolean;
  parentSessionId?: string;
  loadedSkillIds?: string[];
  settings: ChatSessionSettings;
};

export type ChatArtifact = {
  artifactId: string;
  artifactType: string;
  label: string;
  content?: string;
};

export type ChatStreamEvent =
  | { type: 'assistant.delta'; delta: string }
  | { type: 'tool.started'; toolCallId: string; toolName: string }
  | { type: 'tool.awaiting_approval'; toolCallId: string; toolName: string; summary: string }
  | { type: 'tool.completed'; toolCallId: string; toolName: string; output?: string }
  | ({ type: 'artifact.emitted' } & ChatArtifact)
  | { type: 'error'; message: string };
