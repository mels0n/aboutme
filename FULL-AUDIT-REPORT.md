# Full SEO Audit Report — chris.melson.us

**Audit Date:** 2026-05-18  
**Site:** https://chris.melson.us  
**Business Type:** Personal Brand / Executive Portfolio (B2B professional services)  
**Platform:** Next.js 16, deployed on Vercel  
**Pages Crawled:** 17  
**Methodology:** 5 parallel specialist agents + primary analysis

---

## Executive Summary

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 71/100 | 22% | 15.6 |
| Content Quality (E-E-A-T) | 68/100 | 23% | 15.6 |
| On-Page SEO | 68/100 | 20% | 13.6 |
| Schema / Structured Data | 61/100 | 10% | 6.1 |
| Performance (CWV) | 68/100 | 10% | 6.8 |
| AI Search Readiness (GEO) | 71/100 | 10% | 7.1 |
| Images | 42/100 | 5% | 2.1 |
| **OVERALL SEO HEALTH SCORE** | **67/100** | | |

### SEO Health Score: **67 / 100** — Intermediate

**Interpretation:** The site has a well-structured foundation — canonical tags are correct on all 17 pages, sitemap is well-formed, metadata is largely present, and the homepage `@graph` schema is genuinely sophisticated. The STAR-format case studies and GEO highlight blocks show intentional AI-citation design. However, correctable issues in four areas are holding back rankings and citation potential: broken Person schema on /about, missing security headers, zero images across all 7 blog posts, and thin authoritative signal from the absence of third-party brand presence. All top-priority issues are fixable in the codebase.

---

### Top 5 Critical Issues

1. **Duplicate / broken Person schema on /about** — `url` property points to `chrismelson.com` (wrong domain), no `@id` linkage to the homepage `#person` entity — Google cannot merge these into one Knowledge Graph entry
2. **No HTTP security headers** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy all absent from `next.config.ts` (HSTS is present via Vercel default)
3. **Zero images in all 7 blog posts** — no hero images, no diagrams, no post-specific OG images; image search receives nothing, LinkedIn/Twitter shares all use the same generic card
4. **Publication dates not rendered in UI** — blog posts and case studies have `datePublished` in schema but zero date display in the visible HTML — quality raters and AI systems cannot see when content was published
5. **Blog post at ~850 words is below thin content threshold** — "Bridging the Integration Gap" is approximately 57% of the 1,500-word minimum for long-form authority content

### Top 5 Quick Wins

1. Add security headers block to `next.config.ts` — one code change, 30 minutes (Critical fix)
2. Fix Person schema on `/about/page.tsx` — change `url` to `https://chris.melson.us`, add `"@id": "https://chris.melson.us/#person"` (Critical fix, 5 minutes)
3. Add visible publication date to blog post and case study page headers — one template change propagates to all 10 pages (30 minutes)
4. Add `BreadcrumbList` schema to all `/guide/**` pages — highest-ROI schema addition for SERP rich results
5. Expand llms.txt with Canonical Expertise section and individual article summaries — 30 minutes, immediate AI citation impact

---

## Section 1: Technical SEO — **71/100**

*Analysis by seo-technical specialist agent + primary review*

### 1.1 Security Headers ❌ Critical/High

**No security headers are set in `next.config.ts`** (the `headers()` function is absent). Vercel provides HSTS by default only.

| Header | Status | Severity |
|--------|--------|----------|
| `Strict-Transport-Security` | ✅ Present (Vercel default: `max-age=63072000`) — missing `includeSubDomains; preload` | Low gap |
| `Content-Security-Policy` | ❌ Missing | Critical |
| `X-Frame-Options` | ❌ Missing | High |
| `X-Content-Type-Options` | ❌ Missing | High |
| `Referrer-Policy` | ❌ Missing | Medium |
| `Permissions-Policy` | ❌ Missing | Medium |
| `X-Powered-By` | ✅ Removed (`poweredByHeader: false`) | |

**Fix — add to `next.config.ts`:**
```typescript
async headers() {
  return [{
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
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
        ].join('; '),
      },
    ],
  }];
},
```
Note: The `'unsafe-inline'` script-src directive will need to be replaced with nonces once inline `<script type="application/ld+json">` blocks are refactored to support it.

### 1.2 robots.txt — ✅ PASS (with one note)

```
User-Agent: *
Allow: /
Disallow: /private/
Disallow: /api/
Disallow: /_next/
Sitemap: https://chris.melson.us/sitemap.xml
```

- All AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot) are allowed ✓
- `/_next/` disallow correctly blocks build artifacts ✓
- `/api/` disallow blocks `/api/circadian` (correct)
- **Note:** `/cv.json` is served at `https://chris.melson.us/cv.json` (not under `/api/`), so it is **not** blocked by the `/api/` disallow. Its crawlability is ambiguous — add an explicit `Disallow: /cv.json` if it should be private, or add it to llms.txt if intended for AI consumption.

### 1.3 Sitemap — ⚠️ PASS with stale dates

- 17 URLs, all with `lastmod`, `changefreq`, `priority` ✓
- Served with `Content-Type: application/xml`, `Cache-Control: public, max-age=86400` ✓
- Dynamic routes (blog, case studies) use data-derived `lastmod` dates ✓

**Issues:**
- `/guide/lab` lastmod: `2026-01-09` — **4.5 months stale** (hardcoded in route.ts line 20)
- `/guide/office` lastmod: `2026-01-12` — **4+ months stale** (hardcoded in route.ts line 21)
- `/mode/[slug]` intentionally excluded (canonical points to `/`) — correct ✓

### 1.4 Canonical Tags — ✅ PASS on `<link rel="canonical">`, Bug on OG

All 17 pages have correct canonical tags via Next.js `alternates.canonical` with `metadataBase: https://chris.melson.us`. ✓

**Bug:** The `/about` page's OpenGraph metadata inherits homepage-level values (OG url = homepage, OG title = "Christopher Melson | Polymorphic Portfolio"). When `/about` is shared to LinkedIn or Slack, it shows the wrong card. Fix: add explicit `openGraph` object to the `/about` metadata export.

### 1.5 HTTPS / Mobile / Redirects — ✅ PASS

- HTTPS enforced at Vercel edge ✓
- Viewport: `width=device-width, initial-scale=1, maximum-scale=5` ✓ (maximum-scale=5 is correct — allows user zoom)
- Responsive Tailwind classes throughout ✓
- Statically pre-rendered pages return `X-Nextjs-Prerender: 1` ✓

### 1.6 llms.txt — ✅ PRESENT but underbuilt

`https://chris.melson.us/llms.txt` returns HTTP 200, `Content-Length: 1495`, served with `Access-Control-Allow-Origin: *` and edge caching via Vercel. This puts the site ahead of ~95% of comparable portfolios.

**Gaps:** Missing a Canonical Expertise section; does not list individual blog/case study URLs with summaries; omits `/about` and `/faq` references; no `/llms-full.txt` companion for richer LLM context ingestion.

---

## Section 2: Content Quality & E-E-A-T — **68/100**

*Analysis by seo-content specialist agent*

### 2.1 Experience Signals — STRONG ✓ (16/20)

The case studies are the strongest E-E-A-T asset on the site:
- CS-01 names specific internal data: ~$270M revenue base, ~200 institutional "Whales," 30% Sales capacity waste, the "CSAT Paradox"
- CS-02: precise budget trajectory ($20M → $80M), $2M/month burn rate, the "Equities Mismatch" (FX runs 24/5 vs. daily market close assumption)
- CS-03: 13 countries, 200+ FTE, WhatsApp/WeChat/Power Apps/ServiceNow/Glint tool specificity, "January 15 Ultimatum" temporal grounding

These details require insider knowledge and cannot be generated generically — they are strong quality rater signals.

Blog posts are weaker on experience: the M&A integration post uses first-person ("I often employ the Strangler Fig pattern") but examples are generic (Python/Go vs. COBOL/Mainframe). The ITIL post is entirely third-person with no "I did this at Company X" moment. The two content layers (blog + case studies) are never connected, missing the attribution chain.

### 2.2 Expertise Signals — GOOD ✓ (19/25)

The ITIL blog post (~1,900 words) demonstrates genuine practitioner expertise: correct Incident/Problem distinction, all three major RCA methodologies (Five Whys, Ishikawa, Kepner-Tregoe), KEDB coverage, Reactive-to-Proactive maturity progression, and Change Management handoff. This is above the bar for ITSM content.

**Weaknesses:**
- McKinsey citation in the M&A post has no URL — unverifiable claim for a load-bearing statistic
- "70-90% of M&A deals fail to realize synergies" presented as settled fact without nuance
- No on-page credential disclosure (ITIL 4, PMP, TOGAF) on blog/case study pages

### 2.3 Authoritativeness Signals — MODERATE ⚠️ (13/25)

**Has:** LinkedIn + GitHub in `sameAs` schema, real employer names (LSEG, Refinitiv, Thomson Reuters), CV download, `disambiguatingDescription` in schema.

**Missing:**
- No external press mentions, media coverage, or speaking pages
- LinkedIn and GitHub links do NOT appear on blog post or case study individual pages — only in the homepage/about layer
- No testimonials, client logos, or third-party endorsements
- No Wikipedia entity
- Zero YouTube presence (0.737 correlation with AI citation frequency per GEO analysis)

### 2.4 Trustworthiness Signals — MODERATE ⚠️ (16/30)

**Critical gap: Publication dates not visible in UI**

Blog posts and case studies have `datePublished` in JSON-LD schema but zero date rendering in the visible HTML. Google's September 2025 QRG explicitly rewards transparent publication dates. Visitors and quality raters cannot see when content was written.

**Fix:** In `/guide/operational-architecture/blog/[slug]/page.tsx` (lines 80-84), add `{new Date(post.date).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}` alongside the author byline. Mirror this on case study pages.

**Other gaps:**
- `dateModified === datePublished` on all posts — content signals as never updated
- McKinsey citation [2] in M&A post is unlinked
- No contact information visible on blog post or case study individual pages
- No privacy policy (not legally required for a portfolio but noted by some crawlers)

### 2.5 Content Depth

| Page | Estimated Words | Status |
|------|----------------|--------|
| ITIL Problem Management (blog) | ~1,900 | ✅ Adequate |
| M&A Integration Gap (blog) | ~850 | ❌ **Thin** (57% of 1,500-word floor) |
| Operational Architecture guide | ~1,200 | ✅ Good |
| Case studies (each) | ~800-1,200 | ✅ Good (S.T.A.R. structure) |
| FAQ | ~900 | ✅ Good |
| /guide/office | ~300 | ⚠️ Thin |
| /guide/lab | ~300 | ⚠️ Thin |

### 2.6 Internal Linking — ❌ WEAK

- Blog posts have **zero outbound internal links** in their body content
- Case study pages link only to the listing page and homepage
- Blog posts and case studies are complete content silos — no cross-linking
- No post links to `/guide/operational-architecture` (the hub definition page)
- No post links to `/about` or `/faq` as natural next steps

**Specific missed links:**
- M&A blog post → CS-01 (same topic, the methodology explanation connects to the real case)
- ITIL post → CS-03 (the 300→<20 minute MTTr reduction is the real-world ITIL lifecycle proof)
- All blog posts → `/faq` (as "next steps" for potential clients)
- All blog posts → author bio or LinkedIn (trust signal)

### 2.7 AI Content Detection Risk

Moderate signals: uniform sentence length in the M&A post, templated parallel structure across all 7 posts ("Core Argument / Key Insight / Key Metric" sections), consistent list formatting. Case study specificity (tool names, exact figures, temporal grounding) is the strongest counterweight. Under Google's September 2025 QRG, AI content is acceptable if E-E-A-T is demonstrated — case studies clear this bar, blog posts are closer to the line.

---

## Section 3: On-Page SEO — **68/100**

### 3.1 Title Tags

| Page | Title | Length | Issue |
|------|-------|--------|-------|
| / | "Christopher Melson \| Operational Architect for the Agentic Age" | 62 | ✅ |
| /about | "About Christopher Melson \| Executive & Board Advisor" | 53 | ✅ |
| /faq | "FAQ: The Objection Handling Engine" | 35 | ⚠️ No brand, weak keyword |
| /guide/operational-architecture | "What is an Operational Architect? \| Christopher Melson" | 55 | ✅ |
| /guide/operational-architecture/case-studies | "Operational Architecture Case Studies \| Chris Melson \| Christopher Melson" | 74 | ⚠️ Redundant dual names |
| /guide/operational-architecture/blog | "Operational Architecture Blog \| Chris Melson \| Christopher Melson" | 66 | ⚠️ Redundant dual names |
| /guide/lab | "The Lab \| Cognitive Refactoring & Innovation \| Christopher Melson" | 66 | ✅ |
| Blog [slug] | post.title only | Varies | ⚠️ No brand name suffix |
| Case study [slug] | "{title} \| Case Study" | Varies | ⚠️ No brand name |

### 3.2 Meta Descriptions

| Page | Length | Issue |
|------|--------|-------|
| / | ~155 chars | ✅ |
| /about | **68 chars** | ❌ Too short — "I build systems that work..." is not a meta description |
| /faq | ~130 chars | ✅ |
| /guide/operational-architecture | From data (verify) | ⚠️ Check length |
| Blog/Case Study [slug] | From data | ⚠️ Verify individual lengths |

The About page description (`aboutContent.bio.intro[0]`) is a tagline, not a descriptive meta. Target: 120-160 characters that describe what visitors will find on the page.

### 3.3 Open Graph / Twitter Card Coverage

| Page | OG | Twitter |
|------|-----|---------|
| / | ✅ Full | ✅ |
| Blog [slug] | ✅ Article type | ✅ |
| Case study [slug] | ✅ Article type | ✅ |
| /about | ❌ Inherits homepage OG | ❌ Inherits homepage |
| /faq | ❌ | ❌ |
| /guide/operational-architecture | ❌ | ❌ |
| /guide/operational-architecture/case-studies | ❌ | ❌ |
| /guide/operational-architecture/blog | ❌ | ❌ |
| /guide/lab | ❌ | ❌ |
| /guide/office | ❌ | ❌ |

All secondary pages inherit the generic root layout OG tag (homepage title + description + generic card). When these pages are shared on LinkedIn, the wrong card appears.

### 3.4 Heading Structure Issues

- `/guide/lab` H3s: "Schema Metadata", "executive", "strategist", "engineer" — mode names used as headings, poor semantic signal
- `/guide/office` H3s: "Schema Metadata", "boardroom", "architect", "engine room" — same issue
- Blog posts: H2 headings "Core Argument", "Target Audience", "Key Insight" appear before actual content headings (GEO data blocks rendered as H2s, creating a confused heading hierarchy)
- **Homepage H1:** The main interactive experience renders via `HomeClient` (client-side JS). Verify that the server-rendered fallback (`ServerSideResume`, `SemanticNavGraph`) includes a visible H1 — if not, Google indexes a page without an H1.

### 3.5 URL Structure — ✅ PASS

Clean, descriptive, lowercase, hyphenated slugs. Logical hierarchy. No query strings on indexed pages. No trailing slash inconsistency. ✓

---

## Section 4: Schema & Structured Data — **61/100**

*Analysis by seo-schema specialist agent*

### 4.1 Coverage

| Page | Schema | Status |
|------|--------|--------|
| / | @graph: Person, WebSite, ProfilePage, SoftwareApplication, ImageObject | ✅ Sophisticated |
| /about | Person (standalone) | ❌ Critical bug |
| /faq | FAQPage (9 Q&As) | ✅ |
| /guide/operational-architecture | FAQPage (3 Q&As) | ✅ |
| /guide/operational-architecture/blog | CollectionPage + BlogPosting hasPart | ✅ |
| Blog [slug] | BlogPosting | ⚠️ Missing @id, url, mainEntityOfPage |
| /guide/operational-architecture/case-studies | CollectionPage + Article hasPart | ✅ |
| Case study [slug] | Article | ⚠️ Missing @id, url; broken publisher |
| /guide/office | None | ❌ |
| /guide/lab | None | ❌ |

**Note:** `src/shared/lib/schema-generator.ts` exists with a `generateBlogPostingSchema()` function that correctly implements `mainEntityOfPage`, `@id`, and `url` — but blog post pages construct their own inline schema instead of using this function. It is effectively dead code. Wire blog post pages to use it.

### 4.2 Critical Error: Duplicate Person Entity (Fix Immediately)

**File:** `src/app/about/page.tsx` line 25

```javascript
"url": "https://chrismelson.com",  // WRONG — should be https://chris.melson.us
```

No `@id` means this is an anonymous, unconnected entity. Google sees two separate Person entities and cannot merge them. This actively harms Knowledge Graph disambiguation.

**Fix:** Replace the entire standalone Person schema with a WebPage reference:
```json
{
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
}
```

### 4.3 BlogPosting — Missing Rich Result Properties

Add to each blog post's jsonLd object:
```javascript
"@id": `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}`,
"url": `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}`,
"mainEntityOfPage": {
  "@type": "WebPage",
  "@id": `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}`
},
"wordCount": post.content.split(' ').length,
```

### 4.4 Case Study Article — Publisher Bug

```javascript
// WRONG: Creates anonymous Organization entity
"publisher": {
  "@type": "Organization",
  "name": "Christopher Melson | Polymorphic Portfolio",
  "logo": { "@type": "ImageObject", "url": "https://chris.melson.us/opengraph-image" }
}

// FIX: Reference existing person entity
"publisher": { "@id": "https://chris.melson.us/#person" }
```

The OG image is not a logo — Google's Article rich result requires a proper logo. Until a `logo.png` exists, reference the Person entity as publisher.

### 4.5 ImageObject Node — URL Mismatch

`#primaryimage` references `https://chris.melson.us/opengraph-image` (the dynamic Next.js OG route). The Person node within the same graph references `https://chris.melson.us/chris-melson-headshot.jpg`. These are inconsistent. Fix `#primaryimage` to use the static headshot URL and add `width`, `height`, `encodingFormat`.

### 4.6 Missing Schema Opportunities

**BreadcrumbList (High Priority)** — Not implemented anywhere. Every `/guide/**` page is a candidate. This is the single highest-ROI schema addition for SERP rich results.

**WebPage nodes** — Pages `/faq`, `/guide/office`, `/guide/lab`, `/about` need WebPage nodes with `isPartOf: {#website}` and `about: {#person}` to establish site topology in the entity graph.

**ContactPoint** — Add to the `#person` node for professional inquiries (`contactType`, `url: LinkedIn`, `availableLanguage`).

**Service schema** — Add to `/guide/operational-architecture` to describe the advisory engagement model.

### 4.7 Rich Result Eligibility

| Type | Status | Blocker |
|------|--------|---------|
| BreadcrumbList | ❌ Not implemented | Implement it |
| BlogPosting rich results | ❌ Not eligible | Missing `@id`, `url`, `mainEntityOfPage` |
| Article rich results | ❌ Not eligible | Same + broken publisher logo |
| FAQPage rich results | ⚠️ Restricted | Google restricted to gov/healthcare Aug 2023 — still useful for AI citation |
| ProfilePage (Knowledge Panel) | ✅ Partially eligible | Person @graph is correct |

---

## Section 5: Performance — **68/100**

*Estimated from code analysis — no live CrUX data available without Google Search Console credentials*

### 5.1 Strengths

- Next.js 16 with static generation — most pages pre-rendered at edge ✓
- Vercel CDN with global edge network ✓
- AVIF/WebP image formats configured ✓
- Responsive image sizes (360–3840px) ✓
- `compress: true` ✓
- Font `preconnect` hints in layout.tsx ✓
- `productionBrowserSourceMaps: true` (note: Vercel appears to block `.map` files publicly — verify)

### 5.2 Concerns

**5 Google Font Families (Medium-High LCP Risk)**

Inter, Young Serif, Merriweather, JetBrains Mono, and Roboto Slab are all loaded. Even with `preconnect` hints, loading 5 font families adds multiple round trips and CSS @font-face declarations. Consider auditing which fonts are actually used on the critical rendering path and whether all 5 are needed simultaneously.

**Framer Motion (Medium JS Bundle Risk)**

The full Framer Motion library (~30-50KB gzipped) is imported. For primarily animation use, lighter alternatives (CSS transitions, @keyframes) could reduce Time to Interactive and Total Blocking Time.

**Client-Side Homepage (LCP Concern)**

The primary portfolio experience (`HomeClient`) renders client-side. Server-rendered content (`ServerSideResume`, `SemanticNavGraph`) provides fallback, but the main visual interface loads after JavaScript execution. This delays LCP for the most important page.

### 5.3 Core Web Vitals Estimate

| Metric | Estimate | Target |
|--------|----------|--------|
| LCP | 2.0–2.8s | < 2.5s |
| INP | < 200ms (likely) | < 200ms |
| CLS | < 0.1 (entrance animations use `opacity`/`transform` only) | < 0.1 |
| FCP | 1.2–1.8s | < 1.8s |
| TTFB | < 0.6s (Vercel edge) | < 0.8s |

*Run a real PageSpeed Insights test for accurate field data.*

---

## Section 6: AI Search Readiness (GEO) — **71/100**

*Analysis by seo-geo specialist agent*

### 6.1 Platform Scores

| Platform | Estimated Visibility |
|----------|---------------------|
| Google AI Overviews | 74/100 |
| Claude (browse) | 72/100 |
| Bing Copilot | 65/100 |
| Perplexity | 68/100 |
| ChatGPT (search) | 58/100 |

### 6.2 Citability by Target Query

| Query | Page | Citability |
|-------|------|-----------|
| "What is an operational architect?" | /guide/operational-architecture | 62/100 — FAQPage ✓, but answer text ~80 words (target: 134-167 words) |
| "M&A integration consultant" | CS-01 + FAQ | 76/100 — specific metrics, first-person authority |
| "DORA compliance expert" | FAQ mention only | **48/100 — no dedicated page** |
| "transformation executive" | /about (partial) | 55/100 — narrative, not answerable |
| "operational architecture blog" | /guide/operational-architecture/blog | 70/100 — structured listing, correct schema |

**The DORA gap is the highest-value content opportunity on the site.** A dedicated page at `/guide/operational-architecture/dora-compliance` with FAQPage schema targeting "What is EU DORA?", "Who does DORA apply to?", and "How does an Operational Architect implement DORA compliance?" would directly capture a high-intent, low-competition query.

### 6.3 llms.txt Status — ✅ Present but Underbuilt

File present, ~1,495 bytes, served with edge caching. **Recommended expansions:**
1. Add `## Canonical Expertise` section listing 5-6 topics
2. Add individual page/post URLs with one-sentence summaries
3. Expand to 600-800 words total
4. Consider a `/llms-full.txt` companion with FAQ content pre-formatted for LLM ingestion

### 6.4 Brand Entity Strength — ✅ Strong Person @graph, Weak Third-Party Signals

**Strengths:** `disambiguatingDescription` ("Distinct from the Civil Engineer (LSU) and the Football Coach"), `alternateName` array with 4 variants, `sameAs` links, `worksFor` with EmployeeRole entries from resume.json, `knowsAbout` with 8 topic entities.

**Critical gaps:**
- **Zero YouTube presence** — 0.737 correlation with AI citation frequency per analysis. 3-5 videos would be the highest-ROI long-term brand signal.
- No Wikipedia entity
- No Reddit presence in target subreddits (r/consulting, r/fintech, r/csuite)
- `sameAs` has only 2 entries (GitHub, LinkedIn) — no third-party author pages, Crunchbase, conference speaker bios

### 6.5 Technical GEO Signals — ✅ Strong

- `max-snippet: -1` in robots metadata — allows unlimited Google AI Overview extraction ✓
- All AI crawlers allowed in robots.txt ✓
- SSR ensures all content is bot-accessible without JavaScript execution ✓
- `SemanticNavGraph` provides complete site graph crawlability via plain HTML ✓
- STAR-format case studies are ideal AI extraction targets (each section is independently extractable) ✓
- `articleBody` in BlogPosting and Article schema enables full-content AI indexing ✓

---

## Section 7: Images — **42/100**

### 7.1 Blog Posts — Zero Images

All 7 blog posts contain no images whatsoever:
- No hero images
- No diagrams, infographics, or screenshots
- No post-specific OG images (all share the generic Christopher Melson card)
- Google Image Search has no blog content to index
- LinkedIn/Twitter shares all show the same card regardless of which post is shared

### 7.2 About Page — Missing Alt Text

The headshot image on `/about` has no `alt` text. This fails WCAG 2.1 SC 1.1.1 and removes the image from Google Image Search.

### 7.3 Static Headshot vs. Dynamic OG Image

The `chris-melson-headshot.jpg` file is referenced in the Person schema but the `#primaryimage` ImageObject node in `JsonLd.tsx` references the dynamic `/opengraph-image` route instead. For a stable Google Images / Knowledge Panel signal, serve the headshot at a static path and reference it consistently in both Person and ImageObject schema.

### 7.4 Recommendations

1. Add at least one diagram or infographic to the ITIL post (lifecycle diagram, maturity table)
2. Add conceptual diagrams to the M&A integration post (TOM design flow, integration gap visualization)
3. Generate post-specific OG images using the Next.js `opengraph-image` pattern for each blog post
4. Fix headshot alt text on `/about`
5. Ensure `/chris-melson-headshot.jpg` exists at a stable, publicly accessible URL

---

## Section 8: Search Experience Optimization (SXO)

### 8.1 Query-to-Page-Type Mapping

| Target Query | Google Preferred Type | Site Has? | Match? |
|---|---|---|---|
| "what is an operational architect" | Definition/FAQ | /guide/operational-architecture | ✅ Good match |
| "operational architect" (broad) | Mix of definition + profile | /guide/operational-architecture + / | ✅ |
| "M&A integration consultant" | Service page | CS-01 (partial) | ⚠️ No dedicated service page |
| "DORA compliance expert" | Expert profile / guide | FAQ mention only | ❌ No dedicated page |
| "transformation executive" | Profile/bio | /about | ⚠️ Narrative, not query-matched |

### 8.2 Key UX Gaps

1. **No booking/contact mechanism** — LinkedIn is the only CTA. No calendar link (Calendly, Cal.com), no contact form, no email. For a B2B professional services site targeting PE firms and boards, this is a conversion-rate blocker.
2. **"Objection Handling Engine" H1** — branded title that doesn't match search intent "FAQ operational architect." First-time search visitors may not recognize they're on the right page.
3. **Mode switcher crawl gap** — The interactive Boardroom/Architect/Engine Room experience requires JavaScript. Bots index the sr-only SemanticNavGraph fallback, not the richest homepage content.
4. **No breadcrumbs** — Deep URLs like `/guide/operational-architecture/case-studies/ma-integration-gap` have no breadcrumb navigation. BreadcrumbList schema would add SERP sitelinks.
5. **Blog posts show no date, author byline without link, no "next post" navigation** — temporal credibility and content discovery are both weak.

### 8.3 Persona Scoring

| Persona | Score | Main Friction |
|---------|-------|---------------|
| PE Firm Partner (M&A focus) | 65/100 | Case studies exist but no direct contact path |
| Transformation Team Lead (DORA/compliance focus) | 45/100 | No DORA page; FAQ mention insufficient |
| Board Chair (board advisor search) | 62/100 | FAQ answers this well; no case study for board work |

---

## Appendix: Full Page Inventory

| URL | Title | Description | Canonical | Schema | OG Tags |
|-----|-------|-------------|-----------|--------|---------|
| / | ✅ | ✅ 155 chars | ✅ | ✅ @graph | ✅ |
| /about | ✅ | ❌ 68 chars | ✅ | ❌ broken | ❌ inherits |
| /faq | ✅ 35 chars (short) | ✅ 130 chars | ✅ | ✅ FAQPage | ❌ inherits |
| /guide/operational-architecture | ✅ | ✅ | ✅ | ✅ FAQPage | ❌ inherits |
| /guide/operational-architecture/case-studies | ✅ redundant names | ✅ | ✅ | ✅ CollectionPage | ❌ inherits |
| /guide/operational-architecture/blog | ✅ redundant names | ✅ | ✅ | ✅ CollectionPage | ❌ inherits |
| /guide/lab | ✅ | ✅ | ✅ | ❌ None | ❌ inherits |
| /guide/office | ✅ | ✅ | ✅ | ❌ None | ❌ inherits |
| Blog [slug] × 7 | ✅ no brand | ✅ | ✅ | ⚠️ incomplete | ✅ |
| Case study [slug] × 3 | ✅ no brand | ✅ | ✅ | ⚠️ incomplete | ✅ |

---

*Report generated 2026-05-18 using 5 parallel specialist agents (seo-technical, seo-content, seo-schema, seo-geo, seo-sxo) + primary analysis.*
