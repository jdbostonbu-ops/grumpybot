# HandbookBot — Build Plan (v8 — final)

## What we're building

A RAG web app — a handbook-bot platform where a customer signs up, uploads their
own documents, and the app builds them a working bot that answers questions
**grounded only in those documents**, with sources shown. The Grumpy Bean is the
showcase example. This is a **Vibe Friday demo build** (not TDD). **The whole
point of the demo: an app that genuinely works — upload a document, the app turns
it into a working RAG bot.**

---

## ⚠️ Constraints (govern the entire build)

**Code constraints:**

- **No `any` in TypeScript** — everything properly typed (strict).
- **No `var`** — `const`/`let` only.
- **Closure-based functions** — factory functions over classes (except Next.js
  route handlers, which are exported async functions).
- **`id` on every form input, paired with its label's `htmlFor`.**
- **User input rendered via `textContent`**, never `innerHTML`.
- **Minimal code** — least code that does the job; no over-engineering.

**Working-style constraints:**

- **Claude never gets ahead** — no decision-questions while you're still reading,
  no jumping steps, no building before you say go.
- **We always go in sequence** — one step at a time; you run things and share
  results before we move on.

---

## The demo story

Demo as a **brand-new customer**: sign up → click "Get started" → land on the
dashboard → **upload a document live** → open preview → ask the bot questions →
see it answer grounded, with sources. Proving the app works end to end is the
goal.

---

## The five pages

1. **Landing / marketing**
2. **How it works**
3. **Examples → Grumpy Bean** — full **functional showcase** page with the real
   working chat (seeded; always works)
4. **Pricing** — tiers; advertises multiple-bots as a feature
5. **Get started → Dashboard** — upload docs, manage bot, preview, share

---

## Stack

- **Framework:** Next.js (App Router) + React + TypeScript
- **Styling:** plain CSS (globals.css), using the locked palette + fonts
- **Database:** PostgreSQL on **Neon**
- **ORM:** **Prisma** (+ **raw SQL** for vector operations)
- **Vector search:** **pgvector** on Neon (Option C)
- **Auth:** email + password, bcrypt, email verification codes
- **Email:** **Resend** (verification + password reset)
- **AI:** OpenAI — `gpt-4o-mini` for answers, `text-embedding-3-small` for
  embeddings (both changeable later)
- **Deploy:** Vercel
- **Repo:** brand-new project, separate from AnglerCast

---

## Retrieval (Option C)

- On upload: read the uploaded file's **text** → chunk it → embed each chunk
  (`text-embedding-3-small`) → store text + embedding (`vector` column) in Neon
  via pgvector.
- On a question: embed the question → pgvector similarity search (raw SQL
  `$queryRaw`) → top-matching chunks → send only those to `gpt-4o-mini` with
  strict "answer ONLY from this context, else say you don't know" → return answer
  + source chunks/documents.
- Prisma doesn't model `vector`, so embedding storage/similarity uses **raw SQL**
  alongside normal Prisma models.

---

## File upload — Vercel lesson

- Uploaded documents are **read for their text and saved to Neon** (text +
  embeddings). **No writing files to disk** — Vercel's filesystem is read-only at
  runtime (learned on AnglerCast). The file itself isn't stored; only its
  extracted text + vectors.

---

## Grounding & the "funny"

- **Strictly grounded — the bot answers ONLY from retrieved context.** Per the
  assignment.
- **The AI does NOT make content funny.** Funny in = funny bot; boring in =
  boring bot. The humor lives entirely in the uploaded documents (the Grumpy
  Bean's owner wrote a funny handbook).

---

## Open preview

- **"Open preview" = the customer test-drives their own bot's chat** — asks
  questions, sees grounded answers with sources. Verifies the bot learned the
  uploaded docs before sharing. Upload → working bot **must work** — core of the
  demo.

---

## Auth

- **Sign up** → create account → email a verification **code** (Resend) → verify
  to activate
- **Log in** → bcrypt check → session
- **Log out** → clear session
- **Password reset** → request → **emailed code** → confirm new password

---

## Protection (every page, every user, defense in depth)

**No public pages — every page requires login.**

- **Middleware** — guards every route, redirects logged-out users to `/login`
  when they type any URL.
- **Server-side session check** — on protected pages and API routes, the
  page/route re-verifies the session before showing or returning data.
- **No client-side-only checks as the gate** — fine as a nicety, never the actual
  gate.
- Honest note: everything is gated, so a logged-out stranger hits `/login` before
  seeing the marketing pages or the Grumpy Bean demo. Accepted for a demo.

---

## Knowledge base — Grumpy Bean (seeded; expandable)

The seeded example bot's documents (the funny handbook the "owner" wrote):

- `employee-handbook.md` — numbered absurd rules (Compliment Clause, Whisper
  Tuesdays, Muffin Hierarchy + more)
- `menu.md` — full drink list, prices, silly descriptions, secret menu
- `dog-vip-policy.md` — pup rules, treats, line priority
- `faq.md` — allergens, parking, events, catering (no wifi → the refusal demo)
- `about.md` — fake origin story / founder
- `hours-and-holidays.json` — structured data (shows md *and* json handling)

---

## Data model (Prisma)

- **User** — email, hashed password, verified flag, verification code, reset
  fields
- **Bot / Business** — name, theme, owner (User) → the Grumpy Bean (**one bot per
  account for this build**)
- **Document** — filename, content, owning Bot
- **Chunk** — text, **embedding (vector)**, owning Document (pgvector/raw-SQL
  piece)

---

## Design system (locked from mockups)

- **Colors:** soft pink bg `#fff4fa`, purple `#6c4ad6`, hot pink `#ff5fa2`, sunny
  yellow `#ffd84d`, teal `#4ec3e0`, mint `#18b87b`, deep navy `#2b2150`
  (outlines/text)
- **Type:** big, rounded, playful, sentence case; two weights (regular + medium)
- **Layout:** bordered cards (3px navy), pill buttons, rounded corners, color
  blocking
- **Consistency:** HandbookBot nav on every page

---

## Testing

- **No TDD** — Vibe Friday demo. Keep the demo as a reference; can later
  **recreate with TDD** for the disciplined version.

---

## Scope

- **Build for real:** auth + live document upload + working RAG (upload → chunk →
  embed → ask → grounded answer + sources) + dashboard with preview
- **Build as presentation:** landing, how-it-works, pricing (gated like
  everything else)

---

## Build order

1. **Auth foundation first** — login / sign up / logout, Resend email
   verification codes, password reset, sessions, middleware + server-side
   protection. *(Get the gate working before anything else.)*
2. **Home page + global shell** — nav, theme, colors, fonts, layout, the design
   system applied. *(The consistent frame every page sits in.)*
3. **Then page by page** — How it works, Pricing, Dashboard, Examples → Grumpy
   Bean — wiring in the real upload + RAG at the dashboard and example.

---

## Future / "if we finish early" features (parked)

- **Multiple bots per account** — bot-list screen, bot-switcher, documents scoped
  per-bot. (Pricing page advertises it; build only if time.)
- **AI "make my document funny"** — optional tool: AI rewrites an uploaded doc in
  a funny voice, customer reviews and saves it, bot answers from the saved
  version. (Stays grounded; build only if time.)

## Stripe Test Mode — GrumpyBot Demo Build Plan
Intent
Add Stripe Test Mode to GrumpyBot so the "Pricing" page connects to a real payment surface, the User model records who paid for what, the webhook updates the database when payment succeeds, and the tier limits advertised on the pricing page are actually enforced in the API routes. Demo runs in Test Mode only — test cards, no real money. This may stay as the GrumpyBot demo or get rebuilt fresh as a production app later.

What's included in this build
All of these are approved and will be implemented:

Stripe Checkout Session in mode: 'subscription'
Three Stripe Products (Starter, Student, Business) with three Prices (one monthly per tier) created in the Stripe dashboard
Schema additions to the User model for tracking subscription state
Webhook listener at /api/stripe/webhook deployed on Vercel so Stripe can reach it
Database updates triggered by the webhook on checkout.session.completed
Tier enforcement code in existing bot creation and message API routes
/checkout-success and /checkout-cancel pages, both gated behind authentication
Full sk_test_... key stored in .env (no restricted keys for this demo)


What's NOT included

Live Mode (sk_live_... keys, real money)
Restricted Stripe keys


Files added
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts            ← creates Checkout Session, returns Stripe URL
│   │   └── stripe/
│   │       └── webhook/
│   │           └── route.ts        ← receives Stripe events, updates database
│   ├── checkout-success/
│   │   └── page.tsx                ← landing page after successful test payment
│   └── checkout-cancel/
│       └── page.tsx                ← landing page if user cancels in Stripe
├── components/
│   └── PricingCTA.tsx              ← client component wrapping each pricing button
└── lib/
    └── stripe.ts                   ← typed Stripe SDK client (matches openai.ts pattern)
Files modified
src/
├── app/
│   ├── pricing/
│   │   └── page.tsx                ← three <Link> buttons → three <PricingCTA /> buttons
│   ├── api/
│   │   ├── bot/
│   │   │   └── route.ts            ← tier enforcement: block over bot limit
│   │   │   └── ask/
│   │   │       └── route.ts        ← tier enforcement: block over message limit
│   │   └── embed/
│   │       └── ask/
│   │           └── route.ts        ← tier enforcement: block over message limit
│   └── dashboard/                  ← redirect to /pricing if subscriptionTier is NULL
└── lib/
    └── env.ts                      ← add stripeSecretKey + stripeWebhookSecret getters

prisma/
└── schema.prisma                   ← add subscription fields to User model

.env.example                        ← document new env vars
package.json                        ← add stripe dependency

Dependencies added
stripe          (the official Stripe Node SDK)
Installed via npm install stripe.

Environment variables added
In .env:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_STUDENT=price_...
STRIPE_PRICE_BUSINESS=price_...
In .env.example:
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
STRIPE_PRICE_STARTER=price_id_for_starter_plan
STRIPE_PRICE_STUDENT=price_id_for_student_plan
STRIPE_PRICE_BUSINESS=price_id_for_business_plan
Five new env vars. Two secrets (test key + webhook secret), three Price IDs (one per tier).

Stripe dashboard setup (manual, one-time, before code runs)
In Stripe dashboard under Products:

Create Product: "Starter" → add monthly Price at $5 → copy the price_... ID
Create Product: "Student" → add monthly Price at $10 → copy the price_... ID
Create Product: "Business" → add monthly Price at $49 → copy the price_... ID

Under Developers → Webhooks:

Add endpoint: https://www.grumpybot.fyi/api/stripe/webhook
Select event: checkout.session.completed
Copy the signing secret (whsec_...)

Under Developers → API keys:

Copy the test secret key (sk_test_...)

All seven values go into .env.

Schema changes (Prisma)
Three new fields on the existing User model:
prismamodel User {
  id                  String    @id @default(cuid())
  email               String    @unique
  passwordHash        String
  verified            Boolean   @default(false)
  verificationCode    String?
  resetCode           String?
  resetCodeExpires    DateTime?
  createdAt           DateTime  @default(now())

  // NEW Stripe subscription fields
  subscriptionTier    String?   // null, 'starter', 'student', or 'business'
  stripeCustomerId    String?   @unique
  subscriptionStatus  String?   // 'active', 'canceled', 'past_due'
  messageCountMonth   Int       @default(0)
  messageCountResetAt DateTime  @default(now())

  bots Bot[]
}
Migration via npm run db:push. Existing users get NULL for subscriptionTier, which means they have not paid and will be redirected from /dashboard to /pricing.

env.ts additions (matches existing pattern)
Two new getters added to the existing env object:
typescriptget stripeSecretKey(): string {
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
Same closure-based pattern, same required() helper, no changes to the existing structure.

New file: src/lib/stripe.ts
Typed Stripe client following the same pattern as src/lib/openai.ts:
typescriptimport Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: '2024-09-30.acacia',
});

export const priceIdForTier = (tier: 'starter' | 'student' | 'business'): string => {
  if (tier === 'starter') return env.stripePriceStarter;
  if (tier === 'student') return env.stripePriceStudent;
  return env.stripePriceBusiness;
};

New file: src/app/api/checkout/route.ts
Follows the /api/inquiry/route.ts pattern exactly: typed POST handler, payload validation with type guards, NextResponse.json with proper status codes.
Behavior:

Validates request body has { plan: 'starter' | 'student' | 'business' }
Gets the authenticated user from the session
Looks up the Stripe Price ID for the requested tier
Creates a Stripe Checkout Session in mode: 'subscription' with:

That Price ID
customer_email set to the user's email
client_reference_id set to the user's ID (so the webhook can identify them)
success_url pointing to /checkout-success
cancel_url pointing to /checkout-cancel


Returns { url: <stripe-hosted-checkout-url> } for the client to redirect to

No database writes here — that happens in the webhook.

New file: src/app/api/stripe/webhook/route.ts
The webhook listener Stripe calls when checkout.session.completed fires.
Behavior:

Verifies the stripe-signature header using stripe.webhooks.constructEvent with the webhook secret
If signature is invalid: returns 400, does nothing
If the event is checkout.session.completed:

Extracts client_reference_id (the user ID we set during Checkout)
Extracts the subscription details (tier, customer ID)
Updates the User row in the database: sets subscriptionTier, stripeCustomerId, subscriptionStatus = 'active'


Returns 200 to Stripe so it knows the event was received

This is the route that has to be on a publicly accessible URL — that's why it's deployed via Vercel. Stripe sends the POST to https://www.grumpybot.fyi/api/stripe/webhook.
Important: this route does NOT require a session cookie. Stripe is the caller, not a user. It needs to be added to a webhook-specific exception in the matcher OR placed under /api/ which the middleware already excludes (per the existing matcher config in middleware.ts).
Looking at the existing middleware:
typescriptexport const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
API routes are already excluded from middleware. The webhook will work without any middleware changes.

New file: src/components/PricingCTA.tsx
A client component (because it needs an onClick handler).
Renders a button styled exactly like the current <Link> buttons on the pricing page (btn btn--outline, btn btn--primary, btn btn--dark). On click:

POSTs to /api/checkout with the selected plan
Shows "Loading..." text while waiting
On success: receives { url } and does window.location.href = url
On error: shows an error message in the existing pattern ("Could not start checkout. Please try again.")

Props: { plan: 'starter' | 'student' | 'business'; className: string; label: string }

Modified file: src/app/pricing/page.tsx
Only the three button elements change. Everything else stays exactly as it is.
Before:
typescript<Link href="/dashboard" className="btn btn--outline price-card__cta">
  Start with Starter
</Link>
After:
typescript<PricingCTA plan="starter" className="btn btn--outline price-card__cta" label="Start with Starter" />
Same change for the Student and Business buttons.
No copy changes. No layout changes. No CSS changes.

New file: src/app/checkout-success/page.tsx
Server component, matches the design system (hero, card, navy text, pill button). Gated behind authentication via the existing middleware.
Proposed copy:
Thanks!
Your test payment was received.
Your plan is now active.
[Open dashboard →]
Replace any of this with your preferred wording.

New file: src/app/checkout-cancel/page.tsx
Server component. Same design pattern.
Proposed copy:
No worries.
You cancelled the test checkout — no payment was made.
Want to try a different plan?
[Back to pricing →]
Replace any of this with your preferred wording.

Modified file: src/app/dashboard/page.tsx (or wherever the dashboard lives)
Add one check at the top of the server component, right after getSessionUserId():
typescriptconst user = await prisma.user.findUnique({
  where: { id: userId },
  select: { subscriptionTier: true },
});

if (user.subscriptionTier === null) {
  redirect('/pricing');
}
Means: a logged-in user who hasn't paid is sent to the pricing page. Approved per your decision in #4 (no free tier).

Modified files: Tier enforcement in bot and message routes
Three existing API routes get a check added at the top:
src/app/api/bot/route.ts (bot creation):
typescriptconst tierLimits = { starter: 1, student: 7, business: 100 };

const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { _count: { select: { bots: true } } },
});

const limit = tierLimits[user.subscriptionTier];
if (user._count.bots >= limit) {
  return NextResponse.json(
    { error: 'You have reached your bot limit for this plan.' },
    { status: 403 },
  );
}
src/app/api/bot/ask/route.ts and src/app/api/embed/ask/route.ts (message sending):
typescriptconst messageLimits = { starter: 500, student: 5000, business: 50000 };

const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { subscriptionTier: true, messageCountMonth: true, messageCountResetAt: true },
});

// Reset counter if month has rolled over
const nowMs = Date.now();
const resetMs = user.messageCountResetAt.getTime();
const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
if (nowMs - resetMs > oneMonthMs) {
  await prisma.user.update({
    where: { id: userId },
    data: { messageCountMonth: 0, messageCountResetAt: new Date() },
  });
  user.messageCountMonth = 0;
}

const limit = messageLimits[user.subscriptionTier];
if (user.messageCountMonth >= limit) {
  return NextResponse.json(
    { error: 'You have reached your message limit for this plan.' },
    { status: 429 },
  );
}

// ... existing logic to handle the message ...

// After successful message:
await prisma.user.update({
  where: { id: userId },
  data: { messageCountMonth: { increment: 1 } },
});

User flow end-to-end
User signs up → verifies email → logs in →
  Lands on dashboard → server check: subscriptionTier === null →
    Redirected to /pricing →
      Clicks "Go Student" (PricingCTA component) →
        POST /api/checkout { plan: 'student' } →
          Server creates Checkout Session in subscription mode →
            Returns { url } →
              Browser redirects to Stripe-hosted Checkout page →
                User enters 4242 4242 4242 4242, future date, any CVC →
                  Stripe processes test charge, creates test subscription →
                    Stripe sends checkout.session.completed webhook →
                      Webhook handler verifies signature →
                        Webhook handler updates User row: subscriptionTier='student', etc. →
                          Stripe redirects user to /checkout-success →
                            User lands on success page (authenticated) →
                              Clicks "Open dashboard →" →
                                Lands on /dashboard (server check passes — tier is set) →
                                  Can now create up to 7 bots, send up to 5,000 messages
If user creates 7 bots and tries to make an 8th:
POST /api/bot → server checks bot count → 7 >= 7 → returns 403 →
  Client shows: "You have reached your bot limit for this plan."
If user sends their 5,001st message:
POST /api/bot/ask → server checks message count → 5000 >= 5000 → returns 429 →
  Client shows: "You have reached your message limit for this plan."


## Embed Security — 1 Bot, 1 Origin (Layers 1-4)
Intent
Each bot's embed iframe can only be used on ONE origin. Pasting the same iframe code on a second site fails. This rule applies across all tiers — Starter (1 bot × 1 origin = 1 site), Student (7 bots × 1 origin each = 7 sites), Business (100 bots × 1 origin each = 100 sites). Bot count scales between tiers; origin-per-bot is always 1.
Enforcement uses four overlapping layers so a failure of any one layer doesn't open the whole system. No security model is 100%. The goal is reducing attack surface and demonstrating reasonable measures, not perfection.

## Threat model
Defends against:

A user copying an iframe to a second site to bypass tier limits
A user pasting one bot across many small sites to amplify their token consumption
Iframe code theft (someone scraping a legitimate site and reusing the iframe)
Casual abuse from non-technical users
Honest mistakes (testing on one site, deploying to another)

## Multi-bot architecture (prerequisite)
The 1-bot-1-origin model assumes the user can have multiple bots. The current codebase supports only one bot per user (getOrCreateBotForUser returns the same bot every time). The multi-bot system must be built before or alongside this security work.
Required bot fields beyond what exists today:

name — user-facing label (e.g., "My company FAQ bot")
description — what's in this bot
documents — scoped to this specific bot
slug — unique per bot
lockedOrigin — the one domain this bot is allowed on

Operations that currently use the "user's one bot" pattern must accept a specific bot id:

Upload document
Ask question
Update theme
Update slug
Delete document

## Layer 1: Declared origin at embed creation
When the user creates a bot's embed:

Dashboard UI prompts the user for the target domain (e.g., https://myportfolio.com)
Format validation: must be a real-looking origin (regex), no protocol-less inputs accepted
Domain saved as lockedOrigin on the bot record
Cannot be changed except via the explicit "Release embed" flow below

Release embed flow:

Owner clicks "Release embed" in the dashboard
lockedOrigin set to null
Existing iframe on the old site stops working immediately (its token becomes invalid)
A new embed URL is generated with a fresh token
New URL will lock to the next origin it's used on (or to a re-declared origin if Layer 1 is required)

## Layer 2: Signed embed token
Server holds a secret key (EMBED_TOKEN_SECRET env var).
When the embed URL is generated:

Payload: { botId, declaredDomain, issuedAt }
HMAC-SHA256 signature of payload with the secret
URL format: https://www.grumpybot.fyi/embed/[botSlug]?t=[base64-encoded-payload-and-signature]

Token verification on every embed request:

Server reads the t query parameter
Decodes the base64 payload
Recomputes the HMAC signature with the secret
Reject if signatures don't match (means token was forged or tampered with)
Reject if payload's botId doesn't match the slug being requested
Reject if token is older than the configured expiry

## Why this matters:
Without the secret key, an attacker cannot generate a valid token. The signed token proves the embed URL was issued by your server for a specific bot and a specific domain. Anyone copying the iframe URL gets the legitimate token, but the rest of the layers still check origin.

## Layer 3: Server-side Referer + token verification
On every request to /embed/[botSlug] and /api/embed/ask:

Verify the token signature is valid (per Layer 2)
Extract declaredDomain from the verified token
Read the Referer header from the request
Strip Referer down to just the origin (scheme + host + port)
Compare origin to declaredDomain
If they match: allow the request
If they don't match: return 403 Forbidden
If Referer is missing: return 403 Forbidden

## Localhost exception:
The bot owner needs to preview their embed locally before deploying. Special case: localhost origins (http://localhost:*, http://127.0.0.1:*) are allowed if the request is authenticated as the bot's owner (session check matches ownerId). This means owners can test their own bots locally; visitors cannot bypass via localhost.
Edge cases:

Privacy extensions that strip Referer → request fails (user can configure their tool to allow it for their embed sites)
Subdomain mismatches (app.example.com vs example.com) → different origins per web spec, must match exactly
Protocol mismatches (http:// vs https://) → different origins, must match exactly
Trailing slash differences → must be normalized in the comparison

## Layer 4: Iframe runtime JavaScript verification
Inside the iframe rendered by /embed/[botSlug]:

Page loads JavaScript that asks the parent window for its current URL
Same-origin restrictions prevent the iframe from reading the parent's URL directly
Use window.parent.postMessage from the iframe to request the URL
The parent must respond via postMessage with window.location.href
If parent doesn't respond within a short timeout: iframe displays "Embed not allowed on this domain" and stops accepting messages
If response URL's origin doesn't match the locked declaredDomain: iframe displays the error
Iframe phones home to a verification endpoint with the result (for logging)

## What this catches:

Iframe proxy attacks (where an attacker's server fetches the iframe with a faked Referer)
Browser extensions that fake Referer headers but can't fake the parent window's URL
Scenarios where the parent page tries to prevent the iframe from communicating
