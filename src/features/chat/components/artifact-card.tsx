'use client';

import type { ChatArtifact } from '@/lib/types/chat';

type ArtifactCardProps = {
  artifact: ChatArtifact;
  onOpen: (artifactId: string) => void;
};

export function ArtifactCard({ artifact, onOpen }: ArtifactCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(artifact.artifactId)}
      className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:bg-muted/40"
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Artifact · {artifact.artifactType}</p>
      <h4 className="mt-1 text-sm font-semibold">{artifact.label}</h4>
      {artifact.content ? <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{artifact.content}</p> : null}
    </button>
  );
}
