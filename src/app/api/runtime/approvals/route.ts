import { NextResponse } from 'next/server';
import { listApprovals } from '@/server/runtime/runtime-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || '';
  const approvals = listApprovals(sessionId, query, status);

  return NextResponse.json({
    approvals,
    summary: {
      pending: approvals.filter((approval) => approval.status === 'pending').length,
      approved: approvals.filter((approval) => approval.status === 'approved').length,
      rejected: approvals.filter((approval) => approval.status === 'rejected').length,
    },
  });
}
