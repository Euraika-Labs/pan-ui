'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useExtension, useTestExtension, useUpdateCapability, useUpdateExtension } from '@/features/extensions/api/use-extensions';
import { CapabilityToggle } from '@/features/extensions/components/capability-toggle';
import { ExtensionHealthBadge } from '@/features/extensions/components/extension-health-badge';
import { describeAuthState, describeExtensionProvenance, describeGovernance, describeRiskLevel } from '@/lib/presentation/capability-labels';

export function ExtensionDetail({ extensionId }: { extensionId: string }) {
  const extensionQuery = useExtension(extensionId);
  const updateExtension = useUpdateExtension();
  const testExtension = useTestExtension();
  const updateCapability = useUpdateCapability();
  const [tab, setTab] = useState<'overview' | 'permissions' | 'configuration' | 'capabilities'>('overview');

  if (extensionQuery.isLoading || !extensionQuery.data) {
    return <div className="p-4 lg:p-6 text-sm text-muted-foreground">Loading extension…</div>;
  }

  const extension = extensionQuery.data;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <Link href="/extensions" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <ExtensionHealthBadge health={extension.health} />
          <span className="rounded-full border border-border px-2 py-1">{extension.type}</span>
          <span className="rounded-full border border-border px-2 py-1">{describeRiskLevel(extension.riskLevel)}</span>
          <span className="rounded-full border border-border px-2 py-1">{describeAuthState(extension.authState)}</span>
          <span className="rounded-full border border-border px-2 py-1">{describeExtensionProvenance(extension.provenance)}</span>
          <span className="rounded-full border border-border px-2 py-1">{describeGovernance(extension.governance)}</span>
          <span className="rounded-full border border-border px-2 py-1">v{extension.version ?? '0.0.0'}</span>
        </div>
        <h1 className="text-2xl font-semibold">{extension.name}</h1>
        <p className="text-sm text-muted-foreground">{extension.description}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void testExtension.mutateAsync(extension.id)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Test connection
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['overview', 'permissions', 'configuration', 'capabilities'] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg px-4 py-2 text-sm ${tab === item ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="mt-2 text-sm text-muted-foreground">Health: {extension.health}. This integration exposes {extension.capabilities.length} capabilities across {extension.toolCount} discovered tools.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-2 py-1">{describeRiskLevel(extension.riskLevel)}</span>
            <span className="rounded-full border border-border px-2 py-1">{describeAuthState(extension.authState)}</span>
            <span className="rounded-full border border-border px-2 py-1">{describeGovernance(extension.governance)}</span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Profiles:</strong> {extension.profilesUsing.join(', ')}</p>
            <p><strong className="text-foreground">Probe source:</strong> {extension.diagnostics?.source ?? 'unknown'}</p>
            <p><strong className="text-foreground">Last probe:</strong> {extension.diagnostics?.probedAt ?? 'never'}</p>
            <p><strong className="text-foreground">Probe error:</strong> {extension.diagnostics?.errorText ?? 'none captured'}</p>
          </div>
        </section>
      ) : null}

      {tab === 'permissions' ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Permissions</h2>
          <div className="mt-4 space-y-3">
            {extension.capabilities.map((capability) => (
              <div key={capability.id} className="rounded-xl border border-border bg-background p-4">
                <p className="font-medium">{capability.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{describeRiskLevel(capability.riskLevel)} · {capability.scope} scope</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'configuration' ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Configuration</h2>
          <div className="mt-4 space-y-3">
            <input
              aria-label="Extension command"
              defaultValue={extension.config.command ?? ''}
              placeholder="Command"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              onBlur={(e) => void updateExtension.mutateAsync({ extensionId: extension.id, patch: { command: e.target.value || undefined } })}
            />
            <input
              aria-label="Extension URL"
              defaultValue={extension.config.url ?? ''}
              placeholder="URL"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              onBlur={(e) => void updateExtension.mutateAsync({ extensionId: extension.id, patch: { url: e.target.value || undefined } })}
            />
            <select
              aria-label="Extension auth type"
              defaultValue={extension.config.authType ?? 'none'}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              onChange={(e) => void updateExtension.mutateAsync({ extensionId: extension.id, patch: { authType: e.target.value as 'none' | 'api-key' | 'oauth' } })}
            >
              <option value="none">No auth</option>
              <option value="api-key">API key</option>
              <option value="oauth">OAuth</option>
            </select>
            <input
              aria-label="Extension token"
              defaultValue={extension.config.token ?? ''}
              placeholder="Token / secret"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              onBlur={(e) => void updateExtension.mutateAsync({ extensionId: extension.id, patch: { token: e.target.value || undefined } })}
            />
          </div>
        </section>
      ) : null}

      {tab === 'capabilities' ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Capabilities</h2>
          <div className="mt-4 space-y-3">
            {extension.capabilities.map((capability) => (
              <CapabilityToggle
                key={capability.id}
                capability={capability}
                onToggle={(enabled) => void updateCapability.mutateAsync({ extensionId: extension.id, capabilityId: capability.id, patch: { enabled } })}
                onScopeChange={(scope) => void updateCapability.mutateAsync({ extensionId: extension.id, capabilityId: capability.id, patch: { scope } })}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
