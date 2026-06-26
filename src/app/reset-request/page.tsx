'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { Spinner } from '@/components/Spinner';

const ResetRequestPage = (): React.ReactElement => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const emailValue = String(formData.get('email') ?? '');

    try {
      const response = await fetch('/api/auth/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(data?.error ?? 'Could not send a reset code. Please try again.');
        setIsSubmitting(false);
        return;
      }

      router.push(`/reset-confirm?email=${encodeURIComponent(emailValue)}`);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <NavBar />
      <main className="narrow">
        <h1>Reset your password</h1>
        <p>Enter your email and we&apos;ll send you a reset code.</p>
        <form className="card" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <div className="field">
            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          {errorMessage ? <p className="error">{errorMessage}</p> : null}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send reset code'}
            </button>
            {isSubmitting ? <Spinner /> : null}
          </span>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Remembered it? <Link href="/login">Back to log in</Link>
        </p>
      </main>
    </div>
  );
};

export default ResetRequestPage;