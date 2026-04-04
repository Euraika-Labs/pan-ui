import fs from 'node:fs';
import path from 'node:path';
import type { Profile } from '@/lib/types/profile';
import { getHermesHome, getProfileConfigPath } from '@/server/hermes/paths';
import { readYamlFile, writeYamlFile } from '@/server/hermes/yaml-config';

export function listRealProfiles(activeProfile: string | null | undefined): Profile[] {
  const hermesHome = getHermesHome();
  const profilesDir = path.join(hermesHome, 'profiles');
  const names = ['default'];
  if (fs.existsSync(profilesDir)) {
    for (const entry of fs.readdirSync(profilesDir, { withFileTypes: true })) {
      if (entry.isDirectory()) names.push(entry.name);
    }
  }
  return names.map((name) => {
    const config = readYamlFile<{ model?: { default?: string }; ui_policy_preset?: Profile['policyPreset'] }>(getProfileConfigPath(name));
    return {
      id: name,
      name,
      modelDefault: config.model?.default,
      policyPreset: config.ui_policy_preset || 'safe-chat',
      active: name === (activeProfile || 'default'),
    } satisfies Profile;
  });
}

export function updateRealProfilePolicy(profileId: string, policyPreset: NonNullable<Profile['policyPreset']>) {
  const configPath = getProfileConfigPath(profileId);
  const config = readYamlFile<Record<string, unknown>>(configPath);
  config.ui_policy_preset = policyPreset;
  writeYamlFile(configPath, config);
}
