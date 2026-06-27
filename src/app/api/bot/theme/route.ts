import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { bots } from '@/lib/bot';

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const isHex = (value: unknown): value is string =>
  typeof value === 'string' && HEX_PATTERN.test(value);

export const PATCH = async (request: Request): Promise<NextResponse> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { themeBackground?: unknown; themeText?: unknown; themeAccent?: unknown }
    | null;

  if (payload === null) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { themeBackground, themeText, themeAccent } = payload;

  if (!isHex(themeBackground) || !isHex(themeText) || !isHex(themeAccent)) {
    return NextResponse.json(
      { error: 'Each color must be a 6-digit hex value like #1a2b3c.' },
      { status: 400 },
    );
  }

  const bot = await bots.getOrCreateBotForUser(userId);
  await prisma.bot.update({
    where: { id: bot.id },
    data: { themeBackground, themeText, themeAccent },
  });

  return NextResponse.json({ themeBackground, themeText, themeAccent });
};
