import { prisma } from '@/lib/prisma';
import { rag } from '@/lib/rag';

type AskBody = {
  botId?: unknown;
  question?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as AskBody | null;

  const botId = typeof body?.botId === 'string' ? body.botId.trim() : '';
  const question = typeof body?.question === 'string' ? body.question.trim() : '';

  if (botId === '') {
    return Response.json({ error: 'Missing bot id.' }, { status: 400 });
  }
  if (question === '') {
    return Response.json({ error: 'Enter a question.' }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: { OR: [{ slug: botId }, { id: botId }] },
    select: { id: true },
  });
  if (bot === null) {
    return Response.json({ error: 'Bot not found.' }, { status: 404 });
  }

  const result = await rag.answerQuestion(bot.id, question);
  return Response.json(result, { status: 200 });
}
