# Payload CMS Entry Guide: Venue Spotlight Posts

## Overview

This guide provides step-by-step instructions for manually entering the 10 venue spotlight posts into Payload CMS. Each post has been drafted as markdown and now needs to be published in the Posts collection.

**Estimated Time:** 5-7 minutes per post (50-70 minutes total for all 10)

**Prerequisites:**
- Access to Payload CMS admin at `/admin`
- Admin authentication credentials
- Familiarity with Lexical rich text editor
- Featured images prepared (or placeholders documented)

---

## Quick Reference: 10 Spotlight Posts

| # | Slug | Business Name | Status | Word Count |
|---|------|---------------|--------|------------|
| 01 | artisan-espresso-chadstone | Artisan Espresso Co. | ✅ Verified | ~1,150 |
| 02 | mobile-brew-fountain-gate | Mobile Brew | ⚠️ Needs verification | ~1,120 |
| 03 | coffee-culture-westfield | Coffee Culture Café | ✅ Verified | ~1,180 |
| 04 | bean-cart-glen-iris | Bean & Cart Co. | ⚠️ Needs verification | ~1,210 |
| 05 | espresso-express-malvern | Espresso Express | ⚠️ Needs verification | ~1,175 |
| 06 | roaming-roasters-oakleigh | Roaming Roasters | ⚠️ Needs verification | ~1,190 |
| 07 | brew-hub-chadstone | Brew Hub | ⚠️ Needs verification | ~1,185 |
| 08 | cup-cart-fountain-gate | Cup & Cart | ⚠️ Needs verification | ~1,195 |
| 09 | java-junction-glen-iris | Java Junction | ⚠️ Needs verification | ~1,180 |
| 10 | percolate-malvern | Percolate | ⚠️ Needs verification | ~1,230 |

**IMPORTANT:** Posts marked "⚠️ Needs verification" should have status set to 'draft' in Payload until business details are verified. Only publish verified posts (01 and 03) initially.

---

## Step-by-Step Entry Process

### Step 1: Access Payload Admin

1. Navigate to `http://localhost:3000/admin` (development) or `https://yourdomain.com/admin` (production)
2. Log in with admin credentials
3. Click "Posts" in the left sidebar navigation
4. Click "Create New" button (top right)

### Step 2: Fill Standard Fields

**Title:**
- Copy the `title` value from markdown frontmatter
- Example: "Artisan Espresso Co.: Award-Winning Specialty Coffee Cart in Chadstone | The Bean Route"
- Keep the " | The Bean Route" suffix for SEO branding

**Slug:**
- Payload auto-generates from title, or manually enter the `slug` from frontmatter
- Example: `artisan-espresso-chadstone`
- Ensure slug matches internal linking references in other posts

**Excerpt:**
- Copy the `meta_description` from frontmatter (150-160 characters)
- This becomes the post excerpt and meta description
- Example: "Discover Artisan Espresso Co., Chadstone's premium mobile coffee cart serving specialty coffee and award-winning latte art for weddings, corporate events, and private functions."

### Step 3: Convert Markdown Content to Lexical

**Converting Markdown to Lexical:**

Payload uses the Lexical rich text editor. You cannot paste raw markdown directly. Follow this process:

1. **Copy Content Section by Section:**
   - Copy one section at a time from the markdown file
   - Paste into Lexical editor (it will convert to plain text)
   - Apply formatting using Lexical toolbar

2. **Heading Conversion:**
   - Markdown `# Heading` → Select text, choose "Heading 1" from dropdown
   - Markdown `## Heading` → Select text, choose "Heading 2" from dropdown
   - Markdown `### Heading` → Select text, choose "Heading 3" from dropdown

3. **Paragraph Formatting:**
   - Markdown paragraphs paste as plain text → No action needed (default is paragraph)
   - Bold text: Select text, click **B** button or use Ctrl/Cmd + B
   - Italic text: Select text, click *I* button or use Ctrl/Cmd + I

4. **Link Insertion:**
   - Markdown `[text](url)` → Select text, click link icon, paste URL
   - For internal links (like "best-coffee-carts-chadstone"), use placeholder URL: `/blog/best-coffee-carts-chadstone` (will be updated after those posts are published)
   - For vendor profile links, use: `/vendors/[vendor-slug]`

5. **List Conversion:**
   - Markdown bulleted lists → Select lines, click bullet list button
   - Markdown numbered lists → Select lines, click numbered list button

**Pro Tip:** Work section by section (Introduction, About, Menu, Pricing, Why Choose, How to Book, Conclusion) to maintain structure.

### Step 4: Featured Image Upload

**For Verified Venues (01, 03):**
1. Click "Featured Image" upload field
2. Upload high-quality image (recommended: 1200x630px, under 300KB)
3. Add alt text: "[Business Name] mobile coffee cart" or "[Business Name] café interior"
4. If no image available yet: Document placeholder in notes field

**For Unverified Venues (02, 04-10):**
1. Use generic coffee cart/café stock images temporarily
2. Document in internal notes: "PLACEHOLDER IMAGE - replace with vendor photo after verification"
3. Or leave empty and add featured images after vendor verification

**Image Sources (if needed):**
- Vendor Instagram/Facebook (request permission first)
- Stock photo sites: Unsplash, Pexels (search "coffee cart", "mobile barista", "specialty coffee")
- Generic placeholder: Use a high-quality coffee cart image with note "Generic placeholder pending vendor photo"

### Step 5: Set Status and Publishing

**Status Field:**
- **Verified venues (01, 03):** Select `published`
- **Unverified venues (02, 04-10):** Select `draft` (human review required before publishing)

**Published At:**
- For published posts: Set to current date/time or stagger by 1 day for SEO publishing cadence
- For draft posts: Leave empty (will be set when status changes to published)

**Publishing Cadence Recommendation:**
- Day 1: Post 01 (Artisan Espresso Co.)
- Day 2: Post 03 (Coffee Culture Café)
- Day 3-12: Posts 02, 04-10 (after verification, publish 1 per day)

### Step 6: Category & Conversion Goal

**Category:**
- Select `event-focused` (all venue spotlights are event-focused content)
- This affects how posts are grouped on `/blog` page

**Conversion Goal:**
- Select `vendor_signup` (spotlights drive vendor discovery → inquiries → potential vendor signups)

### Step 7: SEO Fields

**Target Keywords:**
- Click "Add Keyword" for each keyword from frontmatter `keywords` array
- Example for Artisan Espresso Co.:
  - "Artisan Espresso Chadstone"
  - "mobile coffee cart Chadstone"
  - "specialty coffee Chadstone"
  - "hire coffee cart Melbourne"
  - "wedding coffee cart Chadstone"
- Limit to 3-5 most important keywords per post

**Search Intent:**
- Enter a concise search intent statement
- Template: "Find and book [Business Name] for [event type] in [suburb]"
- Example: "Find and book Artisan Espresso Co. for weddings and events in Chadstone"

**Meta Description:**
- Auto-populated from Excerpt field (no need to re-enter)
- Verify it's 150-160 characters for optimal SEO

**OG Image (Open Graph):**
- Select same image as Featured Image
- This is the image shown when post is shared on social media

### Step 8: Editorial Metadata

**Priority:**
- Select `quick-win`
- Venue spotlights are low-difficulty content that can rank quickly for brand-name keywords

**Difficulty:**
- Select `low`
- Brand-name keywords (e.g., "Artisan Espresso Chadstone") are easy to rank for

**Traffic Potential:**
- Enter `10-50`
- Individual spotlights have low traffic but aggregate value across 10 posts is significant

### Step 9: Internal Linking

**Internal Links Field:**
- Click "Add Internal Link"
- Search for posts by slug from the internal linking matrix
- For Post 01 (Artisan Espresso Co.), add:
  - `best-coffee-carts-chadstone` (if exists, otherwise note as TODO)
  - `hire-coffee-cart-guide` (if exists, otherwise note as TODO)
  - `specialty-coffee-benefits` (if exists, otherwise note as TODO)

**IMPORTANT:** If target posts don't exist yet (they'll be created in Plan 01-03 and 01-04):
1. Document in internal notes field: "TODO: Add internal links after Plan 01-03 completes"
2. Return to this post after location guides and how-to guides are published
3. Add internalLinks references via Payload admin

**Related Posts:**
- Leave empty (auto-populated by Payload based on category and tags)

### Step 10: Save and Preview

1. Click "Save" button (top right) to save as draft
2. Click "Preview" to see how the post renders on `/blog/[slug]`
3. Verify:
   - ✅ RichTextRenderer displays content correctly
   - ✅ Headings are properly formatted (H1, H2, H3)
   - ✅ Links work (internal and external)
   - ✅ Images display (if uploaded)
   - ✅ SEO metadata appears in page <head>
4. Return to edit if issues found
5. Click "Publish" to change status from draft to published (only for verified posts)

---

## Batch Entry Tips for Efficiency

### Template Approach (Recommended)

1. **Create First Post Completely:** Enter Post 01 (Artisan Espresso Co.) following all steps above
2. **Duplicate for Similar Posts:** Many fields are identical across all spotlights:
   - Category: `event-focused` (same for all)
   - Conversion Goal: `vendor_signup` (same for all)
   - Priority: `quick-win` (same for all)
   - Difficulty: `low` (same for all)
   - Traffic Potential: `10-50` (same for all)

3. **Prepare Content in Batches:**
   - Convert markdown to text for 2-3 posts before starting Payload entry
   - Have all featured images ready in a folder
   - Create spreadsheet with SEO keywords for quick copy/paste

### Common Pitfalls to Avoid

1. **Forgetting to Set Status:** Always set status to `draft` for unverified posts
2. **Skipping Alt Text:** Featured images need alt text for accessibility and SEO
3. **Incomplete Internal Links:** Document TODOs for posts that don't exist yet
4. **Inconsistent Slugs:** Ensure slugs match exactly what's referenced in internal links
5. **Missing Keywords:** Target keywords array must be populated for SEO tracking

### Quality Checklist (Per Post)

Before clicking "Publish," verify:
- [ ] Title includes business name and "| The Bean Route" suffix
- [ ] Slug matches markdown filename and internal link references
- [ ] Excerpt is 150-160 characters
- [ ] Content is fully formatted in Lexical (headings, paragraphs, links, lists)
- [ ] Featured image uploaded with alt text (or placeholder documented)
- [ ] Status set correctly (published for verified, draft for unverified)
- [ ] Category = `event-focused`
- [ ] Conversion Goal = `vendor_signup`
- [ ] 3-5 target keywords added
- [ ] Search intent documented
- [ ] Internal links added (or TODOs documented)
- [ ] Preview renders correctly without errors

---

## Post-Publication Tasks

### After All 10 Posts Entered

1. **Verify Blog Listing:**
   - Navigate to `/blog`
   - Confirm published posts appear in "Event Planning Guides" section
   - Verify filtering and sorting work correctly

2. **Test Individual Post Pages:**
   - Visit `/blog/[slug]` for each published post
   - Check RichTextRenderer displays content properly
   - Verify internal links resolve (no 404s)
   - Test social share preview (Open Graph meta tags)

3. **Update Internal Links (After Plan 01-03 Completes):**
   - Return to all 10 spotlight posts
   - Add internal links to newly published location guides
   - Remove "TODO" notes from internal notes field

4. **Update REQUIREMENTS.md Traceability:**
   - Mark CONTENT-03 and CONTENT-04 requirements as complete
   - Add links to published posts in requirements traceability table

5. **SEO Verification:**
   - Submit updated sitemap to Google Search Console
   - Verify meta descriptions appear in search results (takes 1-2 weeks)
   - Monitor Google Analytics for early traffic signals

---

## Troubleshooting Common Issues

### Issue: Lexical Editor Not Formatting Correctly

**Solution:**
- Clear browser cache and reload Payload admin
- Try different browser (Chrome/Firefox work best with Payload)
- If formatting breaks, delete and re-enter content section

### Issue: Featured Image Upload Fails

**Solution:**
- Check image file size (must be under 5MB)
- Verify image format (JPG, PNG, WebP supported)
- Compress image using tinypng.com or similar
- Check server upload limits in Payload config

### Issue: Internal Links Don't Show Dropdown

**Solution:**
- Ensure target posts exist and are published (or in draft)
- Check Posts collection relationship configuration in `src/collections/Posts.ts`
- Verify internalLinks field is properly configured as relationship type

### Issue: Preview Shows 404 Error

**Solution:**
- Verify slug is unique and follows kebab-case format
- Check Next.js dynamic route exists at `src/app/blog/[slug]/page.tsx`
- Restart dev server if using local development
- Clear Next.js cache: `rm -rf .next && npm run dev`

---

## Reference: Markdown File Locations

All venue spotlight markdown drafts are located in:
```
/docs/content-strategy/venue-spotlights/
```

Files:
- `01-artisan-espresso-chadstone.md`
- `02-mobile-brew-fountain-gate.md`
- `03-coffee-culture-westfield.md`
- `04-bean-cart-glen-iris.md`
- `05-espresso-express-malvern.md`
- `06-roaming-roasters-oakleigh.md`
- `07-brew-hub-chadstone.md`
- `08-cup-cart-fountain-gate.md`
- `09-java-junction-glen-iris.md`
- `10-percolate-malvern.md`

---

## Next Steps After Manual Entry

1. **Verify 2 Published Posts Are Live:**
   - Check `/blog/artisan-espresso-chadstone`
   - Check `/blog/coffee-culture-westfield`

2. **Begin Venue Verification for Remaining 8:**
   - Google Maps research: "mobile coffee carts [suburb]"
   - Instagram/Facebook: Search business names, verify existence
   - Contact vendors for permission and photos
   - Update post status to `published` after verification

3. **Create Location Guides (Plan 01-03):**
   - 7 location guide posts will link to these spotlights
   - Complete Plan 01-03 before adding full internal links

4. **Monitor Performance:**
   - Track post views in Google Analytics
   - Monitor search impressions in Google Search Console
   - Review bounce rate and time on page for content quality signals

---

**Total Time Investment:** 50-70 minutes for all 10 posts (5-7 minutes per post average)

**Difficulty:** Low-Medium (requires familiarity with Lexical editor but straightforward process)

**Outcome:** 10 venue spotlight posts ready for publication (2 immediately, 8 after verification)

---

# Payload CMS Entry Guide: Location Guide Posts

## Overview

This section covers manual entry for the 7 location guide posts created in Plan 01-03. Location guides are longer-form content (1,500-2,000+ words) that aggregate multiple venue spotlights and serve as geographic SEO hubs.

**Estimated Time:** 8-12 minutes per post (60-85 minutes total for all 7)

**Prerequisites:**
- All 10 venue spotlight posts already published (from Plan 01-02)
- Access to Payload CMS admin at `/admin`
- Familiarity with Lexical rich text editor and relationship fields
- Featured images prepared (area photos of Chadstone, Fountain Gate, suburbs)

---

## Quick Reference: 7 Location Guide Posts

| # | Slug | Title | Word Count | Spotlight Links |
|---|------|-------|------------|-----------------|
| 01 | best-coffee-carts-chadstone | Best Coffee Carts in Chadstone | ~2,750 | 10 spotlights |
| 02 | best-coffee-carts-fountain-gate | Coffee Carts Near Fountain Gate | ~1,700 | 5 spotlights |
| 03 | best-coffee-carts-glen-iris | Glen Iris Coffee Guide | ~2,220 | 2 spotlights |
| 04 | best-coffee-carts-malvern | Malvern Specialty Coffee | ~2,560 | 2 spotlights |
| 05 | best-coffee-carts-oakleigh | Oakleigh Mobile Baristas | ~2,630 | 1 spotlight |
| 06 | coffee-shops-near-westfield-chadstone | Coffee at Westfield Chadstone | ~2,200 | 6 spotlights |
| 07 | coffee-carts-for-weddings-chadstone | Wedding Coffee Carts Chadstone | ~3,590 | 7 spotlights |

**Total:** 7 location guides, ~17,650 words, 33 spotlight links (creates strong internal linking topology)

---

## Location Guide Entry Process

### Step 1: Access Payload Admin

Same as venue spotlight process:
1. Navigate to `/admin`
2. Click "Posts" in sidebar
3. Click "Create New"

### Step 2: Fill Standard Fields

**Title:**
- Copy from markdown frontmatter
- Example: "Best Coffee Carts in Chadstone: Your Complete 2026 Guide | The Bean Route"
- Location guides include year (2026) for freshness signal

**Slug:**
- Example: `best-coffee-carts-chadstone`
- Ensure slug matches internal link references in venue spotlight posts

**Excerpt:**
- Copy `meta_description` from frontmatter (150-160 characters)
- Example: "Discover the 10 best mobile coffee carts and cafés serving Chadstone. Expert reviews, pricing, and booking tips for weddings, corporate events, and private functions."

### Step 3: Convert Markdown to Lexical (Location Guides)

**Important Differences from Venue Spotlights:**

Location guides are longer (1,500-3,500 words) and contain more structure:

1. **Multiple Vendor Sections:**
   - Each vendor gets H3 heading: `### 1. Artisan Espresso Co. - Award-Winning Latte Art`
   - Use Lexical heading level 3 for vendor sections
   - Create clear visual hierarchy

2. **Comparison Tables:**
   - Some location guides include comparison information
   - Convert markdown tables to Lexical bullet lists (Payload Lexical doesn't handle complex tables well)
   - Format as structured lists with consistent formatting

3. **Internal Links to Spotlights:**
   - **CRITICAL:** Each vendor section includes link to full spotlight
   - Format: `[Read full [Vendor Name] spotlight →](/blog/[spotlight-slug])`
   - These become Payload relationship links (see Step 9)

4. **Section Organization:**
   - Introduction (200-300 words)
   - Vendor sections (5-10 vendors, each 150-250 words)
   - How to Choose section (200-300 words)
   - Pricing Guide (150-200 words)
   - Conclusion (100-150 words)
   - Related guides links

**Conversion Tips:**

- **Work section by section:** Copy one vendor at a time from markdown
- **Bold vendor names:** Select business name in each section, click Bold button
- **Create consistent formatting:** All vendor sections should look identical in structure
- **Link spotlight references:** Note which spotlights to link in Step 9

### Step 4: Featured Image Upload (Location Guides)

**Recommended Featured Images:**

1. **Best Coffee Carts in Chadstone:** Photo of Chadstone Shopping Centre or Chadstone Park
2. **Coffee Near Fountain Gate:** Fountain Gate Shopping Centre exterior
3. **Glen Iris Coffee Guide:** Glen Iris suburb streetscape or coffee cart at park
4. **Malvern Specialty Coffee:** Malvern Village shopping district or heritage venue
5. **Oakleigh Mobile Baristas:** Oakleigh Greek precinct or community event
6. **Westfield Chadstone Coffee:** Westfield shopping centre entrance or food court
7. **Wedding Coffee Carts Chadstone:** Mobile coffee cart at wedding (generic romantic setup)

**Image Sourcing:**
- Unsplash: Search "Melbourne shopping centre", "coffee cart wedding", "suburban Australia"
- Pexels: Search "mobile coffee cart", "specialty coffee", "barista wedding"
- Generic stock: Use high-quality coffee cart images with location overlay text

**Alt Text Examples:**
- "Chadstone Shopping Centre with mobile coffee cart in foreground"
- "Mobile coffee cart serving wedding reception in Melbourne"
- "Specialty coffee barista at Westfield Chadstone"

### Step 5: Set Status and Publishing

**Status Field:**
- **All 7 location guides:** Set to `published` (these are aggregation/guide content, not business profiles requiring verification)

**Published At:**
- Stagger publication: 1 per day after venue spotlights published
- Example schedule:
  - Day 1-2: Venue spotlights 01-02 (verified)
  - Day 3: Location Guide 01 (Chadstone main hub)
  - Day 4: Location Guide 02 (Fountain Gate)
  - Day 5: Location Guide 03 (Glen Iris)
  - And so on...

**Publishing Strategy:**
- Location guides establish SEO authority hubs
- Publish before remaining venue spotlights to create parent-child linking structure
- Guides can rank for geographic keywords while spotlights rank for brand names

### Step 6: Category & Conversion Goal

**Category:**
- Select `event-focused` (all location guides are event-focused content)

**Conversion Goal:**
- Select `vendor_signup` (guides drive vendor discovery → inquiries → potential vendor signups)

### Step 7: SEO Fields (Location Guides)

**Target Keywords:**

Location guides target geographic + service keywords (higher search volume than brand names):

**Example for "Best Coffee Carts in Chadstone":**
- "coffee carts Chadstone"
- "mobile coffee cart Chadstone"
- "hire coffee cart Chadstone"
- "event coffee Chadstone"
- "specialty coffee Chadstone"
- "wedding coffee cart Chadstone"

**Example for "Wedding Coffee Carts Chadstone":**
- "wedding coffee cart Chadstone"
- "mobile coffee cart wedding Melbourne"
- "hire coffee cart wedding"
- "specialty coffee weddings"
- "barista wedding reception"

**Keyword Strategy:**
- 5-8 keywords per location guide (more than spotlights because guides target broader searches)
- Mix primary geographic keywords with event-type modifiers
- Include long-tail variations

**Search Intent:**
- Template: "Find and compare [service type] in [suburb] for [event type]"
- Example: "Find and compare mobile coffee cart vendors in Chadstone for events, weddings, and corporate functions"

**Meta Description:**
- Auto-populated from Excerpt (verify 150-160 characters)

**OG Image:**
- Same as Featured Image

### Step 8: Editorial Metadata (Location Guides)

**Priority:**
- Select `authority`
- Location guides are authority-building content (high-value SEO targets)

**Difficulty:**
- Select `medium`
- Geographic keywords are moderately competitive (harder than brand names, easier than "best coffee Melbourne")

**Traffic Potential:**
- Enter `100-300`
- Location guides have higher traffic potential than individual spotlights
- Main hub guide (Chadstone) could reach 250-300 monthly visits
- Smaller suburbs (Oakleigh) more like 100-150 monthly visits

### Step 9: Internal Linking (Location Guides - CRITICAL)

**This is the most important step for location guides.** They create bidirectional linking with venue spotlights.

**Internal Links Field:**

For each location guide, add 5-10 internal links using Payload's relationship picker:

**Example for "Best Coffee Carts in Chadstone":**

Add these Post relationships:
1. `artisan-espresso-chadstone` (venue spotlight)
2. `coffee-culture-westfield` (venue spotlight)
3. `brew-hub-chadstone` (venue spotlight)
4. `mobile-brew-fountain-gate` (venue spotlight)
5. `bean-cart-glen-iris` (venue spotlight)
6. `hire-coffee-cart-guide` (how-to guide - will be created in Plan 01-04)
7. `specialty-coffee-benefits` (education post - will be created in Plan 01-04)
8. `corporate-event-coffee` (how-to guide - will be created in Plan 01-04)

**How to Add Relationship Links:**

1. Click "Add Internal Link" button
2. Search for post by slug (e.g., "artisan-espresso-chadstone")
3. Select from dropdown
4. Repeat for all 5-10 links

**For posts that don't exist yet (Plan 01-04 how-to guides):**
- Document in internal notes: "TODO: Add links to how-to guides after Plan 01-04 completes"
- Return to update after Plan 01-04 posts are published

**Linking Matrix Reference:**

Refer to `docs/content-strategy/internal-linking-matrix.md` for exact link targets per guide.

**Related Posts:**
- Leave empty (auto-populated by Payload based on category)

### Step 10: Save, Preview, Publish

1. Click "Save" (top right)
2. Click "Preview" to verify rendering
3. **Check these elements:**
   - ✅ All vendor sections have proper H3 headings
   - ✅ Internal links to spotlights resolve (no 404s)
   - ✅ Comparison information formatted clearly
   - ✅ Images display properly
   - ✅ Related guides section at bottom shows links
4. Return to edit if issues found
5. Click "Publish" (status should already be 'published')

---

## Batch Entry Tips for Location Guides

### Efficiency Strategies:

1. **Prepare Content in Batches:**
   - Convert markdown for 2-3 guides before starting Payload entry
   - Have all featured images downloaded and ready in folder
   - Create spreadsheet with SEO keywords for quick copy/paste

2. **Use Template Approach for Repeated Fields:**
   - Category: `event-focused` (same for all 7)
   - Conversion Goal: `vendor_signup` (same for all 7)
   - Priority: `authority` (same for all 7)
   - Difficulty: `medium` (same for all 7)

3. **Spotlight Links Pattern:**
   - Main Chadstone guide links to ALL 10 spotlights
   - Smaller suburb guides link to 1-5 spotlights in that area
   - Follow internal-linking-matrix.md exactly

### Time Estimates:

- **Chadstone main guide (01):** 12-15 minutes (longest, most links)
- **Standard suburb guides (02-05):** 8-10 minutes each
- **Specialty guides (06-07):** 10-12 minutes each
- **Total for all 7:** 60-85 minutes

### Common Pitfalls:

1. **Forgetting to link spotlights:** Location guides MUST link to venue spotlights (creates SEO topology)
2. **Inconsistent heading hierarchy:** All vendor sections should be H3, main sections H2
3. **Missing geographic keywords:** Each guide needs 5-8 keywords targeting suburb + service
4. **Publishing out of order:** Publish main Chadstone guide first, then smaller suburb guides

---

## Post-Publication: Bidirectional Linking

**CRITICAL FINAL STEP:** After all 7 location guides are published, update venue spotlight posts with backlinks.

### Why Bidirectional Linking Matters:

- **SEO equity flow:** Authority flows from parent guides to child spotlights and back
- **User navigation:** Readers can discover related content easily
- **Topic clustering:** Creates cohesive content cluster around Chadstone coffee

### How to Create Backlinks:

1. Navigate to each venue spotlight post in Payload admin
2. Edit the post
3. Add parent location guide to `internalLinks` field
4. Save

**Example:**

For `artisan-espresso-chadstone` spotlight:
- Add `best-coffee-carts-chadstone` to internalLinks
- Add `coffee-carts-for-weddings-chadstone` to internalLinks (if relevant)

**Time Required:** 3-4 minutes per spotlight × 10 spotlights = 30-40 minutes

**When to Do This:** After all 7 location guides are published (don't do this before guides exist)

---

## Verification Checklist (Per Location Guide)

Before publishing each location guide, verify:

- [ ] Title includes geographic area and "| The Bean Route" suffix
- [ ] Slug matches references in internal linking matrix
- [ ] Excerpt is 150-160 characters
- [ ] Content fully formatted with proper heading hierarchy (H2 for sections, H3 for vendors)
- [ ] Featured image uploaded with geographic alt text
- [ ] Status = `published`
- [ ] Category = `event-focused`
- [ ] Conversion Goal = `vendor_signup`
- [ ] Priority = `authority`
- [ ] Difficulty = `medium`
- [ ] Traffic Potential = 100-300 (varies by suburb)
- [ ] 5-10 target keywords added (geographic + service)
- [ ] Search intent documented
- [ ] 5-10 internal links added (mostly spotlights, some how-to/education)
- [ ] Preview renders correctly without errors
- [ ] All spotlight links resolve (no 404s)

---

## Publishing Schedule Recommendation

**Week 1: Foundation Content**
- Day 1: Publish 2 verified venue spotlights (01, 03)
- Day 2: Publish Location Guide 01 (Chadstone main hub)
- Day 3: Publish Location Guide 06 (Westfield Chadstone)
- Day 4: Publish Location Guide 07 (Wedding Coffee Carts)
- Day 5: Publish Location Guide 02 (Fountain Gate)

**Week 2: Suburb Coverage**
- Day 6: Publish Location Guide 03 (Glen Iris)
- Day 7: Publish Location Guide 04 (Malvern)
- Day 8: Publish Location Guide 05 (Oakleigh)
- Day 9-12: Publish remaining venue spotlights (as verified)

**Why This Order:**

1. **Establish authority hubs first:** Main Chadstone guide published early
2. **Create linking structure:** Guides can link to existing spotlights immediately
3. **Build content velocity:** Publishing 1/day signals fresh content to search engines
4. **Prioritize high-value content:** Chadstone main hub and wedding guide have highest traffic potential

---

## Batch Publishing All 7 Guides (Alternative Approach)

If you prefer to publish all 7 location guides at once (rather than 1/day):

**Advantages:**
- Complete content cluster launched simultaneously
- Full bidirectional linking can be done immediately
- Stronger "content velocity" signal to search engines

**Disadvantages:**
- Less sustained "freshness" signal (1 big update vs. 7 daily updates)
- More work upfront (60-85 minutes continuous Payload entry)

**Recommended:** Stagger publication 1/day for better SEO freshness signals

---

## After Location Guides Published

### 1. Update Venue Spotlight Backlinks (Required)

Go back to all 10 venue spotlight posts and add location guide links to their `internalLinks` fields.

**Time:** 30-40 minutes total

### 2. Verify Blog Listing Display

Navigate to `/blog` and confirm:
- 17 total posts visible (10 spotlights + 7 guides)
- Location guides appear in appropriate category
- Filtering and sorting work correctly

### 3. Test Individual Guide Pages

Visit `/blog/[slug]` for each location guide:
- Verify RichTextRenderer displays content properly
- Check all internal links to spotlights resolve correctly
- Test social share preview (Open Graph)

### 4. Submit Updated Sitemap to Google

After publishing all guides:
- Sitemap auto-updates at `/sitemap.xml`
- Submit to Google Search Console
- Monitor indexing over next 1-2 weeks

### 5. Update REQUIREMENTS.md Traceability

Mark CONTENT-05 and CONTENT-06 requirements complete:
- Add links to published location guides
- Update traceability table with post URLs

---

## Troubleshooting Location Guide Issues

### Issue: Too Many Internal Links to Add Manually

**Solution:**
- Focus on spotlight links first (most important for SEO)
- Add how-to guide links later after Plan 01-04 completes
- Document missing links in internal notes

### Issue: Lexical Editor Struggles with Long Content

**Solution:**
- Work in smaller sections (copy 300-500 words at a time)
- Save frequently to prevent data loss
- Clear browser cache if editor becomes sluggish

### Issue: Featured Images Not Available for All Suburbs

**Solution:**
- Use generic coffee cart stock images with location overlay text
- Document placeholder status in notes
- Replace with authentic suburb photos later

### Issue: Can't Remember Which Spotlights to Link

**Solution:**
- Refer to `docs/content-strategy/internal-linking-matrix.md`
- Each guide has specific spotlight links documented
- Follow matrix exactly for SEO topology

---

## Total Time Investment Summary

**Location Guide Entry:**
- 7 location guides × 8-12 min each = 60-85 minutes
- Bidirectional linking update = 30-40 minutes
- Verification and testing = 15-20 minutes
- **Total: 105-145 minutes (1.75-2.5 hours)**

**Combined with Venue Spotlights:**
- 10 venue spotlights = 50-70 minutes
- 7 location guides = 105-145 minutes
- **Total Phase 1 content entry: 155-215 minutes (2.5-3.5 hours)**

**Difficulty:** Medium (requires careful attention to internal linking and relationship fields)

**Outcome:** 17 published posts with comprehensive internal linking creating strong SEO topology for Chadstone area coffee content

---

**Next: Plan 01-04 will create how-to guides and education posts, completing the 30-post Phase 1 goal.**
