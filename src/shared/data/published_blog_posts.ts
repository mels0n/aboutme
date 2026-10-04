// Public blog data module. Everything on the site reads posts from here.
// The list is generated at build time by scripts/generate-published-posts.ts
// and contains only posts that are published as of that build.
import type { BlogPost } from "./blog-post-type";
import { publishedPosts } from "./published-posts.generated";

export type { BlogPost } from "./blog-post-type";

export const officeBlogPosts: BlogPost[] = publishedPosts;
