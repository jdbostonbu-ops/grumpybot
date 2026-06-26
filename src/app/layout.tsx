import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HandbookBot',
  description: 'Turn your handbook into a bot anyone can ask.',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
