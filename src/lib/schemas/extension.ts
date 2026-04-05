import { z } from 'zod';

export const extensionCapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  riskLevel: z.enum(['read', 'write', 'execute', 'admin']),
  scope: z.enum(['global', 'profile', 'session']),
  approvalPolicy: z.enum(['auto', 'on-request', 'always']).optional(),
  lastUsedAt: z.string().optional(),
});

export const extensionConfigSchema = z.object({
  command: z.string().optional(),
  url: z.string().optional(),
  authType: z.enum(['none', 'api-key', 'oauth']).optional(),
  token: z.string().optional(),
});

export const extensionDiagnosticsSchema = z.object({
  source: z.enum(['live', 'cache', 'persisted', 'failed']),
  errorText: z.string().nullable().optional(),
  remediation: z.array(z.string()).optional(),
  discoveredTools: z.number().optional(),
  probedAt: z.string().optional(),
});

export const extensionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  health: z.enum(['healthy', 'degraded', 'blocked', 'failed']),
  riskLevel: z.enum(['read', 'write', 'execute', 'admin']),
  authState: z.enum(['connected', 'needs-auth', 'expired']),
  governance: z.enum(['enabled', 'blocked', 'approval-gated', 'policy-limited']),
  provenance: z.enum(['built-in', 'verified', 'custom', 'self-hosted', 'local-process']),
  approvalPolicy: z.enum(['auto', 'on-request', 'always']),
  type: z.enum(['mcp', 'native', 'builtin']),
  installed: z.boolean(),
  config: extensionConfigSchema,
  capabilities: z.array(extensionCapabilitySchema),
  toolCount: z.number(),
  profilesUsing: z.array(z.string()),
  diagnostics: extensionDiagnosticsSchema.optional(),
  version: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const toolInventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sourceExtensionId: z.string(),
  sourceExtensionName: z.string(),
  category: z.enum(['mcp', 'builtin', 'native']),
  riskLevel: z.enum(['read', 'write', 'execute', 'admin']),
  enabled: z.boolean(),
  approvalPolicy: z.enum(['auto', 'on-request', 'always']),
  lastUsedAt: z.string().optional(),
  scope: z.enum(['global', 'profile', 'session']),
});
