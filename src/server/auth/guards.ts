import { redirect } from 'next/navigation';
import { getAuthSession } from '@/server/auth/session';

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== 'admin') {
    redirect('/chat');
  }
  return session;
}
