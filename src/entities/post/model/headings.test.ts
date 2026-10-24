import { describe, expect, it } from "vitest";
import { officeBlogPosts } from "@/shared/data/published_blog_posts";
import { headingShift, headingSlug, tableOfContents } from "./headings";

const fence = "```bash\n## not a heading, a shell comment\necho hi\n```";

describe("headingShift", () => {
    it("keeps a ## post as is", () => {
        expect(headingShift("## One\n\ntext\n\n## Two")).toBe(0);
    });

    it("raises a ### post one level", () => {
        expect(headingShift("### One\n\n### Two")).toBe(1);
    });

    it("ignores ## lines inside fenced code", () => {
        expect(headingShift(`### One\n\n${fence}\n\n### Two`)).toBe(1);
    });
});

describe("tableOfContents", () => {
    it("lists the top level with ids that match headingSlug", () => {
        expect(tableOfContents("## First Part\n\n## Second [Part](https://x.y)")).toEqual([
            { id: "first-part", text: "First Part" },
            { id: "second-part", text: "Second Part" },
        ]);
    });

    it("falls back to ### and skips fenced code", () => {
        const toc = tableOfContents(`### A\n\n${fence}\n\n### B`);
        expect(toc.map((item) => item.text)).toEqual(["A", "B"]);
    });

    it("gives every published post a top level that renders as h2", () => {
        for (const post of officeBlogPosts) {
            const prose = post.content.replace(/^```[\s\S]*?^```/gm, "");
            const top = headingShift(post.content) === 0 ? /^## /m : /^### /m;
            expect(top.test(prose), post.slug).toBe(true);
        }
    });

    it("slugs headings to ids, with a fallback for text that has no letters or digits", () => {
        expect(headingSlug("What's next? (Part 2)")).toBe("whats-next-part-2");
        expect(headingSlug("¿¡!")).toBe("section");
    });
});
