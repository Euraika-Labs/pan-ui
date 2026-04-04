import { cookies } from 'next/headers';
import { detectHermesActiveProfileFromHome } from '@/server/hermes/profile-context';

export const PROFILE_COOKIE_NAME = 'hermes_workspace_profile';

export async function getSelectedProfileFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(PROFILE_COOKIE_NAME)?.value ?? detectHermesActiveProfileFromHome();
}
