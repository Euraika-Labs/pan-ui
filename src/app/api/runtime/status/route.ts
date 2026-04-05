import { NextResponse } from 'next/server';
import { getHermesRuntimeStatus } from '@/server/hermes/runtime-bridge';

export async function GET() {
  return NextResponse.json({ status: await getHermesRuntimeStatus() });
}
