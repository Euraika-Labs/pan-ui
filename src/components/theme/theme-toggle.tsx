'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="inline-flex items-center gap-2">
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
