import { z } from 'zod';

export const extensionCapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  scope: z.enum(['global', 'profile', 'session']),
});

export const extensionConfigSchema = z.object({
  command: z.string().optional(),
  url: z.string().optional(),
  authType: z.enum(['none', 'api-key', 'oauth']).optional(),
  token: z.string().optional(),
});

export const extensionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  health: z.enum([
    'healthy',
    'needs_configuration',
    'auth_expired',
    'incompatible',
    'test_failed',
    'disabled_by_policy',
  ]),
  riskLevel: z.enum(['low', 'medium', 'high']),
  type: z.enum(['mcp', 'native', 'builtin']),
  installed: z.boolean(),
  config: extensionConfigSchema,
  capabilities: z.array(extensionCapabilitySchema),
  version: z.string().optional(),
  updatedAt: z.string().optional(),
});
