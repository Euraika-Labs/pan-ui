import type { PropsWithChildren } from 'react';
import { RightDrawer } from '@/components/layout/right-drawer';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1">{children}</main>
          <RightDrawer />
        </div>
      </div>
    </div>
  );
}
