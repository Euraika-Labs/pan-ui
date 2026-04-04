import crypto from 'node:crypto';
import type { Profile } from '@/lib/types/profile';
import { listExtensions } from '@/server/extensions/extension-store';
import { listSessions } from '@/server/chat/session-store';
import { listSkills } from '@/server/skills/skill-store';

const nowProfile = (name: string, policyPreset: Profile['policyPreset'], modelDefault: string): Profile => ({
  id: crypto.randomUUID(),
  name,
  policyPreset,
  modelDefault,
  sessionCount: listSessions().length,
  skillCount: listSkills({ installedOnly: true }).length,
  extensionCount: listExtensions().length,
  active: false,
});

declare global {
  // eslint-disable-next-line no-var
  var __hermesWorkspaceProfiles: Profile[] | undefined;
}

const seedProfiles: Profile[] = [
  { ...nowProfile('default', 'safe-chat', 'Hermes 3 405B'), active: true },
  { ...nowProfile('builder', 'builder', 'Hermes Fast'), active: false },
];

const profiles = globalThis.__hermesWorkspaceProfiles ?? seedProfiles;
globalThis.__hermesWorkspaceProfiles = profiles;

export function listProfiles() {
  return profiles;
}

export function createProfile(name: string, policyPreset: Profile['policyPreset'] = 'safe-chat') {
  const profile = nowProfile(name, policyPreset, 'Hermes 3 405B');
  profiles.push(profile);
  return profile;
}

export function cloneProfile(profileId: string) {
  const source = getRequiredProfile(profileId);
  const cloned = {
    ...source,
    id: crypto.randomUUID(),
    name: `${source.name} copy`,
    active: false,
  };
  profiles.push(cloned);
  return cloned;
}

export function deleteProfile(profileId: string) {
  const index = profiles.findIndex((profile) => profile.id === profileId);
  if (index === -1) throw new Error('Profile not found');
  const [deleted] = profiles.splice(index, 1);
  if (deleted.active && profiles[0]) {
    profiles.forEach((profile) => {
      profile.active = false;
    });
    profiles[0].active = true;
  }
  return deleted;
}

export function activateProfile(profileId: string) {
  profiles.forEach((profile) => {
    profile.active = profile.id === profileId;
  });
  return getRequiredProfile(profileId);
}

export function updateProfilePolicy(profileId: string, policyPreset: Profile['policyPreset']) {
  const profile = getRequiredProfile(profileId);
  profile.policyPreset = policyPreset;
  return profile;
}

function getRequiredProfile(profileId: string) {
  const profile = profiles.find((item) => item.id === profileId);
  if (!profile) throw new Error('Profile not found');
  return profile;
}
