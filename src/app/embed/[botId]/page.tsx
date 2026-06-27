import { prisma } from '@/lib/prisma';
import { EmbedChat } from '@/components/EmbedChat';
import { DEFAULT_THEME, EMBED_THEMES } from '@/lib/embed-themes';

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

  const background = bot.themeBackground ?? DEFAULT_THEME.background;
  const text = bot.themeText ?? DEFAULT_THEME.text;
  const accent = bot.themeAccent ?? DEFAULT_THEME.accent;
  const matchingPreset = EMBED_THEMES.find(
    (preset) =>
      preset.background === background &&
      preset.text === text &&
      preset.accent === accent,
  );
  const botBubble = matchingPreset?.botBubble ?? DEFAULT_THEME.botBubble;

  const themeStyle = {
    '--embed-bg': background,
    '--embed-text': text,
    '--embed-accent': accent,
    '--embed-bot-bubble': botBubble,
  } as React.CSSProperties;

  return (
    <div className="embed-page" style={themeStyle}>
      <EmbedChat botId={bot.id} />
    </div>
  );
};

export default EmbedPage;
