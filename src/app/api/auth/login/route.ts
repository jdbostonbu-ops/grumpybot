import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createSession } from '@/lib/session';

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as LoginBody | null;

  const emailValue = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (emailValue === '' || password === '') {
    return Response.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: emailValue } });

  if (user === null) {
    return Response.json({ error: 'That email and password do not match.' }, { status: 401 });
  }

  const passwordOk = await auth.verifyPassword(password, user.passwordHash);
  if (!passwordOk) {
    return Response.json({ error: 'That email and password do not match.' }, { status: 401 });
  }

  if (!user.verified) {
    return Response.json({ needsVerification: true }, { status: 403 });
  }

  await createSession(user.id);
  return Response.json({ ok: true }, { status: 200 });
}