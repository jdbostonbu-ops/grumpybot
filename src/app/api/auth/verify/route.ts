import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';

type VerifyBody = {
  email?: unknown;
  code?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as VerifyBody | null;

  const emailValue = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';

  if (emailValue === '' || code === '') {
    return Response.json({ error: 'Enter the code from your email.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: emailValue } });
  if (user === null || user.verificationCode === null || user.verificationCode !== code) {
    return Response.json({ error: 'That code is not correct.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verificationCode: null },
  });

  await createSession(user.id);

  return Response.json({ ok: true }, { status: 200 });
}