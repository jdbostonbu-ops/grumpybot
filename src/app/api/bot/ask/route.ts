import { getSessionUserId } from '@/lib/session';
import { bots } from '@/lib/bot';
import { rag } from '@/lib/rag';

type AskBody = {
  question?: unknown;
};

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

  const bot = await bots.getOrCreateBotForUser(userId);
  const result = await rag.answerQuestion(bot.id, question);

  return Response.json(result, { status: 200 });
}