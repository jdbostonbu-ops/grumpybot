import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

const CheckoutCancelPage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
    <div className="page">
      <NavBar userId={userId} />
      <main>
        <section className="hero hero--yellow">
          <div className="hero__inner">
            <h1 className="hero__title">No worries!</h1>
            <p className="hero__lead">
              You cancelled the test checkout — no real money would have moved anyway, this is sandbox mode.
              Take another look at the plans whenever you&apos;re ready.
            </p>
            <Link href="/pricing" className="btn btn--primary">
              Back to pricing →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CheckoutCancelPage;