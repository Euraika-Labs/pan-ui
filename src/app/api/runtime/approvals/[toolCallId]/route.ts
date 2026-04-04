import { NextResponse } from 'next/server';
import { setApprovalDecision } from '@/server/runtime/runtime-store';

export async function PATCH(request: Request, { params }: { params: Promise<{ toolCallId: string }> }) {
  const { toolCallId } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: 'approved' | 'rejected' };
  if (!body.status) return NextResponse.json({ error: 'status is required' }, { status: 400 });
  setApprovalDecision(toolCallId, body.status);
  return NextResponse.json({ ok: true });
}
