import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { NavBar } from '@/components/NavBar';

const CheckoutSuccessPage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });

  if (user === null || user.subscriptionTier === null) {
    redirect('/pricing');
  }

  return (
    <div className="page">
      <NavBar userId={userId} />
      <main>
        <section className="hero hero--yellow">
          <div className="hero__inner">
            <h1 className="hero__title">Thanks for the test payment!</h1>
            <p className="hero__lead">
              No real money moved — this is sandbox mode — but your plan is now active and your bot is ready to build.
            </p>
            <Link href="/dashboard" className="btn btn--primary">
              Open dashboard →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CheckoutSuccessPage;