import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  modelDefault: z.string().optional(),
  policyPreset: z.enum(['safe-chat', 'research', 'builder', 'full-power']).optional(),
  sessionCount: z.number().optional(),
  skillCount: z.number().optional(),
  extensionCount: z.number().optional(),
  active: z.boolean().optional(),
});
