import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { getAuthSession } from '@/server/auth/session';

export default async function LoginPage() {
  const session = await getAuthSession();
  if (session) {
    redirect('/chat');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground">Hermes Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sprint 1 auth is a simple self-hosted login backed by environment variables.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
