// Heading ids are produced twice: from raw markdown for the table of
// contents, and from rendered children for the h2/h3 anchors. Both must go
// through headingSlug so the TOC links land on the matching heading.
export function headingSlug(text: string): string {
    const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    return slug || "section";
}

/** Markdown with fenced code blocks blanked out, so a `## comment` in a shell block is not read as a heading. */
function withoutCodeFences(markdown: string): string {
    return markdown.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, "");
}

// Posts use either ## or ### as their top section level. The table of
// contents follows whichever is the shallowest level with 2+ headings.
export function tableOfContents(markdown: string): { id: string; text: string }[] {
    const prose = withoutCodeFences(markdown);
    for (const level of [2, 3]) {
        const pattern = new RegExp(`^${"#".repeat(level)} (.+)$`, "gm");
        const items = [...prose.matchAll(pattern)].map((m) => {
            const text = m[1]
                .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
                .replace(/[*_`]/g, "")
                .trim();
            return { id: headingSlug(text), text };
        });
        if (items.length >= 2) return items;
    }
    return [];
}

/**
 * How many levels to raise the post's headings so its top level renders as
 * h2 under the page's h1: 0 for a post written with ##, 1 for a post whose
 * top level is ###.
 */
export function headingShift(markdown: string): number {
    return /^## /m.test(withoutCodeFences(markdown)) ? 0 : 1;
}
