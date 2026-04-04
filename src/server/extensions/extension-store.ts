import crypto from 'node:crypto';
import type { Extension, ExtensionCapability, ExtensionConfig, ExtensionHealth } from '@/lib/types/extension';

const nowIso = () => new Date().toISOString();

function defaultCapabilities(): ExtensionCapability[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'search_docs',
      description: 'Read extension-provided documentation and help content.',
      enabled: true,
      riskLevel: 'low',
      scope: 'profile',
    },
    {
      id: crypto.randomUUID(),
      name: 'execute_remote_action',
      description: 'Perform remote MCP-backed actions against third-party systems.',
      enabled: false,
      riskLevel: 'high',
      scope: 'session',
    },
  ];
}

function seedExtensions(): Extension[] {
  return [
    {
      id: 'filesystem-mcp',
      name: 'filesystem-mcp',
      description: 'Browse and manage local project files through an MCP server.',
      health: 'healthy',
      riskLevel: 'medium',
      type: 'mcp',
      installed: true,
      config: { command: 'npx @modelcontextprotocol/server-filesystem /opt/projects', authType: 'none' },
      capabilities: defaultCapabilities(),
      version: '1.0.0',
      updatedAt: nowIso(),
    },
    {
      id: 'github-mcp',
      name: 'github-mcp',
      description: 'Interact with GitHub repositories, issues, and pull requests.',
      health: 'needs_configuration',
      riskLevel: 'high',
      type: 'mcp',
      installed: true,
      config: { url: 'https://mcp.github.example', authType: 'api-key' },
      capabilities: [
        {
          id: crypto.randomUUID(),
          name: 'read_issues',
          description: 'Read issue and pull request metadata.',
          enabled: true,
          riskLevel: 'low',
          scope: 'profile',
        },
        {
          id: crypto.randomUUID(),
          name: 'write_repo',
          description: 'Create issues or update repository content.',
          enabled: false,
          riskLevel: 'high',
          scope: 'session',
        },
      ],
      version: '0.9.0',
      updatedAt: nowIso(),
    },
    {
      id: 'browser-automation',
      name: 'browser-automation',
      description: 'Built-in browser automation connector for Hermes tools.',
      health: 'healthy',
      riskLevel: 'medium',
      type: 'builtin',
      installed: true,
      config: { authType: 'none' },
      capabilities: [
        {
          id: crypto.randomUUID(),
          name: 'browser_open',
          description: 'Open pages and inspect browser content.',
          enabled: true,
          riskLevel: 'low',
          scope: 'profile',
        },
      ],
      version: '1.0.0',
      updatedAt: nowIso(),
    },
  ];
}

declare global {
  // eslint-disable-next-line no-var
  var __hermesWorkspaceExtensions: Map<string, Extension> | undefined;
}

const seeded = seedExtensions();
const extensions = globalThis.__hermesWorkspaceExtensions ?? new Map(seeded.map((extension) => [extension.id, extension]));
globalThis.__hermesWorkspaceExtensions = extensions;

export function listExtensions() {
  return Array.from(extensions.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getExtension(extensionId: string) {
  return extensions.get(extensionId) ?? null;
}

export function addMcpExtension({ name, command, url, authType, token }: { name: string; command?: string; url?: string; authType?: 'none' | 'api-key' | 'oauth'; token?: string }) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const extension: Extension = {
    id,
    name,
    description: 'User-added MCP server connection.',
    health: command || url ? 'needs_configuration' : 'test_failed',
    riskLevel: 'medium',
    type: 'mcp',
    installed: true,
    config: {
      command,
      url,
      authType,
      token,
    },
    capabilities: defaultCapabilities(),
    version: '0.1.0',
    updatedAt: nowIso(),
  };
  extensions.set(extension.id, extension);
  return extension;
}

export function updateExtension(extensionId: string, patch: Partial<ExtensionConfig>) {
  const extension = getRequiredExtension(extensionId);
  const updated: Extension = {
    ...extension,
    config: {
      ...extension.config,
      ...patch,
    },
    updatedAt: nowIso(),
  };
  extensions.set(updated.id, updated);
  return updated;
}

export function testExtension(extensionId: string) {
  const extension = getRequiredExtension(extensionId);
  const nextHealth: ExtensionHealth = extension.config.command || extension.config.url ? 'healthy' : 'test_failed';
  const updated = {
    ...extension,
    health: nextHealth,
    updatedAt: nowIso(),
  };
  extensions.set(updated.id, updated);
  return updated;
}

export function updateCapability(extensionId: string, capabilityId: string, patch: Partial<ExtensionCapability>) {
  const extension = getRequiredExtension(extensionId);
  const updated: Extension = {
    ...extension,
    capabilities: extension.capabilities.map((capability) =>
      capability.id === capabilityId ? { ...capability, ...patch } : capability,
    ),
    updatedAt: nowIso(),
  };
  extensions.set(updated.id, updated);
  return updated;
}

function getRequiredExtension(extensionId: string) {
  const extension = extensions.get(extensionId);
  if (!extension) {
    throw new Error('Extension not found');
  }
  return extension;
}
