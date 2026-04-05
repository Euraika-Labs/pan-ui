import { z } from 'zod';

export const chatStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('assistant.delta'), delta: z.string() }),
  z.object({ type: z.literal('run.phase'), phase: z.enum(['drafting', 'tool-started', 'waiting-approval', 'completed']), label: z.string() }),
  z.object({
    type: z.literal('tool.started'),
    toolCallId: z.string(),
    toolName: z.string(),
    riskLevel: z.enum(['read', 'write', 'execute', 'admin']).optional(),
    provenance: z.enum(['built-in', 'verified', 'custom', 'self-hosted', 'local-process']).optional(),
  }),
  z.object({
    type: z.literal('tool.awaiting_approval'),
    toolCallId: z.string(),
    toolName: z.string(),
    summary: z.string(),
    riskLevel: z.enum(['read', 'write', 'execute', 'admin']).optional(),
    governance: z.enum(['enabled', 'blocked', 'approval-gated', 'policy-limited']).optional(),
  }),
  z.object({
    type: z.literal('tool.completed'),
    toolCallId: z.string(),
    toolName: z.string(),
    output: z.string().optional(),
    riskLevel: z.enum(['read', 'write', 'execute', 'admin']).optional(),
  }),
  z.object({
    type: z.literal('artifact.emitted'),
    artifactId: z.string(),
    artifactType: z.string(),
    label: z.string(),
    content: z.string().optional(),
  }),
  z.object({
    type: z.literal('source.emitted'),
    source: z.object({
      id: z.string(),
      title: z.string(),
      href: z.string().optional(),
      snippet: z.string().optional(),
      sourceType: z.enum(['web', 'file', 'workspace', 'integration', 'unknown']),
      provenance: z.enum(['built-in', 'verified', 'custom', 'self-hosted', 'local-process']),
      note: z.string().optional(),
      label: z.string().optional(),
    }),
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
