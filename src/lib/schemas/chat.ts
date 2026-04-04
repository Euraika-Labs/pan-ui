import { z } from 'zod';

export const chatStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('assistant.delta'), delta: z.string() }),
  z.object({ type: z.literal('tool.started'), toolCallId: z.string(), toolName: z.string() }),
  z.object({
    type: z.literal('tool.awaiting_approval'),
    toolCallId: z.string(),
    toolName: z.string(),
    summary: z.string(),
  }),
  z.object({
    type: z.literal('tool.completed'),
    toolCallId: z.string(),
    toolName: z.string(),
    output: z.string().optional(),
  }),
  z.object({
    type: z.literal('artifact.emitted'),
    artifactId: z.string(),
    artifactType: z.string(),
    label: z.string(),
    content: z.string().optional(),
  }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export const chatSessionSettingsSchema = z.object({
  model: z.string(),
  provider: z.string(),
  policyPreset: z.enum(['safe-chat', 'research', 'builder', 'full-power']),
  memoryMode: z.enum(['standard', 'minimal']),
});

export const chatSessionSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.string(),
  preview: z.string().optional(),
});
