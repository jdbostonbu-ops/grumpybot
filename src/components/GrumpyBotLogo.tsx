/**
 * GrumpyBot mascot — inlined SVG.
 *
 * IMPORTANT: this component duplicates the SVG source from
 * public/grumpybot-logo.svg intentionally. Inlining avoids the middleware
 * auth redirect that intercepts /grumpybot-logo.svg for unauthenticated
 * requests (which is every request from a public embed page).
 *
 * If the logo design ever changes, update BOTH this component AND the
 * public/grumpybot-logo.svg file so they stay in sync.
 */

type GrumpyBotLogoProps = {
  readonly size?: number;
  readonly className?: string;
};

export const GrumpyBotLogo = (props: GrumpyBotLogoProps): React.ReactElement => {
  const size = props.size ?? 96;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GrumpyBot logo"
      className={props.className}
    >
      <title>GrumpyBot</title>
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#4ec3e0" />
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="22"
        fill="none"
        stroke="#2b2150"
        strokeWidth="4"
      />
      <path
        d="M22 26 H72 a11 11 0 0 1 11 11 V62 a11 11 0 0 1 -11 11 H46 l-12 13 v-13 H22 a11 11 0 0 1 -11 -11 V37 a11 11 0 0 1 11 -11 Z"
        fill="#ff5fa2"
        stroke="#2b2150"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <line
        x1="27"
        y1="40"
        x2="41"
        y2="44"
        stroke="#2b2150"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="69"
        y1="40"
        x2="55"
        y2="44"
        stroke="#2b2150"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="37" cy="51" r="5" fill="#ffd84d" stroke="#2b2150" strokeWidth="3" />
      <circle cx="61" cy="51" r="5" fill="#ffd84d" stroke="#2b2150" strokeWidth="3" />
      <path
        d="M38 65 Q49 58 60 65"
        fill="none"
        stroke="#2b2150"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};