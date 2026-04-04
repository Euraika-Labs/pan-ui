import { cookies } from 'next/headers';

export const PROFILE_COOKIE_NAME = 'hermes_workspace_profile';

export async function getSelectedProfileFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(PROFILE_COOKIE_NAME)?.value ?? 'default';
}
