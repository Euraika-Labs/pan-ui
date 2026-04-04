'use client';

import { Menu, PanelRightOpen } from 'lucide-react';
import { ProfileSwitcher } from '@/features/profiles/components/profile-switcher';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useUIStore } from '@/lib/store/ui-store';

export function Topbar() {
  const { toggleMobileNav, openRightDrawer } = useUIStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="rounded-md border border-border p-2 text-muted-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Hermes Workspace</p>
          <p className="text-sm font-medium">Sprint 1 foundation</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ProfileSwitcher />
        <button
          type="button"
          onClick={openRightDrawer}
          className="rounded-md border border-border p-2 text-muted-foreground transition hover:bg-muted"
          aria-label="Open details panel"
        >
          <PanelRightOpen className="h-4 w-4" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
