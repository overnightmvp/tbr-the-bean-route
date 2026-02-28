# ENV_CONFIG_MATRIX.md

Purpose: single source of truth for environment setup across local dev, staging (preview), and production.

## 1) Environment Summary

| Environment | Runtime | Source of truth | Deploy trigger | Data policy |
|---|---|---|---|---|
| Dev | Local (`npm run dev`) | `.env.local` (not committed) | manual | Test/sandbox data |
| Staging | Vercel Preview | Vercel env vars (Preview scope) | PR/open branch deploy | Safe test data only |
| Prod | Vercel Production | Vercel env vars (Production scope) | merge to `main` | Real production data |

---

## 2) Required Variables by Environment

> Rule: values with `NEXT_PUBLIC_` are client-visible. Never put secrets behind `NEXT_PUBLIC_`.

| Variable | Dev | Staging | Prod | Secret? | Notes |
|---|---:|---:|---:|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ | No | Project URL used by browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ | No | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | ✅ | Yes | Server-only, admin/bypass operations |
| `BREVO_API_KEY` | ✅ | ✅ | ✅ | Yes | Server-only, email delivery |
| `NEXT_PUBLIC_BASE_URL` | Optional | ✅ | ✅ | No | Canonical URL for sitemap/SEO |

---

## 3) Value Mapping Template

Fill this in and keep updated after every infra change.

| Variable | Dev value source | Staging value source | Prod value source |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project: `________` | Supabase project: `________` | Supabase project: `________` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API keys | Supabase API keys | Supabase API keys |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API keys (secret) | Supabase API keys (secret) | Supabase API keys (secret) |
| `BREVO_API_KEY` | Brevo API key | Brevo API key | Brevo API key |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | `https://<preview-domain>` | `https://<prod-domain>` |

---

## 4) Vercel Scope Rules (Critical)

- Set every required var in **all needed scopes**:
  - Development
  - Preview
  - Production
- After changing env vars, **redeploy** affected environment.
- Never rely on local `.env.local` assumptions for Vercel runtime.

---

## 5) Validation Checklist (per environment)

### Dev
- [ ] `npm run dev` starts without missing env errors
- [ ] Inquiry form submit succeeds
- [ ] Admin login flow works

### Staging
- [ ] PR preview deploy is green
- [ ] Inquiry, job post, quote submit smoke tests pass
- [ ] Email logs show expected sends (test recipients)

### Prod
- [ ] Main deploy is green
- [ ] Post-deploy smoke tests pass (`docs/DEPLOYMENT.md`)
- [ ] No critical runtime errors in Vercel logs

---

## 6) Configuration Drift Controls

- Keep this matrix updated whenever env vars are added/renamed.
- Add new required vars to:
  1) `.env.local.example`
  2) this matrix
  3) deployment checklist
- Review env parity weekly (staging vs prod).

