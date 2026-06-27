'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { Spinner } from '@/components/Spinner';
import { PasswordField } from '@/components/PasswordField';

const SignupPage = (): React.ReactElement => {
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(data?.error ?? 'Could not create your account. Please try again.');
        setIsSubmitting(false);
        return;
      }

      router.push(`/verify?email=${encodeURIComponent(emailValue)}`);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <NavBar />
      <main>
        <section className="hero hero--yellow">
          <div className="hero__inner">
            <h1 className="hero__title">Create your account.</h1>
            <p className="hero__lead">Sign up to build a bot from your own documents.</p>
          </div>
        </section>
        <div className="narrow">
          <form className="card" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <div className="field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <PasswordField
              id="signup-password"
              name="password"
              label="Password"
              autoComplete="new-password"
            />
            {errorMessage ? <p className="error">{errorMessage}</p> : null}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create account'}
              </button>
              {isSubmitting ? <Spinner /> : null}
            </span>
          </form>
          <p style={{ marginTop: '1rem' }}>
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;