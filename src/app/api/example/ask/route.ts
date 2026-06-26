import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { rag } from '@/lib/rag';

type AskBody = {
  question?: unknown;
};

// Powers the Examples page chat. Always answers from the seeded Grumpy Bean bot,
// regardless of who is logged in, so the showcase is consistent. Still requires
// a session (every page is gated per PLAN.md).
export async function POST(request: Request): Promise<Response> {
  const userId = await getSessionUserId();
  if (userId === null) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as AskBody | null;
  const question = typeof body?.question === 'string' ? body.question.trim() : '';

  if (question === '') {
    return Response.json({ error: 'Enter a question.' }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: { name: 'The Grumpy Bean' },
    orderBy: { createdAt: 'asc' },
  });

  if (bot === null) {
    return Response.json(
      { error: 'The Grumpy Bean example is not available.' },
      { status: 404 },
    );
  }

  const result = await rag.answerQuestion(bot.id, question);
  return Response.json(result, { status: 200 });
}