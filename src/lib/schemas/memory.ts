import { z } from 'zod';

export const memoryEntrySchema = z.object({
  id: z.string(),
  content: z.string(),
  updatedAt: z.string().optional(),
  scope: z.enum(['user', 'agent']),
});

export const contextInspectorSchema = z.object({
  activeProfileId: z.string().nullable(),
  activeSessionId: z.string().nullable(),
  activeSessionTitle: z.string().optional(),
  activeSessionPreview: z.string().optional(),
  loadedSkillIds: z.array(z.string()),
  model: z.string().optional(),
  provider: z.string().optional(),
  policyPreset: z.enum(['safe-chat', 'research', 'builder', 'full-power']).optional(),
  memoryMode: z.enum(['standard', 'minimal']).optional(),
  userMemory: z.array(z.string()),
  agentMemory: z.array(z.string()),
});
