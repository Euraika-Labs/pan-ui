import { execFileSync } from 'node:child_process';

export function createRealProfile(name: string, policyPreset: 'safe-chat' | 'research' | 'builder' | 'full-power' = 'safe-chat') {
  execFileSync('hermes', ['profile', 'create', name], { encoding: 'utf-8' });
  return { id: name, name, policyPreset };
}

export function cloneRealProfile(profileId: string) {
  const cloneName = `${profileId}-copy`;
  execFileSync('hermes', ['profile', 'create', cloneName, '--clone-from', profileId, '--clone-all', '--no-alias'], { encoding: 'utf-8' });
  return { id: cloneName, name: cloneName };
}

export function deleteRealProfile(profileId: string) {
  execFileSync('hermes', ['profile', 'delete', profileId, '-y'], { encoding: 'utf-8' });
}

export function activateRealProfile(profileId: string) {
  execFileSync('hermes', ['profile', 'use', profileId], { encoding: 'utf-8' });
}
