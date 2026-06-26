import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/session';
import { NavBar } from '@/components/NavBar';

// Layer 2 of protection: server-side session check inside the page itself.
// Even though middleware guards this route, the page re-verifies the session
// before rendering. Defense in depth.
const HomePage = async (): Promise<React.ReactElement> => {
  const userId = await getSessionUserId();
  if (userId === null) {
    redirect('/login');
  }

  return (
    <div className="page">
      <NavBar />
      <main className="container">
        <h1>HandbookBot</h1>
        <p>
          Starter scaffold is ready. Pages are built one at a time per the build
          order in PLAN.md.
        </p>
      </main>
    </div>
  );
};

export default HomePage;
