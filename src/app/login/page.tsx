import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { getAuthSession } from '@/server/auth/session';

export default async function LoginPage() {
  const session = await getAuthSession();
  if (session) {
    redirect('/chat');
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
      {/* Subtle Flow Gradient glow behind the card */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'var(--euraika-flow-gradient)' }} />

      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-elevated">
        <div className="mb-8">
          {/* Pan logo mark */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--euraika-flow-gradient)' }}>
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 8h20a14 14 0 0 1 0 28H24v20h-10V8Z" fill="#FEFFEF"/>
                <path d="M24 18h9a6 6 0 0 1 0 12h-9V18Z" fill="#073455" fillOpacity="0.3"/>
                <rect x="14" y="58" width="24" height="4" rx="2" fill="#E9C819"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Pan</h2>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">by Euraika</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your AI workspace.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
