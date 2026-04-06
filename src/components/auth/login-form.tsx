'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? 'Unable to sign in');
      setIsSubmitting(false);
      return;
    }

    router.push('/chat');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label htmlFor="username" className="block space-y-1.5 text-sm">
        <span>Username</span>
        <input
          id="username"
          name="username"
          defaultValue="admin"
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none ring-0 transition focus:border-primary"
        />
      </label>
      <label htmlFor="password" className="block space-y-1.5 text-sm">
        <span>Password</span>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 outline-none ring-0 transition focus:border-primary"
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Signing in…' : 'Continue'}
      </button>
    </form>
  );
}
