import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'brand-gradient text-primary-foreground shadow-card hover:-translate-y-0.5',
  ghost:
    'border border-border/70 bg-background/80 text-foreground shadow-card hover:-translate-y-0.5 hover:bg-card',
  danger:
    'border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'rounded-md px-2.5 py-1 text-2xs font-medium gap-1.5',
  md: 'rounded-lg px-3 py-2 text-sm font-medium gap-2',
  lg: 'rounded-lg px-4 py-2.5 text-sm font-semibold gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'ghost', size = 'md', icon, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
