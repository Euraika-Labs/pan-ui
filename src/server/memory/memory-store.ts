import type { ContextInspector, MemoryEntry } from '@/lib/types/memory';
import { getSession, listSessions } from '@/server/chat/session-store';

const nowIso = () => new Date().toISOString();

declare global {
  // eslint-disable-next-line no-var
  var __hermesWorkspaceMemory: { user: MemoryEntry[]; agent: MemoryEntry[] } | undefined;
}

const seedMemory = {
  user: [
    { id: 'user-1', content: 'Prefers a calm, technical UI with dark mode.', updatedAt: nowIso(), scope: 'user' as const },
    { id: 'user-2', content: 'Wants a first-party Hermes web experience with skills and plugins.', updatedAt: nowIso(), scope: 'user' as const },
  ],
  agent: [
    { id: 'agent-1', content: 'Keep tool visibility first-class in transcript and drawer.', updatedAt: nowIso(), scope: 'agent' as const },
    { id: 'agent-2', content: 'Use safe defaults for risky tools in browser contexts.', updatedAt: nowIso(), scope: 'agent' as const },
  ],
};

const memory = globalThis.__hermesWorkspaceMemory ?? seedMemory;
globalThis.__hermesWorkspaceMemory = memory;

export function getMemory(scope: 'user' | 'agent') {
  return memory[scope];
}

export function updateMemory(scope: 'user' | 'agent', content: string) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  memory[scope] = lines.map((line, index) => ({
    id: `${scope}-${index + 1}`,
    content: line,
    updatedAt: nowIso(),
    scope,
  }));
  return memory[scope];
}

export function sessionSearch(query: string) {
  const normalized = query.trim().toLowerCase();
  return listSessions(normalized).map((session) => ({
    id: session.id,
    title: session.title,
    preview: session.preview,
  }));
}

export function getContextInspector(activeProfileId: string | null, activeSessionId: string | null): ContextInspector {
  const session = activeSessionId ? getSession(activeSessionId) : null;
  return {
    activeProfileId,
    activeSessionId,
    activeSessionTitle: session?.title,
    loadedSkillIds: session?.loadedSkillIds ?? [],
    model: session?.settings.model,
    provider: session?.settings.provider,
    policyPreset: session?.settings.policyPreset,
    memoryMode: session?.settings.memoryMode,
    userMemory: memory.user.map((entry) => entry.content),
    agentMemory: memory.agent.map((entry) => entry.content),
  };
}
