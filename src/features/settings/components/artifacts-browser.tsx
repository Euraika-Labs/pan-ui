'use client';

import { useState } from 'react';
import { useUIStore } from '@/lib/store/ui-store';
import { useRuntimeArtifacts } from '@/features/chat/api/use-runtime-history';

export function ArtifactsBrowser() {
  const { activeSessionId } = useUIStore();
  const [query, setQuery] = useState('');
  const artifactsQuery = useRuntimeArtifacts(activeSessionId, query);
  const artifacts = artifactsQuery.data ?? [];

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Artifacts</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse persisted artifacts for the active session.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Active session</p>
          <p className="mt-2 font-semibold">{activeSessionId ?? 'No active session'}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs uppercase tracking-label text-muted-foreground">Artifacts returned</p>
          <p className="mt-2 font-semibold">{artifacts.length}</p>
        </div>
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter artifacts" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      <div className="space-y-3">
        {artifacts.map((artifact) => (
          <div key={artifact.artifactId} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{artifact.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{artifact.artifactType}</p>
              </div>
              <a
                href={`/api/runtime/artifacts/download?sessionId=${encodeURIComponent(activeSessionId || '')}&artifactId=${encodeURIComponent(artifact.artifactId)}`}
                className="rounded-lg border border-border px-3 py-2 text-xs"
              >
                Download
              </a>
            </div>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-muted-foreground">{artifact.content}</pre>
          </div>
        ))}
        {!artifacts.length ? <p className="text-sm text-muted-foreground">No artifacts matched the current filter.</p> : null}
      </div>
    </div>
  );
}
