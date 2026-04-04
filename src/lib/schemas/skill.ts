import { z } from 'zod';

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  source: z.enum(['bundled', 'local', 'hub', 'agent-created']),
  installed: z.boolean(),
  enabled: z.boolean(),
  content: z.string(),
  loadedInSessions: z.array(z.string()).optional(),
  version: z.string().optional(),
  updatedAt: z.string().optional(),
});
