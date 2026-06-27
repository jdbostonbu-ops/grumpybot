import { prisma } from '@/lib/prisma';
import { EmbedChat } from '@/components/EmbedChat';
import { DEFAULT_THEME } from '@/lib/embed-themes';

type EmbedPageProps = {
  params: Promise<{ botId: string }>;
};

const EmbedPage = async (props: EmbedPageProps): Promise<React.ReactElement> => {
  const { botId } = await props.params;

  const bot = await prisma.bot.findFirst({
    where: { OR: [{ slug: botId }, { id: botId }] },
    select: {
      id: true,
      name: true,
      themeBackground: true,
      themeText: true,
      themeAccent: true,
    },
  });

  if (bot === null) {
    return (
      <div className="embed-page">
        <p className="embed-page__missing">This bot could not be found.</p>
      </div>
    );
  }

  const themeStyle = {
    '--embed-bg': bot.themeBackground ?? DEFAULT_THEME.background,
    '--embed-text': bot.themeText ?? DEFAULT_THEME.text,
    '--embed-accent': bot.themeAccent ?? DEFAULT_THEME.accent,
  } as React.CSSProperties;

  return (
    <div className="embed-page" style={themeStyle}>
      <EmbedChat botId={bot.id} />
    </div>
  );
};

export default EmbedPage;
