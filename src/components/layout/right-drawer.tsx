'use client';

import { ArtifactPanel } from '@/features/chat/components/artifact-panel';
import { ToolTimeline } from '@/features/chat/components/tool-timeline';
import { useRuntimeArtifacts, useRuntimeTimeline } from '@/features/chat/api/use-runtime-history';
import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils';

export function RightDrawer() {
  const {
    rightDrawerOpen,
    closeRightDrawer,
    runEvents,
    artifacts,
    selectedArtifactId,
    selectArtifact,
    activeSessionId,
  } = useUIStore();
  const timelineQuery = useRuntimeTimeline(activeSessionId);
  const artifactQuery = useRuntimeArtifacts(activeSessionId);
  const mergedEvents = timelineQuery.data?.length ? timelineQuery.data : runEvents;
  const mergedArtifacts = artifactQuery.data?.length ? artifactQuery.data : artifacts;

  return (
    <>
      <aside
        className={cn(
          'hidden w-80 shrink-0 border-l border-border bg-card/30 xl:block',
          !rightDrawerOpen && 'xl:hidden',
        )}
      >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="font-medium">Run details</h2>
          <p className="text-sm text-muted-foreground">Tool events, approvals, and artifacts land here.</p>
        </div>
        <button
          type="button"
          onClick={closeRightDrawer}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted"
        >
          Hide
        </button>
      </div>
        <div className="space-y-4 p-4 text-sm text-muted-foreground">
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="font-medium text-foreground">Timeline</p>
            <div className="mt-3">
              <ToolTimeline events={mergedEvents} />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="font-medium text-foreground">Artifacts</p>
            <div className="mt-3">
              <ArtifactPanel artifacts={mergedArtifacts} selectedArtifactId={selectedArtifactId} onSelect={selectArtifact} />
            </div>
          </div>
        </div>
      </aside>
      {rightDrawerOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-30 max-h-[65vh] rounded-t-3xl border border-border bg-background p-4 shadow-2xl xl:hidden">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Run details</h2>
            <button type="button" onClick={closeRightDrawer} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">Hide</button>
          </div>
          <div className="max-h-[52vh] space-y-4 overflow-y-auto">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="font-medium text-foreground">Timeline</p>
              <div className="mt-3">
                <ToolTimeline events={mergedEvents} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="font-medium text-foreground">Artifacts</p>
              <div className="mt-3">
                <ArtifactPanel artifacts={mergedArtifacts} selectedArtifactId={selectedArtifactId} onSelect={selectArtifact} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
