import { describe, expect, it } from "vitest";
import { officeBlogPosts } from "./published_blog_posts";
import { officePostCards } from "./published_post_cards";
import { readMinutes, toPostCard } from "./post-card-type";

describe("readMinutes", () => {
    it("rounds up at 225 words a minute", () => {
        expect(readMinutes(Array(225).fill("w").join(" "))).toBe(1);
        expect(readMinutes(Array(226).fill("w").join(" "))).toBe(2);
    });
});

describe("post cards", () => {
    it("carry only card fields, never the post body", () => {
        const card = toPostCard(officeBlogPosts[0]);
        expect(Object.keys(card).sort()).toEqual(
            ["date", "id", "polymorphicSummary", "readMinutes", "slug", "summary", "title"],
        );
        expect(JSON.stringify(officePostCards)).not.toContain(officeBlogPosts[0].content.slice(0, 200));
    });

    it("list exactly the published posts", () => {
        expect(officePostCards.map((card) => card.slug)).toEqual(officeBlogPosts.map((post) => post.slug));
    });
});
