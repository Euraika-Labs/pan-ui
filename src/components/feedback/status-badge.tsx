import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { StatusTone } from '@/lib/types/runtime-status';

const toneClasses: Record<StatusTone, string> = {
  success: 'border-success/25 bg-success/10 text-foreground',
  warning: 'border-warning/25 bg-warning/10 text-foreground',
  danger: 'border-danger/25 bg-danger/10 text-foreground',
  muted: 'border-border/70 bg-background/60 text-muted-foreground',
  accent: 'border-accent/25 bg-accent/10 text-foreground',
};

const toneIcons: Record<StatusTone, ReactNode> = {
  success: <ShieldCheck className="h-3.5 w-3.5 text-success" />,
  warning: <ShieldQuestion className="h-3.5 w-3.5 text-warning" />,
  danger: <ShieldAlert className="h-3.5 w-3.5 text-danger" />,
  muted: <ShieldQuestion className="h-3.5 w-3.5 text-muted-foreground" />,
  accent: <ShieldCheck className="h-3.5 w-3.5 text-accent" />,
};

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
  icon?: ReactNode;
  className?: string;
};

export function StatusBadge({ label, tone, icon, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-medium capitalize tracking-[0.01em]',
        toneClasses[tone],
        className,
      )}
    >
      {icon ?? toneIcons[tone]}
      {label}
    </span>
  );
}
