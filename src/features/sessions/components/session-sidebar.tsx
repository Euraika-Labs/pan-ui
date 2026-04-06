'use client';

import { useState } from 'react';
import { Clock3, GitBranch, Pin, Plus } from 'lucide-react';
import { SessionSearch } from '@/features/sessions/components/session-search';
import type { ChatSessionSummary } from '@/lib/types/chat';
import { cn } from '@/lib/utils';

type SessionSidebarProps = {
  sessions: ChatSessionSummary[];
  selectedSessionId: string | null;
  search: string;
  isLoading?: boolean;
  onSearchChange: (value: string) => void;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
};

function previewText(preview: string | null | undefined) {
  if (!preview) return 'No messages yet.';
  return preview.length > 88 ? `${preview.slice(0, 85)}…` : preview;
}

function formatUpdatedAt(updatedAt: string) {
  return new Date(updatedAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function SessionSidebar({ sessions, selectedSessionId, search, isLoading, onSearchChange, onNewChat, onSelectSession }: SessionSidebarProps) {
  const PAGE_SIZE = 25;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleSessions = search.trim() ? sessions.filter((session) => !session.parentSessionId) : sessions;
  const pinnedSessions = visibleSessions.filter((session) => session.pinned && !session.archived);
  const recentSessions = visibleSessions.filter((session) => !session.pinned && !session.archived);
  const archivedSessions = visibleSessions.filter((session) => session.archived);

  const ARCHIVED_LIMIT = 5;
  const [showAllArchived, setShowAllArchived] = useState(false);

  const groups = [
    { label: 'Pinned', items: pinnedSessions },
    { label: 'Recent', items: recentSessions.slice(0, visibleCount) },
    { label: 'Archived', items: showAllArchived ? archivedSessions : archivedSessions.slice(0, ARCHIVED_LIMIT) },
  ].filter((group) => group.items.length > 0);

  const hasMore = recentSessions.length > visibleCount;
  const hasMoreArchived = !showAllArchived && archivedSessions.length > ARCHIVED_LIMIT;

  return (
    <aside className="flex h-full max-h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card/60 shadow-[var(--shadow-soft)]">
      <div className="border-b border-border/70 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-label text-muted-foreground">Workspace</p>
        <div className="rounded-lg bg-[linear-gradient(135deg,hsl(var(--primary))/0.16,hsl(var(--accent))/0.12)] p-1">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-lg brand-gradient px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-border/70 bg-background/60 px-2 py-2.5">
            <p className="text-2xs uppercase tracking-label text-muted-foreground">All</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{visibleSessions.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/60 px-2 py-2.5">
            <p className="text-2xs uppercase tracking-label text-muted-foreground">Pinned</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{pinnedSessions.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/60 px-2 py-2.5">
            <p className="text-2xs uppercase tracking-label text-muted-foreground">Archived</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{archivedSessions.length}</p>
          </div>
        </div>
      </div>
      <SessionSearch value={search} onChange={onSearchChange} />
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {isLoading ? <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">Loading sessions…</div> : null}
        {!isLoading && visibleSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">No sessions match your search.</div>
        ) : null}
        {groups.map((group) => (
          <div key={group.label} className="space-y-2">
            <div className="flex items-center justify-between px-2 text-2xs font-semibold uppercase tracking-label text-muted-foreground">
              <span>{group.label}</span>
              <span>{group.items.length}</span>
            </div>
            {group.items.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelectSession(session.id)}
                aria-label={/\(fork\)/i.test(session.title) && selectedSessionId !== session.id ? session.title : `Open session ${session.id}`}
                className={cn(
                  'w-full rounded-lg border px-4 py-3 text-left transition',
                  selectedSessionId === session.id
                    ? 'border-primary/20 bg-primary/8'
                    : 'border-border/70 bg-background/80 hover:border-border hover:bg-card',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p aria-hidden="true" className="truncate text-sm font-semibold text-foreground">{session.title}</p>
                    <p aria-hidden="true" className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{previewText(session.preview)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {session.pinned ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-3xs uppercase tracking-label text-muted-foreground">
                        <Pin className="h-3 w-3" />
                        Pinned
                      </span>
                    ) : null}
                    {session.parentSessionId ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2 py-0.5 text-3xs uppercase tracking-label text-muted-foreground">
                        <GitBranch className="h-3 w-3" />
                        Fork
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-2xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatUpdatedAt(session.updatedAt)}
                  </span>
                  {session.workspaceLabel ? <span>{session.workspaceLabel}</span> : null}
                </div>
              </button>
            ))}
          </div>
        ))}
        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="mx-2 mt-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-card"
          >
            Show more ({recentSessions.length - visibleCount} remaining)
          </button>
        ) : null}
        {hasMoreArchived ? (
          <button
            type="button"
            onClick={() => setShowAllArchived(true)}
            className="mx-2 mt-2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-card"
          >
            Show all archived ({archivedSessions.length - ARCHIVED_LIMIT} more)
          </button>
        ) : null}
      </div>
    </aside>
  );
}
