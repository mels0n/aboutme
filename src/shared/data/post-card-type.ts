import type { BlogPost } from "./blog-post-type";

/**
 * The fields a post card shows. Client components list posts with cards, not
 * full posts, so post bodies never ship in browser JavaScript.
 */
export type PostCard = Pick<BlogPost, "id" | "slug" | "title" | "date" | "summary" | "polymorphicSummary"> & {
    readMinutes: number;
};

/** Reading time at 225 words a minute, as every post listing shows it. */
export function readMinutes(content: string): number {
    return Math.ceil(content.split(/\s+/).length / 225);
}

export function toPostCard(post: BlogPost): PostCard {
    const { id, slug, title, date, summary, polymorphicSummary } = post;
    return { id, slug, title, date, summary, polymorphicSummary, readMinutes: readMinutes(post.content) };
}
