'use client';

import type { ChatArtifact } from '@/lib/types/chat';

type ArtifactPanelProps = {
  artifacts: ChatArtifact[];
  selectedArtifactId: string | null;
  onSelect: (artifactId: string) => void;
};

export function ArtifactPanel({ artifacts, selectedArtifactId, onSelect }: ArtifactPanelProps) {
  const selected = artifacts.find((artifact) => artifact.artifactId === selectedArtifactId) ?? artifacts[0];

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
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{selected.artifactType}</p>
          <h4 className="mt-1 text-sm font-semibold">{selected.label}</h4>
          <pre className="mt-3 whitespace-pre-wrap text-xs text-muted-foreground">{selected.content ?? 'No artifact content available.'}</pre>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No artifacts emitted yet.</p>
      )}
    </div>
  );
}
