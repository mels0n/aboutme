---
phase: 3
plan: 1
wave: 1
depends_on: ["1.2"]
files_modified: [
  "src/app/sitemap.ts",
  ".gsd/ROADMAP.md",
  ".gsd/STATE.md"
]
autonomous: true

must_haves:
  truths:
    - "`sitemap.ts` includes the route `/guide/itil-problem-management`."
    - "A final review of AEO/GEO rules has been executed on the produced code."
    - "Phase 3 is marked Complete in `ROADMAP.md`."
  artifacts:
    - "src/app/sitemap.ts"
---

# Plan 3.1: Validation & Deployment Polish

<objective>
To perform final Quality Assurance and AEO/GEO/SEO validation on the project deliverables, explicitly satisfying the governance rules outlined for project completion. This ensures the output is indexable by Answer Engines and Search Engines.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- RULES from project instructions (Validation Gates)
- src/app/sitemap.ts
</context>

<tasks>

<task type="auto">
  <name>Update Sitemap for Semantic Twin</name>
  <files>src/app/sitemap.ts</files>
  <action>
    Modify `sitemap.ts` to include a new static route entry for `/guide/itil-problem-management`.
    Wait, `itil-problem-management` is in `officeBlogPosts`. Add it dynamically or statically.
    Since we only created one hardcoded page for it at `/guide/itil-problem-management`, we can add a static route block for it, OR we can dynamically map over `officeBlogPosts` to create `/guide/${post.slug}` entries. Given we only built one page, let's just add the static route:
    ```ts
    {
        url: `${baseUrl}/guide/itil-problem-management`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }
    ```
  </action>
  <verify>Get-Content src/app/sitemap.ts -TotalCount 50</verify>
  <done>Sitemap contains the new Semantic Twin route.</done>
</task>

<task type="auto">
  <name>Perform Final Governance Verification</name>
  <files>None</files>
  <action>
    Execute the mental audit gates required by the Master Instructions:
    1. **Answer Engine Test**: Is the first `<p>` or `<dd>` a direct, concise answer? Yes, the KEDB and Proactive vs Reactive facts are defined directly.
    2. **Rich Snippet Test**: Are schemas embedded? Yes, we injected `<script type="application/ld+json">` for both FAQ and BlogPosting.
    3. **Entity Test**: Is it linked? Yes, it's added to `officeBlogPosts` which renders into the `OfficeBlogGrid`.
    4. **Standard Search**: Checked `sitemap.ts` and `robots.ts` integration.
  </action>
  <verify>Run `npm run build` to confirm no errors occur due to sitemap updates.</verify>
  <done>Mental audit complete and build succeeds.</done>
</task>

<task type="auto">
  <name>Conclude Phase 3</name>
  <files>.gsd/ROADMAP.md, .gsd/STATE.md</files>
  <action>
    - Update `ROADMAP.md` to set Phase 3 as ✅ Complete.
    - Write `/execute 3` completion summaries (`3-SUMMARY.md` and `VERIFICATION.md`).
    - Update `STATE.md` to indicate the Milestone is complete.
  </action>
  <verify>Get-Content .gsd/ROADMAP.md</verify>
  <done>Roadmap Phase 3 is Complete and State is verified.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `sitemap.ts` builds correctly.
- [ ] `ROADMAP.md` shows all phases complete.
</verification>

<success_criteria>
- [ ] All required search validations are documented and verified.
</success_criteria>
