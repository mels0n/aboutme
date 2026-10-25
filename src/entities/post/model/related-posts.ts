type RelatablePost = { slug: string; role: string; date: string };

/**
 * A post's byline role names its series ("Builder, Fair Maps · Operational
 * Architect") or its lane ("Homelab Architect"); the part before " · " groups
 * posts that belong together.
 */
const series = (post: RelatablePost) => post.role.split(" · ")[0];

const newestFirst = (a: RelatablePost, b: RelatablePost) => b.date.localeCompare(a.date);

/** Up to `count` other posts: same series first, then the newest of the rest. */
export function relatedPosts<T extends RelatablePost>(current: RelatablePost, posts: T[], count = 3): T[] {
    const others = posts.filter((post) => post.slug !== current.slug);
    const sameSeries = others.filter((post) => series(post) === series(current)).sort(newestFirst);
    const rest = others.filter((post) => series(post) !== series(current)).sort(newestFirst);
    return [...sameSeries, ...rest].slice(0, count);
}
