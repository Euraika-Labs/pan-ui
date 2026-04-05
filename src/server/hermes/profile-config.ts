import fs from 'node:fs';
import path from 'node:path';
import { getProfileRoot } from '@/server/hermes/paths';
import { readYamlFile, writeYamlFile } from '@/server/hermes/yaml-config';

/** Editable subset of a profile's config.yaml + SOUL.md */
export type ProfileConfig = {
  // Model
  modelDefault?: string;
  modelProvider?: string;
  modelBaseUrl?: string;

  // Agent behavior
  maxTurns?: number;
  reasoningEffort?: string;
  toolUseEnforcement?: string;

  // Policy
  policyPreset?: string;

  // Toolsets
  toolsets?: string[];

  // Terminal
  terminalBackend?: string;
  terminalTimeout?: number;

  // Display
  displayCompact?: boolean;
  displayStreaming?: boolean;
  displayShowCost?: boolean;
  displayPersonality?: string;

  // Memory
  memoryEnabled?: boolean;
  userProfileEnabled?: boolean;

  // Security
  approvalsMode?: string;

  // Compression
  compressionEnabled?: boolean;
  compressionThreshold?: number;

  // Soul / system prompt
  soul?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dig(obj: any, ...keys: string[]): any {
  let cur = obj;
  for (const k of keys) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[k];
  }
  return cur;
}

export function readProfileConfig(profileId: string): ProfileConfig {
  const root = getProfileRoot(profileId);
  const configPath = path.join(root, 'config.yaml');
  const soulPath = path.join(root, 'SOUL.md');

  const raw = readYamlFile<Record<string, unknown>>(configPath);

  let soul: string | undefined;
  try {
    soul = fs.readFileSync(soulPath, 'utf-8');
  } catch { /* no SOUL.md */ }

  return {
    modelDefault: dig(raw, 'model', 'default') as string | undefined,
    modelProvider: dig(raw, 'model', 'provider') as string | undefined,
    modelBaseUrl: dig(raw, 'model', 'base_url') as string | undefined,
    maxTurns: dig(raw, 'agent', 'max_turns') as number | undefined,
    reasoningEffort: dig(raw, 'agent', 'reasoning_effort') as string | undefined,
    toolUseEnforcement: dig(raw, 'agent', 'tool_use_enforcement') as string | undefined,
    policyPreset: (raw.ui_policy_preset as string) || undefined,
    toolsets: dig(raw, 'toolsets') as string[] | undefined,
    terminalBackend: dig(raw, 'terminal', 'backend') as string | undefined,
    terminalTimeout: dig(raw, 'terminal', 'timeout') as number | undefined,
    displayCompact: dig(raw, 'display', 'compact') as boolean | undefined,
    displayStreaming: dig(raw, 'display', 'streaming') as boolean | undefined,
    displayShowCost: dig(raw, 'display', 'show_cost') as boolean | undefined,
    displayPersonality: dig(raw, 'display', 'personality') as string | undefined,
    memoryEnabled: dig(raw, 'memory', 'memory_enabled') as boolean | undefined,
    userProfileEnabled: dig(raw, 'memory', 'user_profile_enabled') as boolean | undefined,
    approvalsMode: dig(raw, 'approvals', 'mode') as string | undefined,
    compressionEnabled: dig(raw, 'compression', 'enabled') as boolean | undefined,
    compressionThreshold: dig(raw, 'compression', 'threshold') as number | undefined,
    soul,
  };
}

export function writeProfileConfig(profileId: string, patch: Partial<ProfileConfig>) {
  const root = getProfileRoot(profileId);
  const configPath = path.join(root, 'config.yaml');
  const soulPath = path.join(root, 'SOUL.md');

  const raw = readYamlFile<Record<string, unknown>>(configPath);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function ensureObj(obj: Record<string, unknown>, key: string): Record<string, any> {
    if (!obj[key] || typeof obj[key] !== 'object') obj[key] = {};
    return obj[key] as Record<string, unknown>;
  }

  // Model
  if (patch.modelDefault !== undefined) ensureObj(raw, 'model').default = patch.modelDefault;
  if (patch.modelProvider !== undefined) ensureObj(raw, 'model').provider = patch.modelProvider;
  if (patch.modelBaseUrl !== undefined) ensureObj(raw, 'model').base_url = patch.modelBaseUrl;

  // Agent
  if (patch.maxTurns !== undefined) ensureObj(raw, 'agent').max_turns = patch.maxTurns;
  if (patch.reasoningEffort !== undefined) ensureObj(raw, 'agent').reasoning_effort = patch.reasoningEffort;
  if (patch.toolUseEnforcement !== undefined) ensureObj(raw, 'agent').tool_use_enforcement = patch.toolUseEnforcement;

  // Policy
  if (patch.policyPreset !== undefined) raw.ui_policy_preset = patch.policyPreset;

  // Toolsets
  if (patch.toolsets !== undefined) raw.toolsets = patch.toolsets;

  // Terminal
  if (patch.terminalBackend !== undefined) ensureObj(raw, 'terminal').backend = patch.terminalBackend;
  if (patch.terminalTimeout !== undefined) ensureObj(raw, 'terminal').timeout = patch.terminalTimeout;

  // Display
  if (patch.displayCompact !== undefined) ensureObj(raw, 'display').compact = patch.displayCompact;
  if (patch.displayStreaming !== undefined) ensureObj(raw, 'display').streaming = patch.displayStreaming;
  if (patch.displayShowCost !== undefined) ensureObj(raw, 'display').show_cost = patch.displayShowCost;
  if (patch.displayPersonality !== undefined) ensureObj(raw, 'display').personality = patch.displayPersonality;

  // Memory
  if (patch.memoryEnabled !== undefined) ensureObj(raw, 'memory').memory_enabled = patch.memoryEnabled;
  if (patch.userProfileEnabled !== undefined) ensureObj(raw, 'memory').user_profile_enabled = patch.userProfileEnabled;

  // Security
  if (patch.approvalsMode !== undefined) ensureObj(raw, 'approvals').mode = patch.approvalsMode;

  // Compression
  if (patch.compressionEnabled !== undefined) ensureObj(raw, 'compression').enabled = patch.compressionEnabled;
  if (patch.compressionThreshold !== undefined) ensureObj(raw, 'compression').threshold = patch.compressionThreshold;

  writeYamlFile(configPath, raw);

  // Soul
  if (patch.soul !== undefined) {
    fs.writeFileSync(soulPath, patch.soul, 'utf-8');
  }
}
