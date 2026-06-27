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
      <NavBar userId={userId} />
      <main>
        <section className="hero hero--pink">
          <div className="hero__inner">
            <p className="hero__eyebrow">For cohort students · no RAG required</p>
            <h1 className="hero__title">
              Add a working AI chatbot to your project — before you&apos;ve learned how to build one.
            </h1>
            <p className="hero__lead">
              Built for cohort students, Vibe Fridays, and portfolio projects.
              Upload your project&apos;s docs, get an embeddable bot, paste it on your landing page.
            </p>
            <div className="hero__actions">
              <Link href="/dashboard" className="btn btn--dark">
                Build my bot
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

          <h2 className="section-title">Built by cohort students like you</h2>
          <p className="section-sub">
            every Vibe Friday project gets richer with a Q&amp;A bot grounded in its own content
          </p>
          <div className="biz-grid">
            <div className="biz-card biz-card--teal">
              <span className="biz-card__icon">📚</span>
              <h3 className="biz-card__name">Study Buddy</h3>
              <p className="biz-card__meta">class notes · syllabus</p>
            </div>
            <div className="biz-card biz-card--red">
              <span className="biz-card__icon">🍳</span>
              <h3 className="biz-card__name">Recipe Box</h3>
              <p className="biz-card__meta">cookbook · weeknight ideas</p>
            </div>
            <div className="biz-card biz-card--navy">
              <span className="biz-card__icon">🌀</span>
              <h3 className="biz-card__name">Weird Stuff</h3>
              <p className="biz-card__meta">curated oddities · portfolio party trick</p>
            </div>
            <div className="biz-card biz-card--purple">
              <span className="biz-card__icon">☕</span>
              <h3 className="biz-card__name">The Grumpy Bean</h3>
              <p className="biz-card__meta">coffee shop · 28 rules</p>
            </div>
            <div className="biz-card biz-card--pink">
              <span className="biz-card__icon">🎒</span>
              <h3 className="biz-card__name">Survival Guide</h3>
              <p className="biz-card__meta">freshman year · FAQ</p>
            </div>
            <div className="biz-card biz-card--green">
              <span className="biz-card__icon">📜</span>
              <h3 className="biz-card__name">Fictional World Lore</h3>
              <p className="biz-card__meta">main characters · old war</p>
            </div>
          </div>
        </div>

        <section className="band band--yellow">
          <div className="band__inner">
            <h2>Ready to ship your next project?</h2>
            <p>Your first bot in under 5 minutes. Built for portfolios, demos, and Vibe Fridays.</p>
            <Link href="/dashboard" className="btn btn--dark">
              Build my bot
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