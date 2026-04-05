'use client';

import { Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-3 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:bg-card disabled:cursor-not-allowed disabled:opacity-70"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      disabled={!mounted}
    >
      {isDark ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-primary" />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}
