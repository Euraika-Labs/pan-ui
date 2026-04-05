import fs from 'node:fs';
import path from 'node:path';
import type { Profile } from '@/lib/types/profile';
import { describeHermesProfileContext, detectHermesActiveProfileFromHome } from '@/server/hermes/profile-context';
import { listRealExtensions } from '@/server/hermes/real-extensions';
import { listRealSkills } from '@/server/hermes/real-skills';
import { getHermesHome, getProfileConfigPath, getProfileStateDb } from '@/server/hermes/paths';
import { readSqliteJson } from '@/server/hermes/sqlite-bridge';
import { readYamlFile, writeYamlFile } from '@/server/hermes/yaml-config';

function countRealSessions(profileId: string) {
  const dbPath = getProfileStateDb(profileId);
  if (!fs.existsSync(dbPath)) return 0;
  try {
    return readSqliteJson<number>(
      dbPath,
      "cur.execute('SELECT COUNT(*) FROM sessions')\nprint(json.dumps(cur.fetchone()[0]))",
    );
  } catch {
    return 0;
  }
}

export function listRealProfiles(activeProfile: string | null | undefined): Profile[] {
  const hermesHome = getHermesHome();
  const profilesDir = path.join(hermesHome, 'profiles');
  const detectedActive = detectHermesActiveProfileFromHome();
  const names = detectedActive ? [detectedActive] : [];
  if (fs.existsSync(profilesDir)) {
    for (const entry of fs.readdirSync(profilesDir, { withFileTypes: true })) {
      if (entry.isDirectory() && !names.includes(entry.name)) names.push(entry.name);
    }
  }
  return names.map((name) => {
    const config = readYamlFile<{ model?: { default?: string }; ui_policy_preset?: Profile['policyPreset'] }>(getProfileConfigPath(name));
    const sessionCount = countRealSessions(name);
    const skillCount = listRealSkills(name).length;
    const extensionCount = listRealExtensions(name).length;
    const profileContext = describeHermesProfileContext(name);
    const runtimeProvider = config.model?.default ? 'real-hermes' : 'unconfigured';
    const integrationsCount = extensionCount;
    return {
      id: name,
      name,
      modelDefault: config.model?.default,
      policyPreset: config.ui_policy_preset || 'safe-chat',
      sessionCount,
      skillCount,
      extensionCount,
      integrationsCount,
      runtimeProvider,
      runtimeSummary: `${config.model?.default || 'No default model'} · ${sessionCount} sessions · ${skillCount} skills`,
      trustMode: config.ui_policy_preset || 'safe-chat',
      runtimeHealth: config.model?.default ? 'healthy' : 'degraded',
      profileContextLabel: profileContext.label,
      active: name === (activeProfile || detectedActive),
    } satisfies Profile;
  });
}

export function updateRealProfilePolicy(profileId: string, policyPreset: NonNullable<Profile['policyPreset']>) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<Record<string, unknown>>(configPath);
  config.ui_policy_preset = policyPreset;
  writeYamlFile(configPath, config);
}
