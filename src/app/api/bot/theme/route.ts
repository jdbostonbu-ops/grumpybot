import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { bots } from '@/lib/bot';

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const isHex = (value: unknown): value is string =>
  typeof value === 'string' && HEX_PATTERN.test(value);

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

type BotUpdateData = {
  themeBackground?: string;
  themeText?: string;
  themeAccent?: string;
  streamingEnabled?: boolean;
};

export const PATCH = async (request: Request): Promise<NextResponse> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | {
        themeBackground?: unknown;
        themeText?: unknown;
        themeAccent?: unknown;
        streamingEnabled?: unknown;
      }
    | null;

  if (payload === null) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { themeBackground, themeText, themeAccent, streamingEnabled } = payload;
  const data: BotUpdateData = {};

  if (
    themeBackground !== undefined ||
    themeText !== undefined ||
    themeAccent !== undefined
  ) {
    if (!isHex(themeBackground) || !isHex(themeText) || !isHex(themeAccent)) {
      return NextResponse.json(
        { error: 'Each color must be a 6-digit hex value like #1a2b3c.' },
        { status: 400 },
      );
    }
    data.themeBackground = themeBackground;
    data.themeText = themeText;
    data.themeAccent = themeAccent;
  }

  if (streamingEnabled !== undefined) {
    if (!isBoolean(streamingEnabled)) {
      return NextResponse.json(
        { error: 'streamingEnabled must be true or false.' },
        { status: 400 },
      );
    }
    data.streamingEnabled = streamingEnabled;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
  }

  const bot = await bots.getOrCreateBotForUser(userId);
  const updated = await prisma.bot.update({
    where: { id: bot.id },
    data,
  });

  return NextResponse.json({
    themeBackground: updated.themeBackground,
    themeText: updated.themeText,
    themeAccent: updated.themeAccent,
    streamingEnabled: updated.streamingEnabled,
  });
};
