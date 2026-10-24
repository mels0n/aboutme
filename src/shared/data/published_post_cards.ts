// Card-sized view of the published posts, for client components. Generated
// next to published-posts.generated.ts by scripts/generate-published-posts.ts;
// it holds no post bodies, so importing it keeps the browser bundle small.
import { publishedPostCards } from "./published-post-cards.generated";

export type { PostCard } from "./post-card-type";

export const officePostCards = publishedPostCards;
