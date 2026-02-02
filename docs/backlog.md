# The Bean Route — Product Backlog

---

## Brutal Assessment

The scaffolding is solid. Two matching flows, admin tooling, registration wizard, job board. Clean code, consistent patterns. But **the product doesn't work end-to-end yet.** Three things will kill it before it gets traction:

1. **No notifications exist.** Every submission promises "we'll be in touch" or "we'll email you." None of those emails are sent. An inquiry, a quote, a vendor application — they all land in the database and stop dead. Admin sees them, but admin has no outbound channel either.

2. **The browse page is fake.** `/app` renders 10 hardcoded vendors from `vendors.ts`. The `vendors` Supabase table is empty and unused. When an application is approved in admin, no vendor row is created. The marketplace and the database are disconnected.

3. **Admin is wide open.** `/admin` has zero authentication. Anyone with the URL can read every inquiry (names, emails, phone numbers), approve or reject vendor applications, and manage jobs. This is a data privacy problem today, not a future one.

Fix these three. Everything else is secondary.

---

## What Works Right Now (Smoke Tests)

Verify these before building anything new:

| # | Flow | How | Confirm |
|---|---|---|---|
| 1 | Browse → Inquire | `/app` → pick vendor → "Get a Quote" → fill → submit | Success state. Row in `inquiries` with status `pending`. |
| 2 | Admin manages inquiry | `/admin` → Inquiries tab | Row visible. Status buttons work. Detail modal shows all fields. |
| 3 | Register as vendor | `/vendors/register` → 3 steps → submit | Success state. Row in `vendor_applications` with status `pending`. |
| 4 | Admin approves application | `/admin` → Applications → Approve | Status → `approved`. (Bug: no vendor row is created.) |
| 5 | Post a job | `/jobs/create` → 3 steps → submit | Success state. Row in `jobs`. "View your job" link works. |
| 6 | Submit a quote | `/jobs/{id}` → "Submit a Quote" → fill → submit | Success state. Row in `quotes`. Quote appears in detail after modal closes. |
| 7 | Admin manages jobs | `/admin` → Jobs tab | Jobs listed. Quotes counted. Detail modal shows quotes. Close works. |
| 8 | Job board filters | `/jobs` | Filter by event type, suburb, budget. Results update. |
| 9 | Vendor detail page | `/app` → "View" on any card | Page loads. Inquiry modal works from here. |
| 10 | Landing page | `/` | Carousel scrolls. Both CTAs link correctly. |
| 11 | Get Listed CTA | `/vendors-guide/get-listed` | Button links to `/vendors/register` (not mailto). |
| 12 | Nav completeness | Any page | Jobs link present in desktop + mobile nav. All links resolve. |

**Form validation smoke tests** — on every form, clear required fields and click Next/Submit. Errors should appear inline. Specifically:
- Vendor registration: description under 30 chars → blocked
- Job creation: past date → blocked by min attribute
- Job creation: budget min > max → error
- Quote and inquiry modals: empty required fields → errors
- Email fields: invalid format → error

---

## Epic Breakdown

| Epic | Priority | Why |
|---|---|---|
| E1: Email Notifications | P0 | Dead end without this. Nothing converts. |
| E2: Connect Browse to Real Data | P0 | The marketplace is fiction right now. |
| E3: Protect Admin | P0 | PII is exposed. Fix before any real users. |
| E4: Clarify the Two Flows | P1 | Users won't know which flow to use. |
| E5: Quote & Inquiry Acceptance | P1 | Closes the loop. Enables conversion. |
| E6: Vendor Self-Service | P2 | Removes admin as a bottleneck at scale. |
| E7: Cleanup & Hardening | P2 | Technical debt and missing guardrails. |

---

## E1: Email Notifications

> *Every flow is a dead end without this. Single email utility, one template per event type.*

### US-1.1 — Notify vendor on new inquiry
**As a** vendor, **when** someone submits an inquiry for my cart, **I want** an email so I can respond.
- Triggered: on insert into `inquiries`
- To: vendor's `contact_email` (from hardcoded data or `vendors` table)
- Contains: planner's name, email, phone, event details, estimated cost
- Fallback: if no vendor email, send to `hello@thebeanroute.com.au`

### US-1.2 — Confirm inquiry submission to planner
**As an** event planner, **after** submitting an inquiry, **I want** a confirmation email.
- To: `contact_email` from the inquiry form
- Contains: vendor name, summary of what was submitted

### US-1.3 — Notify event owner on new quote
**As an** event owner, **when** a vendor quotes on my job, **I want** an email.
- Triggered: on insert into `quotes`
- To: job owner's `contact_email` (from `jobs` table)
- Contains: vendor name, price/hr, message, vendor email

### US-1.4 — Confirm quote submission to vendor
**As a** vendor, **after** submitting a quote, **I want** confirmation it was received.
- To: vendor's `contact_email` from the quote form
- Contains: job title, quoted price

### US-1.5 — Notify applicant on application decision
**As a** vendor applicant, **when** admin approves or rejects my application, **I want** an email.
- Triggered: on status change in `vendor_applications`
- Approved email: "Your listing is live" + next steps
- Rejected email: generic + invitation to reapply

**Build note:** One `sendEmail(to, subject, text)` function. Resend is the simplest integration for Next.js. All triggers can be implemented as Supabase Edge Functions or called directly after the database write in the client component (simpler for MVP).

---

## E2: Connect Browse to Real Data

> *The browse page must show database vendors. Approved applications must create vendor rows.*

### US-2.1 — Browse fetches from Supabase
**As a** user, **I want** `/app` to show real vendors from the database.
- Replace `getAllVendors()` import with a Supabase fetch on mount
- Filters work against real data
- Empty state if no vendors exist
- Existing filter UX unchanged

### US-2.2 — Approving an application creates a vendor listing
**As an** admin, **when** I approve a vendor application, **the vendor should appear on the browse page.**
- On status → `approved`: insert into `vendors` table
- Map fields: business_name, specialty, suburbs, price_min/max, capacity_min/max, description, contact_email, contact_phone, website
- Generate slug from business_name (lowercase, hyphens)
- Set `verified = false` initially
- Tags populated from `event_types` array

### US-2.3 — Vendor detail pages work for database vendors
**As a** user, **I want** `/vendors/[slug]` to load data from Supabase.
- Fetch vendor by slug from `vendors` table
- Inquiry modal references the real `vendor_id`
- 404 if slug doesn't match any vendor

### US-2.4 — Remove dead code
- Delete `src/lib/vendors.ts`
- Delete `src/lib/experiences.ts`
- Remove all imports. Build must pass.

---

## E3: Protect Admin

> *Minimum: no unauthenticated access to PII.*

### US-3.1 — Admin requires authentication
**As an** admin, **I want** `/admin` to require login before showing any data.

**Simplest MVP path:**
1. Hardcode one admin email (e.g. `admin@thebeanroute.com.au`)
2. User enters email on `/admin` → if it matches, send a 6-digit code via email (uses E1 infrastructure)
3. User enters code → session stored in cookie or localStorage
4. All admin data fetches gated on valid session
5. Logout clears session

### US-3.2 — Admin uses service role for reads
**As an** admin, **when** I view inquiries, **the reads should use the Supabase service role key** (not anon).
- Current RLS on `inquiries` already blocks anon SELECT ✓
- Admin page must use `supabaseAdmin` client initialized with `SUPABASE_SERVICE_ROLE_KEY`
- This key must be server-side only (never exposed to browser)
- **Implication:** Admin data fetches should move to API routes or Server Actions, not client-side Supabase calls

---

## E4: Clarify the Two Matching Flows

> *Both flows solve "match planner with vendor" but they're different use cases. Users need to know which to pick.*

### US-4.1 — Distinguish the two flows in copy
The distinction is:
- **"Get a Quote"** = I already know which vendor I want. One vendor, direct contact.
- **"Post a Job"** = I want competing quotes from multiple vendors. I'll pick the best one.

**Where to state this:**
- `/jobs` page subtitle: "Post an event and get competing quotes from multiple vendors"
- `/app` page: "Browse vendors" framing stays as-is (implies you've chosen)
- FAQ or guide page that explains both options

### US-4.2 — Job board shows competition signal
**As a** vendor browsing jobs, **I want** to see how many quotes a job already has, **so that** I can judge whether it's worth quoting.
- Quote count already shown on job cards ✓
- Consider: dim or hide jobs that already have an accepted quote (needs E5 first)

---

## E5: Quote & Inquiry Acceptance

> *Closing the loop. Without this, matched parties have to figure it out via email.*

### US-5.1 — Event owner can accept a quote
**As an** event owner, **I want** to accept a quote on my job, **so that** the vendor knows they got the gig.
- Each quote on `/jobs/{id}` gets an "Accept" button
- Accepting: updates quote status, sends vendor an email (E1), optionally closes the job
- Only one quote can be accepted per job
- **Schema change:** Add `status TEXT DEFAULT 'pending'` to `quotes` (pending | accepted | declined)

### US-5.2 — Vendor is notified on acceptance
**As a** vendor, **when** my quote is accepted, **I get an email** with full event details and the event owner's contact info.
- Depends on: US-5.1 + US-1.x infrastructure

### US-5.3 — Vendor can respond to an inquiry
**As a** vendor, **when** I receive an inquiry, **I want** a way to respond or decline in-app (not just via raw email).
- **Option A (simple):** Reply-to header on notification email routes back to planner. No in-app action needed.
- **Option B (later):** Vendor dashboard with accept/decline per inquiry.
- Recommendation: ship Option A with E1. Revisit Option B in E6.

---

## E6: Vendor Self-Service

> *Removes admin as a permanent bottleneck. Vendors manage their own business.*

### US-6.1 — Vendor login and dashboard
**As a** vendor, **I want** to log in and see my inquiries and quotes.
- Auth: same magic-link pattern as admin (E3), but for any registered vendor email
- Dashboard shows: inquiries for my vendor_id, quotes I've submitted (matched by email), my listing status
- Can see full details of each

### US-6.2 — Vendor can edit their listing
**As a** vendor, **I want** to update pricing, suburbs, or description.
- Edit form pre-populated from `vendors` table
- Save updates the row immediately
- Changes reflected on browse page

### US-6.3 — Vendor can upload a cart photo
**As a** vendor, **I want** to add a photo of my cart.
- Upload via Supabase Storage
- Stored URL saved to `image_url` column
- Displayed on browse cards and vendor detail page (replaces gradient placeholder)

---

## E7: Cleanup & Hardening

### US-7.1 — Rate limiting on submissions
Prevent spam on inquiries, quotes, applications, and jobs.
- Option: Supabase rate limits on RLS policies
- Option: middleware checking IP + table per minute
- Threshold: 5 submissions per IP per hour is reasonable for MVP

### US-7.2 — Server-side validation
All form submissions currently validate client-side only. Add server-side validation (API route or Server Action) that mirrors client rules before the Supabase insert. Return errors to the form if invalid.

### US-7.3 — Remove dead code
- `src/lib/experiences.ts` — unused legacy data, delete it
- Any unused imports or components left over from previous iterations

### US-7.4 — Storybook build separation
`npm run build` currently includes Storybook output in `public/storybook/`. This adds build time and bundle size for production. Separate storybook build from production build.

---

## What NOT to Build Next

These are tempting but premature:

- **Payment processing** — the product hasn't proven it can match parties reliably yet. Get to first conversion, then add payments.
- **Vendor search/autocomplete** — there are 10 vendors (soon maybe 20-30). Filtering is sufficient.
- **Mobile app** — the responsive web experience covers mobile. Native adds nothing at this stage.
- **AI-powered matching** — premature. The filtering is simple and works. Add ML when you have enough data to learn from.
- **Vendor reviews/ratings** — needs volume first. With <100 transactions, ratings are meaningless.
- **Multi-city expansion** — nail Melbourne first. The suburb list and vendor base are Melbourne-specific.

---

## Build Order

If you're working through this sequentially:

```
1. E3 (Protect Admin)    — do this first. 2 hours of work, fixes the biggest risk.
2. E1 (Notifications)    — foundation that E2, E5 depend on.
3. E2 (Real Data)        — makes the marketplace real.
4. E5 (Acceptance)       — closes the conversion loop.
5. E4 (Clarify Flows)    — copy/UX changes, can run in parallel with anything.
6. E6 (Vendor Portal)    — scale play, not day-one.
7. E7 (Cleanup)          — do incrementally as you go.
```
