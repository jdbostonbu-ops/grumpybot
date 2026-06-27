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

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user === null) {
    redirect('/login');
  }

  const bot = await bots.getOrCreateBotForUser(userId);

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
  const embedUrl = `${protocol}://${host}/embed/${bot.id}`;

  return (
    <div className="page">
      <NavBar />
      <DashboardClient
        botName={bot.name}
        botId={bot.id}
        embedUrl={embedUrl}
        initialDocs={documents}
        initialChunkCount={chunkCount}
      />
    </div>
  );
};

export default DashboardPage;
