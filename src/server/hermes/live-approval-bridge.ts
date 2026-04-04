import { getApprovalDecision } from '@/server/runtime/runtime-store';

export async function waitForLiveApproval(toolCallId: string, timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const status = getApprovalDecision(toolCallId);
    if (status === 'approved' || status === 'rejected') return status;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return 'pending';
}

export async function gateEventsUntilApproved<T extends { type?: string; toolCallId?: string }>(
  events: T[],
  timeoutMs = 30000,
): Promise<{ approved: boolean; released: T[]; gateToolCallId?: string }> {
  const approvalEvent = events.find((event) => event.type === 'tool.awaiting_approval' && event.toolCallId) as
    | (T & { toolCallId: string })
    | undefined;

  if (!approvalEvent) {
    return { approved: true, released: events };
  }

  const decision = await waitForLiveApproval(approvalEvent.toolCallId, timeoutMs);
  return {
    approved: decision === 'approved',
    released: decision === 'approved' ? events : [approvalEvent],
    gateToolCallId: approvalEvent.toolCallId,
  };
}
