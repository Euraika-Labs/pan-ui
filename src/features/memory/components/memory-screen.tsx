'use client';

import { useState } from 'react';
import { ContextInspectorPanel } from '@/features/memory/components/context-inspector';
import { MemoryEditor } from '@/features/memory/components/memory-editor';
import { SessionSearchPanel } from '@/features/memory/components/session-search-panel';
import { useContextInspector } from '@/features/memory/api/use-memory';
import { useUIStore } from '@/lib/store/ui-store';

export function MemoryScreen() {
  const [tab, setTab] = useState<'user' | 'agent' | 'search' | 'context'>('user');
  const { selectedProfileId, activeSessionId } = useUIStore();
  const contextQuery = useContextInspector(selectedProfileId, activeSessionId);
  const context = contextQuery.data;

  return (
    <div className="h-full overflow-y-auto space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Memory</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect prompt memory, search prior sessions, and review current context state.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected profile</p>
          <p className="mt-2 font-semibold">{context?.activeProfileId ?? selectedProfileId ?? 'No profile'}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Active session</p>
          <p className="mt-2 font-semibold">{context?.activeSessionTitle ?? activeSessionId ?? 'No session'}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Loaded skills</p>
          <p className="mt-2 font-semibold">{context?.loadedSkillIds.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Memory mode</p>
          <p className="mt-2 font-semibold">{context?.memoryMode ?? 'standard'}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">Memory semantics</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-medium text-foreground">User memory</p>
              <p className="mt-1">Durable facts about the human on the other side: preferences, identity, and stable habits worth carrying into future sessions.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-medium text-foreground">Agent memory</p>
              <p className="mt-1">Operational notes about the environment, conventions, and workflow details that help the agent behave consistently later.</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">Important behavior</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-medium text-foreground">Editing memory is durable</p>
              <p className="mt-1">Changes are saved immediately and affect future sessions. The current session context remains what was already loaded unless you start a fresh thread.</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="font-medium text-foreground">Session search is not memory</p>
              <p className="mt-1">Search lets you recover prior conversations without promoting them into persistent memory.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {[
          ['user', 'User memory'],
          ['agent', 'Agent memory'],
          ['search', 'Session search'],
          ['context', 'Context inspector'],
        ].map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id as typeof tab)} className={`rounded-lg px-4 py-2 text-sm ${tab === id ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'user' ? <MemoryEditor scope="user" /> : null}
      {tab === 'agent' ? <MemoryEditor scope="agent" /> : null}
      {tab === 'search' ? <SessionSearchPanel /> : null}
      {tab === 'context' ? <ContextInspectorPanel /> : null}
    </div>
  );
}
