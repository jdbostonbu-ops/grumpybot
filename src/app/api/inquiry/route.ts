import { NextResponse } from 'next/server';
import { email } from '@/lib/email';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const asString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

export const POST = async (request: Request): Promise<NextResponse> => {
  const payload = (await request.json().catch(() => null)) as
    | {
        name?: unknown;
        email?: unknown;
        phone?: unknown;
        ragType?: unknown;
        audience?: unknown;
        project?: unknown;
        goals?: unknown;
        deadline?: unknown;
      }
    | null;

  if (payload === null) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (
    !isNonEmptyString(payload.name) ||
    !isNonEmptyString(payload.email) ||
    !isNonEmptyString(payload.ragType) ||
    !isNonEmptyString(payload.audience) ||
    !isNonEmptyString(payload.project) ||
    !isNonEmptyString(payload.goals)
  ) {
    return NextResponse.json(
      { error: 'Please fill in all required fields.' },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });
  }

  try {
    await email.sendInquiry({
      name: payload.name,
      email: payload.email,
      phone: asString(payload.phone),
      ragType: payload.ragType,
      audience: payload.audience,
      project: payload.project,
      goals: payload.goals,
      deadline: asString(payload.deadline),
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not send right now. Try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
};
