import { prisma } from '@/lib/prisma';
import { EmbedChat } from '@/components/EmbedChat';

type EmbedPageProps = {
  params: Promise<{ botId: string }>;
};

const EmbedPage = async (props: EmbedPageProps): Promise<React.ReactElement> => {
  const { botId } = await props.params;

  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    select: { id: true, name: true },
  });

  if (bot === null) {
    return (
      <div className="embed-page">
        <p className="embed-page__missing">This bot could not be found.</p>
      </div>
    );
  }

  return (
    <div className="embed-page">
      <EmbedChat botId={bot.id} />
    </div>
  );
};

export default EmbedPage;
