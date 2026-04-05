'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Bot, Brain, FolderTree, Library, MessageSquare, Settings, Sparkles, Workflow } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/chat', label: 'Chat', icon: MessageSquare, description: 'Active workspace runs and transcripts' },
  { href: '/skills', label: 'Skills', icon: Library, description: 'Reusable Hermes skills and local edits' },
  { href: '/extensions', label: 'Integrations', icon: Bot, description: 'Installed · MCP Servers · Tools · Approvals · Diagnostics' },
  { href: '/memory', label: 'Memory', icon: Brain, description: 'User profile, agent memory, context, and session recall' },
  { href: '/profiles', label: 'Profiles', icon: FolderTree, description: 'Active profile, policies, and session scope' },
  { href: '/settings', label: 'Settings', icon: Settings, description: 'Runtime, diagnostics, and environment controls' },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skillPathMatch = pathname.match(/^\/skills\/([^/?#]+)/);
  const loadedSkillHint = skillPathMatch?.[1] ?? searchParams.get('loadedSkill');
  const { mobileNavOpen, toggleMobileNav, activeSessionId } = useUIStore();

  const nav = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/70 px-5 py-5">
        <div className="rounded-[1.6rem] border border-border/80 bg-card/90 p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-primary-foreground shadow-[var(--shadow-card)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Project workspace</p>
              <h1 className="text-lg font-semibold">Hermes Workspace</h1>
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
            Session-backed today, ready for future project and workspace entities without changing your chat flow.
          </div>
        </div>
      </div>

      <div className="px-3 pt-3">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Navigate</p>
      </div>
      <nav className="space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon, description }) => {
          const targetHref = href === '/chat' && activeSessionId
            ? `/chat?session=${encodeURIComponent(activeSessionId)}${loadedSkillHint ? `&loadedSkill=${encodeURIComponent(loadedSkillHint)}` : ''}`
            : href === '/skills' && activeSessionId
              ? `/skills?session=${encodeURIComponent(activeSessionId)}`
              : href;
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={targetHref}
              aria-label={label === 'Integrations' ? 'Extensions' : label === 'Chat' ? 'Workspace chat' : label}
              onClick={() => {
                if (mobileNavOpen) toggleMobileNav();
              }}
              className={cn(
                'group flex items-start gap-3 rounded-2xl px-3 py-3 text-sm transition',
                active
                  ? 'border border-primary/20 bg-primary/10 text-foreground shadow-[var(--shadow-card)]'
                  : 'border border-transparent text-muted-foreground hover:border-border/70 hover:bg-card/70 hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl transition',
                  active
                    ? 'bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-primary-foreground'
                    : 'bg-muted/70 text-muted-foreground group-hover:bg-background group-hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3">
        <div className="rounded-[1.5rem] border border-border/70 bg-card/80 p-4 text-xs leading-5 text-muted-foreground shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 text-foreground">
            <Workflow className="h-4 w-4 text-primary" />
            <p className="font-semibold">Workspace contract</p>
          </div>
          <p className="mt-2">
            Navigation covers chat, skills, integrations, profiles, and settings. Session history stays separate so the shell feels like a workspace, not a page list.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-80 shrink-0 border-r border-border/70 bg-surface/70 backdrop-blur-xl lg:block">{nav}</aside>
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden" onClick={toggleMobileNav}>
          <aside className="h-full w-80 border-r border-border/70 bg-background/95 shadow-[var(--shadow-elevated)]" onClick={(e) => e.stopPropagation()}>
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
