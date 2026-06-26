import Link from 'next/link';
import Image from 'next/image';

// The GrumpyBot top nav. Appears on every page for consistency.
export const NavBar = (): React.ReactElement => (
  <nav className="nav">
    <Link href="/" className="nav__brand">
      <Image
        src="/grumpybot-logo.svg"
        alt="GrumpyBot logo"
        width={40}
        height={40}
        priority
      />
      GrumpyBot
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