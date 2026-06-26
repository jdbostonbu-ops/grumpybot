'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { PasswordField } from '@/components/PasswordField';
import { Spinner } from '@/components/Spinner';

const ResetConfirmForm = (): React.ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') ?? '';

  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const code = String(formData.get('code') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const response = await fetch('/api/auth/reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromQuery, code, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(data?.error ?? 'Could not reset your password. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setNoticeMessage('Password updated. Redirecting to log in…');
      setTimeout(() => router.push('/login'), 1200);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="narrow">
      <h1>Enter your reset code</h1>
      <p>
        We sent a code to {emailFromQuery || 'your email'}. Enter it with your new
        password.
      </p>
      <form className="card" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div className="field">
          <label htmlFor="reset-code">Reset code</label>
          <input
            id="reset-code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
          />
        </div>
        <PasswordField
          id="reset-new-password"
          name="password"
          label="New password"
          autoComplete="new-password"
        />
        {errorMessage ? <p className="error">{errorMessage}</p> : null}
        {noticeMessage ? <p className="notice">{noticeMessage}</p> : null}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </button>
          {isSubmitting ? <Spinner /> : null}
        </span>
      </form>
      <p style={{ marginTop: '1rem' }}>
        <Link href="/login">Back to log in</Link>
      </p>
    </main>
  );
};

const ResetConfirmPage = (): React.ReactElement => (
  <div className="page">
    <NavBar />
    <Suspense fallback={null}>
      <ResetConfirmForm />
    </Suspense>
  </div>
);

export default ResetConfirmPage;