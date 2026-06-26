import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/session';
import { GrumpyBeanChat } from '@/components/GrumpyBeanChat';
import { NavBar } from '@/components/NavBar';

// Layer 2 protection: every page requires login (per PLAN.md).
const ExamplesPage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
     <>
      <NavBar />
    <div className="bean">
      <nav className="bean-nav">
        <span className="bean-nav__brand">☕ The Grumpy Bean</span>
        <div className="bean-nav__links">
          <span>Home</span>
          <span>Menu</span>
          <span>The Rules</span>
          <span className="bean-nav__active">Ask Us</span>
        </div>
      </nav>

      <section className="bean-hero">
        <p className="bean-hero__eyebrow">EST. WHENEVER · OPEN TIL WE&apos;RE TIRED</p>
        <h1 className="bean-hero__title">Coffee with a little attitude.</h1>
        <p className="bean-hero__sub">Great espresso. Absurd rules. Dogs drink free.</p>
      </section>

      <div className="bean-body">
        <h2 className="bean-section-title">☕ Today&apos;s pours</h2>
        <div className="bean-menu-grid">
          <div className="bean-menu-card">
            <h3>The Compliment Latte</h3>
            <p className="bean-menu-card__desc">served with a sincere compliment</p>
            <p className="bean-menu-card__price">$5</p>
          </div>
          <div className="bean-menu-card">
            <h3>Whisper Tuesday Brew</h3>
            <p className="bean-menu-card__desc">order quietly or get decaf</p>
            <p className="bean-menu-card__price">$4</p>
          </div>
          <div className="bean-menu-card">
            <h3>Pup Cup</h3>
            <p className="bean-menu-card__desc">for VIPs (Very Important Pups)</p>
            <p className="bean-menu-card__price bean-menu-card__price--free">Free</p>
          </div>
        </div>

        <h2 className="bean-section-title">⚠ House rules (yes, really)</h2>
        <div className="bean-rules">
          <div className="bean-rule bean-rule--purple">
            <strong>Rule 4 —</strong> Tuesdays are whisper-only. Speak up, get decaf.
          </div>
          <div className="bean-rule bean-rule--green">
            <strong>Rule 7 —</strong> Blueberry muffins outrank bran. Always.
          </div>
          <div className="bean-rule bean-rule--pink">
            <strong>Rule 12 —</strong> Dogs are automatic VIPs. Non-negotiable.
          </div>
        </div>
      </div>

      <section className="bean-ask">
        <h2 className="bean-ask__title">Ask the Handbook 🤖</h2>
        <p className="bean-ask__sub">
          Type a question — our grumpy bot answers using only the official rules.
        </p>
        <GrumpyBeanChat />
      </section>

      <footer className="bean-footer">
        The Grumpy Bean · 123 Espresso Lane · open til we&apos;re tired · dogs always
        welcome
      </footer>
    </div>
      </>
  );
};

export default ExamplesPage;