export type SkillSource = 'bundled' | 'local' | 'hub' | 'agent-created';

export type Skill = {
  id: string;
  name: string;
  description: string;
  source: SkillSource;
  installed: boolean;
  enabled: boolean;
  content: string;
  loadedInSessions?: string[];
  version?: string;
  updatedAt?: string;
};
