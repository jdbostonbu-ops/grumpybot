# HandbookBot — starter pack

A RAG handbook-bot platform. See `PLAN.md` for the full build plan (v8).

This starter is the **scaffold** — the stack, the design system, the auth/RAG
library foundation, the Prisma schema, and the Grumpy Bean seed. The pages are
built one at a time, in sequence, per the build order in `PLAN.md`.

---

## What's already in here

```
handbookbot/
├── PLAN.md                     ← the full build plan (v8)
├── package.json                ← the full stack
├── tsconfig.json               ← strict TypeScript (no any)
├── next.config.ts
├── .env.example                ← copy to .env and fill in
├── prisma/
│   ├── schema.prisma           ← User, Bot, Document, Chunk (+ pgvector)
│   └── seed.ts                 ← the Grumpy Bean showcase bot + funny handbook
└── src/
    ├── middleware.ts           ← route protection (layer 1)
    ├── app/
    │   ├── globals.css         ← the locked design system
    │   ├── layout.tsx
    │   └── page.tsx            ← home placeholder (server-side check, layer 2)
    ├── components/
    │   └── NavBar.tsx          ← the consistent HandbookBot nav
    └── lib/
        ├── prisma.ts           ← Prisma client
        ├── env.ts              ← typed env access
        ├── auth.ts             ← password hashing + code generation
        ├── session.ts          ← signed-cookie sessions
        ├── email.ts            ← Resend verification/reset emails
        ├── openai.ts           ← OpenAI client + embeddings
        ├── chunk.ts            ← document chunking
        ├── retrieval.ts        ← pgvector raw-SQL store + similarity search
        └── rag.ts             ← grounded answer generation
```

---

## Setup steps

### 1. Install dependencies

```bash
npm install
```

### 2. Create your `.env`

```bash
cp .env.example .env
```

Then fill in the real values (see comments in `.env.example`):

- `DATABASE_URL` / `DIRECT_URL` — from your Neon project
- `OPENAI_API_KEY` — from OpenAI
- `RESEND_API_KEY` + `EMAIL_FROM` — from Resend
- `SESSION_SECRET` — generate with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 3. Enable pgvector on Neon

In the Neon SQL editor (or psql), run once:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Push the schema to the database

```bash
npm run db:push
```

### 5. Seed the Grumpy Bean showcase bot

```bash
npm run db:seed
```

(This calls OpenAI to embed the seed documents, so it needs `OPENAI_API_KEY`.)

### 6. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login` (no auth pages
exist yet; those are build step 1).

---

## Build order (from PLAN.md)

1. Auth foundation (login / signup / logout / verify / reset) + protection
2. Home page + global shell (nav, theme, layout)
3. Page by page (How it works, Pricing, Dashboard, Examples → Grumpy Bean),
   wiring in the real upload + RAG at the dashboard and example.
