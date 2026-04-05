import fs from 'node:fs';
import path from 'node:path';
import type { ContextInspector, MemoryEntry } from '@/lib/types/memory';
import { getHermesHome, getProfileMemoriesDir } from '@/server/hermes/paths';
import { getRealSession, listRealSessions } from '@/server/hermes/real-sessions';

function memoryFile(profileId: string | null | undefined, scope: 'user' | 'agent') {
  return path.join(getProfileMemoriesDir(profileId), scope === 'user' ? 'USER.md' : 'MEMORY.md');
}

function globalMemoryFile(scope: 'user' | 'agent') {
  return path.join(getHermesHome(), 'memories', scope === 'user' ? 'USER.md' : 'MEMORY.md');
}

/**
 * Parse a memory file into entries.
 * The § character is used as a separator between entries (not a real entry).
 * Each entry may span multiple lines between § separators.
 */
function parseMemoryFile(filePath: string, scope: 'user' | 'agent', idPrefix: string): MemoryEntry[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  if (!content) return [];

  // Split by § separator (with surrounding whitespace/newlines)
  const blocks = content.split(/\n?§\n?/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, index) => ({
    id: `${idPrefix}-${index + 1}`,
    content: block,
    scope,
  }));
}

export function readRealMemory(profileId: string | null | undefined, scope: 'user' | 'agent'): MemoryEntry[] {
  return parseMemoryFile(memoryFile(profileId, scope), scope, scope);
}

export function readGlobalMemory(scope: 'user' | 'agent'): MemoryEntry[] {
  return parseMemoryFile(globalMemoryFile(scope), scope, `global-${scope}`);
}

/** Raw file content (for the text editor) */
export function readRealMemoryRaw(profileId: string | null | undefined, scope: 'user' | 'agent'): string {
  const filePath = memoryFile(profileId, scope);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
}

export function readGlobalMemoryRaw(scope: 'user' | 'agent'): string {
  const filePath = globalMemoryFile(scope);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
}

export function writeRealMemory(profileId: string | null | undefined, scope: 'user' | 'agent', content: string): MemoryEntry[] {
  const dir = getProfileMemoriesDir(profileId);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = memoryFile(profileId, scope);
  fs.writeFileSync(filePath, content.trim() + (content.trim() ? '\n' : ''), 'utf-8');
  return readRealMemory(profileId, scope);
}

export function writeGlobalMemory(scope: 'user' | 'agent', content: string): MemoryEntry[] {
  const dir = path.join(getHermesHome(), 'memories');
  fs.mkdirSync(dir, { recursive: true });
  const filePath = globalMemoryFile(scope);
  fs.writeFileSync(filePath, content.trim() + (content.trim() ? '\n' : ''), 'utf-8');
  return readGlobalMemory(scope);
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
    activeSessionPreview: session?.preview,
    loadedSkillIds: session?.loadedSkillIds ?? [],
    model: session?.settings.model,
    provider: session?.settings.provider,
    policyPreset: session?.settings.policyPreset,
    memoryMode: session?.settings.memoryMode,
    userMemory: readRealMemory(profileId, 'user').map((x) => x.content),
    agentMemory: readRealMemory(profileId, 'agent').map((x) => x.content),
  };
}
