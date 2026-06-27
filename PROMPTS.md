# Prompts

This file collects the prompt text and prompt-shaped content used by Handbookbot.

## Chat Completion Prompt

Source: `src/lib/rag.ts`

Model source: `src/lib/openai.ts`

- Chat model: `gpt-4o-mini`
- Embedding model: `text-embedding-3-small`
- Retrieved context count: top 4 chunks

### System Prompt

```text
You are a helpful assistant for a specific business. Answer the user's question using ONLY the context provided below. The context is drawn from the business's own documents. If the answer is not contained in the context, say you could not find it in the documents and do not make anything up. Do not use outside knowledge. Match the tone of the documents.
```

### User Prompt Template

```text
Context:
{context}

Question: {question}
```

### Context Template

Each retrieved chunk is formatted into the user prompt like this:

```text
[Source {index}: {filename}]
{chunk text}
```

Multiple chunks are separated by a blank line.

### No Context Fallback

Returned directly when no chunks are retrieved:

```text
I could not find anything about that in the documents, so I cannot answer it.
```

### Empty Model Response Fallback

Returned if the chat completion does not include message content:

```text
I could not produce an answer from the documents.
```

## Seeded Example Bot Documents

Source: `prisma/seed.ts`

These are not system prompts, but they are the seeded context documents that shape answers for the example bot, `The Grumpy Bean`.

### `employee-handbook.md`

```markdown
# The Grumpy Bean — Employee & Customer Handbook

## Rule 1 — The Compliment Clause
Every latte must be served with one (1) sincere compliment. Iced lattes require two, because the customer is clearly braver.

## Rule 4 — Whisper Tuesdays
On Tuesdays, all orders must be placed in a whisper. Customers who speak at normal volume are served decaf as a gentle lesson.

## Rule 7 — The Muffin Hierarchy
Blueberry muffins outrank bran muffins. If we run out of blueberry, a bran muffin may be "promoted" but must be referred to as "blueberry-adjacent."

## Rule 9 — No Talking About Mondays
We do not acknowledge Mondays at the Grumpy Bean. Staff who mention Mondays must refill the napkin dispensers as penance.

## Rule 12 — Dog Policy
Dogs are always welcome and are automatically considered VIPs (Very Important Pups). They receive a free pup cup and a handwritten apology for the weather.
```

### `menu.md`

```markdown
# The Grumpy Bean — Menu

## Espresso drinks
- The Compliment Latte — $5 — served with a sincere compliment
- Whisper Tuesday Brew — $4 — order quietly or receive decaf
- The Reluctant Cappuccino — $4.50 — made with visible reluctance
- Cold Brew of Few Words — $4 — we will not chat while pouring it

## For the pups
- Pup Cup — Free — for VIPs (Very Important Pups) only

## Secret menu
- The Grump — ask for it by name and frown. It is a triple espresso.
```

### `dog-vip-policy.md`

```markdown
# Dog VIP Policy

Dogs are Very Important Pups (VIPs) at the Grumpy Bean.

- Every dog receives a complimentary pup cup.
- Dogs outrank humans in line. If a dog arrives, it is served first.
- Treats are kept behind the counter and dispensed at the barista's discretion.
- Dogs are never served decaf, even on Whisper Tuesdays.
```

### `faq.md`

```markdown
# Frequently Asked Questions

## Do you have allergen information?
Yes. Ask a barista about any drink and they will tell you what is in it. Oat, almond, and soy milk are available.

## Is there parking?
There is street parking out front and a small lot behind the shop.

## Can I host an event here?
Yes, we host small events after hours. Speak to the manager to arrange it.

## Do you offer catering?
We cater coffee for local events. Minimum order is one large airpot.
```

### `about.md`

```markdown
# About The Grumpy Bean

The Grumpy Bean was founded by Beatrice "Bea" Grumpworth, a former librarian who believed coffee should be excellent and conversation should be optional.

Bea opened the shop with a simple philosophy: great espresso, absurd rules, and dogs drink free. The grumpiness is a bit; the coffee is serious.
```

### `hours-and-holidays.json`

```json
{
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
}
```
