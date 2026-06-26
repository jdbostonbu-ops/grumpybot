import { prisma } from '@/lib/prisma';

// One bot per account (per PLAN.md). This returns the user's bot, creating it
// the first time it is needed so a brand-new account always has somewhere to
// upload documents.
const getOrCreateBotForUser = async (userId: string): Promise<{ id: string; name: string }> => {
  const existing = await prisma.bot.findFirst({ where: { ownerId: userId } });
  if (existing !== null) {
    return { id: existing.id, name: existing.name };
  }

  const created = await prisma.bot.create({
    data: { name: 'My bot', theme: 'playful', ownerId: userId },
  });
  return { id: created.id, name: created.name };
};

export const bots = {
  getOrCreateBotForUser,
};