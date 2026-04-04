'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionSearch } from '@/features/memory/api/use-memory';

export function SessionSearchPanel() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const searchQuery = useSessionSearch(query);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Session search</h2>
      <p className="mt-1 text-sm text-muted-foreground">Search prior conversations independently from prompt memory.</p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search prior sessions…"
        className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
      />
      <div className="mt-4 space-y-3">
        {(searchQuery.data ?? []).map((result) => (
          <button key={result.id} type="button" onClick={() => router.push('/chat')} className="block w-full rounded-xl border border-border bg-background p-4 text-left">
            <p className="text-sm font-medium">{result.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{result.preview}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
