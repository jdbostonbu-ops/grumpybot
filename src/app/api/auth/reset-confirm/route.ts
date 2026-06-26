import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type ResetConfirmBody = {
  email?: unknown;
  code?: unknown;
  password?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as ResetConfirmBody | null;

  const emailValue = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const code = typeof body?.code === 'string' ? body.code.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (emailValue === '' || code === '') {
    return Response.json({ error: 'Enter the code from your email.' }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email: emailValue } });

  if (
    user === null ||
    user.resetCode === null ||
    user.resetCode !== code ||
    user.resetCodeExpires === null ||
    user.resetCodeExpires.getTime() < Date.now()
  ) {
    return Response.json(
      { error: 'That code is not correct or has expired.' },
      { status: 400 },
    );
  }

  const passwordHash = await auth.hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetCode: null, resetCodeExpires: null },
  });

  return Response.json({ ok: true }, { status: 200 });
}