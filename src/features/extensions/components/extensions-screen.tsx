'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddMcpExtension, useExtensions } from '@/features/extensions/api/use-extensions';
import { AddMcpServerDialog } from '@/features/extensions/components/add-mcp-server-dialog';
import { ExtensionCard } from '@/features/extensions/components/extension-card';

export function ExtensionsScreen() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const extensionsQuery = useExtensions();
  const addMcp = useAddMcpExtension();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Extensions</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage MCP servers, built-in connectors, configuration, and capability exposure.</p>
        </div>
        <button type="button" onClick={() => setDialogOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Add MCP server
        </button>
      </div>

      {extensionsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading extensions…</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(extensionsQuery.data ?? []).map((extension) => (
          <ExtensionCard key={extension.id} extension={extension} />
        ))}
      </div>

      <AddMcpServerDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (payload) => {
          const { extension } = await addMcp.mutateAsync(payload);
          setDialogOpen(false);
          router.push(`/extensions/${extension.id}`);
        }}
      />
    </div>
  );
}
