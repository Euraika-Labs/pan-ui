'use client';

import type { Profile } from '@/lib/types/profile';

type PolicyPresetSelectorProps = {
  value: NonNullable<Profile['policyPreset']>;
  onChange: (value: NonNullable<Profile['policyPreset']>) => void;
};

export function PolicyPresetSelector({ value, onChange }: PolicyPresetSelectorProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as NonNullable<Profile['policyPreset']>)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
      aria-label="Policy preset selector"
    >
      <option value="safe-chat">Safe Chat</option>
      <option value="research">Research</option>
      <option value="builder">Builder</option>
      <option value="full-power">Full Power</option>
    </select>
  );
}
