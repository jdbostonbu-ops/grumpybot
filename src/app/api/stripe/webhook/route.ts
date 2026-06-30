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
  if (userId === null) {
    return Response.json({ error: 'Missing user reference.' }, { status: 400 });
  }

  const tier = session.metadata?.tier;
  if (!isTier(tier)) {
    return Response.json({ error: 'Missing or invalid tier metadata.' }, { status: 400 });
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