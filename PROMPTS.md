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

## Chat UI Prompts

These prompts are shown to users in chat interfaces. They are not sent as system prompts to the model.

### Embedded Chat

Source: `src/components/EmbedChat.tsx`

Default greeting:

```text
Ask me anything about this project — I only answer from the uploaded documents.
```

Form label:

```text
Ask the bot
```

Input placeholder:

```text
Ask a question…
```

### Dashboard Preview Chat

Source: `src/components/DashboardClient.tsx`

Panel title:

```text
Preview your bot
```

Panel subtitle:

```text
Test questions before customers do
```

Empty-state prompt:

```text
Ask your bot a question below.
```

Form label:

```text
Ask your bot
```

Input placeholder: same as Embedded Chat.

### Dashboard Share And Theme Controls

Source: `src/components/DashboardClient.tsx`

Panel title:

```text
Share / embed
```

Theme picker label:

```text
Theme
```

Preset labels:

```text
Default
Dark Code
Playful
Forest
Ocean
Teal
Custom
```

Custom color labels:

```text
Background
Text
Accent
```

Save theme button states:

```text
Save colors
Saving…
Saved ✓
```

Bot slug label:

```text
Bot slug
```

Bot slug placeholder:

```text
your-slug
```

Slug save button text:

```text
Save
```

The slug button also uses the shared saving and saved states listed above.

Slug saved message:

```text
Saved.
```

### Embed Page

Source: `src/app/embed/[botId]/page.tsx`

Missing bot message:

```text
This bot could not be found.
```

### Validation And Error Messages

Sources: `src/app/api/bot/theme/route.ts`, `src/app/api/bot/slug/route.ts`, `src/components/DashboardClient.tsx`

```text
Invalid request body.
Each color must be a 6-digit hex value like #1a2b3c.
Could not save colors.
Could not save colors. Please try again.
Enter a slug.
Could not save slug.
Could not save slug. Please try again.
```

### Grumpy Bean Example Chat

Source: `src/components/GrumpyBeanChat.tsx`

Greeting:

```text
Well, well. Ask me about our rules, the menu, dogs, muffins, whatever. I only answer from the handbook though — don't get cute.
```

Suggested questions:

```text
Loud latte on Tuesday?
Can I bring my dog?
Do you have blueberry muffins?
What's the wifi password?
```

Form label:

```text
Ask the Grumpy Bean
```

Input placeholder:

```text
Ask about our rules, menu, dogs…
```

## Dashboard Prompt-Facing Copy

Sources: `src/components/DashboardClient.tsx`, `src/lib/bot.ts`

Dashboard header:

```text
Dashboard
Your bot is live 🎉
Answering from {documentCount} document{s} · {chunkCount} chunk{s} indexed
```

Stats:

```text
Documents
Chunks indexed
Status
• Live
```

Knowledge base controls:

```text
Knowledge base
+ Add document
Upload a document
Uploading…
Drag files here — .md, .txt, .json
No documents yet. Add one to get started.
• indexed
Delete {filename}
Delete this document?
Cancel
Deleting…
Delete
```

Dashboard quote:

```text
Upload markdown files. Talk to the chatbot. Copy the embed. Add it to your code.
```

Share explainer:

```text
How to share your bot
Bot slug
Pick a short custom name (like muttstrut). It becomes part of your bot's URL.
Public link
The full URL to your bot's chat. Paste it anywhere a link can go: Instagram bio, email signature, QR code.
Embed snippet
A line of code that puts your bot inside any website that lets you paste HTML.
Share the link anywhere, or paste the embed into your site code.
```

Custom inquiry band:

```text
Need a bot that isn't here?
GrumpyBot handles Q&A on your documents. For more advanced setups — Multimodal RAG (bots that read images), Agentic RAG (bots that reason in multiple steps), or Voice RAG (talk-to-your-bot) — we'll build it custom.
Tell us about your project. We'll send you ready-to-paste code for your site.
Start project inquiry →
Hide form ↑
```

Custom inquiry form:

```text
Thank you!
Your submission has been received. We're getting Grumpy for you!
GrumpyBot
we'll get back to you
Tell us about your project
Name
Email
Phone
Deadline
e.g. end of August
RAG type
Pick one…
Multimodal RAG (reads images)
Agentic RAG (multi-step reasoning)
Voice RAG (talk to your bot)
Other / not sure
Audience
Who will use this bot?
Tell us about your project
What you want it to do
Sending…
Send inquiry
Could not send. Try again.
```

Share and copy controls:

```text
Public link
Copied!
Copy
Embed snippet
<iframe src="{origin}/embed/{slugOrBotId}" width="380" height="540" style="border:0"></iframe>
```

Chat response chrome:

```text
Sources: {sourceList}
Thinking…
Ask
Something went wrong.
Something went wrong. Please try again.
```

Upload and delete errors:

```text
Upload failed.
Upload failed. Please try again.
Delete failed.
Delete failed. Please try again.
```

Default bot name:

```text
My bot
```

## Authentication And Account Prompts

Sources: `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/verify/page.tsx`, `src/app/reset-request/page.tsx`, `src/app/reset-confirm/page.tsx`, `src/components/PasswordField.tsx`, `src/components/LogoutButton.tsx`

Login:

```text
Log in.
Welcome back. Log in to manage your bot.
Email
Password
Logging in…
Log in
Don't have an account? Sign up
Forgot password?
Could not log in. Please try again.
Something went wrong. Please try again.
```

Signup:

```text
Create your account.
Sign up to build a bot from your own documents.
Email
Password
Creating…
Create account
Already have an account? Log in
Could not create your account. Please try again.
Something went wrong. Please try again.
```

Verification:

```text
Check your email
We sent a 6-digit code to {emailOrFallback}. Enter it below.
your email
Verification code
Verifying…
Verify
Could not verify. Please try again.
Something went wrong. Please try again.
```

Password reset request:

```text
Reset your password
Enter your email and we'll send you a reset code.
Email
Sending…
Send reset code
Remembered it? Back to log in
Could not send a reset code. Please try again.
Something went wrong. Please try again.
```

Password reset confirmation:

```text
Enter your reset code
We sent a code to {emailOrFallback}. Enter it with your new password.
your email
Reset code
New password
Updating…
Update password
Password updated. Redirecting to log in…
Back to log in
Could not reset your password. Please try again.
Something went wrong. Please try again.
```

Password visibility and logout controls:

```text
Hide password
Show password
Logging out…
Log out
```

Authentication API messages:

Sources: `src/app/api/auth/login/route.ts`, `src/app/api/auth/signup/route.ts`, `src/app/api/auth/verify/route.ts`, `src/app/api/auth/reset-request/route.ts`, `src/app/api/auth/reset-confirm/route.ts`

```text
Enter a valid email address.
Password must be at least 8 characters.
An account with this email already exists.
Enter your email and password.
That email and password do not match.
Enter the code from your email.
That code is not correct.
That code is not correct or has expired.
```

Email templates:

Source: `src/lib/email.ts`

```text
Verify your GrumpyBot account
Welcome to GrumpyBot! Use the code below to verify your email.
Reset your GrumpyBot password
Use the code below to reset your password.
{heading}

Your code is: {code}

If you did not request this, you can ignore this email.
```

Inquiry email template:

Source: `src/lib/email.ts`

```text
New project inquiry from {name}
New project inquiry

Name: {name}
Email: {email}
Phone: {phoneOrNotProvided}
RAG type: {ragType}
Deadline: {deadlineOrNotProvided}

Audience:
{audience}

Project description:
{project}

What they want it to do:
{goals}

(not provided)
```

## API Validation And Error Messages

Sources: `src/app/api/bot/route.ts`, `src/app/api/bot/upload/route.ts`, `src/app/api/bot/ask/route.ts`, `src/app/api/embed/ask/route.ts`, `src/app/api/example/ask/route.ts`, `src/app/api/bot/document/[id]/route.ts`, `src/app/api/bot/slug/route.ts`, `src/app/api/bot/theme/route.ts`, `src/app/api/inquiry/route.ts`

```text
Not signed in.
No file was uploaded.
That file is empty.
That file is too large (max 1 MB).
Please upload a .md, .txt, or .json file.
That file has no readable text.
Enter a question.
Missing bot id.
Bot not found.
The Grumpy Bean example is not available.
Missing document id.
Document not found.
Use lowercase letters, numbers, and hyphens only (2-40 characters).
That slug is already taken.
Invalid request body.
Each color must be a 6-digit hex value like #1a2b3c.
Please fill in all required fields.
Enter a valid email.
Could not send right now. Try again.
```

## Site And Example Page Copy

These are not model prompts, but they are user-facing prompt-shaped strings that invite users into workflows or example questions.

Sources: `src/app/page.tsx`, `src/app/how-it-works/page.tsx`, `src/app/pricing/page.tsx`, `src/app/examples/page.tsx`, `src/components/NavBar.tsx`

App metadata:

Source: `src/app/layout.tsx`

```text
GrumpyBot
Turn your handbook into a bot anyone can ask.
```

Navigation:

```text
GrumpyBot
Home
How it works
Examples
Pricing
Get started
```

Home page:

```text
For cohort students · no RAG required
Add a working AI chatbot to your project — before you've learned how to build one.
Built for cohort students, Vibe Fridays, and portfolio projects. Upload your project's docs, get an embeddable bot, paste it on your landing page.
Build my bot
See an example
How it works
1. Upload
Drop in your handbook, menu, or FAQ files.
2. We build it
Your bot learns your docs in seconds.
3. Share
Add it to your site or share a link.
Built by cohort students like you
every Vibe Friday project gets richer with a Q&A bot grounded in its own content
Study Buddy
class notes · syllabus
Recipe Box
cookbook · weeknight ideas
Weird Stuff
curated oddities · portfolio party trick
The Grumpy Bean
coffee shop · 28 rules
Survival Guide
freshman year · FAQ
Fictional World Lore
main characters · old war
Ready to ship your next project?
Your first bot in under 5 minutes. Built for portfolios, demos, and Vibe Fridays.
GrumpyBot · turn any document into a bot · made with ☕ and AI
```

How it works page:

```text
From documents to a bot in 3 steps.
No code. No training. No nonsense.
Upload your documents
Drop in whatever your business runs on — handbook, menu, policies, FAQs. We accept .md, .txt, and .json. The Grumpy Bean uploaded its rulebook; you upload yours.
We build your bot automatically
Your documents get split into searchable pieces and indexed in seconds. When someone asks a question, the bot finds the most relevant pieces and answers using only those — so it never makes things up.
Share it with the world
Get a link or embed the chat right on your website. Customers ask questions and get instant, accurate answers — with the source shown, so they know it's legit.
The best part: it only knows what you tell it
Your bot answers from your project docs and nothing else. If the answer isn't in what you uploaded, it says "I could not find it in the documents" instead of making something up. No hallucinations, no off-topic answers — perfect for portfolios where you want visitors to learn about your work.
See it in action
Don't want to use excessive tokens building a RAG? Don't know how to yet?
Try the Grumpy Bean example
```

Pricing page:

```text
Simple pricing. No surprises.
Start free. Upgrade when your bot gets popular.
Starter
$5/mo
For trying it out.
1 bot
5 documents
Grounded answers with sources
Shareable link
Start with Starter
★ Most popular
Student
$10/mo
For cohort students with portfolio projects.
7 bots (one per class)
Unlimited documents
Embed on your site
Custom colors
Token costs included
Go Student
Business
$19/mo
For instructors, small teams, anyone past school.
Unlimited bots
Team accounts
Remove branding
Priority support
Get Business
All plans include grounded answers, source citations, and the no-making-stuff-up guarantee. Token costs included on every plan.
```

Grumpy Bean example page:

```text
The Grumpy Bean
Home
Menu
The Rules
Ask Us
Building a landing page for class? Build it with style — add a chatbot.
EST. WHENEVER · OPEN TIL WE'RE TIRED
Coffee with a little attitude.
Great espresso. Absurd rules. Dogs drink free.
Today's pours
The Compliment Latte
served with a sincere compliment
$5
Whisper Tuesday Brew
order quietly or get decaf
$4
Pup Cup
for VIPs (Very Important Pups)
Free
House rules (yes, really)
Rule 4 — Tuesdays are whisper-only. Speak up, get decaf.
Rule 7 — Blueberry muffins outrank bran. Always.
Rule 12 — Dogs are automatic VIPs. Non-negotiable.
Ask the Handbook 🤖
Type a question — our grumpy bot answers using only the official rules.
The Grumpy Bean · 123 Espresso Lane · open til we're tired · dogs always welcome
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

## Prompt Logging Checkpoint

Continue logging new prompt-facing strings after this checkpoint. Last reviewed sources:

```text
src/lib/rag.ts
src/components/EmbedChat.tsx
src/components/DashboardClient.tsx
src/components/GrumpyBeanChat.tsx
src/components/NavBar.tsx
src/components/LogoutButton.tsx
src/components/PasswordField.tsx
src/lib/bot.ts
src/app/page.tsx
src/app/layout.tsx
src/app/login/page.tsx
src/app/signup/page.tsx
src/app/verify/page.tsx
src/app/reset-request/page.tsx
src/app/reset-confirm/page.tsx
src/app/how-it-works/page.tsx
src/app/pricing/page.tsx
src/app/examples/page.tsx
src/app/embed/[botId]/page.tsx
src/app/api/bot/route.ts
src/app/api/bot/upload/route.ts
src/app/api/bot/ask/route.ts
src/app/api/embed/ask/route.ts
src/app/api/example/ask/route.ts
src/app/api/bot/document/[id]/route.ts
src/app/api/bot/theme/route.ts
src/app/api/bot/slug/route.ts
src/app/api/inquiry/route.ts
src/app/api/auth/login/route.ts
src/app/api/auth/signup/route.ts
src/app/api/auth/verify/route.ts
src/app/api/auth/reset-request/route.ts
src/app/api/auth/reset-confirm/route.ts
src/lib/email.ts
prisma/seed.ts
```
