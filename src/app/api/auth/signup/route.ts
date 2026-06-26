import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { email } from '@/lib/email';

type SignupBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as SignupBody | null;

  const emailValue = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (emailValue === '' || !emailValue.includes('@')) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: emailValue } });
  if (existing !== null && existing.verified) {
    return Response.json(
      { error: 'An account with this email already exists.' },
      { status: 409 },
    );
  }

  const passwordHash = await auth.hashPassword(password);
  const verificationCode = auth.generateCode();

  if (existing !== null) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, verificationCode, verified: false },
    });
  } else {
    await prisma.user.create({
      data: { email: emailValue, passwordHash, verificationCode, verified: false },
    });
  }

  await email.sendVerificationCode(emailValue, verificationCode);

  return Response.json({ ok: true }, { status: 201 });
}