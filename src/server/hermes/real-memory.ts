import fs from 'node:fs';
import path from 'node:path';
import type { ContextInspector, MemoryEntry } from '@/lib/types/memory';
import { getProfileMemoriesDir } from '@/server/hermes/paths';
import { getRealSession, listRealSessions } from '@/server/hermes/real-sessions';

function memoryFile(profileId: string | null | undefined, scope: 'user' | 'agent') {
  return path.join(getProfileMemoriesDir(profileId), scope === 'user' ? 'USER.md' : 'MEMORY.md');
}

export function readRealMemory(profileId: string | null | undefined, scope: 'user' | 'agent'): MemoryEntry[] {
  const filePath = memoryFile(profileId, scope);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').map((line) => line.trim()).filter(Boolean).map((line, index) => ({ id: `${scope}-${index+1}`, content: line, scope }));
}

export function writeRealMemory(profileId: string | null | undefined, scope: 'user' | 'agent', content: string): MemoryEntry[] {
  const dir = getProfileMemoriesDir(profileId);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = memoryFile(profileId, scope);
  fs.writeFileSync(filePath, content.trim() + (content.trim() ? '\n' : ''), 'utf-8');
  return readRealMemory(profileId, scope);
}

export function searchRealSessions(profileId: string | null | undefined, query: string) {
  return listRealSessions(profileId, query).map((session) => ({ id: session.id, title: session.title, preview: session.preview }));
}

export function buildRealContext(profileId: string | null | undefined, sessionId: string | null | undefined): ContextInspector {
  const session = sessionId ? getRealSession(profileId, sessionId) : null;
  return {
    activeProfileId: profileId ?? 'default',
    activeSessionId: sessionId ?? null,
    activeSessionTitle: session?.title,
    loadedSkillIds: session?.loadedSkillIds ?? [],
    model: session?.settings.model,
    provider: session?.settings.provider,
    policyPreset: session?.settings.policyPreset,
    memoryMode: session?.settings.memoryMode,
    userMemory: readRealMemory(profileId, 'user').map((x) => x.content),
    agentMemory: readRealMemory(profileId, 'agent').map((x) => x.content),
  };
}
