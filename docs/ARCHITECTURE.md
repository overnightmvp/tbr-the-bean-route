# ARCHITECTURE.md

## High-level Architecture
- **Frontend:** Next.js App Router
- **Backend:** Next.js API routes
- **Database:** Supabase Postgres
- **Email:** Brevo
- **Hosting:** Vercel

## App Areas
- Public marketplace pages: `/app`, `/vendors/*`, `/jobs/*`
- Admin area: `/dashboard` and admin API routes
- Vendor area: `/vendor/*`

## Data Model (Core)
- `vendors`
- `inquiries`
- `vendor_applications`
- `jobs`
- `quotes`

Additional support tables may exist (e.g., auth/session, notifications).

## Integration Boundaries
- Client-safe Supabase keys use `NEXT_PUBLIC_*`
- Sensitive operations (admin/data writes) use server-side routes + service role key
- Email sends occur server-side only

## Migration Strategy (Minimal)
Canonical location for forward migrations:
- `supabase/migrations/*.sql`

Legacy SQL files may still exist in other folders and should be gradually consolidated.
