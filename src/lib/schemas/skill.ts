import { z } from 'zod';

export const skillLinkedFileSchema = z.object({
  path: z.string(),
  name: z.string(),
  group: z.string(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  source: z.enum(['bundled', 'local', 'hub', 'agent-created']),
  scope: z.enum(['builtin', 'global', 'profile']),
  provenance: z.enum(['built-in', 'verified', 'custom', 'local-process']),
  installed: z.boolean(),
  enabled: z.boolean(),
  content: z.string(),
  loadedInSessions: z.array(z.string()).optional(),
  ownerProfileId: z.string().nullable().optional(),
  filePath: z.string().optional(),
  version: z.string().optional(),
  updatedAt: z.string().optional(),
  impliedTools: z.array(z.string()).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  relatedSkills: z.array(z.string()).optional(),
  linkedFiles: z.array(skillLinkedFileSchema).optional(),
  author: z.string().optional(),
});
