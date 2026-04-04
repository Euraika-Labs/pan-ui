'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FolderTree, Library, MemoryStick, MessageSquare, Settings } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/skills', label: 'Skills', icon: Library },
  { href: '/extensions', label: 'Extensions', icon: Bot },
  { href: '/memory', label: 'Memory', icon: MemoryStick },
  { href: '/profiles', label: 'Profiles', icon: FolderTree },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { mobileNavOpen, toggleMobileNav } = useUIStore();

  const nav = (
    <>
      <div className="flex h-16 items-center border-b border-border px-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Hermes</p>
          <h1 className="text-lg font-semibold">Workspace</h1>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => {
                if (mobileNavOpen) toggleMobileNav();
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 lg:block">{nav}</aside>
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={toggleMobileNav}>
          <aside className="h-full w-72 border-r border-border bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
