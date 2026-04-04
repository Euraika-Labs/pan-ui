import { describe, expect, it } from 'vitest';
import { addMcpExtension, getExtension, listExtensions, testExtension, updateCapability, updateExtension } from '@/server/extensions/extension-store';

describe('extension store', () => {
  it('lists seeded extensions', () => {
    const extensions = listExtensions();
    expect(extensions.length).toBeGreaterThan(0);
    expect(getExtension(extensions[0].id)?.id).toBe(extensions[0].id);
  });

  it('adds and updates an MCP extension', () => {
    const extension = addMcpExtension({
      name: 'Docs MCP',
      url: 'https://docs.example/mcp',
      authType: 'api-key',
      token: 'secret',
    });

    expect(extension.installed).toBe(true);
    expect(extension.type).toBe('mcp');

    const updated = updateExtension(extension.id, { command: 'npx docs-mcp' });
    expect(updated.config.command).toBe('npx docs-mcp');

    const tested = testExtension(extension.id);
    expect(tested.health).toBe('healthy');
  });

  it('updates extension capabilities', () => {
    const extension = listExtensions()[0];
    const capability = extension.capabilities[0];
    const updated = updateCapability(extension.id, capability.id, { enabled: !capability.enabled, scope: 'session' });
    const nextCapability = updated.capabilities.find((item) => item.id === capability.id);
    expect(nextCapability?.scope).toBe('session');
  });
});
