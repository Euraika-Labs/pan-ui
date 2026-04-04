'use client';

import { useProfiles, useUpdateProfile } from '@/features/profiles/api/use-profiles';
import { AuditLog } from '@/features/settings/components/audit-log';
import { PolicyPresetSelector } from '@/features/settings/components/policy-preset-selector';
import { RuntimeStatusPanel } from '@/features/settings/components/runtime-status';
import { useUIStore } from '@/lib/store/ui-store';

export function SettingsScreen() {
  const { selectedProfileId } = useUIStore();
  const profilesQuery = useProfiles();
  const updateProfile = useUpdateProfile();
  const activeProfile = (profilesQuery.data ?? []).find((profile) => profile.id === selectedProfileId) ?? (profilesQuery.data ?? [])[0];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage policy presets and inspect recent workspace changes.</p>
      </div>
      {activeProfile ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Active profile policy</h2>
          <p className="mt-1 text-sm text-muted-foreground">Change the active profile default policy preset.</p>
          <div className="mt-4 max-w-sm">
            <PolicyPresetSelector
              value={activeProfile.policyPreset ?? 'safe-chat'}
              onChange={(value) => void updateProfile.mutateAsync({ profileId: activeProfile.id, policyPreset: value })}
            />
          </div>
        </section>
      ) : null}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Operational browsers</h2>
        <p className="mt-1 text-sm text-muted-foreground">Open dedicated pages for runtime artifacts, approvals, audit history, and MCP diagnostics.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a href="/settings/audit" className="rounded-lg border border-border px-4 py-2">Audit browser</a>
          <a href="/settings/approvals" className="rounded-lg border border-border px-4 py-2">Approvals browser</a>
          <a href="/settings/artifacts" className="rounded-lg border border-border px-4 py-2">Artifacts browser</a>
          <a href="/settings/mcp-diagnostics" className="rounded-lg border border-border px-4 py-2">MCP diagnostics</a>
          <a href="/settings/health" className="rounded-lg border border-border px-4 py-2">Runtime health</a>
          <a href="/settings/runs" className="rounded-lg border border-border px-4 py-2">Runs explorer</a>
          <a href="/settings/telemetry" className="rounded-lg border border-border px-4 py-2">Telemetry browser</a>
        </div>
      </section>
      <RuntimeStatusPanel />
      <AuditLog />
    </div>
  );
}
