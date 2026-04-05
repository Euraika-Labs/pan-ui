import { execFileSync } from 'node:child_process';

function runHermes(args: string[]): { ok: boolean; error?: string } {
  try {
    execFileSync('hermes', args, { encoding: 'utf-8', timeout: 15000 });
    return { ok: true };
  } catch (err: unknown) {
    // execFileSync puts stderr/stdout in err.stderr/err.stdout
    const e = err as { stderr?: string; stdout?: string; message?: string };
    const combined = [e.stderr, e.stdout, e.message].filter(Boolean).join('\n');
    // Look for "Error: ..." line from the CLI
    const match = combined.match(/Error:\s*(.+)/);
    if (match) return { ok: false, error: match[1].replace(/\s+at\s+\/.*$/, '').trim() };
    return { ok: false, error: combined.slice(0, 200) };
  }
}

export function createRealProfile(name: string, _policyPreset: 'safe-chat' | 'research' | 'builder' | 'full-power' = 'safe-chat') {
  const result = runHermes(['profile', 'create', name]);
  if (!result.ok) throw new Error(result.error ?? 'Failed to create profile');
  return { id: name, name, policyPreset: _policyPreset };
}

export function cloneRealProfile(profileId: string) {
  const cloneName = `${profileId}-copy`;
  const result = runHermes(['profile', 'create', cloneName, '--clone-from', profileId, '--clone-all', '--no-alias']);
  if (!result.ok) throw new Error(result.error ?? 'Failed to clone profile');
  return { id: cloneName, name: cloneName };
}

export function deleteRealProfile(profileId: string) {
  const result = runHermes(['profile', 'delete', profileId, '-y']);
  if (!result.ok) throw new Error(result.error ?? 'Failed to delete profile');
}

export function activateRealProfile(profileId: string) {
  const result = runHermes(['profile', 'use', profileId]);
  if (!result.ok) throw new Error(result.error ?? 'Failed to activate profile');
}
