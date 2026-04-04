import { z } from 'zod';

export const auditEventSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  action: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  detail: z.string(),
});
