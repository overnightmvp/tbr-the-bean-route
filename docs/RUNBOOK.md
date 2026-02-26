# RUNBOOK.md

## Daily Ops
- Check Vercel deployment health
- Check Supabase project status
- Check Brevo delivery logs for failures

## Incident Triage

### Forms failing in production
Likely causes:
- Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- API route runtime error

Actions:
1. Check Vercel env vars
2. Check Vercel runtime logs
3. Verify Supabase availability

### Admin access issues
Likely causes:
- Missing `SUPABASE_SERVICE_ROLE_KEY`
- OTP flow issue

Actions:
1. Verify server env vars
2. Inspect auth route logs
3. Validate DB table access and session cookies

### Emails not delivering
Likely causes:
- Missing/invalid `BREVO_API_KEY`
- Brevo sender/domain limits

Actions:
1. Verify Brevo API key in env vars
2. Check Brevo dashboard logs
3. Trigger a test email path

## Pre-release Gate
Before production release:
- `npm run lint`
- `npm run build`
- Run smoke checklist from `docs/DEPLOYMENT.md`
