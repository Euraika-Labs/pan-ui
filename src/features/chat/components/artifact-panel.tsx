'use client';

import type { ChatArtifact } from '@/lib/types/chat';

type ArtifactPanelProps = {
  artifacts: ChatArtifact[];
  selectedArtifactId: string | null;
  onSelect: (artifactId: string) => void;
};

export function ArtifactPanel({ artifacts, selectedArtifactId, onSelect }: ArtifactPanelProps) {
  const selected = artifacts.find((artifact) => artifact.artifactId === selectedArtifactId) ?? artifacts[0];

  if (!artifacts.length) {
    return <p className="text-sm text-muted-foreground">Artifacts will appear here when the agent emits files, plans, or generated content.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {artifacts.map((artifact) => (
          <button
            key={artifact.artifactId}
            type="button"
            onClick={() => onSelect(artifact.artifactId)}
            className={`rounded-full px-3 py-1 text-xs ${selected?.artifactId === artifact.artifactId ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}
          >
            {artifact.label}
          </button>
        ))}
      </div>
      {selected ? (
        <div className="rounded-lg border border-border/70 bg-background/80 p-3 shadow-[var(--shadow-card)]">
          <p className="text-xs uppercase tracking-label text-muted-foreground">{selected.artifactType}</p>
          <h4 className="mt-1 text-sm font-semibold text-foreground">{selected.label}</h4>
          <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">{selected.content ?? 'No artifact content available.'}</pre>
        </div>
      ) : null}
    </div>
  );
}
