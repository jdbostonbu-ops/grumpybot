import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

const PricingPage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
    <div className="page">
      <NavBar />
      <main>
        <section className="hero hero--yellow">
          <div className="hero__inner">
            <h1 className="hero__title">Simple pricing. No surprises.</h1>
            <p className="hero__lead">Start free. Upgrade when your bot gets popular.</p>
          </div>
        </section>

        <div className="container">
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
                Start free
              </Link>
            </div>

            <div className="card price-card price-card--featured">
              <span className="price-card__badge">★ Most popular</span>
              <h3 className="price-card__name">Pro</h3>
              <p className="price-card__price">
                $19<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For real businesses.</p>
              <ul className="price-card__list">
                <li>Up to 5 bots</li>
                <li>Unlimited documents</li>
                <li>Embed on your site</li>
                <li>Custom colors</li>
                <li>Priority support</li>
              </ul>
              <Link href="/dashboard" className="btn btn--primary price-card__cta">
                Get Pro
              </Link>
            </div>

            <div className="card price-card">
              <h3 className="price-card__name">Business</h3>
              <p className="price-card__price">
                $49<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For teams &amp; chains.</p>
              <ul className="price-card__list">
                <li>Unlimited bots</li>
                <li>Team accounts</li>
                <li>Remove branding</li>
                <li>Priority support</li>
              </ul>
              <Link href="/dashboard" className="btn btn--dark price-card__cta">
                Contact us
              </Link>
            </div>
          </div>
          <p className="pricing-note">
            All plans include grounded answers, source citations, and the
            no-making-stuff-up guarantee. Multiple bots and team features are on the
            roadmap; today every account includes one fully working bot.
          </p>
        </div>

        <footer className="band band--navy">
          <div className="band__inner">
            GrumpyBot · turn any document into a bot · made with ☕ and AI
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PricingPage;