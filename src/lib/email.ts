import { Resend } from 'resend';
import { env } from '@/lib/env';

let resend: Resend | undefined;

const getResend = (): Resend => {
  if (resend === undefined) {
    resend = new Resend(env.resendApiKey);
  }
  return resend;
};

const sendCodeEmail = async (
  to: string,
  subject: string,
  heading: string,
  code: string,
): Promise<void> => {
  await getResend().emails.send({
    from: env.emailFrom,
    to,
    subject,
    text: `${heading}\n\nYour code is: ${code}\n\nIf you did not request this, you can ignore this email.`,
  });
};

export const email = {
  sendVerificationCode: async (to: string, code: string): Promise<void> => {
    await sendCodeEmail(
      to,
      'Verify your HandbookBot account',
      'Welcome to HandbookBot! Use the code below to verify your email.',
      code,
    );
  },
  sendResetCode: async (to: string, code: string): Promise<void> => {
    await sendCodeEmail(
      to,
      'Reset your HandbookBot password',
      'Use the code below to reset your password.',
      code,
    );
  },
};
