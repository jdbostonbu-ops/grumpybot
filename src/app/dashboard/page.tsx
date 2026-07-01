import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { bots } from '@/lib/bot';
import { NavBar } from '@/components/NavBar';
import { headers } from 'next/headers';
import { DashboardClient } from '@/components/DashboardClient';

// Layer 2 protection: re-verify the session server-side before rendering.
const DashboardPage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({ where: { id: userId },
  select: { subscriptionTier: true }, });
  if (user === null) {
    redirect('/login');
  }

  if (user.subscriptionTier === null) {
  redirect('/pricing');
}

  const ownedBot = await bots.getOrCreateBotForUser(userId);
  const bot = await prisma.bot.findUniqueOrThrow({
    where: { id: ownedBot.id },
    select: {
      id: true,
      name: true,
      slug: true,
      themeBackground: true,
      themeText: true,
      themeAccent: true,
      streamingEnabled: true,
      lockedOrigin: true,
    },
  });
  const documents = await prisma.document.findMany({
    where: { botId: bot.id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, filename: true },
  });

  const chunkCount = await prisma.chunk.count({
    where: { document: { botId: bot.id } },
  });

  const headerList = await headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const embedHandle = bot.slug ?? bot.id;
  const embedUrl = `${protocol}://${host}/embed/${embedHandle}`;

  return (
    <div className="page">
      <NavBar userId={userId} />
      <DashboardClient
        botName={bot.name}
        botId={bot.id}
        initialSlug={bot.slug ?? ''}
        embedUrl={embedUrl}
        initialDocs={documents}
        initialChunkCount={chunkCount}
        initialTheme={{
          background: bot.themeBackground,
          text: bot.themeText,
          accent: bot.themeAccent,
        }}
        initialStreamingEnabled={bot.streamingEnabled}
        initialLockedOrigin={bot.lockedOrigin}
      />
    </div>
  );
};

export default DashboardPage;
