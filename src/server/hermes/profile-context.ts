import path from 'node:path';
import { getConfiguredHermesHome } from '@/server/hermes/paths';

export function detectHermesActiveProfileFromHome() {
  const hermesHome = getConfiguredHermesHome();
  const normalized = path.normalize(hermesHome);
  const marker = `${path.sep}profiles${path.sep}`;
  const index = normalized.lastIndexOf(marker);
  if (index === -1) {
    return 'default';
  }
  return normalized.slice(index + marker.length).split(path.sep)[0] || 'default';
}

export function describeHermesProfileContext(profileId?: string | null) {
  const activeProfile = detectHermesActiveProfileFromHome();
  const requestedProfile = profileId || activeProfile;
  return {
    requestedProfile,
    activeProfile,
    usingRequestedProfile: requestedProfile === activeProfile,
    label: requestedProfile === activeProfile ? `${requestedProfile} · active runtime profile` : `${requestedProfile} · requested via WebUI`,
  };
}
