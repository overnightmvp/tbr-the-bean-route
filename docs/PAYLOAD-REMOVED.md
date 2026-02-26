# Payload CMS Removed (February 2026)

## What Happened

Payload CMS was removed from the project and replaced with a simple markdown-based blog system.

## Why

After multiple attempts to fix authentication issues (401/403 errors), it became clear that Payload CMS 3.x has fundamental compatibility problems with Next.js 15 App Router. The authentication system was not propagating user context correctly, causing `req.user` to be `undefined` even after successful login.

Following systematic debugging principles: **after 3+ failed fixes, question the architecture** - we did, and removed it.

## What Was Removed

- All Payload CMS packages (~300 npm packages)
- `/src/app/(payload)/` - Admin UI routes
- `/src/app/api/(payload)/` - API routes
- `/src/payload.config.ts` - Configuration file
- `/src/collections/` - Posts, Media, Users collections
- `/src/lib/payload-auth-handlers.ts` - Custom auth handlers
- Supabase `payload` schema (blog-specific tables)

## What Replaced It

A simple, reliable markdown blog system:

- **Content location**: `/content/posts/*.md`
- **Rendering**: `gray-matter` + `react-markdown`
- **Utilities**: `src/lib/posts.ts`
- **Guide**: `docs/MARKDOWN-BLOG-GUIDE.md`

## Benefits

✅ No authentication issues
✅ Git version control for all content
✅ Fast builds (no database queries)
✅ Simple to manage
✅ Free (no CMS hosting costs)
✅ Portable content

## Migration Path

If you had existing Payload blog posts:

1. Export posts from Payload database (if they existed)
2. Convert to markdown format with frontmatter
3. Save to `/content/posts/`
4. Commit to git

Since this project was in development, no migration was needed.

## Environment Variables

You can now remove from `.env.local`:
- `PAYLOAD_SECRET`
- `DATABASE_URI` (if used only for Payload)

Keep all Supabase variables - they're still used for vendors, inquiries, jobs, etc.

## References

- **Debugging session**: Systematic debugging led to this decision
- **Related issues**:
  - [Payload #8426](https://github.com/payloadcms/payload/issues/8426) - API-Key 403 errors
  - [Payload #6402](https://github.com/payloadcms/payload/issues/6402) - Custom paths 401 errors
- **Replacement guide**: `docs/MARKDOWN-BLOG-GUIDE.md`

## Lesson Learned

**Sometimes the best solution is to simplify.** For a 30-post blog, markdown files work better than a complex CMS with authentication problems.
