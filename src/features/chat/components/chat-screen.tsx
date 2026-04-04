'use client';

import { useEffect, useMemo, useState } from 'react';
import { trackClientEvent } from '@/lib/telemetry/client';
import type { ChatSessionSettings } from '@/lib/types/chat';
import type { Message } from '@/lib/types/message';
import { useUIStore } from '@/lib/store/ui-store';
import { ChatComposer } from '@/features/chat/components/chat-composer';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatTranscript } from '@/features/chat/components/chat-transcript';
import { useChatStream } from '@/features/chat/api/use-chat-stream';
import {
  useArchiveSession,
  useCreateSession,
  useDeleteSession,
  useForkSession,
  useRenameSession,
  useSession,
  useSessions,
  useUpdateSessionSettings,
} from '@/features/sessions/api/use-sessions';
import { ConfirmSessionActionDialog } from '@/features/sessions/components/confirm-session-action-dialog';
import { RenameSessionDialog } from '@/features/sessions/components/rename-session-dialog';
import { SessionSidebar } from '@/features/sessions/components/session-sidebar';
import { ChatSettingsSheet } from '@/features/settings/components/chat-settings-sheet';

export function ChatScreen() {
  const [search, setSearch] = useState('');
  const sessionsQuery = useSessions(search);
  const createSession = useCreateSession();
  const renameSession = useRenameSession();
  const archiveSession = useArchiveSession();
  const deleteSession = useDeleteSession();
  const forkSession = useForkSession();
  const updateSessionSettings = useUpdateSessionSettings();
  const { runEvents, artifacts, addRunEvent, addArtifact, resetRunState, selectArtifact, updateApprovalState, activeSessionId, setActiveSessionId } = useUIStore();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [renameOpen, setRenameOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<ChatSessionSettings>({
    model: 'Hermes 3 405B',
    provider: 'mock-runtime',
    policyPreset: 'safe-chat',
    memoryMode: 'standard',
  });
  const chatStream = useChatStream();

  useEffect(() => {
    if (!selectedSessionId && sessionsQuery.data?.length) {
      const preferred = activeSessionId && sessionsQuery.data.some((session) => session.id === activeSessionId)
        ? activeSessionId
        : sessionsQuery.data[0].id;
      setSelectedSessionId(preferred);
    }
  }, [activeSessionId, selectedSessionId, sessionsQuery.data]);

  useEffect(() => {
    if (selectedSessionId && sessionsQuery.data && !sessionsQuery.data.some((session) => session.id === selectedSessionId)) {
      setSelectedSessionId(sessionsQuery.data[0]?.id ?? null);
    }
  }, [selectedSessionId, sessionsQuery.data]);

  const sessionQuery = useSession(selectedSessionId);

  useEffect(() => {
    setActiveSessionId(selectedSessionId);
  }, [selectedSessionId, setActiveSessionId]);

  useEffect(() => {
    if (sessionQuery.data?.settings) {
      setLocalSettings(sessionQuery.data.settings);
    }
  }, [sessionQuery.data?.settings]);

  const messages = useMemo(() => {
    return [...(sessionQuery.data?.messages ?? []), ...optimisticMessages];
  }, [optimisticMessages, sessionQuery.data?.messages]);

  const handleNewChat = async () => {
    const result = await createSession.mutateAsync();
    resetRunState();
    setSelectedSessionId(result.session.id);
    setOptimisticMessages([]);
    setStreamingMessage('');
  };

  const handleSend = async (message: string, attachmentIds?: string[]) => {
    let sessionId = selectedSessionId;
    if (!sessionId) {
      const created = await createSession.mutateAsync();
      sessionId = created.session.id;
      setSelectedSessionId(sessionId);
    }

    const optimisticMessage: Message = {
      id: `optimistic-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };

    resetRunState();
    setOptimisticMessages((current) => [...current, optimisticMessage]);
    setStreamingMessage('');

    try {
      await chatStream.mutateAsync({
        sessionId,
        message,
        attachmentIds,
        onEvent: (event) => {
          if (event.type === 'assistant.delta') {
            setStreamingMessage((current) => current + event.delta);
            return;
          }
          addRunEvent(event);
          if (event.type === 'artifact.emitted') {
            addArtifact({
              artifactId: event.artifactId,
              artifactType: event.artifactType,
              label: event.label,
              content: event.content,
            });
          }
        },
      });
    } finally {
      setOptimisticMessages([]);
      setStreamingMessage('');
    }
  };

  const activeTitle = sessionQuery.data?.title ?? 'New chat';
  const activeSettings = localSettings;

  return (
    <>
      <div className="grid min-h-[calc(100vh-4rem)] gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        <SessionSidebar
          sessions={sessionsQuery.data ?? []}
          selectedSessionId={selectedSessionId}
          search={search}
          isLoading={sessionsQuery.isLoading}
          onSearchChange={setSearch}
          onNewChat={() => void handleNewChat()}
          onSelectSession={(sessionId) => {
            resetRunState();
            setSelectedSessionId(sessionId);
            setOptimisticMessages([]);
            setStreamingMessage('');
          }}
        />
        <section className="flex min-h-[calc(100vh-6rem)] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/50 shadow-sm">
          <ChatHeader
            title={activeTitle}
            settings={activeSettings}
            loadedSkillIds={sessionQuery.data?.loadedSkillIds}
            onOpenSettings={() => setSettingsOpen(true)}
            onRename={() => setRenameOpen(true)}
            onArchive={() => setArchiveOpen(true)}
            onDelete={() => setDeleteOpen(true)}
            onFork={() => {
              if (!selectedSessionId) return;
              void forkSession.mutateAsync(selectedSessionId).then(({ session }) => {
                resetRunState();
                setSearch('');
                setSelectedSessionId(session.id);
                setOptimisticMessages([]);
                setStreamingMessage('');
              });
            }}
            onModelChange={(model, provider) => {
              if (!selectedSessionId) return;
              setLocalSettings((current) => ({ ...current, model, provider }));
              void updateSessionSettings.mutateAsync({ sessionId: selectedSessionId, settings: { model, provider } });
            }}
          />
          <ChatTranscript
            messages={messages}
            runEvents={runEvents}
            artifacts={artifacts}
            streamingMessage={streamingMessage}
            isStreaming={chatStream.isPending}
            isLoading={sessionQuery.isLoading}
            onApprove={(toolCallId) => {
              trackClientEvent('approval.approved', { toolCallId });
              fetch(`/api/runtime/approvals/${toolCallId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) }).catch(() => undefined);
              updateApprovalState(toolCallId, true);
            }}
            onReject={(toolCallId) => {
              trackClientEvent('approval.rejected', { toolCallId });
              fetch(`/api/runtime/approvals/${toolCallId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) }).catch(() => undefined);
              updateApprovalState(toolCallId, false);
            }}
            onOpenArtifact={(artifactId) => selectArtifact(artifactId)}
          />
          {chatStream.isError ? (
            <div className="border-t border-border bg-danger/10 px-5 py-3 text-sm text-foreground">
              {(chatStream.error as Error).message}
            </div>
          ) : null}
          <ChatComposer disabled={chatStream.isPending} onSend={handleSend} />
        </section>
      </div>

      <RenameSessionDialog
        open={renameOpen}
        initialTitle={activeTitle}
        onClose={() => setRenameOpen(false)}
        onSubmit={async (title) => {
          if (!selectedSessionId) return;
          setRenameOpen(false);
          await renameSession.mutateAsync({ sessionId: selectedSessionId, title });
        }}
      />

      <ConfirmSessionActionDialog
        open={archiveOpen}
        title="Archive session"
        description="Archive this conversation but keep it available in history and search."
        confirmLabel="Archive"
        onClose={() => setArchiveOpen(false)}
        onConfirm={async () => {
          if (!selectedSessionId) return;
          await archiveSession.mutateAsync(selectedSessionId);
          setArchiveOpen(false);
        }}
      />

      <ConfirmSessionActionDialog
        open={deleteOpen}
        title="Delete session"
        description="This permanently removes the selected conversation from the in-memory Sprint 4 session store."
        confirmLabel="Delete"
        confirmClassName="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white"
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          if (!selectedSessionId) return;
          const deletedId = selectedSessionId;
          await deleteSession.mutateAsync(deletedId);
          resetRunState();
          setDeleteOpen(false);
          if (deletedId === selectedSessionId) {
            setSelectedSessionId(null);
          }
        }}
      />

      <ChatSettingsSheet
        open={settingsOpen}
        settings={activeSettings}
        onClose={() => setSettingsOpen(false)}
        onSave={async (settings) => {
          if (!selectedSessionId) return;
          setLocalSettings((current) => ({ ...current, ...settings }));
          await updateSessionSettings.mutateAsync({ sessionId: selectedSessionId, settings });
        }}
      />
    </>
  );
}
