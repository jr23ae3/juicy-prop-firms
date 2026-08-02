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
| 2 | **Database & Auth** — Prisma schema, PostgreSQL, Supabase Auth | Pending |
| 3 | **Core Data Models** — Prop firms, plans, pricing, seed data | Pending |
| 4 | **Comparison Table** — Filterable plan comparison with live pricing | Pending |
| 5 | **Rankings & Firm Pages** — Power rankings, firm detail pages | Pending |
| 6 | **AI Advisor** — OpenAI-powered personalized recommendations | Pending |
| 7 | **User Features** — Saved firms, alerts, preferences (TanStack Query) | Pending |
| 8 | **Stripe & Premium** — Subscriptions, premium features | Pending |
| 9 | **Email & Notifications** — Resend integration, deal alerts | Pending |
| 10 | **Production Polish** — Performance, a11y audit, SEO, monitoring | Pending |

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## License

Private — all rights reserved.
