import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import type { Skill } from '@/lib/types/skill';
import { getHermesHome, getProfileConfigPath, getProfileSkillsDir, getProfileStateDb } from '@/server/hermes/paths';
import { readSqliteJson } from '@/server/hermes/sqlite-bridge';
import { readYamlFile, writeYamlFile } from '@/server/hermes/yaml-config';

type SkillsConfigShape = {
  skills?: {
    disabled?: string[];
    platform_disabled?: Record<string, string[]>;
  };
};

function collectSkillFiles(root: string, source: Skill['source']): Array<{ path: string; source: Skill['source'] }> {
  if (!fs.existsSync(root)) return [];
  const results: Array<{ path: string; source: Skill['source'] }> = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile() && entry.name === 'SKILL.md') results.push({ path: full, source });
    }
  };
  walk(root);
  return results;
}

function getDisabledSkills(profileId: string | null | undefined): Set<string> {
  const config = readYamlFile<SkillsConfigShape>(getProfileConfigPath(profileId));
  const globalDisabled = new Set(config.skills?.disabled || []);
  const platformDisabled = new Set(config.skills?.platform_disabled?.cli || []);
  return new Set([...globalDisabled, ...platformDisabled]);
}

function writeSkillEnabled(profileId: string | null | undefined, skillId: string, enabled: boolean) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<SkillsConfigShape>(configPath);
  config.skills = config.skills || {};
  const disabled = new Set(config.skills.disabled || []);
  const platformDisabled = new Set(config.skills.platform_disabled?.cli || []);
  if (enabled) {
    disabled.delete(skillId);
    platformDisabled.delete(skillId);
  } else {
    disabled.add(skillId);
    platformDisabled.add(skillId);
  }
  config.skills.disabled = Array.from(disabled).sort();
  config.skills.platform_disabled = config.skills.platform_disabled || {};
  config.skills.platform_disabled.cli = Array.from(platformDisabled).sort();
  writeYamlFile(configPath, config);
}

function parseSkill(filePath: string, source: Skill['source'], disabled: Set<string>): Skill {
  const content = fs.readFileSync(filePath, 'utf-8');
  const name = path.basename(path.dirname(filePath));
  const descriptionLine = content.split('\n').find((line) => line.toLowerCase().startsWith('description:'));
  return {
    id: name,
    name,
    description: descriptionLine ? descriptionLine.split(':').slice(1).join(':').trim() : 'Hermes skill',
    source,
    installed: true,
    enabled: !disabled.has(name),
    content,
    loadedInSessions: [],
  };
}

export function listRealSkills(profileId: string | null | undefined): Skill[] {
  const hermesHome = getHermesHome();
  const builtinsRoot = path.join(hermesHome, 'hermes-agent', 'skills');
  const globalRoot = path.join(hermesHome, 'skills');
  const profileRoot = getProfileSkillsDir(profileId);
  const disabled = getDisabledSkills(profileId);
  const files = [
    ...collectSkillFiles(builtinsRoot, 'bundled'),
    ...collectSkillFiles(globalRoot, 'local'),
    ...collectSkillFiles(profileRoot, 'local'),
  ];
  const seen = new Set<string>();
  const skills: Skill[] = [];
  for (const file of files) {
    const parsed = parseSkill(file.path, file.source, disabled);
    if (seen.has(parsed.id)) continue;
    seen.add(parsed.id);
    skills.push(parsed);
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export function getRealSkill(profileId: string | null | undefined, skillId: string): Skill | null {
  return listRealSkills(profileId).find((skill) => skill.id === skillId) || null;
}

export function updateRealSkill(profileId: string | null | undefined, skillId: string, content: string): Skill {
  const hermesHome = getHermesHome();
  const candidates = [
    path.join(getProfileSkillsDir(profileId), skillId, 'SKILL.md'),
    path.join(hermesHome, 'skills', skillId, 'SKILL.md'),
  ];
  const existing = candidates.find((filePath) => fs.existsSync(filePath));
  const target = existing || candidates[0];
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf-8');
  return getRealSkill(profileId, skillId)!;
}

export function installRealSkill(profileId: string | null | undefined, skillId: string): Skill {
  const builtins = path.join(getHermesHome(), 'hermes-agent', 'skills', skillId, 'SKILL.md');
  const target = path.join(getProfileSkillsDir(profileId), skillId, 'SKILL.md');
  if (fs.existsSync(builtins)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(builtins, target);
    return getRealSkill(profileId, skillId)!;
  }
  throw new Error('Real skill not found for install');
}

export function uninstallRealSkill(profileId: string | null | undefined, skillId: string) {
  const targetDir = path.join(getProfileSkillsDir(profileId), skillId);
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
    return true;
  }
  throw new Error('Installed real skill not found');
}

export function setRealSkillEnabled(profileId: string | null | undefined, skillId: string, enabled: boolean): Skill {
  const skill = getRealSkill(profileId, skillId);
  if (!skill) throw new Error('Real skill not found');
  writeSkillEnabled(profileId, skillId, enabled);
  return getRealSkill(profileId, skillId)!;
}

export function loadRealSkillIntoSession(profileId: string | null | undefined, sessionId: string, skillId: string) {
  execFileSync('hermes', ['skills', 'list'], { encoding: 'utf-8' });
  const dbPath = getProfileStateDb(profileId);
  if (!fs.existsSync(dbPath)) return skillId;
  readSqliteJson(
    dbPath,
    `import json\nsession_id=${JSON.stringify(sessionId)}\nskill_id=${JSON.stringify(skillId)}\ncur.execute("SELECT model_config FROM sessions WHERE id=?", (session_id,))\nr=cur.fetchone()\nif not r: print(json.dumps({'ok': False})); raise SystemExit\nconfig={}\nif r[0]:\n    try: config=json.loads(r[0]) or {}\n    except Exception: config={}\nloaded=config.get('loadedSkillIds', [])\nif skill_id not in loaded:\n    loaded.append(skill_id)\nconfig['loadedSkillIds']=loaded\ncur.execute("UPDATE sessions SET model_config=? WHERE id=?", (json.dumps(config), session_id))\nconn.commit()\nprint(json.dumps({'ok': True}))`,
  );
  return skillId;
}
