import { getSessionUserId } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

type CheckoutBody = {
  plan?: unknown;
};

type Plan = 'starter' | 'student' | 'business';

const isPlan = (value: unknown): value is Plan =>
  value === 'starter' || value === 'student' || value === 'business';

export async function POST(request: Request): Promise<Response> {
  const userId = await getSessionUserId();
  if (userId === null) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CheckoutBody | null;
  if (body === null || !isPlan(body.plan)) {
    return Response.json({ error: 'Invalid plan.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (user === null) {
    return Response.json({ error: 'Account not found.' }, { status: 404 });
  }

  const priceId = stripe.priceIdForTier(body.plan);
  const origin = request.headers.get('origin') ?? 'https://www.grumpybot.fyi';

  try {
    const session = await stripe.getClient().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: userId,
      metadata: { tier: body.plan },
      success_url: `${origin}/checkout-success`,
      cancel_url: `${origin}/checkout-cancel`,
    });

    if (session.url === null) {
      return Response.json({ error: 'Could not create checkout session.' }, { status: 500 });
    }

    return Response.json({ url: session.url }, { status: 200 });
  } catch {
    return Response.json({ error: 'Could not start checkout. Try again.' }, { status: 500 });
  }
}