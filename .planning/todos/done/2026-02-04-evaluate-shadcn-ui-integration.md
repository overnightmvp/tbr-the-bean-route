---
created: 2026-02-04T19:30
title: Evaluate shadcn/ui integration feasibility
area: ui
status: resolved
resolution: Decision made to stick with current Tailwind + custom components approach
resolved_at: 2026-02-05
files:
  - src/components/ui/
  - package.json
  - tailwind.config.ts
---

## Problem

Current project has custom UI components in `src/components/ui/` (Button, Card, Input, Badge, etc.) with Storybook stories.

Question: Can we integrate shadcn/ui design library to:
- Enhance component library with production-tested components
- Reduce maintenance burden
- Access wider component ecosystem (forms, modals, dialogs, etc.)

**Compatibility concerns:**
- Project already has Tailwind CSS configured
- Existing UI components follow similar pattern (variant-based styling)
- Would need migration strategy for existing components
- Storybook integration requirements

## Resolution

**Decision: Stick with current Tailwind CSS + custom components approach**

Rationale:
- Current UI components are working well
- Project is MVP-focused, custom approach gives full control
- No need for additional complexity at this stage
- Can revisit if complex components are needed later
