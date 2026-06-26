import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

// Layer 2 protection: every page requires login (per PLAN.md, no public pages).
const HomePage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
    <div className="page">
      <NavBar />
      <main>
        <section className="hero">
          <div className="hero__inner">
            <p className="hero__eyebrow">Grumpy on the outside. Helpful on the inside.</p>
            <h1 className="hero__title">
              Turn your handbook into a bot anyone can ask.
            </h1>
            <p className="hero__lead">
              Upload your documents and GrumpyBot builds you a chatbot that answers
              questions using only what is in them — with the receipts to prove it.
            </p>
            <div className="hero__actions">
              <Link href="/dashboard" className="btn btn--primary">
                Get started
              </Link>
              <Link href="/examples" className="btn btn--outline">
                See an example
              </Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="feature-grid">
            <div className="card feature">
              <span className="feature__badge feature__badge--pink">1</span>
              <h3>Upload your docs</h3>
              <p>
                Drop in your handbook, menu, FAQ — markdown, text, or JSON. Your
                words, your rules.
              </p>
            </div>
            <div className="card feature">
              <span className="feature__badge feature__badge--teal">2</span>
              <h3>We build your bot</h3>
              <p>
                GrumpyBot reads and indexes everything so it can find the right
                answer fast.
              </p>
            </div>
            <div className="card feature">
              <span className="feature__badge feature__badge--yellow">3</span>
              <h3>Answers, grounded</h3>
              <p>
                Every reply comes only from your documents, with the sources shown.
                No making things up.
              </p>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="cta card">
            <h2>Ready to make your own grumpy little helper?</h2>
            <p>It only takes a few minutes to go from documents to a working bot.</p>
            <Link href="/dashboard" className="btn btn--dark">
              Build my bot
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
