import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { email } from '@/lib/email';

type ResetRequestBody = {
  email?: unknown;
};

const RESET_CODE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as ResetRequestBody | null;
  const emailValue = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (emailValue === '' || !emailValue.includes('@')) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: emailValue } });

  if (user !== null) {
    const resetCode = auth.generateCode();
    const resetCodeExpires = new Date(Date.now() + RESET_CODE_TTL_MS);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetCode, resetCodeExpires },
    });
    await email.sendResetCode(emailValue, resetCode);
  }

  return Response.json({ ok: true }, { status: 200 });
}