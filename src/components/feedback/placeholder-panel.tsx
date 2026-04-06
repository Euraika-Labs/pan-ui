import type { ReactNode } from 'react';

export function PlaceholderPanel({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <p className="mt-2 text-xs uppercase tracking-label text-muted-foreground">Agent fallback surface</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
