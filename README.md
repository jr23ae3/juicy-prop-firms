# Juicy Prop Firms

Production-ready SaaS platform for comparing futures prop firms — with AI-powered recommendations, verified pricing, and transparent all-in cost comparisons.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | PostgreSQL, Prisma ORM |
| Auth | Supabase Auth |
| Data fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| AI | OpenAI API |
| Payments | Stripe |
| Email | Resend |
| Hosting | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database & Auth setup (Milestone 2)

1. Create a [Supabase](https://supabase.com) project and copy URL + anon key into `.env.local`
2. Add your PostgreSQL `DATABASE_URL` (Supabase → Settings → Database)
3. Run migrations:

```bash
npm run db:migrate
```

4. In Supabase → Authentication → URL Configuration, set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

Auth routes: `/login`, `/signup`, `/account` (protected)

### Seed data (Milestone 3)

After running migrations, seed sample firms and plans:

```bash
npm run db:seed
```

This loads 5 prop firms, 10 plans, verified discount codes, and power rankings.
Data APIs: `GET /api/plans`, `GET /api/rankings`, `GET /api/plans/metadata`

### Compare page (Milestone 4)

Visit [/compare](/compare) for the filterable plan comparison table with:
- All-in cost column (eval + activation)
- Verified discount code badges with copy
- Filters: firm, account size, eval type, max budget, search
- Mobile card layout + desktop table
- TanStack Query for live data fetching

### Rankings & firm pages (Milestone 5)

- [/rankings](/rankings) — Power rankings with factor breakdowns
- [/firms/{slug}](/firms/lucid-trading) — SEO firm profiles with plans & ranking scores
- [/methodology](/methodology) — How we verify and rank firms

### AI Advisor (Milestone 6)

Visit [/advisor](/advisor) for personalized plan recommendations:
- Questionnaire: trading style, experience, budget, priorities
- OpenAI-powered matching (falls back to smart rules without API key)
- Top 3 plans with reasoning, match scores, and discount codes

Add `OPENAI_API_KEY` to `.env.local` for full AI reasoning.

### User features (Milestone 7)

Signed-in users get a full account dashboard at [/account](/account):
- **Saved plans** — bookmark plans from the compare table
- **Preferences** — trading style, budget, and priorities (pre-fill AI Advisor)
- **Deal alerts** — store price-drop targets (email delivery in Milestone 9)

User APIs: `GET/POST/DELETE /api/user/saved-plans`, `GET/PUT /api/user/preferences`, `GET/POST/DELETE /api/user/alerts`

### Stripe & Premium (Milestone 8)

Visit [/pricing](/pricing) for Free vs **Juicy Pro** ($9.99/mo):

| Feature | Free | Juicy Pro |
|---------|------|-----------|
| Plan comparison | Full access | Full access |
| AI Advisor | 1 match | Top 3 + full AI reasoning |
| Saved plans | Up to 3 | Unlimited |
| Deal alerts | — | Create & manage |
| Ranking breakdowns | — | Factor scores for all firms |

**Stripe setup:**
1. Create a product + recurring price in [Stripe Dashboard](https://dashboard.stripe.com)
2. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRICE_ID=price_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Webhook endpoint: `POST /api/stripe/webhook` — events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

APIs: `POST /api/stripe/checkout`, `POST /api/stripe/portal`, `GET /api/user/subscription`

## Project Structure

```
src/
├── actions/          # Server Actions (mutations, form handlers)
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/
│   ├── layout/       # Header, footer, container
│   ├── marketing/    # Landing page sections
│   └── ui/           # shadcn/ui primitives
├── config/           # Site config, navigation
├── hooks/            # Custom React hooks
├── lib/              # Utilities, env validation
├── server/           # Server-only modules
├── services/         # Business logic & data access
└── types/            # Shared TypeScript types
```

## Milestone Roadmap

| # | Milestone | Status |
|---|-----------|--------|
| 1 | **Project Foundation** — Next.js, Tailwind, shadcn, architecture, shell UI | ✅ Complete |
| 2 | **Database & Auth** — Prisma schema, PostgreSQL, Supabase Auth | ✅ Complete |
| 3 | **Core Data Models** — Prop firms, plans, pricing, seed data | ✅ Complete |
| 4 | **Comparison Table** — Filterable plan comparison with live pricing | ✅ Complete |
| 5 | **Rankings & Firm Pages** — Power rankings, firm detail pages | ✅ Complete |
| 6 | **AI Advisor** — OpenAI-powered personalized recommendations | ✅ Complete |
| 7 | **User Features** — Saved plans, alerts, preferences (TanStack Query) | ✅ Complete |
| 8 | **Stripe & Premium** — Subscriptions, premium features | ✅ Complete |
| 9 | **Email & Notifications** — Resend integration, deal alerts | Pending |
| 10 | **Production Polish** — Performance, a11y audit, SEO, monitoring | Pending |

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed sample firms & plans
npm run db:push      # Push schema (prototyping)
npm run db:studio    # Open Prisma Studio
```

## License

Private — all rights reserved.
