import { NextResponse } from 'next/server';
import { getSelectedProfileFromCookie } from '@/server/hermes/profile-cookie';
import { listHubMcpServers, searchHubMcpServers } from '@/server/hermes/hub-mcp';
import { listRealExtensions } from '@/server/hermes/real-extensions';

function toExtensionId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    let servers;
    let total: number;

    if (q) {
      const result = await searchHubMcpServers(q);
      servers = result.servers;
      total = result.total;
    } else {
      servers = await listHubMcpServers();
      total = servers.length;
    }

    // Filter out already-installed servers
    const profileId = await getSelectedProfileFromCookie();
    const installed = listRealExtensions(profileId);
    const installedKeys = new Set(installed.flatMap((extension) => [extension.id, extension.name]));
    const filtered = servers.filter((server) => {
      const normalizedId = toExtensionId(server.name);
      return !installedKeys.has(server.name) && !installedKeys.has(normalizedId);
    });

    return NextResponse.json({ servers: filtered, total, filtered: filtered.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list hub MCP servers' },
      { status: 500 },
    );
  }
}
