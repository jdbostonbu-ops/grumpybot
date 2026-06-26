import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const userId = await getSessionUserId();
  if (userId === null) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await context.params;
  if (typeof id !== 'string' || id === '') {
    return Response.json({ error: 'Missing document id.' }, { status: 400 });
  }

  const document = await prisma.document.findFirst({
    where: { id, bot: { ownerId: userId } },
  });
  if (document === null) {
    return Response.json({ error: 'Document not found.' }, { status: 404 });
  }

  const chunks = await prisma.chunk.count({
    where: { documentId: document.id },
  });

  await prisma.document.delete({ where: { id: document.id } });

  return Response.json({ ok: true, chunks }, { status: 200 });
}
