'use client';

import type { ChatSessionSummary } from '@/lib/types/chat';
import { cn } from '@/lib/utils';
import { SessionSearch } from '@/features/sessions/components/session-search';

type SessionSidebarProps = {
  sessions: ChatSessionSummary[];
  selectedSessionId: string | null;
  search: string;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
};

export function SessionSidebar({
  sessions,
  selectedSessionId,
  search,
  isLoading,
  onSearchChange,
  onNewChat,
  onSelectSession,
}: SessionSidebarProps) {
  return (
    <aside className="flex min-h-[calc(100vh-6rem)] flex-col rounded-2xl border border-border bg-card/50">
      <div className="border-b border-border p-4">
        <button
          type="button"
          onClick={onNewChat}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          New chat
        </button>
      </div>
      <SessionSearch value={search} onChange={onSearchChange} />
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {isLoading ? <p className="px-2 text-sm text-muted-foreground">Loading sessions…</p> : null}
        {!isLoading && sessions.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">No sessions match your search.</p>
        ) : null}
        {sessions.map((session) => (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelectSession(session.id)}
            className={cn(
              'w-full rounded-xl border px-3 py-3 text-left transition',
              selectedSessionId === session.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background hover:bg-muted',
            )}
          >
            <p className="truncate text-sm font-medium">{session.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{session.preview ?? 'No messages yet.'}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
