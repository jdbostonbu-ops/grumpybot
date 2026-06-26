import Link from 'next/link';

// The HandbookBot top nav. Appears on every page for consistency.
// Links are placeholders for the pages built in later steps.
export const NavBar = (): React.ReactElement => (
  <nav className="nav">
    <Link href="/" className="nav__brand">
      <span className="nav__logo" aria-hidden="true">
        H
      </span>
      HandbookBot
    </Link>
    <div className="nav__links">
      <Link href="/how-it-works">How it works</Link>
      <Link href="/examples">Examples</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href="/dashboard" className="btn btn--primary">
        Get started
      </Link>
    </div>
  </nav>
);
