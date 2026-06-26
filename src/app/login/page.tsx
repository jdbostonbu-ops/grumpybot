'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { PasswordField } from '@/components/PasswordField';
import { Spinner } from '@/components/Spinner';

const LoginPage = (): React.ReactElement => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const emailValue = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, password }),
      });

      if (response.ok) {
        router.push('/dashboard');
        return;
      }

      const data = (await response.json().catch(() => null)) as
        | { error?: string; needsVerification?: boolean }
        | null;

      if (data?.needsVerification) {
        router.push(`/verify?email=${encodeURIComponent(emailValue)}`);
        return;
      }

      setErrorMessage(data?.error ?? 'Could not log in. Please try again.');
      setIsSubmitting(false);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <NavBar />
      <main className="narrow">
        <h1>Log in</h1>
        <p>Welcome back. Log in to manage your bot.</p>
        <form className="card" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <PasswordField
            id="login-password"
            name="password"
            label="Password"
            autoComplete="current-password"
          />
          {errorMessage ? <p className="error">{errorMessage}</p> : null}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
            {isSubmitting ? <Spinner /> : null}
          </span>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
        <p>
          <Link href="/reset-request">Forgot password?</Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;