import Stripe from 'stripe';
import { env } from '@/lib/env';

// API version pinned to match the webhook destination configured in Stripe.
export const STRIPE_API_VERSION = '2026-06-24.dahlia';

const createClient = (): Stripe => new Stripe(env.stripeSecretKey, {
  apiVersion: STRIPE_API_VERSION,
});

let client: Stripe | undefined;

const getClient = (): Stripe => {
  if (client === undefined) {
    client = createClient();
  }
  return client;
};

const priceIdForTier = (tier: 'starter' | 'student' | 'business'): string => {
  if (tier === 'starter') return env.stripePriceStarter;
  if (tier === 'student') return env.stripePriceStudent;
  return env.stripePriceBusiness;
};

export const stripe = {
  getClient,
  priceIdForTier,
};