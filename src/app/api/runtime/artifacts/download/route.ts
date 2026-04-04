import { NextResponse } from 'next/server';
import { listArtifacts } from '@/server/runtime/runtime-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || '';
  const artifactId = searchParams.get('artifactId') || '';
  if (!sessionId || !artifactId) {
    return NextResponse.json({ error: 'sessionId and artifactId are required' }, { status: 400 });
  }
  const artifact = listArtifacts(sessionId).find((item) => item.artifactId === artifactId);
  if (!artifact) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
  }
  return new NextResponse(artifact.content || '', {
    headers: {
      'Content-Type': artifact.artifactType || 'text/plain',
      'Content-Disposition': `attachment; filename="${artifact.label.replace(/[^a-zA-Z0-9._-]+/g, '_')}.txt"`,
    },
  });
}
