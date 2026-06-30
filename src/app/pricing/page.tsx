import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';
import { PricingCTA } from '@/components/PricingCTA';

const PricingPage = async (): Promise<React.ReactElement> => {
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
            <h1 className="hero__title">Simple pricing.<br />No surprises.</h1>
            <p className="hero__lead">AI chatbots that only know what you teach them. From $5.</p>
          </div>
        </section>

        <div className="container-wide">
          <div className="pricing-grid">
            <div className="card price-card">
              <h3 className="price-card__name">Starter</h3>
              <p className="price-card__price">
                $5<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For trying it out.</p>
              <ul className="price-card__list">
                <li>1 bot</li>
                <li>500 messages</li>
                <li>$3 per 1,000</li>
                <li>5 documents</li>
                <li>Shareable link</li>
                <li>Custom colors</li>
              </ul>
              <PricingCTA plan="starter" className="btn btn--outline price-card__cta" label="Start with Starter" />
            </div>

            <div className="card price-card price-card--featured">
              <span className="price-card__badge">★ Most popular</span>
              <h3 className="price-card__name">Student</h3>
              <p className="price-card__price">
                $10<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For cohort students with portfolio projects.</p>
              <ul className="price-card__list">
                <li>7 bots</li>
                <li>5,000 messages</li>
                <li>$3 per 1,000</li>
                <li>Unlimited documents</li>
                <li>Embed on your site</li>
                <li>Custom colors</li>
              </ul>
              <PricingCTA plan="student" className="btn btn--primary price-card__cta" label="Go Student" />
            </div>

            <div className="card price-card">
              <h3 className="price-card__name">Business</h3>
              <p className="price-card__price">
                $49<span className="price-card__per">/mo</span>
              </p>
              <p className="price-card__tagline">For instructors, small teams, anyone past school.</p>
              <ul className="price-card__list">
                <li>100 bots</li>
                <li>Team accounts</li>
                <li>50,000 messages</li>
                <li>$3 per 1,000</li>
                <li>Custom colors</li>
                <li>Priority support</li>
              </ul>
              <PricingCTA plan="business" className="btn btn--dark price-card__cta" label="Get Business" />
            </div>
          </div>
          <p className="pricing-note">
            All plans include source citations and the
            no-making-stuff-up guarantee. Additional messages are $3 per 1,000.
          </p>
        </div>

        <section className="band pricing-disclosures">
          <div className="pricing-disclosures__inner">
            <h2>What you should know</h2>
            <p>
              <strong>Cancellation and refunds.</strong> You can cancel anytime from your account settings. Cancellation
              takes effect at the end of your current billing cycle, and you keep access through the end of the cycle
              you&apos;ve already paid for. Payments for started billing cycles are non-refundable. Annual plans and
              school packages have their own terms outlined at signing.
            </p>
            <p>
              <strong>Bot permanence.</strong> Once you create a bot, it&apos;s permanent. You can edit a bot&apos;s documents
              and styling, but you can&apos;t delete it yourself — and we can&apos;t either, except in cases of terms-of-service
              violations or verified user removal requests sent to support@grumpybot.fyi. This protects every embed you
              ship: a bot on your portfolio site, college application, or client project won&apos;t break because someone
              deleted it.
            </p>
            <p>
              <strong>Content moderation.</strong> Every embedded bot is served from GrumpyBot&apos;s servers, which means
              we can disable inappropriate or off-policy content platform-wide at any time. Anyone — users, embed
              viewers, third parties — can report a bot using the report link in its iframe footer. Reports are reviewed
              by GrumpyBot administrators.
            </p>
            <p>
              <strong>Inactive bots.</strong> When your subscription ends, your bots stop serving immediately. Embeds
              return a &quot;this bot is no longer active&quot; message — your embed code doesn&apos;t need to change. Bot data is
              retained for 90 days in case you resubscribe and want to restore access. After 90 days, bot data is
              permanently deleted.
            </p>
            <p>
              <strong>Overage billing.</strong> If you go over your included messages in a month, additional usage is
              billed at $3 per 1,000 messages at the end of your billing cycle. Heavy use of your bot (for example,
              embedding it on a busy commercial site) may push you into overage; you can monitor usage in your dashboard.
            </p>
            <p>For full terms, see grumpybot.fyi/terms.</p>
          </div>
        </section>

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
