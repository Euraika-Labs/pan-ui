import { describe, expect, it } from 'vitest';
import { createSession, getSession } from '@/server/chat/session-store';
import {
  disableSkill,
  enableSkill,
  getSkill,
  installSkill,
  listSkills,
  loadSkillIntoSession,
  uninstallSkill,
  updateSkillContent,
} from '@/server/skills/skill-store';

describe('skill store', () => {
  it('lists skills and returns details', () => {
    const skills = listSkills();
    expect(skills.length).toBeGreaterThan(0);
    expect(getSkill(skills[0].id)?.id).toBe(skills[0].id);
  });

  it('installs, enables, updates, and uninstalls skills', () => {
    const installed = installSkill('mcp-operator');
    expect(installed.installed).toBe(true);

    const enabled = enableSkill('mcp-operator');
    expect(enabled.enabled).toBe(true);

    const updated = updateSkillContent('mcp-operator', '# Updated');
    expect(updated.content).toBe('# Updated');

    const disabled = disableSkill('mcp-operator');
    expect(disabled.enabled).toBe(false);

    const uninstalled = uninstallSkill('mcp-operator');
    expect(uninstalled.installed).toBe(false);
  });

  it('loads a skill into a session', () => {
    const session = createSession();
    const skill = loadSkillIntoSession('writing-plans', session.id);
    expect(skill.loadedInSessions).toContain(session.id);
    expect(getSession(session.id)?.loadedSkillIds).toContain('writing-plans');
  });
});
