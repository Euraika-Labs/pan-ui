'use client';

import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useModelOptions } from '@/features/settings/api/use-models';
import { cn } from '@/lib/utils';

type ModelSwitcherProps = {
  value: string;
  provider?: string;
  onChange: (model: string, provider: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};

export function ModelSwitcher({
  value,
  provider,
  onChange,
  ariaLabel = 'Model switcher',
  disabled,
  className,
}: ModelSwitcherProps) {
  const modelOptionsQuery = useModelOptions(value, provider);
  const options = modelOptionsQuery.data ?? [];

  useEffect(() => {
    if (!value && options[0]) {
      onChange(options[0].id, options[0].provider);
    }
  }, [onChange, options, value]);

  const selectedValue = options.find((option) => option.id === value)?.label ?? value;

  return (
    <div className={cn('relative', className)}>
      <select
        value={selectedValue}
        onChange={(event) => {
          const next = options.find((option) => option.label === event.target.value || option.id === event.target.value);
          if (next) onChange(next.id, next.provider);
        }}
        className="min-w-[14rem] appearance-none rounded-2xl border border-border/70 bg-background/85 px-4 py-2.5 pr-10 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={ariaLabel}
        disabled={disabled || options.length === 0}
      >
        {options.map((option) => (
          <option key={option.id} value={option.label}>
            {option.label} · {option.provider}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
