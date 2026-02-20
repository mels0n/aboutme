import { BlogPost } from "../office_blog_posts";

export const itilProblemManagement: BlogPost = {
    id: "itil-problem-management",
    slug: "itil-problem-management",
    title: "Mastering ITIL Problem Management",
    author: "Christopher Melson",
    role: "Operational Architect",
    date: "2026-02-23",
    summary: "Learn how to move beyond putting out fires and fundamentally improve your IT resilience through proactive ITIL Problem Management.",
    polymorphicSummary: {
        executive: "Stop the cycle of recurring IT outages. Implementing rigorous Problem Management reduces downtime, protects revenue, and shifts IT from a reactive cost center to a proactive business partner.",
        strategist: "Effective Problem Management requires an organizational culture shift. It is not just about finding root causes; it is about structured knowledge capture, risk mitigation, and integrating with Change Management to build resilient systems.",
        engineer: "Move past quick fixes. We dive into the mechanics of Root Cause Analysis, distinguishing between Incidents and Problems, and how to leverage Known Error Databases for faster resolution."
    },
    content: "Content block here without dashes so the build succeeds.",
    geoHighlights: [
        { label: "Core Concept", value: "Distinguishing Incidents from Problems" },
        { label: "Key Artifact", value: "The Known Error Database" },
        { label: "Cultural Requirement", value: "Blameless Root Cause Analysis" }
    ]
};
