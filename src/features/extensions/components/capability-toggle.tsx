'use client';

import type { ExtensionCapability } from '@/lib/types/extension';

type CapabilityToggleProps = {
  capability: ExtensionCapability;
  onToggle: (nextEnabled: boolean) => void;
  onScopeChange: (scope: ExtensionCapability['scope']) => void;
};

export function CapabilityToggle({ capability, onToggle, onScopeChange }: CapabilityToggleProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold">{capability.name}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{capability.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">Risk: {capability.riskLevel}</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={capability.enabled} onChange={(e) => onToggle(e.target.checked)} />
          Enabled
        </label>
      </div>
      <div className="mt-3">
        <label className="text-xs text-muted-foreground">Scope</label>
        <select
          value={capability.scope}
          onChange={(e) => onScopeChange(e.target.value as ExtensionCapability['scope'])}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="global">Global</option>
          <option value="profile">Profile</option>
          <option value="session">Session</option>
        </select>
      </div>
    </div>
  );
}
