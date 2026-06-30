'use client';

import { useState } from 'react';

type Plan = 'starter' | 'student' | 'business';

type PricingCTAProps = {
  plan: Plan;
  className: string;
  label: string;
};

export const PricingCTA = ({ plan, className, label }: PricingCTAProps): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        setErrorMessage('Could not start checkout. Please try again.');
        setIsLoading(false);
        return;
      }

      const data = (await response.json().catch(() => null)) as { url?: unknown } | null;
      if (data === null || typeof data.url !== 'string') {
        setErrorMessage('Could not start checkout. Please try again.');
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setErrorMessage('Could not start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? <span className="pricing-cta-spinner" aria-label="Loading" /> : label}
      </button>
      {errorMessage !== null ? (
        <p className="pricing-cta-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
};