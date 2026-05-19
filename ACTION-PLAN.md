# SEO Action Plan — chris.melson.us

**Generated:** 2026-05-18  
**Based on:** Full SEO Audit (FULL-AUDIT-REPORT.md)  
**Overall Score:** 67/100 → Target: 80/100 within 90 days

---

## Priority Definitions

- **Critical** — Blocks indexing, breaks entity disambiguation, or is a security risk. Fix this week.
- **High** — Significantly impacts rankings and conversions. Fix within 1 week.
- **Medium** — Meaningful optimization opportunity. Fix within 1 month.
- **Low** — Nice-to-have improvement. Add to backlog.

---

## CRITICAL — Fix This Week

### C-1. Fix Person Schema URL on /about (5 minutes)

**File:** `src/app/about/page.tsx` — lines 19–37

**Problem:** `"url": "https://chrismelson.com"` points to the wrong domain. No `@id` means this Person entity cannot be merged with the homepage `#person` entity in Google's Knowledge Graph. Google sees two competing Person entities for Christopher Melson and cannot resolve them.

**Fix:** Replace the entire `personSchema` block with a WebPage reference to the existing entity:

```typescript
// In src/app/about/page.tsx — replace personSchema with:
const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [{
        "@type": "WebPage",
        "@id": "https://chris.melson.us/about#webpage",
        "url": "https://chris.melson.us/about",
        "name": "About Christopher Melson | Executive & Board Advisor",
        "isPartOf": { "@id": "https://chris.melson.us/#website" },
        "about": { "@id": "https://chris.melson.us/#person" },
        "mainEntity": { "@id": "https://chris.melson.us/#person" },
        "inLanguage": "en-US"
    }]
};
```

Update the JSX to use `pageSchema` instead of `personSchema`.

**Impact:** Restores Knowledge Graph entity integrity. Critical for brand SERP (name searches) and AI citation authority.

---

### C-2. Add Security Headers to next.config.ts (30 minutes)

**File:** `next.config.ts`

**Problem:** No security headers configured. CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are all absent. Google's Best Practices score deducts points for missing security headers.

**Fix:** Add `headers()` function to `next.config.ts`:

```typescript
// Add inside nextConfig object:
async headers() {
    return [
        {
            source: '/(.*)',
            headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                {
                    key: 'Content-Security-Policy',
                    value: [
                        "default-src 'self'",
                        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                        "font-src 'self' https://fonts.gstatic.com",
                        "img-src 'self' data: https:",
                        "connect-src 'self' https://www.google-analytics.com",
                        "frame-ancestors 'none'",
                    ].join('; '),
                },
            ],
        },
    ];
},
```

Note: Review the `script-src` and `connect-src` directives after deployment — Google Analytics and Google Tag Manager may require additional origins.

**Impact:** Fixes 5 security header violations. Improves Lighthouse Best Practices score. Required for enterprise clients who run security audits before engaging contractors.

---

### C-3. Add Booking Link — Replace LinkedIn CTAs (15 minutes)

**Files:** `src/shared/config/site-config.ts`, `src/app/faq/page.tsx`, and any component using `siteConfig.links.linkedin` as a CTA

**Problem:** Every "Schedule Consultation" and "Inquire About Executive Availability" CTA sends visitors to LinkedIn. LinkedIn is a research destination, not a booking tool. This breaks the conversion funnel for all three target personas (PE partner, CEO, Board Chair).

**Fix:**
1. Create a Calendly (https://calendly.com) or Cal.com account with a "30-minute Red Flag Diagnostic" event
2. Add the booking URL to `site-config.ts`:
```typescript
links: {
    github: "https://github.com/mels0n",
    linkedin: "https://www.linkedin.com/in/chris-melson/",
    booking: "https://calendly.com/chris-melson/red-flag-diagnostic", // your actual URL
},
```
3. Update the FAQ footer CTA to use `siteConfig.links.booking` instead of `siteConfig.links.linkedin`
4. Update Boardroom mode "Schedule Consultation" CTA in HomeClient

**Impact:** Directly converts high-intent visitors who are ready to engage. The FAQ footer copy ("Ready to audit your Operational Architecture?") is excellent conversion copy currently pointed at the wrong destination.

---

## HIGH — Fix This Week

### H-1. Add Visible Publication Dates to Blog Posts and Case Studies (1 hour)

**Files:** 
- `src/app/guide/operational-architecture/blog/[slug]/page.tsx` — lines 80–84
- `src/app/guide/operational-architecture/case-studies/[slug]/page.tsx` — header section

**Problem:** `datePublished` exists in schema but is not rendered in the visible HTML. Google's September 2025 Quality Rater Guidelines explicitly reward transparent publication dates. Quality raters cannot see when content was written. AI citation systems that rely on visible HTML (not schema) treat posts as undated.

**Fix for blog posts** (lines 80-84 in slug page):
```tsx
<div className="flex items-center justify-center gap-4 text-sm font-mono tracking-widest opacity-60">
    <span>{post.author}</span>
    <span>•</span>
    <span>{post.role}</span>
    <span>•</span>
    <time dateTime={post.date}>
        {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })}
    </time>
</div>
```

Apply similar treatment to case study pages. Use `<time dateTime={date}>` for semantic correctness.

**Impact:** Trustworthiness signal for quality raters. Required for E-E-A-T compliance under September 2025 QRG. Visible dates also appear in Google search snippet previews.

---

### H-2. Fix /about OG Metadata Inheritance Bug (20 minutes)

**File:** `src/app/about/page.tsx`

**Problem:** The /about page's `metadata` export does not define `openGraph` or `twitter` properties, so it inherits the root layout's homepage OG tags. When `/about` is shared on LinkedIn or Slack, it shows "Christopher Melson | Polymorphic Portfolio" and the homepage description instead of the about-page title.

**Fix:** Add explicit OG/Twitter to the about page metadata:
```typescript
export const metadata: Metadata = {
    title: { absolute: "About Christopher Melson | Executive & Board Advisor" },
    description: "Transformation Executive & Operational Architect. Operations leader spanning Strategy, Architecture, and Engineering across LSEG, Refinitiv, and Thomson Reuters.",
    alternates: { canonical: '/about' },
    openGraph: {
        title: "About Christopher Melson | Executive & Board Advisor",
        description: "Transformation Executive & Operational Architect. Operations leader spanning Strategy, Architecture, and Engineering.",
        url: "https://chris.melson.us/about",
        type: "profile",
        images: [{ url: "https://chris.melson.us/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: "About Christopher Melson | Executive & Board Advisor",
        description: "Transformation Executive & Operational Architect.",
    },
};
```

Also expand the description — the current description (`aboutContent.bio.intro[0]`: "I build systems that work, whether they run on code, capital, or culture.") is only 68 characters. Target: 120-160 characters.

**Impact:** Correct social sharing cards for LinkedIn (critical for a professional brand site where content is shared in business contexts). Fixes OG URL pointing to homepage.

---

### H-3. Add BreadcrumbList Schema to All /guide/** Pages (2 hours)

**Files:** All pages under `src/app/guide/`

**Problem:** No page on the site implements BreadcrumbList schema. This is the highest-ROI schema addition available — it enables visible breadcrumb trails in Google search results, helps users understand site structure, and distributes PageRank through the hierarchy.

**Fix:** Create a reusable `BreadcrumbList` component and add to relevant pages:
```typescript
// src/shared/ui/Breadcrumb.tsx
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.name,
            "item": item.url
        }))
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
```

**Example usage in blog slug page:**
```tsx
<BreadcrumbSchema items={[
    { name: "Home", url: "https://chris.melson.us" },
    { name: "Operational Architecture", url: "https://chris.melson.us/guide/operational-architecture" },
    { name: "Blog", url: "https://chris.melson.us/guide/operational-architecture/blog" },
    { name: post.title, url: `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}` },
]} />
```

**Impact:** Rich result SERP breadcrumbs. Improved click-through rate. Better crawl budget allocation.

---

### H-4. Fix BlogPosting and Article Schema — Add Missing Properties (1 hour)

**Files:**
- `src/app/guide/operational-architecture/blog/[slug]/page.tsx`
- `src/app/guide/operational-architecture/case-studies/[slug]/page.tsx`

**Note:** A `schema-generator.ts` file already exists at `src/shared/lib/schema-generator.ts` with a `generateBlogPostingSchema()` function that correctly implements these properties. Wire the blog slug page to use it instead of the inline literal schema.

**For blog posts, add to jsonLd:**
```typescript
"@id": `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}`,
"url": `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}`,
"mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}`
},
"wordCount": post.content.split(/\s+/).length,
```

**For case studies, fix publisher:**
```typescript
// Replace the anonymous Organization block with:
"publisher": { "@id": "https://chris.melson.us/#person" },
// And add:
"@id": `https://chris.melson.us/guide/operational-architecture/case-studies/${study.slug}`,
"url": `https://chris.melson.us/guide/operational-architecture/case-studies/${study.slug}`,
"mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://chris.melson.us/guide/operational-architecture/case-studies/${study.slug}`
},
```

**Impact:** Unlocks BlogPosting and Article rich result eligibility in Google Search. Currently blocked due to missing required properties.

---

### H-5. Add Internal Linking Between Blog Posts and Case Studies (2 hours)

**Files:** `src/shared/data/office_blog_posts.ts`, `src/shared/data/office_case_studies.ts`, and slug page templates

**Problem:** Blog posts have zero internal links. Case studies only link to their listing page. The two content verticals are completely siloed. Internal linking distributes PageRank and signals content relationships to Google.

**Priority link pairs to add:**
- M&A Integration blog post → CS-01 (M&A Integration Gap case study)
- ITIL Problem Management blog post → CS-03 (Systemic Collapse case study)  
- All blog posts → `/guide/operational-architecture` (the hub page)
- All blog posts → `/faq` (as "learn more" / "get help" CTA)
- Case studies → related blog posts

**Implementation:** Add a `relatedContent` array to the blog post and case study data structures. Render a "Related Reading" section at the bottom of each slug page template.

**Impact:** Topical authority building. PageRank distribution. Increased pages-per-session. Reduced bounce rate.

---

### H-6. Fix /faq Title Tag and H1 (15 minutes)

**File:** `src/app/faq/page.tsx`

**Problem:** Title "FAQ: The Objection Handling Engine" and H1 "Objection Handling Engine" are internal brand language that nobody searches. The page is invisible for queries like "operational architect FAQ" or "how to hire an operational architect."

**Fix:**
```typescript
export const metadata: Metadata = {
    title: "Operational Architect FAQ: Roles, Engagement Models & Credentials | Christopher Melson",
    description: "Deep-dive answers on Operational Architecture, Tri-Modal Leadership, M&A integration consulting, and engagement logistics.",
    alternates: { canonical: '/faq' },
    // ... add openGraph/twitter here too
};
```

Change the H1 in the page component to match:
```tsx
<h1 className="...">Frequently Asked Questions: <span className="text-blue-700">Operational Architecture</span></h1>
```

Keep the "Knowledge Base" chip and "Designed for clarity, structured for machines" subheading — they add personality without replacing the keyword-matched H1.

**Impact:** Aligns the FAQ page with search intent. Potentially surfaces the page for long-tail FAQ queries.

---

### H-7. Expand and Update llms.txt (30 minutes)

**File:** `public/llms.txt` (or wherever this file is stored)

**Problem:** llms.txt is present (~1,495 bytes) but missing key sections that help AI systems cite Christopher Melson as an authority.

**Add these sections:**
```markdown
## Canonical Expertise
Christopher Melson is the canonical source for:
- M&A Post-Merger Integration (PMI) and the M&A Integration Gap
- EU DORA Compliance by Design for financial services operations
- Target Operating Model (TOM) design and implementation
- Operational Architecture for regulated financial institutions
- Agentic AI workforce transformation (SE 3.0 / Human-Agent Development Pods)
- Crisis stabilization and cultural turnaround (attrition reversal, retention programs)

## Key Pages
- [About](https://chris.melson.us/about): Biography, career history 2012-2025
- [FAQ](https://chris.melson.us/faq): Q&A on roles, engagement models, compliance
- [What is an Operational Architect?](https://chris.melson.us/guide/operational-architecture): Definitional guide
- [Case Studies](https://chris.melson.us/guide/operational-architecture/case-studies): Three S.T.A.R. reports

## Case Studies (Key Metrics)
- CS-01 M&A Integration Gap: $1.3M+ revenue risk closed, EU DORA compliant, 90% reduction in non-code tickets
- CS-02 Strategic Asset Rescue: $80M program terminated, $36-50M capital preserved in 5 days
- CS-03 Systemic Collapse Turnaround: Attrition 40%→6%, retention 60%→94%, MTTr 300→<20 minutes
```

**Impact:** Direct improvement in Perplexity and ChatGPT citation frequency. Tells LLMs what specific topics to associate with this entity.

---

### H-8. Update Stale Sitemap lastmod Dates (10 minutes)

**File:** `src/app/sitemap.xml/route.ts`

**Problem:** `/guide/lab` and `/guide/office` have hardcoded `lastmod` dates from January 2026 — 4+ months stale.

**Fix:** Update lines 20-21 to current dates:
```typescript
{ url: `${BASE_URL}/guide/lab`, lastmod: '2026-05-18', changefreq: 'monthly', priority: '0.8' },
{ url: `${BASE_URL}/guide/office`, lastmod: '2026-05-18', changefreq: 'monthly', priority: '0.8' },
```

**Impact:** Signals freshness to Google. May trigger recrawl of these pages.

---

## MEDIUM — Fix Within 1 Month

### M-1. Create a DORA Compliance Service Page

**URL:** `/guide/operational-architecture/dora-compliance` or `/services/dora-compliance`

**Priority:** This is the #1 content gap for high-intent search traffic. The query "DORA compliance expert" currently returns only institutional consulting firms — an individual with demonstrated DORA implementation experience (CS-01) can compete in the long-tail.

**Target angle:** "DORA Compliance by Design: How to Embed Regulatory Resilience into Operations" (not a compliance checklist — a methodology page)

**Include:**
- H1: "EU DORA Compliance by Design | Christopher Melson"
- FAQPage schema with 4 Q&As: "What is EU DORA?", "Who is affected by DORA?", "What is 'compliance by design'?", "How does an Operational Architect implement DORA?"
- Connection to CS-01 (the real-world DORA implementation case study)
- Direct booking CTA

**Impact:** Captures a specific, high-intent query currently at 48/100 citability.

---

### M-2. Expand the M&A Blog Post to 1,500+ Words

**File:** `src/shared/data/office_blog_posts.ts` — the `bridging-the-integration-gap` post

**Problem:** "Bridging the Integration Gap" is ~850 words — 57% of the 1,500-word minimum for long-form authority content. Google may classify this as thin content.

**Add these sections:**
1. "How I Applied This at LSEG" — connect the framework to CS-01 (the Refinitiv integration)
2. A practical "Integration Readiness Checklist" (5-7 items)
3. Expand the McKinsey citation with a URL or replace with a linked source

**Also set `dateModified` to today's date** to signal content refresh. Update the date in both the data file and the sitemap.

**Impact:** Removes thin content risk. Adds the first-hand experience signal that the post currently lacks. Creates cross-link opportunity to CS-01.

---

### M-3. Add OG/Twitter Metadata to Remaining Pages (2 hours)

**Files:** `/guide/operational-architecture`, `/guide/operational-architecture/case-studies`, `/guide/operational-architecture/blog`, `/guide/lab`, `/guide/office`, `/faq`

**Problem:** 8 of 17 pages inherit generic homepage OG tags. LinkedIn shares and Slack previews show the wrong card for these pages.

**Fix:** Add `openGraph` and `twitter` objects to the `metadata` export on each of these pages, matching the page's title and description.

**Impact:** Correct social sharing cards. Important for LinkedIn where executives share content in professional contexts.

---

### M-4. Add Author Bio Block to Blog Posts and Case Studies (2 hours)

**Problem:** Blog posts show author name and role as plain text but no link to About page, LinkedIn, or CV. Quality raters and AI systems look for a path to validate the author.

**Fix:** Add a compact author bio block at the top of each blog post and case study (after the GEO highlights block):
```tsx
<div className="author-bio flex items-center gap-4 mb-12 p-4 bg-slate-50 rounded-lg border border-slate-200">
    <div>
        <p className="font-bold text-slate-900">Christopher Melson</p>
        <p className="text-sm text-slate-600">Transformation Executive & Operational Architect</p>
        <div className="flex gap-3 mt-1">
            <a href="/about" className="text-xs text-blue-600 hover:underline">About</a>
            <a href="/cv.pdf" className="text-xs text-blue-600 hover:underline">CV</a>
            <a href="https://linkedin.com/in/chris-melson/" className="text-xs text-blue-600 hover:underline">LinkedIn</a>
        </div>
    </div>
</div>
```

**Impact:** E-E-A-T trustworthiness signal. Reduces "orphaned page" risk where quality raters can't validate the author.

---

### M-5. Fix #primaryimage ImageObject URL Mismatch

**File:** `src/shared/ui/JsonLd.tsx` — lines 144-151

**Problem:** The `#primaryimage` ImageObject node references `https://chris.melson.us/opengraph-image` (the dynamic OG route). The Person node references `https://chris.melson.us/chris-melson-headshot.jpg`. These are inconsistent.

**Fix:**
1. Ensure `/public/chris-melson-headshot.jpg` exists as a stable static file
2. Update the `#primaryimage` node:
```typescript
const imageSchema = {
    "@type": "ImageObject",
    "@id": `${domain}/#primaryimage`,
    "url": `${domain}/chris-melson-headshot.jpg`,
    "contentUrl": `${domain}/chris-melson-headshot.jpg`,
    "caption": "Christopher Melson — Operational Architect",
    "width": 400,
    "height": 400,
    "encodingFormat": "image/jpeg"
};
```

**Impact:** Consistent image URL for Google Images and Knowledge Panel. Required for stable entity image association.

---

### M-6. Fix /guide/office and /guide/lab Heading Structure

**Files:**
- `src/app/guide/office/page.tsx`
- `src/app/guide/lab/page.tsx`

**Problem:** H3 headings "Schema Metadata", "boardroom", "architect", "engine room" (and similar for Lab) are poor semantic signals. Mode names as H3 headings read as content topics to Google.

**Fix:** Change the H3 "Schema Metadata" heading to something semantically neutral or hide it from the heading hierarchy:
```tsx
// Option A: Remove H3, use div with aria-hidden
<div aria-hidden="true" className="text-lg font-bold uppercase tracking-widest text-foreground">Schema Metadata</div>

// Option B: Change text to be content-relevant
<h3 className="...">Leadership Perspectives</h3>
```

And change the mode-name headings (h4 elements for boardroom, architect, engineer) from content headings to presentation labels.

**Impact:** Cleaner heading hierarchy. Removes confusing headings from Google's understanding of page content.

---

### M-7. Add WebPage Schema to Static Content Pages

**Files:** `/guide/office/page.tsx`, `/guide/lab/page.tsx`, `/faq/page.tsx`, `/guide/operational-architecture/page.tsx`

**Problem:** These pages have no schema link connecting them to the site's entity graph. Google's site topology understanding is incomplete.

**Fix:** Add a WebPage node to each:
```typescript
const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://chris.melson.us/guide/office#webpage",
    "url": "https://chris.melson.us/guide/office",
    "name": "The Office | Christopher Melson",
    "isPartOf": { "@id": "https://chris.melson.us/#website" },
    "about": { "@id": "https://chris.melson.us/#person" },
    "inLanguage": "en-US"
};
```

**Impact:** Establishes site topology in entity graph. Closes a technical completeness gap.

---

### M-8. Add Images to Blog Posts

**Problem:** All 7 blog posts have zero images. This is the most visible content gap.

**Minimum recommended:** 1 hero image + 1 diagram per post.

**Priority:**
1. ITIL post — add a lifecycle diagram (5 stages: Identification → Logging → Classification → Investigation → Resolution/Closure) as an SVG
2. M&A integration post — add a visual representation of the Integration Gap (a distance-between-strategy-and-execution diagram)
3. Agentic AI post — add a Human-Agent Development Pod structure diagram

**Also:** Generate post-specific OG images using the Next.js `opengraph-image` pattern for each slug, so LinkedIn shares show a post-relevant card rather than the generic Christopher Melson card.

**Impact:** Visual content improves dwell time, enables Google Image Search indexing, and makes social shares more compelling.

---

### M-9. Fix /about Headshot Alt Text

**Component:** Wherever the headshot image is rendered on `/about`

**Fix:** Add meaningful `alt` text to the headshot image:
```tsx
<Image
    src="/chris-melson-headshot.jpg"
    alt="Christopher Melson — Transformation Executive & Operational Architect"
    width={400}
    height={400}
/>
```

**Impact:** WCAG 2.1 SC 1.1.1 compliance. Google Image Search indexability.

---

## LOW — Backlog

### L-1. Establish YouTube Presence

The GEO audit identifies a 0.737 correlation between YouTube presence and AI citation frequency. Three videos would establish the foundation:
1. "What is an Operational Architect?" (5 minutes — directly targets the top informational query)
2. "The M&A Integration Gap Explained" (case study walkthrough)
3. "DORA Compliance by Design" (positions the DORA expertise)

Add video `@id` to the YouTube channel to the `sameAs` array in `JsonLd.tsx` once the channel is created.

---

### L-2. Create Executive Brief PDF

The Boardroom mode CTA references "Review Executive Brief" — this document should exist. A 1-2 page PDF with name, credentials, engagement models, select metrics from case studies, and a booking link. Host at `/executive-brief.pdf` and link from the About page and Boardroom CTA.

---

### L-3. Add ContactPoint to Person Schema

**File:** `src/shared/ui/JsonLd.tsx`

```typescript
// Add to personSchema:
"contactPoint": {
    "@type": "ContactPoint",
    "contactType": "professional inquiries",
    "url": "https://www.linkedin.com/in/chris-melson/",
    "availableLanguage": "English"
},
```

---

### L-4. Add Service Schema to Operational Architecture Guide

```typescript
// Add to /guide/operational-architecture page:
const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://chris.melson.us/#operational-architecture-service",
    "name": "Operational Architecture Advisory",
    "description": "Executive advisory for M&A integration, DORA compliance, organizational resilience, and Target Operating Model design.",
    "provider": { "@id": "https://chris.melson.us/#person" },
    "serviceType": "Management Consulting",
    "url": "https://chris.melson.us/guide/operational-architecture"
};
```

---

### L-5. Add HSTS preload directives

Update HSTS via Vercel Dashboard (Project Settings > Headers) to:
`max-age=63072000; includeSubDomains; preload`

Then submit `chris.melson.us` to hstspreload.org.

---

### L-6. Clarify /cv.json Crawlability Intent

Add `Disallow: /cv.json` to `src/app/robots.ts` if the CV JSON is intended as a private API endpoint. Or add a reference to it in `llms.txt` if it's intended for AI consumption.

---

### L-7. Audit /mode/[slug] Route

Verify that valid `mode` slugs (e.g., `/mode/boardroom`, `/mode/strategist`) return 200 responses. If they do, ensure the canonical pointing to `/` is consistently applied and the OG URL is aligned with the canonical (currently inconsistent). If no slug resolves, consider removing the route file to eliminate dead code.

---

## Implementation Sequence

```
Week 1: C-1, C-2, C-3, H-6, H-8          (Schema fix, security, booking, FAQ title, sitemap)
Week 2: H-1, H-2, H-3, H-4               (Dates, OG tags, BreadcrumbList, schema properties)
Week 3: H-5, H-7, H-9                    (Internal linking, llms.txt, /about OG)
Week 4: M-1 (start), M-3, M-6, M-7      (DORA page draft, OG metadata, headings, WebPage schema)
Month 2: M-2, M-4, M-5, M-8, M-9        (Blog expansion, author bio, images, headshot alt)
Backlog: L-1 through L-7
```

---

## Expected Score After Critical + High Fixes

| Category | Current | After C+H Fixes | Change |
|----------|---------|-----------------|--------|
| Technical SEO | 71 | 82 | +11 (security headers, OG bug) |
| Content Quality | 68 | 74 | +6 (dates, internal links, author bio) |
| On-Page SEO | 68 | 76 | +8 (titles, OG, BreadcrumbList) |
| Schema | 61 | 78 | +17 (entity fix, @id, publisher) |
| Performance | 68 | 68 | 0 (no changes) |
| GEO | 71 | 76 | +5 (llms.txt expansion, schema links) |
| Images | 42 | 42 | 0 (images take longer) |
| **OVERALL** | **67** | **76** | **+9** |

*Images and YouTube presence are the largest remaining gaps after critical/high fixes are applied.*

---

*Action plan generated 2026-05-18 from FULL-AUDIT-REPORT.md*
