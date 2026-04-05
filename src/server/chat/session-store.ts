import crypto from 'node:crypto';
import type { ChatSession, ChatSessionSettings, ChatSessionSummary } from '@/lib/types/chat';
import type { Message } from '@/lib/types/message';

const nowIso = () => new Date().toISOString();

function createMessage(role: Message['role'], content: string, attachments?: Message['attachments']): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: nowIso(),
    attachments,
  };
}

const defaultSessionSettings: ChatSessionSettings = {
  model: 'Hermes 3 405B',
  provider: 'real-hermes',
  policyPreset: 'safe-chat',
  memoryMode: 'standard',
};

function createSeedSession(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: 'Welcome to Hermes Workspace',
    updatedAt: nowIso(),
    preview: 'Ask Hermes to help with research, coding, and automation.',
    messages: [
      createMessage(
        'assistant',
        'Hey — I am ready. Start a new chat or ask me to help with research, code, skills, or extensions.',
      ),
    ],
    archived: false,
    loadedSkillIds: [],
    settings: { ...defaultSessionSettings },
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __hermesWorkspaceSessions: Map<string, ChatSession> | undefined;
}

const seedSession = createSeedSession();
const sessions =
  globalThis.__hermesWorkspaceSessions ?? new Map<string, ChatSession>([[seedSession.id, seedSession]]);

globalThis.__hermesWorkspaceSessions = sessions;

function summarize(session: ChatSession): ChatSessionSummary {
  return {
    id: session.id,
    title: session.archived ? `${session.title} (archived)` : session.title,
    updatedAt: session.updatedAt,
    preview: session.preview,
    workspaceLabel: session.archived ? 'Archived' : session.parentSessionId ? 'Forks' : 'Active workspace',
    pinned: !session.archived && !session.parentSessionId,
    archived: session.archived,
    parentSessionId: session.parentSessionId,
  };
}

export function listSessions(search?: string): ChatSessionSummary[] {
  const normalizedSearch = search?.trim().toLowerCase();

  return Array.from(sessions.values())
    .filter((session) => {
      if (!normalizedSearch) return true;
      const haystack = [session.title, session.preview, ...session.messages.map((message) => message.content)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(summarize);
}

export function getSession(sessionId: string): ChatSession | null {
  return sessions.get(sessionId) ?? null;
}

export function createSession(): ChatSession {
  const session: ChatSession = {
    id: crypto.randomUUID(),
    title: 'New chat',
    updatedAt: nowIso(),
    preview: 'Start chatting with Hermes.',
    messages: [],
    archived: false,
    loadedSkillIds: [],
    settings: { ...defaultSessionSettings },
  };
  sessions.set(session.id, session);
  return session;
}

export function updateSession(sessionId: string, updater: (session: ChatSession) => void): ChatSession {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  updater(session);
  session.updatedAt = nowIso();

  const latestMessage = session.messages[session.messages.length - 1];
  if (latestMessage) {
    session.preview = latestMessage.content.slice(0, 120);
    if (session.title === 'New chat' && latestMessage.role === 'user') {
      session.title = latestMessage.content.slice(0, 40) || 'New chat';
    }
  }

  sessions.set(session.id, session);
  return session;
}

export function renameSession(sessionId: string, title: string) {
  return updateSession(sessionId, (session) => {
    session.title = title.trim() || session.title;
  });
}

export function archiveSession(sessionId: string) {
  return updateSession(sessionId, (session) => {
    session.archived = true;
  });
}

export function deleteSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  sessions.delete(sessionId);
}

export function forkSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const clonedMessages = session.messages.map((message) => ({ ...message, id: crypto.randomUUID() }));
  const forkedSession: ChatSession = {
    ...session,
    id: crypto.randomUUID(),
    title: `${session.title} (fork)`,
    updatedAt: nowIso(),
    parentSessionId: session.id,
    archived: false,
    messages: clonedMessages,
    loadedSkillIds: [...(session.loadedSkillIds ?? [])],
    settings: { ...session.settings },
  };

  sessions.set(forkedSession.id, forkedSession);
  return forkedSession;
}

export function updateSessionSettings(sessionId: string, settings: Partial<ChatSessionSettings>) {
  return updateSession(sessionId, (session) => {
    session.settings = {
      ...session.settings,
      ...settings,
    };
  });
}

export function addUserMessage(sessionId: string, content: string, attachments?: Message['attachments']) {
  return updateSession(sessionId, (session) => {
    session.messages.push(createMessage('user', content, attachments));
  });
}

export function addAssistantMessage(sessionId: string, content: string) {
  return updateSession(sessionId, (session) => {
    session.messages.push(createMessage('assistant', content));
  });
}
