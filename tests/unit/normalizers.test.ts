import { describe, expect, it } from 'vitest';
import { normalizeExtensions, normalizeSkills, normalizeToolInventory } from '@/lib/api/normalizers';

describe('API normalizers', () => {
  it('normalizes skill inventory metadata', () => {
    const skills = normalizeSkills([{ id: 'skill', name: 'Skill', description: 'Desc', source: 'local', scope: 'profile', provenance: 'custom', installed: true, enabled: true, content: '# Skill' }]);
    expect(skills[0].scope).toBe('profile');
  });

  it('normalizes extension inventory and tools', () => {
    const extensions = normalizeExtensions([{ id: 'ext', name: 'Ext', description: 'Desc', health: 'healthy', riskLevel: 'read', authState: 'connected', governance: 'enabled', provenance: 'custom', approvalPolicy: 'auto', type: 'mcp', installed: true, config: {}, capabilities: [], toolCount: 0, profilesUsing: ['default'] }]);
    const tools = normalizeToolInventory([{ id: 'ext:tool', name: 'tool', sourceExtensionId: 'ext', sourceExtensionName: 'Ext', category: 'mcp', riskLevel: 'read', enabled: true, approvalPolicy: 'auto', scope: 'profile' }]);
    expect(extensions[0].profilesUsing).toContain('default');
    expect(tools[0].sourceExtensionName).toBe('Ext');
  });
});