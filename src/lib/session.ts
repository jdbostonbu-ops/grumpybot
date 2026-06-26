import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { SESSION_COOKIE_NAME } from '@/lib/session-cookie';

// A small, dependency-free signed-cookie session.
// The cookie value is `${userId}.${signature}` where the signature is an HMAC
// of the userId using SESSION_SECRET. We can therefore trust the userId in the
// cookie without a database lookup, while still being tamper-proof.

const COOKIE_NAME = SESSION_COOKIE_NAME;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const sign = (value: string): string =>
  createHmac('sha256', env.sessionSecret).update(value).digest('hex');

const safeEqual = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
};

export const createSession = async (userId: string): Promise<void> => {
  const value = `${userId}.${sign(userId)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
};

export const clearSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
};

// Returns the signed-in user's id, or null if there is no valid session.
export const getSessionUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (raw === undefined) {
    return null;
  }
  const separator = raw.lastIndexOf('.');
  if (separator === -1) {
    return null;
  }
  const userId = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  if (!safeEqual(signature, sign(userId))) {
    return null;
  }
  return userId;
};


