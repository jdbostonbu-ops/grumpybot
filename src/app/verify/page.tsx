'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { Spinner } from '@/components/Spinner';

const VerifyForm = (): React.ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const code = String(formData.get('code') ?? '');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromQuery, code }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(data?.error ?? 'Could not verify. Please try again.');
        setIsSubmitting(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="narrow">
      <h1>Check your email</h1>
      <p>We sent a 6-digit code to {emailFromQuery || 'your email'}. Enter it below.</p>
      <form className="card" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div className="field">
          <label htmlFor="verify-code">Verification code</label>
          <input
            id="verify-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
          />
        </div>
        {errorMessage ? <p className="error">{errorMessage}</p> : null}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying…' : 'Verify'}
          </button>
          {isSubmitting ? <Spinner /> : null}
        </span>
      </form>
    </main>
  );
};

const VerifyPage = (): React.ReactElement => (
  <div className="page">
    <NavBar />
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  </div>
);

export default VerifyPage;