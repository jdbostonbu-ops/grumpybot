// Seeds the Grumpy Bean — the always-on showcase bot used on the Examples page.
// Run with: npm run db:seed   (after db:push and enabling the vector extension)
//
// This creates a demo owner user, the Grumpy Bean bot, its documents, and
// indexes every chunk (embeddings via OpenAI) so the example works immediately.

import { PrismaClient } from '@prisma/client';
import { retrieval } from '../src/lib/retrieval';
import { auth } from '../src/lib/auth';

const prisma = new PrismaClient();

const documents: Array<{ filename: string; content: string }> = [
  {
    filename: 'employee-handbook.md',
    content: `# The Grumpy Bean — Employee & Customer Handbook

## Rule 1 — The Compliment Clause
Every latte must be served with one (1) sincere compliment. Iced lattes require two, because the customer is clearly braver.

## Rule 4 — Whisper Tuesdays
On Tuesdays, all orders must be placed in a whisper. Customers who speak at normal volume are served decaf as a gentle lesson.

## Rule 7 — The Muffin Hierarchy
Blueberry muffins outrank bran muffins. If we run out of blueberry, a bran muffin may be "promoted" but must be referred to as "blueberry-adjacent."

## Rule 9 — No Talking About Mondays
We do not acknowledge Mondays at the Grumpy Bean. Staff who mention Mondays must refill the napkin dispensers as penance.

## Rule 12 — Dog Policy
Dogs are always welcome and are automatically considered VIPs (Very Important Pups). They receive a free pup cup and a handwritten apology for the weather.`,
  },
  {
    filename: 'menu.md',
    content: `# The Grumpy Bean — Menu

## Espresso drinks
- The Compliment Latte — $5 — served with a sincere compliment
- Whisper Tuesday Brew — $4 — order quietly or receive decaf
- The Reluctant Cappuccino — $4.50 — made with visible reluctance
- Cold Brew of Few Words — $4 — we will not chat while pouring it

## For the pups
- Pup Cup — Free — for VIPs (Very Important Pups) only

## Secret menu
- The Grump — ask for it by name and frown. It is a triple espresso.`,
  },
  {
    filename: 'dog-vip-policy.md',
    content: `# Dog VIP Policy

Dogs are Very Important Pups (VIPs) at the Grumpy Bean.

- Every dog receives a complimentary pup cup.
- Dogs outrank humans in line. If a dog arrives, it is served first.
- Treats are kept behind the counter and dispensed at the barista's discretion.
- Dogs are never served decaf, even on Whisper Tuesdays.`,
  },
  {
    filename: 'faq.md',
    content: `# Frequently Asked Questions

## Do you have allergen information?
Yes. Ask a barista about any drink and they will tell you what is in it. Oat, almond, and soy milk are available.

## Is there parking?
There is street parking out front and a small lot behind the shop.

## Can I host an event here?
Yes, we host small events after hours. Speak to the manager to arrange it.

## Do you offer catering?
We cater coffee for local events. Minimum order is one large airpot.`,
  },
  {
    filename: 'about.md',
    content: `# About The Grumpy Bean

The Grumpy Bean was founded by Beatrice "Bea" Grumpworth, a former librarian who believed coffee should be excellent and conversation should be optional.

Bea opened the shop with a simple philosophy: great espresso, absurd rules, and dogs drink free. The grumpiness is a bit; the coffee is serious.`,
  },
  {
    filename: 'hours-and-holidays.json',
    content: `{
  "open": "7am",
  "close": "until we are tired",
  "weekly": {
    "monday": "we do not acknowledge Mondays",
    "tuesday": "open, but whisper only",
    "wednesday": "open",
    "thursday": "open",
    "friday": "open",
    "saturday": "open",
    "sunday": "open"
  },
  "holidays": "closed, because even grumpy beans need rest"
}`,
  },
];

const main = async (): Promise<void> => {
  const ownerEmail = 'owner@grumpybean.example';

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      passwordHash: await auth.hashPassword('grumpybean-demo'),
      verified: true,
    },
  });

  // Start clean so re-seeding is idempotent.
  await prisma.bot.deleteMany({ where: { ownerId: owner.id } });

  const bot = await prisma.bot.create({
    data: {
      name: 'The Grumpy Bean',
      theme: 'playful',
      ownerId: owner.id,
    },
  });

  for (const doc of documents) {
    const created = await prisma.document.create({
      data: { filename: doc.filename, content: doc.content, botId: bot.id },
    });
    const count = await retrieval.indexDocument(created.id, doc.content);
    // eslint-disable-next-line no-console
    console.log(`Indexed ${doc.filename}: ${count} chunks`);
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded bot ${bot.name} (${bot.id})`);
};

main()
  .catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
