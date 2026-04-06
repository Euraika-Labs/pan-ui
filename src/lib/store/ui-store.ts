import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatArtifact, ChatStreamEvent } from '@/lib/types/chat';

export type RightDrawerTab = 'context' | 'activity' | 'tools' | 'output' | 'session';

type UIState = {
  rightDrawerOpen: boolean;
  mobileNavOpen: boolean;
  selectedProfileId: string | null;
  activeSessionId: string | null;
  recentlyLoadedSkillIds: string[];
  sessionLoadedSkillIds: Record<string, string[]>;
  runEvents: ChatStreamEvent[];
  artifacts: ChatArtifact[];
  selectedArtifactId: string | null;
  rightDrawerTab: RightDrawerTab;
  sessionDrawerTabs: Record<string, RightDrawerTab>;
  openRightDrawer: (tab?: RightDrawerTab) => void;
  closeRightDrawer: () => void;
  toggleMobileNav: () => void;
  setSelectedProfileId: (profileId: string | null) => void;
  setActiveSessionId: (sessionId: string | null) => void;
  rememberLoadedSkill: (skillId: string) => void;
  rememberLoadedSkillInSession: (sessionId: string, skillId: string) => void;
  resetRunState: () => void;
  addRunEvent: (event: ChatStreamEvent) => void;
  addArtifact: (artifact: ChatArtifact) => void;
  selectArtifact: (artifactId: string | null) => void;
  setRightDrawerTab: (tab: RightDrawerTab) => void;
  updateApprovalState: (toolCallId: string, approved: boolean) => void;
};

function resolveAutoTab(event: ChatStreamEvent): RightDrawerTab | null {
  switch (event.type) {
    case 'artifact.emitted':
    case 'source.emitted':
      return 'output';
    case 'tool.awaiting_approval':
    case 'tool.started':
    case 'tool.completed':
    case 'run.phase':
      return 'activity';
    default:
      return null;
  }
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      rightDrawerOpen: false,
      mobileNavOpen: false,
      selectedProfileId: null,
      activeSessionId: null,
      recentlyLoadedSkillIds: [],
      sessionLoadedSkillIds: {},
      runEvents: [],
      artifacts: [],
      selectedArtifactId: null,
      rightDrawerTab: 'activity',
      sessionDrawerTabs: {},
      openRightDrawer: (tab) =>
        set((state) => {
          const activeSessionId = state.activeSessionId;
          const nextTab = tab ?? state.rightDrawerTab;
          return {
            rightDrawerOpen: true,
            rightDrawerTab: nextTab,
            sessionDrawerTabs: activeSessionId ? { ...state.sessionDrawerTabs, [activeSessionId]: nextTab } : state.sessionDrawerTabs,
          };
        }),
      closeRightDrawer: () => set({ rightDrawerOpen: false }),
      toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
      setSelectedProfileId: (profileId) => set({ selectedProfileId: profileId }),
      setActiveSessionId: (sessionId) =>
        set((state) => ({
          activeSessionId: sessionId,
          rightDrawerTab: sessionId ? state.sessionDrawerTabs[sessionId] ?? state.rightDrawerTab : state.rightDrawerTab,
        })),
      rememberLoadedSkill: (skillId) =>
        set((state) => ({
          recentlyLoadedSkillIds: state.recentlyLoadedSkillIds.includes(skillId) ? state.recentlyLoadedSkillIds : [skillId, ...state.recentlyLoadedSkillIds],
        })),
      rememberLoadedSkillInSession: (sessionId, skillId) =>
        set((state) => ({
          recentlyLoadedSkillIds: state.recentlyLoadedSkillIds.includes(skillId) ? state.recentlyLoadedSkillIds : [skillId, ...state.recentlyLoadedSkillIds],
          sessionLoadedSkillIds: {
            ...state.sessionLoadedSkillIds,
            [sessionId]: state.sessionLoadedSkillIds[sessionId]?.includes(skillId)
              ? state.sessionLoadedSkillIds[sessionId]
              : [skillId, ...(state.sessionLoadedSkillIds[sessionId] ?? [])],
          },
        })),
      resetRunState: () => set((state) => ({ runEvents: [], artifacts: [], selectedArtifactId: null, rightDrawerTab: state.rightDrawerTab })),
      addRunEvent: (event) =>
        set((state) => {
          const autoTab = resolveAutoTab(event);
          const activeSessionId = state.activeSessionId;
          return {
            runEvents: [...state.runEvents, event],
            rightDrawerOpen: state.rightDrawerOpen,
            rightDrawerTab: autoTab ?? state.rightDrawerTab,
            sessionDrawerTabs: autoTab && activeSessionId ? { ...state.sessionDrawerTabs, [activeSessionId]: autoTab } : state.sessionDrawerTabs,
          };
        }),
      addArtifact: (artifact) =>
        set((state) => ({
          artifacts: state.artifacts.some((item) => item.artifactId === artifact.artifactId) ? state.artifacts : [...state.artifacts, artifact],
          selectedArtifactId: artifact.artifactId,
          rightDrawerOpen: state.rightDrawerOpen,
          rightDrawerTab: 'output',
          sessionDrawerTabs: state.activeSessionId ? { ...state.sessionDrawerTabs, [state.activeSessionId]: 'output' } : state.sessionDrawerTabs,
        })),
      selectArtifact: (artifactId) =>
        set((state) => ({
          selectedArtifactId: artifactId,
          rightDrawerOpen: true,
          rightDrawerTab: 'output',
          sessionDrawerTabs: state.activeSessionId ? { ...state.sessionDrawerTabs, [state.activeSessionId]: 'output' } : state.sessionDrawerTabs,
        })),
      setRightDrawerTab: (tab) =>
        set((state) => ({
          rightDrawerTab: tab,
          rightDrawerOpen: true,
          sessionDrawerTabs: state.activeSessionId ? { ...state.sessionDrawerTabs, [state.activeSessionId]: tab } : state.sessionDrawerTabs,
        })),
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
    }),
    {
      name: 'pan-ui',
      partialize: (state) => ({
        selectedProfileId: state.selectedProfileId,
        activeSessionId: state.activeSessionId,
        recentlyLoadedSkillIds: state.recentlyLoadedSkillIds,
        sessionLoadedSkillIds: state.sessionLoadedSkillIds,
        rightDrawerTab: state.rightDrawerTab,
        sessionDrawerTabs: state.sessionDrawerTabs,
      }),
    },
  ),
);
