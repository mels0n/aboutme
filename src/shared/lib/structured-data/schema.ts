import { z } from "zod";

/*
 * Boundary schemas. Data enters the structured-data module from the resume
 * export, the blog registry and the project cards; each is parsed here so a
 * malformed entry fails the build instead of shipping bad markup.
 */

const resumeItem = z.object({
    visible: z.boolean(),
    company: z.string().optional(),
    position: z.string().optional(),
    institution: z.string().optional(),
    studyType: z.string().optional(),
    area: z.string().optional(),
    date: z.string().optional(),
    keywords: z.array(z.string()).optional(),
});

export const resumeSchema = z.object({
    sections: z.object({
        experience: z.object({ items: z.array(resumeItem) }),
        education: z.object({ items: z.array(resumeItem) }),
        skills: z.object({ items: z.array(resumeItem) }),
    }),
});
export type ResumeInput = z.infer<typeof resumeSchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

export const postSchema = z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    date: isoDate,
    lastUpdated: isoDate.optional(),
    ogImage: z.string().optional(),
    keywords: z.array(z.string().min(1)).optional(),
    content: z.string(),
});
export type PostInput = z.infer<typeof postSchema>;

export const caseStudySchema = z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    date: isoDate,
    summary: z.object({ executive: z.string(), strategist: z.string() }),
    fullReport: z.object({
        situation: z.string(),
        task: z.string(),
        action: z.string(),
        result: z.string(),
    }),
});
export type CaseStudyInput = z.infer<typeof caseStudySchema>;

export const projectSchema = z.object({
    slug: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    repository: z.string().url(),
    website: z.string().url().optional(),
    image: z.string().min(1),
    keywords: z.array(z.string()),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const faqSectionSchema = z.array(
    z.object({ items: z.array(z.object({ question: z.string(), answer: z.string() })) }),
);

/** One JSON-LD node: an object with a @type and, when it is addressable, an @id. */
export const nodeSchema = z.looseObject({
    "@id": z.string().url().optional(),
    "@type": z.union([z.string(), z.array(z.string())]),
});
export type JsonLdNode = z.infer<typeof nodeSchema>;

export const graphSchema = z.object({
    "@context": z.literal("https://schema.org"),
    "@graph": z.array(nodeSchema).min(1),
});
export type JsonLdGraph = z.infer<typeof graphSchema>;
