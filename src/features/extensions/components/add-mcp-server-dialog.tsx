'use client';

import { useState } from 'react';

type AddMcpServerDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; command?: string; url?: string; authType?: 'none' | 'api-key' | 'oauth'; token?: string }) => Promise<void> | void;
};

export function AddMcpServerDialog({ open, onClose, onSubmit }: AddMcpServerDialogProps) {
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [url, setUrl] = useState('');
  const [authType, setAuthType] = useState<'none' | 'api-key' | 'oauth'>('none');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Add MCP server</h3>
        <p className="mt-1 text-sm text-muted-foreground">Create a new MCP extension by command or URL.</p>
        <div className="mt-4 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Server name" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="Command (optional if URL is provided)" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL (optional if command is provided)" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <select value={authType} onChange={(e) => setAuthType(e.target.value as 'none' | 'api-key' | 'oauth')} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="none">No auth</option>
            <option value="api-key">API key</option>
            <option value="oauth">OAuth</option>
          </select>
          {authType !== 'none' ? <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token / secret" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /> : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button
            type="button"
            onClick={async () => {
              if (!name.trim() || (!command.trim() && !url.trim())) {
                setError('Name plus command or URL is required.');
                return;
              }
              setError(null);
              await onSubmit({ name: name.trim(), command: command.trim() || undefined, url: url.trim() || undefined, authType, token: token.trim() || undefined });
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Add server
          </button>
        </div>
      </div>
    </div>
  );
}
