import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { bots } from '@/lib/bot';

type SlugBody = {
  slug?: unknown;
};

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export async function PATCH(request: Request): Promise<Response> {
  const userId = await getSessionUserId();
  if (userId === null) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SlugBody | null;
  const slug = typeof body?.slug === 'string' ? body.slug.trim().toLowerCase() : '';

  if (slug === '') {
    return Response.json({ error: 'Enter a slug.' }, { status: 400 });
  }
  if (!SLUG_PATTERN.test(slug)) {
    return Response.json(
      { error: 'Use lowercase letters, numbers, and hyphens only (2-40 characters).' },
      { status: 400 },
    );
  }

  const bot = await bots.getOrCreateBotForUser(userId);

  const existing = await prisma.bot.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing !== null && existing.id !== bot.id) {
    return Response.json({ error: 'That slug is already taken.' }, { status: 409 });
  }

  const updated = await prisma.bot.update({
    where: { id: bot.id },
    data: { slug },
    select: { id: true, slug: true },
  });

  return Response.json({ ok: true, slug: updated.slug }, { status: 200 });
}
