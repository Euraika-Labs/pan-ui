'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMemory, useUpdateMemory } from '@/features/memory/api/use-memory';

export function MemoryEditor({ scope }: { scope: 'user' | 'agent' }) {
  const memoryQuery = useMemory(scope);
  const updateMemory = useUpdateMemory(scope);
  const initial = useMemo(() => (memoryQuery.data ?? []).map((entry) => entry.content).join('\n'), [memoryQuery.data]);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{scope === 'user' ? 'User memory' : 'Agent memory'}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Updates persist immediately, but prompt injection changes take effect on the next session start.
      </p>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-4 min-h-64 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary"
      />
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => void updateMemory.mutateAsync(value)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Save {scope} memory
        </button>
      </div>
    </section>
  );
}
