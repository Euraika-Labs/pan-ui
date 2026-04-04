import fs from 'node:fs';
import path from 'node:path';

export function getHermesHome() {
  return process.env.HERMES_HOME || path.join(process.env.HOME || '', '.hermes');
}

export function getProfileName(profileId: string | null | undefined) {
  if (!profileId || profileId === 'default') return 'default';
  return profileId;
}

export function getProfileRoot(profileId: string | null | undefined) {
  const hermesHome = getHermesHome();
  const profileName = getProfileName(profileId);
  return profileName === 'default' ? hermesHome : path.join(hermesHome, 'profiles', profileName);
}

export function getProfileStateDb(profileId: string | null | undefined) {
  return path.join(getProfileRoot(profileId), 'state.db');
}

export function getProfileMemoriesDir(profileId: string | null | undefined) {
  return path.join(getProfileRoot(profileId), 'memories');
}

export function getProfileSkillsDir(profileId: string | null | undefined) {
  return path.join(getProfileRoot(profileId), 'skills');
}

export function getProfileConfigPath(profileId: string | null | undefined) {
  return path.join(getProfileRoot(profileId), 'config.yaml');
}

export function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}
