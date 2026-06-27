import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

const HowItWorksPage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
    <div className="page">
      <NavBar userId={userId} />
      <main>
        <section className="hero hero--green">
          <div className="hero__inner">
            <h1 className="hero__title">From documents to a bot in 3 steps.</h1>
            <p className="hero__lead">No code. No training. No nonsense.</p>
          </div>
        </section>

        <div className="container-wide">
          <div className="step-list">
            <div className="card step">
              <span className="feature__badge feature__badge--yellow">1</span>
              <div className="step__body">
                <h3>Upload your documents</h3>
                <p>
                  Drop in whatever your business runs on — handbook, menu,
                  policies, FAQs. We accept .md, .txt, and .json. The Grumpy Bean
                  uploaded its rulebook; you upload yours.
                </p>
              </div>
            </div>

            <div className="card step">
              <span className="feature__badge feature__badge--teal">2</span>
              <div className="step__body">
                <h3>We build your bot automatically</h3>
                <p>
                  Your documents get split into searchable pieces and indexed in
                  seconds. When someone asks a question, the bot finds the most
                  relevant pieces and answers using only those — so it never makes
                  things up.
                </p>
              </div>
            </div>

            <div className="card step">
              <span className="feature__badge feature__badge--pink">3</span>
              <div className="step__body">
                <h3>Share it with the world</h3>
                <p>
                  Get a link or embed the chat right on your website. Customers ask
                  questions and get instant, accurate answers — with the source
                  shown, so they know it&apos;s legit.
                </p>
              </div>
            </div>
          </div>

          <div className="callout">
            <h2 className="callout__title">The best part: it only knows what you tell it</h2>
            <p className="callout__text">
              Your bot answers from your project docs and nothing else. If the
              answer isn&apos;t in what you uploaded, it says &quot;I could not find it in
              the documents&quot; instead of making something up. No hallucinations,
              no off-topic answers — perfect for portfolios where you want visitors
              to learn about your work.
            </p>
          </div>
        </div>

        <section className="band band--yellow">
          <div className="band__inner">
            <h2>See it in action</h2>
            <p className="band__sub">Don&apos;t want to use excessive tokens building a RAG? Don&apos;t know how to yet?</p>
            <Link href="/examples" className="btn btn--dark">
              Try the Grumpy Bean example
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

export default HowItWorksPage;