# Markdown Blog System

## What Changed

Payload CMS has been **completely removed** and replaced with a simple, fast markdown-based blog system.

### Why We Removed Payload

After 3+ attempts to fix authentication issues (401/403 errors), it became clear that Payload CMS 3.x has fundamental compatibility problems with Next.js 15 App Router. Rather than waste more time debugging, we switched to a simpler, more reliable approach.

## How the New System Works

Blog posts are now simple markdown files stored in `/content/posts/`:

```
content/
  posts/
    example-post.md
    another-post.md
    your-post-here.md
```

## Creating a Blog Post

Create a new `.md` file in `content/posts/`:

```markdown
---
title: "Your Post Title"
slug: "your-post-slug"
publishedAt: "2026-02-27"
status: "published"
category: "guides"
excerpt: "A brief description of your post for previews"
---

# Your Content Here

Write your blog post content in markdown format.

## Subheadings Work

- Bullet points work
- Lists are supported
- **Bold** and *italic* text
- [Links](https://example.com) work too

### Smaller Headings

Everything you need for a great blog post.
```

## Frontmatter Fields

Required fields in the `---` section at the top:

- **title**: Post title (shows in cards and article header)
- **publishedAt**: Publication date (YYYY-MM-DD format)
- **status**: Must be `"published"` to show on site (or `"draft"` to hide)

Optional fields:

- **slug**: URL-friendly version of title (defaults to filename)
- **category**: Used for grouping posts (e.g., "guides", "tips")
- **excerpt**: Short description for post cards

## Benefits Over Payload CMS

✅ **No authentication issues** - it's just files
✅ **Git version control** - track all changes
✅ **Fast builds** - no database queries
✅ **Simple** - no complex CMS to manage
✅ **Portable** - take your content anywhere
✅ **Free** - no CMS hosting costs

## Deploying New Posts

1. Create your `.md` file in `content/posts/`
2. Commit to git: `git add content/posts/your-post.md && git commit -m "Add blog post"`
3. Push to deploy: `git push`
4. Next.js will rebuild and your post goes live

## Example Post Included

Check `content/posts/example-post.md` for a complete example with all features.

## What Was Removed

- Payload CMS packages (~300 packages removed)
- `/src/app/(payload)/` directory (admin UI)
- `/src/app/api/(payload)/` directory (API routes)
- `/src/collections/` directory (CMS collections)
- `/src/payload.config.ts` and related files
- Database dependencies for blog (vendors still use Supabase)

## Environment Variables

You can remove these from `.env.local` if you want:
- `PAYLOAD_SECRET`
- `DATABASE_URI` (only if it was used exclusively for Payload)

**Keep** all other Supabase variables - they're still used for vendors, inquiries, etc.

## Writing Your 30 Posts

You can now write all 30 blog posts as markdown files. No authentication hassles, no database issues, just content.

---

**Questions?** The blog system is now completely file-based. Just create markdown files and they automatically appear on your site.
