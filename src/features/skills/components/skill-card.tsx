import Link from 'next/link';
import type { Skill } from '@/lib/types/skill';

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/skills/${skill.id}`} className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{skill.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{skill.description}</p>
        </div>
        <div className="space-y-1 text-right text-xs">
          <p className="rounded-full border border-border px-2 py-1">{skill.source}</p>
          <p className={`rounded-full px-2 py-1 ${skill.enabled ? 'bg-success/15 text-foreground' : 'bg-muted text-muted-foreground'}`}>
            {skill.enabled ? 'Enabled' : skill.installed ? 'Installed' : 'Available'}
          </p>
        </div>
      </div>
    </Link>
  );
}
