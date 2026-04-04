import path from 'node:path';
import { getHermesHome } from '@/server/hermes/paths';

export function detectHermesActiveProfileFromHome() {
  const hermesHome = getHermesHome();
  const normalized = path.normalize(hermesHome);
  const marker = `${path.sep}profiles${path.sep}`;
  const index = normalized.lastIndexOf(marker);
  if (index === -1) {
    return 'default';
  }
  return normalized.slice(index + marker.length).split(path.sep)[0] || 'default';
}
