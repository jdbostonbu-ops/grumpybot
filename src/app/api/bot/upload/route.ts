import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { bots } from '@/lib/bot';
import { retrieval } from '@/lib/retrieval';

const MAX_BYTES = 1_000_000; // 1 MB cap for a demo upload
const ALLOWED_EXTENSIONS = ['md', 'txt', 'json'];

const extensionOf = (filename: string): string => {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot + 1).toLowerCase();
};

export async function POST(request: Request): Promise<Response> {
  const userId = await getSessionUserId();
  if (userId === null) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');

  if (!(file instanceof File)) {
    return Response.json({ error: 'No file was uploaded.' }, { status: 400 });
  }
  if (file.size === 0) {
    return Response.json({ error: 'That file is empty.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'That file is too large (max 1 MB).' }, { status: 400 });
  }
  if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) {
    return Response.json(
      { error: 'Please upload a .md, .txt, or .json file.' },
      { status: 400 },
    );
  }

  const content = await file.text();
  if (content.trim() === '') {
    return Response.json({ error: 'That file has no readable text.' }, { status: 400 });
  }

  const bot = await bots.getOrCreateBotForUser(userId);

  const document = await prisma.document.create({
    data: { filename: file.name, content, botId: bot.id },
  });

  const chunkCount = await retrieval.indexDocument(document.id, content);

  return Response.json(
    { ok: true, id: document.id, filename: file.name, chunks: chunkCount },
    { status: 201 },
  );
}