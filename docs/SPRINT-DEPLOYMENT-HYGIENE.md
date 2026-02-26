# SPRINT: Deployment Hygiene (Sprint 1)

Goal: make deploys predictable, verifiable, and low-risk.

Duration: 1 week
Owner: PM + Engineering
Definition of Done: green CI, documented env parity, repeatable smoke test, rollback-ready.

---

## Board Columns
- Backlog
- In Progress
- In Review
- Done

---

## Sprint Backlog (prioritized)

### DH-01 — Environment matrix finalized
**Type:** Docs/Infra
**Priority:** P0
**Estimate:** 2 pts
**Acceptance Criteria:**
- `docs/ENV_CONFIG_MATRIX.md` completed with real values/sources.
- All required vars mapped for dev/staging/prod.
- Team confirms no unknown required vars remain.

### DH-02 — Env parity audit (Vercel scopes)
**Type:** Infra
**Priority:** P0
**Estimate:** 3 pts
**Acceptance Criteria:**
- Verify each required var exists in Development/Preview/Production scopes.
- Screenshot or exported checklist attached to ticket.
- Any missing vars added and redeployed.

### DH-03 — CI baseline enforcement
**Type:** CI
**Priority:** P0
**Estimate:** 3 pts
**Acceptance Criteria:**
- PR to `main` requires passing CI checks (`lint` + `build`).
- Broken PR demonstrably blocked from merge.

### DH-04 — Post-deploy smoke test script/checklist
**Type:** QA/Ops
**Priority:** P0
**Estimate:** 3 pts
**Acceptance Criteria:**
- Smoke checklist exists and is runnable in <15 minutes.
- Covers inquiry, vendor application, admin login, job+quote path.
- Stored in `docs/DEPLOYMENT.md` and linked from sprint board.

### DH-05 — Rollback playbook hardening
**Type:** Ops
**Priority:** P1
**Estimate:** 2 pts
**Acceptance Criteria:**
- Clear steps for Vercel rollback + post-rollback verification.
- Owner and escalation contact defined.

### DH-06 — Migration discipline lock-in
**Type:** DB/Process
**Priority:** P1
**Estimate:** 3 pts
**Acceptance Criteria:**
- Team uses only `supabase/migrations/` for forward changes.
- New migration naming convention documented.
- “Do not edit applied migrations” explicitly documented.

### DH-07 — Alerting/log review ritual
**Type:** Reliability
**Priority:** P2
**Estimate:** 2 pts
**Acceptance Criteria:**
- Daily/weekly log review owner assigned.
- Minimal alert thresholds defined (build fail, runtime 5xx spikes, email failure rate).

---

## Suggested Sprint Plan

### Day 1–2
- DH-01, DH-02

### Day 3
- DH-03, DH-04

### Day 4
- DH-05, DH-06

### Day 5
- DH-07 + retro

---

## Metrics for Sprint Success

- Deployment failure rate reduced week-over-week
- Mean time to detect deploy issues < 15 minutes
- Mean time to rollback < 10 minutes
- 100% PRs to main pass required CI before merge

---

## Ready-to-copy Ticket Format

**Title:** `[DH-XX] <task>`
**Description:**
- Context
- Scope
- Out of scope

**Acceptance Criteria:**
- [ ] ...
- [ ] ...

**Evidence:**
- Link to PR
- Link/screenshot to Vercel/Supabase proof

