import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/session-cookie';

// Layer 1 of protection: the gatekeeper at the door.
// Every route except the auth pages and Next.js internals requires a session
// cookie. A logged-out user typing ANY protected URL is redirected to /login.
//
// NOTE: middleware runs on the Edge runtime, so it does a lightweight check for
// the presence of the session cookie. The cryptographic verification + the
// database-backed check happen server-side in pages/route handlers (layer 2).

const PUBLIC_PATHS = ['/login', '/signup', '/verify', '/reset-request', '/reset-confirm', '/embed'];

const isPublic = (pathname: string): boolean =>
  PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

export const middleware = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

// Match everything except API routes, static files, and Next internals.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
