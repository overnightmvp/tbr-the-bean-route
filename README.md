# The Bean Route (TBR)

Two-sided marketplace connecting event organizers with coffee vendors in Melbourne.

## Stack
- Next.js (App Router, TypeScript)
- Supabase (Postgres + Auth)
- Brevo (transactional email)
- Vercel (hosting)

## Quickstart
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open: http://localhost:3000

## Required Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BREVO_API_KEY=
```

## Core Docs
- Product: `docs/PRODUCT.md`
- Architecture: `docs/ARCHITECTURE.md`
- Deployment: `docs/DEPLOYMENT.md`
- Operations runbook: `docs/RUNBOOK.md`

## Deployment
- Production deploys from `main` via Vercel.
- See `docs/DEPLOYMENT.md` for full release steps and smoke tests.

## CI
GitHub Actions runs lint + build on pull requests.

## Repository
Current repository rename target:
`overnightmvp/tbr-the-bean-route`
