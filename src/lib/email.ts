import sgMail from '@sendgrid/mail';
import { env } from '@/lib/env';

let configured = false;

const getClient = (): typeof sgMail => {
  if (!configured) {
    sgMail.setApiKey(env.sendgridApiKey);
    configured = true;
  }
  return sgMail;
};

const sendCodeEmail = async (
  to: string,
  subject: string,
  heading: string,
  code: string,
): Promise<void> => {
  await getClient().send({
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
      'Verify your GrumpyBot account',
      'Welcome to GrumpyBot! Use the code below to verify your email.',
      code,
    );
  },
  sendResetCode: async (to: string, code: string): Promise<void> => {
    await sendCodeEmail(
      to,
      'Reset your GrumpyBot password',
      'Use the code below to reset your password.',
      code,
    );
  },
};
