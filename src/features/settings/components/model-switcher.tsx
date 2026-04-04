'use client';

import { MODEL_OPTIONS } from '@/features/settings/api/use-models';

type ModelSwitcherProps = {
  value: string;
  onChange: (model: string, provider: string) => void;
  ariaLabel?: string;
};

export function ModelSwitcher({ value, onChange, ariaLabel = 'Model switcher' }: ModelSwitcherProps) {
  return (
    <select
      value={value}
      onChange={(event) => {
        const next = MODEL_OPTIONS.find((option) => option.id === event.target.value);
        if (next) onChange(next.id, next.provider);
      }}
      className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
      aria-label={ariaLabel}
    >
      {MODEL_OPTIONS.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label} · {option.provider}
        </option>
      ))}
    </select>
  );
}
