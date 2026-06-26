// Typed, validated access to environment variables.
// Throws at first use if a required variable is missing, so problems surface
// immediately rather than as a confusing runtime error deep in the app.

const required = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  get databaseUrl(): string {
    return required('DATABASE_URL');
  },
  get openaiApiKey(): string {
    return required('OPENAI_API_KEY');
  },
  get resendApiKey(): string {
    return required('RESEND_API_KEY');
  },
  get emailFrom(): string {
    return required('EMAIL_FROM');
  },
  get sessionSecret(): string {
    return required('SESSION_SECRET');
  },
};
