# 📋 TBR Agile Backlog — Epic Roadmap

This is the centralized source of truth for all current and future work on The Bean Route.

---

## 🔴 Epic 1: Launch Security & Stability (Priority: Urgent)
*Goal: Fix the "brutal" audit holes before real users touch the site.*

- [x] **Consolidate Documentation**: Move all project artifacts into this Agile Hub.
- [ ] **Admin Session Hardening**: Move OTP codes to DB (currently in-memory) and sign session cookies.
- [ ] **Database RLS Policies**: Lock down `quotes`, `jobs`, and `applications` (currently world-writable).
- [ ] **Rate Limiting**: Protect inquiry and registration forms from spam/DDoS.
- [ ] **Zod Validation**: Implement server-side schema validation for all POST routes.

---

## 🟡 Epic 2: Core Conversion Optimization (Priority: High)
*Goal: Improve the onboarding and booking rates.*

- [ ] **Vendor Image Support**: Allow vendors to upload at least one "hero" image during registration.
- [ ] **Job Management Link**: Send a secure "Manage Job" link to customers via email (since there are no accounts yet).
- [ ] **Submission Previews**: Allow users to see how their listing/job looks before final submit.
- [ ] **Location Autocomplete**: Integrate Google Places API for consistent location data.

---

## 🟢 Epic 3: Vendor Success & Growth (Priority: Medium)
*Goal: Make the platform valuable for vendors to stick around.*

- [ ] **Vendor Dashboard**: Let approved vendors log in and manage their profile/inquiries.
- [ ] **Quote Success Tracking**: Show vendors how many of their quotes are being viewed/accepted.
- [ ] **Review System**: Allow planners to leave feedback on vendor performance.

---

## ⚪ Epic 4: Regional & Category Expansion (Roadmap)
- [ ] **Multi-State Launch**: Hubs for NSW, QLD, and SA.
- [ ] **Category Filters**: Dedicated sections for "Specialty Beans" or "Sustainability Focused" carts.
- [ ] **Payment Bridge**: Integrate Stripe for secure deposit handling.

---

## 🔍 The "Brutal Honesty" Burn-down
| Issue | Severity | Status |
|---|---|---|
| World-Writable DB | 🔥 Critical | ⏳ Pending |
| In-memory Auth Codes | 🔥 Critical | ⏳ Pending |
| No Image Uploads | 🔴 High | ⏳ Pending |
| Hardcoded Whitelist | 🟡 Medium | ⏳ Pending |
| No Page Transitions | ⚪ Low | ⏳ Pending |
