'use client';

import { useState } from 'react';
import { SkillCard } from '@/features/skills/components/skill-card';
import { useSkills } from '@/features/skills/api/use-skills';

export function SkillsScreen() {
  const [tab, setTab] = useState<'installed' | 'discover'>('installed');
  const skillsQuery = useSkills(tab === 'installed');

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Skills</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse installed skills, inspect details, and manage reusable Hermes workflows.</p>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setTab('installed')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'installed' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}>
          Installed
        </button>
        <button type="button" onClick={() => setTab('discover')} className={`rounded-lg px-4 py-2 text-sm ${tab === 'discover' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}>
          Discover
        </button>
      </div>

      {skillsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading skills…</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(skillsQuery.data ?? []).map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
}
