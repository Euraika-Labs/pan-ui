import { create } from 'zustand';
import type { ChatArtifact, ChatStreamEvent } from '@/lib/types/chat';

type UIState = {
  rightDrawerOpen: boolean;
  mobileNavOpen: boolean;
  selectedProfileId: string | null;
  activeSessionId: string | null;
  runEvents: ChatStreamEvent[];
  artifacts: ChatArtifact[];
  selectedArtifactId: string | null;
  openRightDrawer: () => void;
  closeRightDrawer: () => void;
  toggleMobileNav: () => void;
  setSelectedProfileId: (profileId: string | null) => void;
  setActiveSessionId: (sessionId: string | null) => void;
  resetRunState: () => void;
  addRunEvent: (event: ChatStreamEvent) => void;
  addArtifact: (artifact: ChatArtifact) => void;
  selectArtifact: (artifactId: string | null) => void;
  updateApprovalState: (toolCallId: string, approved: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  rightDrawerOpen: false,
  mobileNavOpen: false,
  selectedProfileId: null,
  activeSessionId: null,
  runEvents: [],
  artifacts: [],
  selectedArtifactId: null,
  openRightDrawer: () => set({ rightDrawerOpen: true }),
  closeRightDrawer: () => set({ rightDrawerOpen: false }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  setSelectedProfileId: (profileId) => set({ selectedProfileId: profileId }),
  setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }),
  resetRunState: () => set({ runEvents: [], artifacts: [], selectedArtifactId: null }),
  addRunEvent: (event) =>
    set((state) => ({
      runEvents: [...state.runEvents, event],
    })),
  addArtifact: (artifact) =>
    set((state) => ({
      artifacts: state.artifacts.some((item) => item.artifactId === artifact.artifactId)
        ? state.artifacts
        : [...state.artifacts, artifact],
      selectedArtifactId: artifact.artifactId,
      rightDrawerOpen: true,
    })),
  selectArtifact: (artifactId) => set({ selectedArtifactId: artifactId, rightDrawerOpen: true }),
  updateApprovalState: (toolCallId, approved) =>
    set((state) => ({
      runEvents: state.runEvents.map((event) => {
        if (event.type === 'tool.awaiting_approval' && event.toolCallId === toolCallId) {
          return {
            ...event,
            summary: approved ? `${event.summary} (Approved)` : `${event.summary} (Rejected)`,
          };
        }
        return event;
      }),
    })),
}));
