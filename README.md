<p align="center">
  <img src="public/grumpybot-logo.svg" alt="GrumpyBot logo" width="400" />
</p>

<h1 align="center">GrumpyBot</h1>

<p align="center">
  <b>For students, new coders, and new entrepreneurs.</b><br/>
  Your first bot in under 5 minutes. Built for portfolios, demos, real clients, and Vibe Fridays.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript strict" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Neon-Postgres-00E599?logo=postgresql&logoColor=white" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/pgvector-0.5-336791?logo=postgresql&logoColor=white" alt="pgvector" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/SendGrid-Email-1A82E2?logo=minutemailer&logoColor=white" alt="SendGrid" />
  <img src="https://img.shields.io/badge/Cloudflare-DNS%20%2B%20Routing-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  🌐 <a href="https://www.grumpybot.fyi/signup"><b>Live site → grumpybot.fyi</b></a>
  &nbsp;·&nbsp;
  <img src="https://github.com/jdbostonbu-ops.png" width="20" valign="middle" />
  &nbsp;<a href="https://github.com/jdbostonbu-ops"><b>@jdbostonbu-ops</b></a>
</p>

---

## 👤 Author

<p>
  <img src="https://github.com/jdbostonbu-ops.png" width="60" valign="middle" />
  &nbsp;&nbsp;Built by <a href="https://github.com/jdbostonbu-ops"><b>@jdbostonbu-ops</b></a>
</p>

---

## ✨ Features

- 📚 **Build a bot from your content** — drop in `.md`, `.txt`, or `.json` files (handbooks, cookbooks, study notes, FAQs, fictional worlds — anything). Your bot answers only from those documents, no hallucinations, no outside knowledge
- 🔌 **No-code iframe embed** — your bot ships with a one-line `<iframe>` snippet and a custom slug (`grumpybot.fyi/embed/your-slug`). Paste it on any site — Webflow, Squarespace, your portfolio, a Notion page that allows HTML — no coding required
- 🎨 **6 color themes + custom hex** — match your bot's look to your brand with a live preview in the dashboard
- ⚡ **Streaming responses** — toggle word-by-word streaming on or off per bot (like ChatGPT, in your bot)
- 🚀 **Request advanced bots** — built-in flip-card inquiry form lets visitors commission custom builds:
  - **Multimodal RAG** — reads images, not just text
  - **Agentic RAG** — multi-step reasoning across documents
  - **Voice RAG** — spoken conversations with your bot
  - Inquiries are emailed to `inquiry@grumpybot.fyi` via verified SendGrid + Cloudflare Email Routing — real delivery, not a fake form
- 🔐 **Real email-verified authentication** — signup with verification code, password reset, all delivered via SendGrid from the verified `grumpybot.fyi` domain (no dev sandbox, no "noreply@gmail")
- 🧑‍🏫 **Grumpy Bean example bot** — pre-seeded showcase bot demonstrating the full RAG pipeline you can try without signing up
- 🎉 **Confetti, hover glows, card flips** — small touches throughout (hover the dashboard 🎉, watch the landing-page cards lift, see the inquiry card spin and flip on submit)

---

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript (strict) |
| **Styling** | CSS modules + design tokens (no framework, no Tailwind) |
| **Database** | Neon Postgres + Prisma ORM |
| **Vector search** | pgvector (raw-SQL similarity search) |
| **AI** | OpenAI `gpt-4o-mini` (chat) + `text-embedding-3-small` (embeddings) |
| **Auth** | Signed-cookie sessions, bcrypt password hashing |
| **Email** | SendGrid (transactional) + Cloudflare Email Routing (inquiry forwarding) |
| **Hosting** | Vercel + Cloudflare DNS |

---

## 📦 Project structure

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
    ├── middleware.ts           ← route protection
    ├── app/
    │   ├── globals.css         ← the locked design system
    │   ├── layout.tsx
    │   ├── icon.svg            ← favicon
    │   ├── page.tsx            ← landing
    │   ├── dashboard/          ← authenticated bot owner dashboard
    │   ├── embed/[botId]/      ← public embeddable chat
    │   ├── examples/           ← showcase bots (Grumpy Bean)
    │   └── api/
    │       ├── auth/           ← signup, login, verify, reset, logout
    │       ├── bot/            ← theme, slug, document, ask, upload
    │       ├── embed/ask/      ← public embed chat endpoint (streaming-capable)
    │       └── inquiry/        ← project inquiry form submission
    ├── components/
    │   ├── NavBar.tsx
    │   ├── DashboardClient.tsx
    │   ├── EmbedChat.tsx
    │   └── GrumpyBeanChat.tsx
    └── lib/
        ├── prisma.ts           ← Prisma client
        ├── env.ts              ← typed env access
        ├── auth.ts             ← password hashing + code generation
        ├── session.ts          ← signed-cookie sessions
        ├── email.ts            ← SendGrid (verification, reset, inquiry)
        ├── openai.ts           ← OpenAI client + embeddings
        ├── chunk.ts            ← document chunking
        ├── retrieval.ts        ← pgvector similarity search
        ├── rag.ts              ← grounded answer generation (sync + streaming)
        ├── bot.ts              ← bot helpers
        └── embed-themes.ts     ← color theme presets
```

---

## 🚀 Setup

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
- `SENDGRID_API_KEY` + `EMAIL_FROM` — from SendGrid
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

Open [http://localhost:3000](http://localhost:3000).

---

## 🏗 Build order (from PLAN.md)

1. Auth foundation (login / signup / logout / verify / reset) + route protection
2. Home page + global shell (nav, theme, layout)
3. Page by page (How it works, Pricing, Dashboard, Examples → Grumpy Bean), wiring in the real upload + RAG at the dashboard and example.

See `PLAN.md` for the full v8 build plan.

---

Made with 💜 for cohort students and Vibe Fridays.
