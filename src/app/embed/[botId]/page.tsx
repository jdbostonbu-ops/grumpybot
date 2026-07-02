import { headers } from 'next/headers';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { EmbedChat } from '@/components/EmbedChat';
import { DEFAULT_THEME, EMBED_THEMES } from '@/lib/embed-themes';
import { verifyEmbedToken } from '@/lib/embed-token';
import {
  extractRefererOrigin,
  isLocalhostOrigin,
  originsMatch,
} from '@/lib/embed-security';

type EmbedPageProps = {
  params: Promise<{ botId: string }>;
  searchParams: Promise<{ t?: string }>;
};

/**
 * Layer 3 enforcement result for the page route. Mirrors the shape used
 * by the ask API route, but with a third outcome for the localhost
 * placeholder — the API route rejects localhost, but the page serves
 * a static informational page instead of the bot.
 */
type PageEnforcementResult =
  | { outcome: 'allow'; token: string }
  | { outcome: 'localhost' }
  | {
      outcome: 'reject';
      logResult:
        | 'MISSING_TOKEN'
        | 'INVALID_TOKEN'
        | 'MISSING_REFERER'
        | 'WRONG_ORIGIN';
    };

/**
 * Closure-based enforcement check for the embed page. Captures the bot
 * id, its locked origin, the incoming token, and the Referer header.
 * Runs the same six rejection paths as the API route, but with a
 * separate 'localhost' outcome that triggers the placeholder page.
 * Never leaks lockedOrigin — the rejection page shows only a generic
 * message.
 */
const createPageEnforcementCheck = (
  botId: string,
  lockedOrigin: string | null,
  token: string,
  refererHeader: string | null,
): (() => PageEnforcementResult) => {
  return (): PageEnforcementResult => {
    if (lockedOrigin === null) {
      return { outcome: 'reject', logResult: 'WRONG_ORIGIN' };
    }

    if (token === '') {
      return { outcome: 'reject', logResult: 'MISSING_TOKEN' };
    }

    const payload = verifyEmbedToken(token);
    if (payload === null || payload.botId !== botId) {
      return { outcome: 'reject', logResult: 'INVALID_TOKEN' };
    }

    const refererOrigin = extractRefererOrigin(refererHeader);
    if (refererOrigin === null) {
      return { outcome: 'reject', logResult: 'MISSING_REFERER' };
    }

    if (isLocalhostOrigin(refererOrigin)) {
      return { outcome: 'localhost' };
    }

    if (!originsMatch(refererOrigin, payload.lockedOrigin)) {
      return { outcome: 'reject', logResult: 'WRONG_ORIGIN' };
    }

    return { outcome: 'allow', token };
  };
};

const logPageAttempt = async (
  botId: string,
  refererOrigin: string | null,
  result:
    | 'MISSING_TOKEN'
    | 'INVALID_TOKEN'
    | 'MISSING_REFERER'
    | 'WRONG_ORIGIN'
    | 'LOCALHOST_PLACEHOLDER',
): Promise<void> => {
  try {
    await prisma.embedAttempt.create({
      data: {
        botId,
        refererOrigin,
        result,
      },
    });
  } catch {
    // Logging must never break rendering.
  }
};

const EmbedPage = async (props: EmbedPageProps): Promise<React.ReactElement> => {
  const { botId } = await props.params;
  const { t } = await props.searchParams;
  const token = typeof t === 'string' ? t.trim() : '';

  const headerList = await headers();
  const refererHeader = headerList.get('referer');

  const bot = await prisma.bot.findFirst({
    where: { OR: [{ slug: botId }, { id: botId }] },
    select: {
      id: true,
      name: true,
      themeBackground: true,
      themeText: true,
      themeAccent: true,
      lockedOrigin: true,
    },
  });

  if (bot === null) {
    return (
      <div className="embed-page">
        <p className="embed-page__missing">This bot could not be found.</p>
      </div>
    );
  }

  // Theme computed here so both the localhost placeholder and the
  // working bot render with the owner's custom colors. The blocked
  // page deliberately does NOT use the theme — it's a platform
  // message, not a bot experience.
  const background = bot.themeBackground ?? DEFAULT_THEME.background;
  const text = bot.themeText ?? DEFAULT_THEME.text;
  const accent = bot.themeAccent ?? DEFAULT_THEME.accent;
  const matchingPreset = EMBED_THEMES.find(
    (preset) =>
      preset.background === background &&
      preset.text === text &&
      preset.accent === accent,
  );
  const botBubble = matchingPreset?.botBubble ?? DEFAULT_THEME.botBubble;
  const themeStyle = {
    '--embed-bg': background,
    '--embed-text': text,
    '--embed-accent': accent,
    '--embed-bot-bubble': botBubble,
  } as React.CSSProperties;

  const check = createPageEnforcementCheck(
    bot.id,
    bot.lockedOrigin,
    token,
    refererHeader,
  );
  const enforcement = check();

  if (enforcement.outcome === 'reject') {
    await logPageAttempt(
      bot.id,
      extractRefererOrigin(refererHeader),
      enforcement.logResult,
    );
    return (
      <div className="embed-blocked">
        <div className="embed-blocked__card">
          <Image
            src="/grumpybot-logo.svg"
            alt="GrumpyBot"
            width={96}
            height={96}
            className="embed-blocked__logo"
            priority
          />
          <h1 className="embed-blocked__title">Embed not allowed.</h1>
          <p className="embed-blocked__body">
            This bot is only available on the page it was locked to. If
            you&apos;re the owner, check your embed configuration at
            grumpybot.fyi.
          </p>
        </div>
      </div>
    );
  }

  if (enforcement.outcome === 'localhost') {
    await logPageAttempt(
      bot.id,
      extractRefererOrigin(refererHeader),
      'LOCALHOST_PLACEHOLDER',
    );
    return (
      <div className="embed-localhost" style={themeStyle}>
        <div className="embed-localhost__card">
          <Image
            src="/grumpybot-logo.svg"
            alt="GrumpyBot"
            width={128}
            height={128}
            className="embed-localhost__logo"
            priority
          />
          <h1 className="embed-localhost__title">
            You can&apos;t test GrumpyBot on localhost.
          </h1>
          <p className="embed-localhost__body">
            You can only style and resize the iframe from here. To see the
            embedded chatbot in action, either publish your project to your
            locked page, or test the bot directly at grumpybot.fyi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="embed-page" style={themeStyle}>
      <EmbedChat botId={bot.id} token={enforcement.token} />
    </div>
  );
};

export default EmbedPage;
