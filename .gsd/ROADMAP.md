# ROADMAP.md

> **Current Milestone**: 17 - New Blog Post
> **Goal**: Create a new blog post following all existing FSD and AEO/GEO/SEO rules, including the 'Answer First' rule, Semantic Twin protocol, and proper schemas.

## Must-Haves
- [ ] Implement a new `BlogPost` data object in `src/shared/data/blog-posts/`
- [ ] Create the strict Semantic Twin page under `src/app/guide/operational-architecture/blog/[slug]/page.tsx` (or similar feature slice)
- [ ] Guarantee Answer-First semantic `<dl>` structure for GEO
- [ ] Guarantee valid JSON-LD schemas (BlogPosting, FAQPage, HowTo depending on content)
- [ ] Ensure `polymorphicSummary` and `geoHighlights` are properly supplied

## Phases

### Phase 1: Topic Selection & Schema Design
**Status**: ✅ Complete
**Objective**: Decide on the blog post topic, outline the core thesis, and define the expected JSON-LD schema (FAQ, How-To, etc.) to drive the narrative structure.

### Phase 2: Content Drafting (Data Layer)
**Status**: ✅ Complete
**Objective**: Write the blog post content as a standard `BlogPost` object in `src/shared/data/blog-posts/`, meticulously filling in `polymorphicSummary`, `geoHighlights`, and formatting with markdown.

### Phase 3: Semantic Twin Implementation (UI Layer)
**Status**: ✅ Complete
**Objective**: Build the public page for the blog post (e.g., `src/app/guide/operational-architecture/blog/network-observability/page.tsx`), strictly adhering to Answer-First, FAQ Schema, and Semantic Twin protocols.p of the page.

### Phase 4: AEO/GEO/SEO Validation & Polish
**Status**: ⬜ Not Started
**Objective**: Run local builds, validate the auto-generated JSON-LD using schema tools, verify mobile responsiveness, and confirm the living system protocol (updating any related documentation like llms.txt or sitemap if needed).
