export type SkillSource = 'bundled' | 'local' | 'hub' | 'agent-created';
export type SkillScope = 'builtin' | 'global' | 'profile';
export type SkillProvenance = 'built-in' | 'verified' | 'custom' | 'local-process';

export type SkillLinkedFile = {
  /** Relative path within the skill directory, e.g. "references/api.md" */
  path: string;
  /** Just the filename */
  name: string;
  /** "references" | "templates" | "scripts" | "assets" */
  group: string;
};

export type Skill = {
  id: string;
  name: string;
  description: string;
  source: SkillSource;
  scope: SkillScope;
  provenance: SkillProvenance;
  installed: boolean;
  enabled: boolean;
  content: string;
  loadedInSessions?: string[];
  ownerProfileId?: string | null;
  filePath?: string;
  version?: string;
  updatedAt?: string;
  impliedTools?: string[];
  /** Category derived from directory path, e.g. "github", "mlops/training" */
  category?: string;
  /** Tags from YAML frontmatter metadata.hermes.tags */
  tags?: string[];
  /** Related skills from YAML frontmatter */
  relatedSkills?: string[];
  /** Linked supporting files (references, templates, scripts, assets) */
  linkedFiles?: SkillLinkedFile[];
  /** Author from frontmatter */
  author?: string;
};
