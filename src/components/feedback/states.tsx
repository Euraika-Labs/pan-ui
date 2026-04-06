import type { ReactNode } from 'react';

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return <div className="rounded-lg border border-border/70 bg-card/60 p-6 text-sm text-muted-foreground shadow-[var(--shadow-card)]">{message}</div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-card/60 p-6 text-sm text-muted-foreground shadow-[var(--shadow-card)]">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-2 leading-6">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-foreground shadow-[var(--shadow-card)]">{message}</div>;
}
