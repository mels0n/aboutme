export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    author: string;
    role: string;
    date: string;
    lastUpdated?: string;
    /** Never publish regardless of date, e.g. while a post is still being drafted. */
    draft?: boolean;
    summary: string;
    polymorphicSummary: {
        executive: string;
        strategist: string;
        engineer: string;
    };
    content: string;
    ogImage?: string;
    geoHighlights: {
        label: string;
        value: string;
    }[];
}
