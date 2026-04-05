import type { PropsWithChildren } from 'react';
import { RightDrawer } from '@/components/layout/right-drawer';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary))/0.09,transparent_30%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background))_22%,hsl(var(--surface)))]" />
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="flex min-h-0 flex-1 gap-4 px-3 pb-3 lg:gap-5 lg:px-5 lg:pb-5 xl:gap-6">
          <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>
          <RightDrawer />
        </div>
      </div>
    </div>
  );
}
