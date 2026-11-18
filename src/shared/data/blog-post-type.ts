export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    /** Search-result title (<title>, social cards) when `title` runs past about 60 characters. The page heading keeps `title`. */
    seoTitle?: string;
    author: string;
    role: string;
    date: string;
    lastUpdated?: string;
    /** Never publish regardless of date, e.g. while a post is still being drafted. */
    draft?: boolean;
    summary: string;
    /** Meta description and social-card text when `summary` runs past 160 characters. The page and its structured data keep the full `summary` on purpose. */
    seoDescription?: string;
    polymorphicSummary: {
        executive: string;
        strategist: string;
        engineer: string;
    };
    content: string;
    ogImage?: string;
    /** Topic keywords, emitted as BlogPosting.keywords when present. */
    keywords?: string[];
    geoHighlights: {
        label: string;
        value: string;
    }[];
}
