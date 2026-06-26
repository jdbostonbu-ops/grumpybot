import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { NavBar } from '@/components/NavBar';
import { LogoutButton } from '@/components/LogoutButton';

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

  return (
    <div className="page">
      <NavBar />
      <main className="container">
        <h1>Your bot is live 🎉</h1>
        <p>Signed in as {user.email}.</p>
        <p>
          This is a placeholder dashboard. Document upload and bot preview are
          built next.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LogoutButton />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;