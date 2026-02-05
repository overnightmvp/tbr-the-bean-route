---
created: 2026-02-04T19:30
title: Evaluate shadcn/ui integration feasibility
area: ui
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

## Solution

**Phase 1: Research & evaluation**
- Use context7 MCP to check shadcn/ui documentation
- Analyze compatibility with Next.js 14 App Router
- Review component overlap with existing UI library
- Check Tailwind config requirements

**Phase 2: Proof of concept**
- Install shadcn/ui CLI
- Add 1-2 components (e.g., Dialog, Select) that don't exist currently
- Verify Storybook compatibility
- Test with existing design tokens

**Phase 3: Decision point**
Options:
1. **Full migration**: Replace custom components with shadcn/ui equivalents
2. **Hybrid approach**: Keep existing components, use shadcn/ui for new ones
3. **No integration**: Current custom library is sufficient

**Phase 4: Implementation (if approved)**
- Migration plan for existing components
- Update Storybook stories
- Documentation updates

**Key questions to answer:**
- Bundle size impact?
- TypeScript type safety maintained?
- Accessibility improvements?
- Team learning curve?
