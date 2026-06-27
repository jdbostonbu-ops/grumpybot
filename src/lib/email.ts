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

type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  ragType: string;
  audience: string;
  project: string;
  goals: string;
  deadline: string;
};

const formatInquiryBody = (data: InquiryPayload): string => {
  return [
    `New project inquiry`,
    ``,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone === '' ? '(not provided)' : data.phone}`,
    `RAG type: ${data.ragType}`,
    `Deadline: ${data.deadline === '' ? '(not provided)' : data.deadline}`,
    ``,
    `Audience:`,
    data.audience,
    ``,
    `Project description:`,
    data.project,
    ``,
    `What they want it to do:`,
    data.goals,
  ].join('\n');
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
  sendInquiry: async (data: InquiryPayload): Promise<void> => {
    await getClient().send({
      from: env.emailFrom,
      to: 'inquiry@grumpybot.fyi',
      replyTo: data.email,
      subject: `New project inquiry from ${data.name}`,
      text: formatInquiryBody(data),
    });
  },
};
