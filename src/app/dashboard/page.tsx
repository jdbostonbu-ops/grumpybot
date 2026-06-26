import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { bots } from '@/lib/bot';
import { NavBar } from '@/components/NavBar';
import { DashboardClient } from '@/components/DashboardClient';

// Layer 2 protection: re-verify session before rendering.
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

  const documentIds = documents.map((doc) => doc.id);
  const chunkCount =
    documentIds.length === 0
      ? 0
      : await prisma.chunk.count({ where: { documentId: { in: documentIds } } });

  return (
    <div className="page">
      <NavBar />
      <DashboardClient
        botId={bot.id}
        botName={bot.name}
        initialDocuments={documents}
        chunkCount={chunkCount}
      />
    </div>
  );
};

export default DashboardPage;