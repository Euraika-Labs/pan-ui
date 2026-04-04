import { z } from 'zod';

export const sessionSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.string(),
  status: z.enum(['active', 'archived']),
  preview: z.string().optional(),
  parentSessionId: z.string().optional(),
});
