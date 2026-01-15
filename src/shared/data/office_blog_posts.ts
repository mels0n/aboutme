import { agenticShift } from "./blog-posts/agentic-shift";
import { triModalTranslation } from "./blog-posts/tri-modal-translation";
import { integrationGap } from "./blog-posts/integration-gap";
import { scalabilityEngineering } from "./blog-posts/scalability-engineering";
import { generativeToAgentic } from "./blog-posts/generative-to-agentic";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    author: string;
    role: string;
    date: string;
    summary: string;
    polymorphicSummary: {
        executive: string;
        strategist: string;
        engineer: string;
    };
    content: string;
    geoHighlights: {
        label: string;
        value: string;
    }[];
}

export const officeBlogPosts: BlogPost[] = [
    agenticShift,
    triModalTranslation,
    integrationGap,
    scalabilityEngineering,
    generativeToAgentic
];
