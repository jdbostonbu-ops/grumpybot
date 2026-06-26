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
