# DEPLOYMENT.md

## Deployment Pattern (Minimal + Reliable)
1. Open PR to `main`
2. CI must pass (`lint`, `build`)
3. Merge PR
4. Vercel auto-deploys from `main`
5. Run smoke tests (see below)
6. If critical issue, rollback to previous Vercel deployment

## Environments
- **Production:** Vercel project main deployment
- **Preview:** PR previews on Vercel
- **Local:** `npm run dev`

## Required Environment Variables (Vercel + local)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BREVO_API_KEY=
```

## Database
- Apply SQL migrations in `supabase/migrations/` in order.
- Keep migration files immutable after production application.

## Smoke Test Checklist (Post Deploy)
1. Open homepage and vendor pages
2. Submit test inquiry
3. Submit test vendor application
4. Admin login (OTP/code flow)
5. Create a job + submit a quote
6. Verify records in Supabase and notification emails in Brevo logs

## Rollback
- Use Vercel dashboard to promote previous healthy deployment.
- If deploy included a bad migration, apply forward fix migration (do not mutate old migration files).
