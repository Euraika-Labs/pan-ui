import type { ReactNode } from 'react';

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return <div className="rounded-2xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">{message}</div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-foreground">{message}</div>;
}
