import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

// Layer 2 protection: every page requires login (per PLAN.md, no public pages).
const HowItWorksPage = async (): Promise<React.ReactElement> => {
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
            <p className="hero__eyebrow">How it works</p>
            <h1 className="hero__title">From documents to a bot in minutes.</h1>
            <p className="hero__lead">
              GrumpyBot reads your files, learns what is in them, and answers
              questions using only your words. Here is the whole journey.
            </p>
          </div>
        </section>

        <section className="container">
          <div className="step-list">
            <div className="card step">
              <span className="feature__badge feature__badge--pink">1</span>
              <div className="step__body">
                <h3>You upload your documents</h3>
                <p>
                  Add your handbook, menu, policies, or FAQ as markdown, plain
                  text, or JSON. GrumpyBot reads the text straight out of each
                  file — nothing else needed.
                </p>
              </div>
            </div>

            <div className="card step">
              <span className="feature__badge feature__badge--teal">2</span>
              <div className="step__body">
                <h3>We break them into pieces</h3>
                <p>
                  Each document is split into bite-sized chunks so the bot can
                  pinpoint the exact part that answers a question instead of
                  guessing from the whole thing.
                </p>
              </div>
            </div>

            <div className="card step">
              <span className="feature__badge feature__badge--yellow">3</span>
              <div className="step__body">
                <h3>We turn words into meaning</h3>
                <p>
                  Every chunk gets an embedding — a way of capturing what it means
                  — so the bot can match a question to the right passage even when
                  the wording is different.
                </p>
              </div>
            </div>

            <div className="card step">
              <span className="feature__badge feature__badge--pink">4</span>
              <div className="step__body">
                <h3>Someone asks a question</h3>
                <p>
                  GrumpyBot finds the closest matching chunks from your documents
                  and hands only those to the AI as the source material for its
                  answer.
                </p>
              </div>
            </div>

            <div className="card step">
              <span className="feature__badge feature__badge--teal">5</span>
              <div className="step__body">
                <h3>It answers — grounded, with sources</h3>
                <p>
                  The bot replies using only what it found in your documents, and
                  shows which files it used. If the answer is not in your
                  documents, it says so instead of making something up.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="cta card">
            <h2>That is the whole trick.</h2>
            <p>Upload your documents and watch your own grounded bot come to life.</p>
            <Link href="/dashboard" className="btn btn--dark">
              Build my bot
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;