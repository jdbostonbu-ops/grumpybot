import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

// Layer 2 protection: every page requires login (per PLAN.md, no public pages).
const PricingPage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
    <div className="page">
      <NavBar />
      <main>
        <section className="hero hero--compact">
          <div className="hero__inner">
            <p className="hero__eyebrow">Pricing</p>
            <h1 className="hero__title">Pick a plan and get grumpy.</h1>
            <p className="hero__lead">
              Start free, then grow as your bots do. Every plan keeps answers
              grounded in your own documents.
            </p>
          </div>
        </section>

        <section className="container">
          <div className="pricing-grid">
            <div className="card price-card">
              <h3 className="price-card__name">Starter</h3>
              <p className="price-card__price">
                $0<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For trying it out.</p>
              <ul className="price-card__list">
                <li>1 bot</li>
                <li>Up to 10 documents</li>
                <li>Grounded answers with sources</li>
                <li>Live preview</li>
              </ul>
              <Link href="/dashboard" className="btn btn--outline price-card__cta">
                Get started
              </Link>
            </div>

            <div className="card price-card price-card--featured">
              <span className="price-card__badge">Most popular</span>
              <h3 className="price-card__name">Pro</h3>
              <p className="price-card__price">
                $19<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For a growing business.</p>
              <ul className="price-card__list">
                <li>Up to 5 bots</li>
                <li>Unlimited documents</li>
                <li>Grounded answers with sources</li>
                <li>Live preview &amp; sharing</li>
                <li>Priority support</li>
              </ul>
              <Link href="/dashboard" className="btn btn--primary price-card__cta">
                Get started
              </Link>
            </div>

            <div className="card price-card">
              <h3 className="price-card__name">Business</h3>
              <p className="price-card__price">
                $49<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For the whole team.</p>
              <ul className="price-card__list">
                <li>Unlimited bots</li>
                <li>Unlimited documents</li>
                <li>Grounded answers with sources</li>
                <li>Team access</li>
                <li>Priority support</li>
              </ul>
              <Link href="/dashboard" className="btn btn--dark price-card__cta">
                Get started
              </Link>
            </div>
          </div>
          <p className="pricing-note">
            Multiple bots and team features are on the roadmap. Today every account
            includes one fully working bot.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PricingPage;