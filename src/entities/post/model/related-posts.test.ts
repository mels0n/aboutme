import { describe, expect, it } from "vitest";
import { relatedPosts } from "./related-posts";

const post = (slug: string, role: string, date: string) => ({ slug, role, date });

const posts = [
    post("maps-1", "Builder, Fair Maps · Operational Architect", "2026-09-01"),
    post("maps-2", "Builder, Fair Maps · Operational Architect", "2026-10-01"),
    post("lab-1", "Homelab Architect", "2026-08-01"),
    post("oa-1", "Operational Architect", "2026-10-10"),
    post("oa-2", "Operational Architect", "2026-01-01"),
];

describe("relatedPosts", () => {
    it("puts the same series first, then the newest of the rest, never the post itself", () => {
        const related = relatedPosts(posts[0], posts).map((p) => p.slug);
        expect(related).toEqual(["maps-2", "oa-1", "lab-1"]);
    });

    it("groups on the role before the separator", () => {
        expect(relatedPosts(posts[3], posts, 1).map((p) => p.slug)).toEqual(["oa-2"]);
    });

    it("returns fewer when there are not enough posts", () => {
        expect(relatedPosts(posts[0], posts.slice(0, 2))).toHaveLength(1);
    });
});
