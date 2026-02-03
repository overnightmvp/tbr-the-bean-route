# Vercel Production Errors - Troubleshooting Guide

## Error: "supabaseUrl is required" on Get a Quote Form

### Symptoms
```
Uncaught (in promise) Error: supabaseUrl is required.
    at new tJ (988.82910249256a594e.js:21:81661)
    at tV (988.82910249256a594e.js:21:85940)
```

When clicking "Get a Quote" on production (Vercel), the form fails with this error.

### Root Cause

The Supabase client in `src/lib/supabase.ts` is initialized at module load time:

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error('supabaseUrl is required.')
}

export const supabase = createClient(supabaseUrl, supabaseAnon)
```

This code runs in the browser. The environment variables **must be prefixed with `NEXT_PUBLIC_`** to be accessible in client-side code.

### The Problem

**Vercel doesn't have the environment variables configured.**

Even though you have them in `.env.local` locally, Vercel production needs them configured in the Vercel dashboard.

---

## Solution: Add Environment Variables to Vercel

### Step 1: Get Your Supabase Credentials

1. Go to: https://supabase.com/dashboard/project/pjnykwieexuoxngkgnvx
2. Click **Settings** → **API**
3. Copy these values:
   - **Project URL**: `https://pjnykwieexuoxngkgnvx.supabase.co`
   - **anon public key**: Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key** (secret): Also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` but longer

### Step 2: Add to Vercel Dashboard

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (cbw-coffee-club)
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Add these variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pjnykwieexuoxngkgnvx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your anon key) | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your service role key) | Production, Preview, Development |
| `BREVO_API_KEY` | `xkeysib-...` (your Brevo key) | Production, Preview, Development |

**CRITICAL**:
- `NEXT_PUBLIC_*` variables are embedded in the browser bundle
- `SUPABASE_SERVICE_ROLE_KEY` should NOT have `NEXT_PUBLIC_` prefix (server-only)
- `BREVO_API_KEY` should NOT have `NEXT_PUBLIC_` prefix (server-only)

### Step 3: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**

OR: Just push a new commit to trigger a deployment

---

## Verification Checklist

After redeployment, test these on production:

### ✅ Forms Work
- [ ] Go to homepage carousel
- [ ] Click "Get a Quote" on any vendor
- [ ] Fill form and submit
- [ ] Should see success message (not "supabaseUrl is required")

### ✅ Admin Panel Works
- [ ] Go to `/admin`
- [ ] Enter email, get code from logs
- [ ] Should see Inquiries/Applications/Jobs tabs load
- [ ] No 401/500 errors

### ✅ Job Board Works
- [ ] Go to `/jobs`
- [ ] Should see jobs listed
- [ ] Click a job → "Submit a Quote"
- [ ] Form should work

### ✅ Vendor Registration Works
- [ ] Go to `/vendors/register`
- [ ] Fill 3-step form
- [ ] Submit
- [ ] Should see success

---

## Additional Error: favicon.ico 404

```
/favicon.ico:1  Failed to load resource: the server responded with a status of 404
```

**Not critical** - just means no favicon exists. To fix:

1. Add `favicon.ico` to `public/` folder
2. Vercel will automatically serve it

---

## Environment Variables Quick Reference

### Client-Side (NEXT_PUBLIC_*)
Variables that need to be accessed in browser code:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `NEXT_PUBLIC_BASE_URL` (optional, for sitemap)

### Server-Side Only
Variables that should NEVER be exposed to browser:
- `SUPABASE_SERVICE_ROLE_KEY` 🔒 (bypasses RLS!)
- `BREVO_API_KEY` 🔒 (sends emails)

---

## How to Prevent This in Future

### 1. Add .env.local.example to Repo

Already done! File exists at root:
```bash
cat .env.local.example
```

### 2. Document in README

Add to README:
```markdown
## Deployment to Vercel

1. Add environment variables in Vercel dashboard (see .env.local.example)
2. Deploy
3. Verify forms work
```

### 3. Use Vercel CLI for Local Testing

```bash
npm install -g vercel
vercel env pull .env.local
```

This downloads production env vars to local `.env.local`

---

## Still Getting Errors?

### Check Build Logs

1. Go to Vercel → Deployments → Click failed deployment
2. Look for errors in build output
3. Common issues:
   - TypeScript errors (run `npm run build` locally first)
   - Missing dependencies (run `npm install`)
   - Import errors

### Check Runtime Logs

1. Go to Vercel → Logs (under Deployments)
2. Filter by "Error"
3. Look for server-side errors

### Test Locally with Production Build

```bash
npm run build
npm run start
```

This runs the production build locally. If it works here but not on Vercel, it's an environment variable issue.

---

## Summary

**Problem**: Supabase environment variables not configured in Vercel
**Solution**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel dashboard
**Result**: Forms work, database operations succeed

The app should work once you add these variables and redeploy! 🚀
