# PRODUCT.md

## Product
The Bean Route (TBR) is a Melbourne-focused marketplace that helps:
1. **Event organizers** find and book coffee vendors.
2. **Vendors** receive leads, quote on jobs, and manage visibility.

## Core User Flows

### 1) Direct inquiry flow
- User browses vendors (`/app`, `/vendors/[slug]`)
- User submits inquiry
- Vendor + planner receive notifications

### 2) Job board flow
- Planner posts job (`/jobs/create`)
- Vendors browse jobs (`/jobs`) and submit quotes
- Planner reviews quotes and follows up

### 3) Vendor onboarding flow
- Vendor submits application (`/vendors/register`)
- Admin reviews and approves/rejects
- Approved vendor appears in marketplace

## MVP Success Criteria
- Inquiries successfully saved and visible to admin
- Job posting and quote submission work end-to-end
- Vendor registration and admin review function reliably
- Basic notification emails are delivered

## Non-Goals (for now)
- Heavy workflow automation
- Complex vendor billing and invoicing
- Multi-region rollout beyond Melbourne
