import type Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { env } from '@/lib/env';

type Tier = 'starter' | 'student' | 'business';

const isTier = (value: unknown): value is Tier =>
  value === 'starter' || value === 'student' || value === 'business';

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get('stripe-signature');
  if (signature === null) {
    return Response.json({ error: 'Missing signature.' }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.getClient().webhooks.constructEvent(
      rawBody,
      signature,
      env.stripeWebhookSecret,
    );
  } catch {
    return Response.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({ received: true }, { status: 200 });
  }

  const session = event.data.object;

 const userId = session.client_reference_id;
  const tier = session.metadata?.tier;

  // This sandbox also bills Nymbl + CashPilot demo checkouts (Payment
  // Links — no user reference, no tier). Not ours to fulfill: acknowledge
  // with 200 so Stripe stops retrying.
  if (userId === null || !isTier(tier)) {
    return Response.json({ received: true, ignored: 'not a GrumpyBot checkout' }, { status: 200 });
  }

  const customerId = typeof session.customer === 'string' ? session.customer : null;
  if (customerId === null) {
    return Response.json({ error: 'Missing customer id.' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        stripeCustomerId: customerId,
        subscriptionStatus: 'active',
      },
    });
  } catch {
    return Response.json({ error: 'Could not update user.' }, { status: 500 });
  }

  return Response.json({ received: true }, { status: 200 });
}