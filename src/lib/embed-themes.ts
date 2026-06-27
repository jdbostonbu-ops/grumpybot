// Preset color themes for embeddable chat bots.
// Each preset stores three hex values that get injected into the embed page as
// CSS variables (--embed-bg, --embed-text, --embed-accent). If a bot has no
// theme set, the embed page falls back to the DEFAULT_THEME values below.

export type EmbedTheme = {
  readonly key: string;
  readonly label: string;
  readonly background: string;
  readonly text: string;
  readonly accent: string;
};

export const EMBED_THEMES: readonly EmbedTheme[] = [
  {
    key: 'default',
    label: 'Default',
    background: '#ffffff',
    text: '#2b2150',
    accent: '#6c4ad6',
  },
  {
    key: 'dark-code',
    label: 'Dark Code',
    background: '#131826',
    text: '#e2e8f0',
    accent: '#06b6d4',
  },
  {
    key: 'playful',
    label: 'Playful',
    background: '#fffbeb',
    text: '#2b2150',
    accent: '#ff5fa2',
  },
  {
    key: 'forest',
    label: 'Forest',
    background: '#f0f4ea',
    text: '#1a3d2e',
    accent: '#18b87b',
  },
  {
    key: 'ocean',
    label: 'Ocean',
    background: '#e1f0f5',
    text: '#0f3a52',
    accent: '#0891b2',
  },
  {
    key: 'teal',
    label: 'Teal',
    background: '#4ec3e0',
    text: '#fff4fa',
    accent: '#2b2150',
  },
];

export const DEFAULT_THEME: EmbedTheme = EMBED_THEMES[0]!;
