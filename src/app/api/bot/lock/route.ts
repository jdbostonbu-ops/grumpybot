import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { bots } from '@/lib/bot';
import { canonicalizeEmbedUrl } from '@/lib/embed-url';
import { signEmbedToken } from '@/lib/embed-token';

type LockBody = {
  url?: unknown;
};

export async function PATCH(request: Request): Promise<Response> {
  const userId = await getSessionUserId();
  if (userId === null) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as LockBody | null;
  const rawUrl = typeof body?.url === 'string' ? body.url : '';

  const canonical = canonicalizeEmbedUrl(rawUrl);
  if (canonical === null) {
    return Response.json(
      { error: 'Enter the full https:// address of the page where your bot will live.' },
      { status: 400 },
    );
  }

  const bot = await bots.getOrCreateBotForUser(userId);
  const current = await prisma.bot.findUnique({
    where: { id: bot.id },
    select: { lockedOrigin: true },
  });

  if (current !== null && current.lockedOrigin !== null) {
    return Response.json(
      { error: 'This bot is already locked. Release it first to change the URL.' },
      { status: 409 },
    );
  }

const updated = await prisma.bot.update({
    where: { id: bot.id },
    data: { lockedOrigin: canonical },
    select: { lockedOrigin: true },
  });

  const token = signEmbedToken({
    botId: bot.id,
    lockedOrigin: canonical,
  });

  return Response.json(
    { ok: true, lockedOrigin: updated.lockedOrigin, token },
    { status: 200 },
  );
}

export async function DELETE(): Promise<Response> {
  const userId = await getSessionUserId();
  if (userId === null) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const bot = await bots.getOrCreateBotForUser(userId);
  await prisma.bot.update({
    where: { id: bot.id },
    data: { lockedOrigin: null },
    select: { id: true },
  });

  return Response.json({ ok: true, lockedOrigin: null }, { status: 200 });
}