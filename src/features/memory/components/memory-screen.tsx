'use client';

import { useState } from 'react';
import { ContextInspectorPanel } from '@/features/memory/components/context-inspector';
import { MemoryEditor } from '@/features/memory/components/memory-editor';
import { SessionSearchPanel } from '@/features/memory/components/session-search-panel';

export function MemoryScreen() {
  const [tab, setTab] = useState<'user' | 'agent' | 'search' | 'context'>('user');

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Memory</h1>
        <p className="mt-2 text-sm text-muted-foreground">Inspect prompt memory, search prior sessions, and review current context state.</p>
      </div>
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
