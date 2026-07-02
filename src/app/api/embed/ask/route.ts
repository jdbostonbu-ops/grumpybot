import { prisma } from '@/lib/prisma';
import { rag } from '@/lib/rag';
import { verifyEmbedToken } from '@/lib/embed-token';
import {
  extractRefererOrigin,
  isLocalhostOrigin,
  originsMatch,
} from '@/lib/embed-security';

type AskBody = {
  botId?: unknown;
  question?: unknown;
  token?: unknown;
};

/**
 * Layer 3 enforcement result for a single request. Callers use the
 * `outcome` field to decide whether to serve the answer, and the
 * `logResult` field to write the correct AttemptResult enum value.
 */
type EnforcementResult =
  | { outcome: 'allow' }
  | {
      outcome: 'reject';
      status: number;
      body: { error: string };
      logResult:
        | 'MISSING_TOKEN'
        | 'INVALID_TOKEN'
        | 'MISSING_REFERER'
        | 'WRONG_ORIGIN'
        | 'LOCALHOST_PLACEHOLDER';
    };

/**
 * Closure-based enforcement check for the ask API route.
 * Captures the bot's id and locked origin, plus the token and Referer
 * from the current request. Returns an EnforcementResult the route
 * uses to either continue or reject. Never leaks lockedOrigin in the
 * response body — errors are intentionally generic.
 */
const createEnforcementCheck = (
  botId: string,
  lockedOrigin: string | null,
  token: string,
  refererHeader: string | null,
  apiOrigin: string,
): (() => EnforcementResult) => {
  return (): EnforcementResult => {
    // If the bot isn't locked yet, no embed traffic is allowed at all.
    // Owners must lock before the embed can accept messages.
    if (lockedOrigin === null) {
      return {
        outcome: 'reject',
        status: 403,
        body: { error: 'Embed not allowed.' },
        logResult: 'WRONG_ORIGIN',
      };
    }

    if (token === '') {
      return {
        outcome: 'reject',
        status: 403,
        body: { error: 'Embed not allowed.' },
        logResult: 'MISSING_TOKEN',
      };
    }

    const payload = verifyEmbedToken(token);
    if (payload === null || payload.botId !== botId) {
      return {
        outcome: 'reject',
        status: 403,
        body: { error: 'Embed not allowed.' },
        logResult: 'INVALID_TOKEN',
      };
    }

    const refererOrigin = extractRefererOrigin(refererHeader);
    if (refererOrigin === null) {
      return {
        outcome: 'reject',
        status: 403,
        body: { error: 'Embed not allowed.' },
        logResult: 'MISSING_REFERER',
      };
    }

    // Localhost never chats, ever. The placeholder page serves the
    // static informational HTML from GET /embed/[botSlug], but the
    // API endpoint always rejects localhost messages — belt and
    // suspenders per the design.
   // Localhost never chats, ever. The placeholder page serves the
    // static informational HTML from GET /embed/[botSlug], but the
    // API endpoint always rejects localhost messages — belt and
    // suspenders per the design.
    if (isLocalhostOrigin(refererOrigin)) {
      return {
        outcome: 'reject',
        status: 403,
        body: { error: 'Embed not allowed.' },
        logResult: 'LOCALHOST_PLACEHOLDER',
      };
    }

    // Legitimate iframe fetches send the iframe's own URL as the
    // Referer, not the parent page's URL. When the Referer origin
    // matches our own API origin, we allow the request — the token
    // signature has already verified the caller is a legitimate embed
    // for a specific lockedOrigin. The page-load GET check remains
    // the primary defense against URL republishing on attacker sites.
    if (originsMatch(refererOrigin, apiOrigin)) {
      return { outcome: 'allow' };
    }

    if (!originsMatch(refererOrigin, payload.lockedOrigin)) {
      return {
        outcome: 'reject',
        status: 403,
        body: { error: 'Embed not allowed.' },
        logResult: 'WRONG_ORIGIN',
      };
    }

    return { outcome: 'allow' };
  };
};

const logAttempt = async (
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
    // Logging must never break the response. If the DB write fails, we
    // still return the 403 the caller expects.
  }
};

const buildStreamResponse = (
  sources: string[],
  textStream: AsyncIterable<string>,
): Response => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(JSON.stringify({ sources }) + '\n'));
        for await (const chunk of textStream) {
          controller.enqueue(encoder.encode(JSON.stringify({ text: chunk }) + '\n'));
        }
        controller.enqueue(encoder.encode(JSON.stringify({ done: true }) + '\n'));
      } catch {
        controller.enqueue(
          encoder.encode(JSON.stringify({ error: 'Stream failed.' }) + '\n'),
        );
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
    },
  });
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as AskBody | null;
  const botId = typeof body?.botId === 'string' ? body.botId.trim() : '';
  const question = typeof body?.question === 'string' ? body.question.trim() : '';
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  const refererHeader = request.headers.get('referer');

  if (botId === '') {
    return Response.json({ error: 'Missing bot id.' }, { status: 400 });
  }
  if (question === '') {
    return Response.json({ error: 'Enter a question.' }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: { OR: [{ slug: botId }, { id: botId }] },
    select: { id: true, streamingEnabled: true, lockedOrigin: true },
  });
  if (bot === null) {
    return Response.json({ error: 'Bot not found.' }, { status: 404 });
  }

  const apiOrigin = new URL(request.url).origin;
  const check = createEnforcementCheck(
    bot.id,
    bot.lockedOrigin,
    token,
    refererHeader,
    apiOrigin,
  );
  const enforcement = check();

  if (enforcement.outcome === 'reject') {
    await logAttempt(
      bot.id,
      extractRefererOrigin(refererHeader),
      enforcement.logResult,
    );
    return Response.json(enforcement.body, { status: enforcement.status });
  }

  if (bot.streamingEnabled === true) {
    const { sources, stream } = await rag.streamAnswer(bot.id, question);
    return buildStreamResponse(sources, stream);
  }

  const result = await rag.answerQuestion(bot.id, question);
  return Response.json(result, { status: 200 });
}

