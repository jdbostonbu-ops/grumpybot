import { prisma } from '@/lib/prisma';
import { rag } from '@/lib/rag';

type AskBody = {
  botId?: unknown;
  question?: unknown;
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

  if (botId === '') {
    return Response.json({ error: 'Missing bot id.' }, { status: 400 });
  }
  if (question === '') {
    return Response.json({ error: 'Enter a question.' }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: { OR: [{ slug: botId }, { id: botId }] },
    select: { id: true, streamingEnabled: true },
  });
  if (bot === null) {
    return Response.json({ error: 'Bot not found.' }, { status: 404 });
  }

  if (bot.streamingEnabled === true) {
    const { sources, stream } = await rag.streamAnswer(bot.id, question);
    return buildStreamResponse(sources, stream);
  }
  const result = await rag.answerQuestion(bot.id, question);
  return Response.json(result, { status: 200 });
}
