'use client';

import Link from 'next/link';
import { useProfiles, useUpdateProfile } from '@/features/profiles/api/use-profiles';
import { AuditLog } from '@/features/settings/components/audit-log';
import { PolicyPresetSelector } from '@/features/settings/components/policy-preset-selector';
import { RuntimeStatusPanel } from '@/features/settings/components/runtime-status';
import { useRuntimeStatus } from '@/features/settings/api/use-runtime-status';
import { useUIStore } from '@/lib/store/ui-store';

const browsers = [
  { href: '/settings/approvals', title: 'Approvals browser', description: 'Review blocked actions, reasons, and operator decisions.' },
  { href: '/settings/runs', title: 'Runs explorer', description: 'Inspect durable run state, phases, artifacts, and failures.' },
  { href: '/settings/telemetry', title: 'Telemetry browser', description: 'Trace client and server events for debugging and product insight.' },
  { href: '/settings/audit', title: 'Audit browser', description: 'Search persistent governance and configuration changes.' },
  { href: '/settings/health', title: 'Runtime health', description: 'Check runtime, provider, memory, and MCP remediation signals.' },
  { href: '/settings/mcp-diagnostics', title: 'MCP diagnostics', description: 'Validate MCP servers, discovered tools, and probe failures.' },
  { href: '/settings/artifacts', title: 'Artifacts browser', description: 'Browse files, plans, and outputs emitted by prior runs.' },
];

export function SettingsScreen() {
  const { selectedProfileId } = useUIStore();
  const profilesQuery = useProfiles();
  const runtimeQuery = useRuntimeStatus();
  const updateProfile = useUpdateProfile();
  const activeProfile = (profilesQuery.data ?? []).find((profile) => profile.id === selectedProfileId) ?? (profilesQuery.data ?? []).find((profile) => profile.active) ?? (profilesQuery.data ?? [])[0];
  const runtime = runtimeQuery.data;

  return (
    <div className="h-full overflow-y-auto space-y-6 p-4 lg:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Settings cockpit</h1>
        <p className="text-sm text-muted-foreground">Operate with explicit visibility into runtime state, policy posture, diagnostics, and durable history.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Runtime posture</h2>
              <p className="mt-1 text-sm text-muted-foreground">This panel tells you whether the runtime is live, which profile is active, and what the workspace can safely do right now.</p>
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Connection</p>
                <p className="mt-2 font-semibold">{runtime?.apiReachable ? 'Runtime live' : runtime?.available ? 'Runtime degraded' : 'Runtime unavailable'}</p>
              </div>
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Profile context</p>
                <p className="mt-2 font-semibold">{runtime?.profileContext?.label ?? runtime?.activeProfile ?? 'Loading'}</p>
              </div>
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">MCP servers</p>
                <p className="mt-2 font-semibold">{runtime?.mcpServers.length ?? 0}</p>
              </div>
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Skills indexed</p>
                <p className="mt-2 font-semibold">{runtime?.skillsCount ?? 0}</p>
              </div>
            </div>
          </div>
          {runtime?.remediationHints?.length ? (
            <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
              <p className="font-medium">Recommended remediation</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                {runtime.remediationHints.slice(0, 4).map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {activeProfile ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Active profile policy</h2>
            <p className="mt-1 text-sm text-muted-foreground">The selected profile controls memory scope, default guardrails, and which integrations are visible across the workspace.</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected profile</p>
                <p className="mt-2 font-semibold text-foreground">{activeProfile.name}</p>
              </div>
              <PolicyPresetSelector
                value={activeProfile.policyPreset ?? 'safe-chat'}
                onChange={(value) => void updateProfile.mutateAsync({ profileId: activeProfile.id, policyPreset: value })}
              />
            </div>
          </section>
        ) : null}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Operational browsers</h2>
            <p className="mt-1 text-sm text-muted-foreground">Dedicated operator views for approvals, runs, telemetry, audit, diagnostics, and generated outputs.</p>
          </div>
          <Link href="/settings/health" className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium">
            Open diagnostics first
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {browsers.map((browser) => (
            <Link key={browser.href} href={browser.href} className="rounded-xl border border-border bg-background p-4 transition hover:bg-muted/40">
              <p className="text-sm font-semibold">{browser.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{browser.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <RuntimeStatusPanel />
      <AuditLog />
    </div>
  );
}
