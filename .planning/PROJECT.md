# The Bean Route: 90-Day Content & Growth Marketing Initiative

## What This Is

The Bean Route is expanding from a simple vendor marketplace into a **coffee culture and marketplace authority hub**. This 90-day initiative builds 90 blog posts (1 per day) that drive organic traffic, educate both vendors and event organizers, and create a growth loop with partner venues offering free coffee incentives to new vendor sign-ups.

## Core Value

**Drive organic discovery and vendor acquisition through high-intent coffee and event content that becomes the go-to resource for finding, understanding, and booking coffee experiences in Melbourne's Chadstone and surrounding suburbs.**

## Requirements

### Validated

- ✓ Supabase PostgreSQL database (existing)
- ✓ Next.js 14 with App Router (existing)
- ✓ Vendor directory and profiles (existing)
- ✓ Job board for event postings (existing)
- ✓ Admin dashboard for management (existing)
- ✓ Vendor self-registration flow (existing)

### Active

- [ ] Payload CMS integration for blog management
- [ ] 90 blog posts covering 4 categories: venue spotlights, location guides, how-to guides, and coffee education
- [ ] Internal linking strategy connecting blogs to vendor profiles, other posts, and guides
- [ ] External linking partnerships with venue/coffee/event-related sites
- [ ] Static ad placement for free coffee offers on vendor registration page
- [ ] Static ad placement for free coffee offers in blog sidebars
- [ ] Micro-interactions and visual polish for blog and ad components
- [ ] SEO optimization on all posts (meta tags, structured data, keyword targeting)
- [ ] Analytics tracking for organic traffic, conversions, and engagement

### Out of Scope

- Mobile app — web-first focus
- Real-time chat or messaging — not core to marketplace function
- Advanced personalization — not MVP feature
- Video content — text/image focus for 90-day window
- Multi-location expansion beyond Melbourne metro in 90 days

## Context

**Current State:**
- The Bean Route is a two-sided marketplace connecting event organizers with coffee cart vendors
- 10 seed vendors in Melbourne with suburb coverage
- Public vendor directory, job board, and inquiry system
- Admin portal for vendor application approvals and inquiry management

**Geographic Strategy:**
- **Phase 1 (Days 1-30):** Deep Chadstone focus with immediate surroundings (Fountain Gate, Westfield Chadstone area)
- **Phase 2 (Days 31-60):** Expand to Knox, Notting Hill, Bentleigh
- **Phase 3 (Days 61-90):** Additional suburbs and meta-content (best of all areas)

**Content Mix (90 posts):**
1. **Venue Spotlights (30 posts):** Individual coffee carts and coffee shops in coverage areas with photos, location, hours, linking to relevant guides
2. **Location Guides (20 posts):** "Best Coffee Carts in [Suburb]", "Coffee Shops Near [Venue Type]" with multiple venue links and internal linking
3. **How-To Guides (15 posts):** Vendor guides ("How to Price Your Cart", "Growing Your Coffee Cart Business"), organizer guides ("Guide to Hiring Coffee Carts", "Event Catering Planning")
4. **Coffee Education (25 posts):** "How to Spot Good Coffee", "Benefits of Coffee", "L-Theanine & Coffee", "Is Decaf Really Coffee?", "Why Your Coffee Tastes Different in Different Cups", "The Barista Relationship", "What Makes a Great Barista"

**Growth Loop:**
- Partner venues offer free coffee coupons for new vendor registrations
- Ads placed on `/vendors/register` and blog sidebars
- Content drives SEO traffic → discovery → registration → vendor acquisition

**Target Audience:**
- **Primary:** Event organizers searching "hire coffee carts Melbourne" and related terms
- **Secondary:** Coffee enthusiasts and vendors seeking growth knowledge
- **Tertiary:** Local coffee culture and venue discovery

## Constraints

- **Resource:** Solo content creator (you write/edit, Claude assists with drafting and strategy)
- **Timeline:** 90 days = 1 post per day (strict deadline for MVP)
- **Tech Stack:** Payload CMS for blog backend, Next.js front-end, Supabase for data
- **Content Quality:** Balance volume with quality — AI-drafted, human-refined posts
- **SEO:** Must target high-intent, local keywords with strong internal/external linking
- **Production:** Batch writing approach + templated formats to maintain pace

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Payload CMS over MDX | Allows non-developers to publish, easier content scheduling | — Pending |
| 1 post per day target | Aggressive timeline creates consistent SEO signal and content momentum | — Pending |
| Both audiences equally | Vendors need guides, organizers need discovery — content bridges both | — Pending |
| Free coffee incentive model | Low-cost growth lever, creates venue partnerships, drives registrations | — Pending |
| Coffee education focus | Differentiates from competitor marketplaces, builds authority, improves SEO | — Pending |
| AI-assisted production | Enables 90-day timeline solo, maintains quality through human refinement | — Pending |

---
*Last updated: 2026-02-23 after initialization*
