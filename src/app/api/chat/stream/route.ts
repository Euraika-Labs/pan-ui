import { NextResponse } from 'next/server';
import { addAssistantMessage, addUserMessage } from '@/server/chat/session-store';
import { hermesFetch } from '@/server/hermes/client';
import { HermesConnectionError, HermesResponseError } from '@/server/hermes/errors';
import { parseSSEChunk } from '@/server/hermes/stream-parser';
import { appendRealSessionMessage, getRealSession } from '@/server/hermes/real-sessions';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { gateEventsUntilApproved } from '@/server/hermes/live-approval-bridge';
import { trackServerEvent } from '@/lib/telemetry/server';
import { getUpload } from '@/server/uploads/upload-store';
import { getApprovalDecision, persistArtifact, persistToolEvent } from '@/server/runtime/runtime-store';
import { createRun, updateRunStatus } from '@/server/runtime/run-orchestrator';

const encoder = new TextEncoder();

function toSSE(data: unknown) {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

function mockResponseFor(message: string, attachmentNames: string[]) {
  const attachmentNote = attachmentNames.length ? `\n\nAttachments received: ${attachmentNames.join(', ')}.` : '';
  return `Hermes mock mode is active. You said: ${message}${attachmentNote}\n\nSprint 8 now includes attachments, voice tools, and mobile polish on top of the earlier agent UI.`;
}

async function waitForApproval(toolCallId: string, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const status = getApprovalDecision(toolCallId);
    if (status === 'approved' || status === 'rejected') return status;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return 'pending';
}

function createMockStream(runId: string, sessionId: string, message: string, attachmentNames: string[]) {
  const responseText = mockResponseFor(message, attachmentNames);
  const words = responseText.split(/(\s+)/).filter(Boolean);

  return new ReadableStream({
    async start(controller) {
      let assembled = '';
      updateRunStatus(runId, 'running');
      const started = { type: 'tool.started', toolCallId: 'tool-web-search', toolName: 'web_search' } as const;
      persistToolEvent(sessionId, started);
      controller.enqueue(toSSE(started));
      await new Promise((resolve) => setTimeout(resolve, 15));

      const approval = {
        type: 'tool.awaiting_approval',
        toolCallId: 'tool-terminal-approval',
        toolName: 'terminal',
        summary: 'Hermes wants approval to run a safe planning command in the workspace.',
      } as const;
      persistToolEvent(sessionId, approval);
      controller.enqueue(toSSE(approval));
      await new Promise((resolve) => setTimeout(resolve, 15));

      updateRunStatus(runId, 'waiting_approval');
      const decision = await waitForApproval(approval.toolCallId);
      updateRunStatus(runId, decision === 'approved' ? 'running' : 'failed', decision === 'rejected' ? 'Approval rejected' : decision === 'pending' ? 'Approval timed out' : '');
      if (decision !== 'approved') {
        const rejected = {
          type: 'error',
          message: decision === 'rejected' ? 'Tool execution rejected by user approval queue.' : 'Tool execution timed out waiting for approval.',
        } as const;
        persistToolEvent(sessionId, rejected);
        controller.enqueue(toSSE(rejected));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
        return;
      }

      const artifact = {
        type: 'artifact.emitted',
        artifactId: 'artifact-plan',
        artifactType: 'text/markdown',
        label: 'Implementation sketch',
        content: `# Hermes Workspace\n\nUser prompt: ${message}\n\n- Research references gathered\n- Initial plan drafted\n- Ready for deeper implementation`,
      } as const;
      persistArtifact(sessionId, artifact);
      controller.enqueue(toSSE(artifact));
      await new Promise((resolve) => setTimeout(resolve, 15));

      const completed = {
        type: 'tool.completed',
        toolCallId: 'tool-web-search',
        toolName: 'web_search',
        output: 'Collected reference UI patterns and surfaced a draft implementation sketch.',
      } as const;
      persistToolEvent(sessionId, completed);
      controller.enqueue(toSSE(completed));
      await new Promise((resolve) => setTimeout(resolve, 15));

      for (const part of words) {
        assembled += part;
        controller.enqueue(toSSE({ type: 'assistant.delta', delta: part }));
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      addAssistantMessage(sessionId, assembled);
      updateRunStatus(runId, 'completed');
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

function createPassthroughPersistentStream(runId: string, profileId: string, sessionId: string, upstream: ReadableStream<Uint8Array>) {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let assistantBuffer = '';

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      updateRunStatus(runId, 'running');
      let doneReading = false;
      while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;
        if (done) break;
        if (!value) continue;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() ?? '';
        for (const chunk of chunks) {
          const events = parseSSEChunk(`${chunk}\n\n`);
          if (events.some((event) => event.type === 'tool.awaiting_approval')) {
            updateRunStatus(runId, 'waiting_approval');
          }
          const gate = await gateEventsUntilApproved(events);
          if (events.some((event) => event.type === 'tool.awaiting_approval') && gate.approved) {
            updateRunStatus(runId, 'running');
          }
          for (const event of gate.released) {
            if (event.type === 'assistant.delta') {
              assistantBuffer += event.delta;
            } else {
              persistToolEvent(sessionId, event);
              if (event.type === 'artifact.emitted') persistArtifact(sessionId, event);
              if (event.type === 'tool.started') {
                appendRealSessionMessage(profileId, sessionId, {
                  role: 'assistant',
                  content: '',
                  toolCalls: [{ id: event.toolCallId, function: { name: event.toolName, arguments: '{}' } }],
                });
              }
              if (event.type === 'tool.completed') {
                appendRealSessionMessage(profileId, sessionId, {
                  role: 'tool',
                  content: event.output || '',
                  toolCallId: event.toolCallId,
                  toolName: event.toolName,
                });
              }
            }
            controller.enqueue(toSSE(event));
          }
          if (!gate.approved) {
            controller.enqueue(toSSE({ type: 'error', message: 'Execution blocked pending or rejected approval.' }));
            updateRunStatus(runId, 'failed', 'Blocked pending or rejected approval');
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            return;
          }
        }
      }
      if (assistantBuffer.trim()) {
        appendRealSessionMessage(profileId, sessionId, { role: 'assistant', content: assistantBuffer, finishReason: 'stop' });
      }
      updateRunStatus(runId, 'completed');
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  const { sessionId, message, attachmentIds } = (await request.json().catch(() => ({}))) as {
    sessionId?: string;
    message?: string;
    attachmentIds?: string[];
  };

  if (!sessionId || !message?.trim()) {
    return NextResponse.json({ error: 'sessionId and message are required' }, { status: 400 });
  }

  const profileId = await getSelectedProfileFromCookie();
  const run = createRun(sessionId);
  const attachments = (attachmentIds ?? [])
    .map((id) => getUpload(id))
    .filter((item): item is NonNullable<ReturnType<typeof getUpload>> => Boolean(item))
    .map((item) => ({ id: item.id, name: item.name, size: item.size, type: item.type }));
  const attachmentNames = attachments.map((item) => item.name);

  if (getRealSession(profileId, sessionId)) {
    appendRealSessionMessage(profileId, sessionId, { role: 'user', content: message });
  } else {
    addUserMessage(sessionId, message, attachments);
  }
  trackServerEvent('chat.stream.start', { sessionId, attachmentCount: attachments.length });

  const mockMode = process.env.HERMES_MOCK_MODE !== 'false';
  if (mockMode) {
    return new NextResponse(createMockStream(run.id, sessionId, message, attachmentNames), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }

  try {
    const hermesResponse = await hermesFetch('/v1/responses', {
      method: 'POST',
      body: JSON.stringify({ input: message, stream: true }),
    });

    return new NextResponse(createPassthroughPersistentStream(run.id, profileId, sessionId, hermesResponse.body!), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof HermesResponseError) {
      updateRunStatus(run.id, 'failed', error.message);
      return NextResponse.json({ error: error.message, status: error.status }, { status: error.status });
    }

    if (error instanceof HermesConnectionError) {
      return new NextResponse(createMockStream(run.id, sessionId, message, attachmentNames), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    updateRunStatus(run.id, 'failed', 'Unknown streaming failure');
    return NextResponse.json({ error: 'Unknown streaming failure' }, { status: 500 });
  }
}
