import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

const HomePage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
    <div className="page">
      <NavBar />
      <main>
        <section className="hero hero--pink">
          <div className="hero__inner">
            <p className="hero__eyebrow">For any business · no code needed</p>
            <h1 className="hero__title">
              Turn your handbook into a bot anyone can ask.
            </h1>
            <p className="hero__lead">
              Upload your policies, menu, FAQs, or rules. We build you a chatbot
              that answers customers — using only your documents.
            </p>
            <div className="hero__actions">
              <Link href="/dashboard" className="btn btn--dark">
                Build my bot — free
              </Link>
              <Link href="/examples" className="btn btn--outline">
                See an example
              </Link>
            </div>
          </div>
        </section>

        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="feature-grid">
            <div className="card feature feature--center">
              <span className="icon-circle icon-circle--yellow">⬆</span>
              <h3>1. Upload</h3>
              <p>Drop in your handbook, menu, or FAQ files.</p>
            </div>
            <div className="card feature feature--center">
              <span className="icon-circle icon-circle--teal">✦</span>
              <h3>2. We build it</h3>
              <p>Your bot learns your docs in seconds.</p>
            </div>
            <div className="card feature feature--center">
              <span className="icon-circle icon-circle--green">↗</span>
              <h3>3. Share</h3>
              <p>Add it to your site or share a link.</p>
            </div>
          </div>

          <h2 className="section-title">Businesses already using it</h2>
          <p className="section-sub">
            every bot answers only from that business&apos;s own documents
          </p>
          <div className="biz-grid">
            <div className="biz-card biz-card--purple">
              <span className="biz-card__icon">☕</span>
              <h3 className="biz-card__name">The Grumpy Bean</h3>
              <p className="biz-card__meta">coffee shop · 28 rules</p>
            </div>
            <div className="biz-card biz-card--pink">
              <span className="biz-card__icon">🐾</span>
              <h3 className="biz-card__name">Happy Tails Rescue</h3>
              <p className="biz-card__meta">adoption policies · FAQ</p>
            </div>
            <div className="biz-card biz-card--green">
              <span className="biz-card__icon">🔧</span>
              <h3 className="biz-card__name">Riddle &amp; Wrench</h3>
              <p className="biz-card__meta">auto repair · service guide</p>
            </div>
          </div>
        </div>

        <section className="band band--yellow">
          <div className="band__inner">
            <h2>Ready to build yours?</h2>
            <p>Free to start. No credit card. Your first bot in under 5 minutes.</p>
            <Link href="/dashboard" className="btn btn--dark">
              Build my bot — free
            </Link>
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

export default HomePage;