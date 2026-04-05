import { cookies } from 'next/headers';
import { describeHermesProfileContext, detectHermesActiveProfileFromHome } from '@/server/hermes/profile-context';

export const PROFILE_COOKIE_NAME = 'hermes_workspace_profile';

export async function getSelectedProfileFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(PROFILE_COOKIE_NAME)?.value ?? detectHermesActiveProfileFromHome();
}

export async function getSelectedProfileContextFromCookie() {
  const selectedProfile = await getSelectedProfileFromCookie();
  return describeHermesProfileContext(selectedProfile);
}
