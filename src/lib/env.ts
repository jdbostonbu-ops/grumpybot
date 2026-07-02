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
  get sendgridApiKey(): string {
    return required('SENDGRID_API_KEY');
  },
  get emailFrom(): string {
    return required('EMAIL_FROM');
  },
  get sessionSecret(): string {
    return required('SESSION_SECRET');
  },
  get stripeSecretKey(): string {
  return required('STRIPE_SECRET_KEY');
  },
  get stripeWebhookSecret(): string {
    return required('STRIPE_WEBHOOK_SECRET');
  },
  get stripePriceStarter(): string {
    return required('STRIPE_PRICE_STARTER');
  },
  get stripePriceStudent(): string {
    return required('STRIPE_PRICE_STUDENT');
  },
  get stripePriceBusiness(): string {
    return required('STRIPE_PRICE_BUSINESS');
  },
  get embedTokenSecret(): string {
    return required('EMBED_TOKEN_SECRET');
  },
};
