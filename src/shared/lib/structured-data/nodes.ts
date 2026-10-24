import { siteConfig } from "../../config/site-config";
import { LANGUAGE, SITE_URL, abs, ids, pageId } from "./config";
import {
    caseStudySchema, postSchema, projectSchema, resumeSchema,
    type CaseStudyInput, type JsonLdNode, type PostInput, type ProjectInput,
} from "./schema";

type Node = JsonLdNode;
const ref = (id: string) => ({ "@id": id });

/* ---------------------------------------------------------------- resume */

const MONTHS: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

/** "Oct 2023" -> "2023-10". Returns undefined for "Present" or anything unparseable. */
function monthYear(text: string | undefined): string | undefined {
    const match = text?.trim().match(/^([A-Z][a-z]{2}) (\d{4})$/);
    return match && MONTHS[match[1]] ? `${match[2]}-${MONTHS[match[1]]}` : undefined;
}

function roles(experience: { visible: boolean; company?: string; position?: string; date?: string }[]) {
    return experience
        // The trailing "Previous Roles" entry has no dates and is a list, not a role.
        .filter((item) => item.visible && item.company && item.position && item.date)
        .flatMap((item) => {
            const [start, end] = (item.date ?? "").split(" - ");
            const startDate = monthYear(start);
            if (!startDate) return [];
            const endDate = monthYear(end);
            return [{
                "@type": "EmployeeRole",
                roleName: item.position,
                startDate,
                ...(endDate ? { endDate } : {}),
                worksFor: { "@type": "Organization", name: item.company },
            }];
        });
}

/** Resume education rows hold the degree in `area` when a major is in `studyType`, and only in `studyType` otherwise. */
function degreeName(item: { studyType?: string; area?: string }): string {
    return [item.area, item.studyType].filter(Boolean).join(", ");
}

/* ---------------------------------------------------------------- entities */

export function headshotNode(): Node {
    return {
        "@type": "ImageObject",
        "@id": ids.headshot,
        url: abs(siteConfig.person.headshot),
        contentUrl: abs(siteConfig.person.headshot),
        width: 400,
        height: 400,
        caption: siteConfig.person.name,
    };
}

export function ogImageNode(): Node {
    return {
        "@type": "ImageObject",
        "@id": ids.ogImage,
        url: abs("/opengraph-image"),
        contentUrl: abs("/opengraph-image"),
        width: 1200,
        height: 630,
        caption: `${siteConfig.person.name} - ${siteConfig.person.description}`,
    };
}

export function untapWebNode(): Node {
    return {
        "@type": "Organization",
        "@id": ids.untapWeb,
        name: "Untap Web",
        url: siteConfig.links.untapWeb,
    };
}

export function cvNode(): Node {
    return {
        "@type": "DigitalDocument",
        "@id": ids.cv,
        name: `Curriculum vitae of ${siteConfig.person.name}`,
        url: abs(siteConfig.links.cvPdf),
        encodingFormat: "application/pdf",
        inLanguage: LANGUAGE,
        author: ref(ids.person),
    };
}

/** The canonical Person entity. Other sites reference it through their own sameAs back to this origin. */
export function personNode(resumeInput: unknown): Node {
    const resume = resumeSchema.parse(resumeInput);
    const { person, links } = siteConfig;
    const education = resume.sections.education.items.filter((item) => item.visible && item.institution);
    const institutions = [...new Set(education.map((item) => item.institution as string))];
    const skills = resume.sections.skills.items.flatMap((item) => (item.visible ? item.keywords ?? [] : []));

    return {
        "@type": "Person",
        "@id": ids.person,
        name: person.name,
        alternateName: person.alternateNames,
        givenName: person.givenName,
        familyName: person.familyName,
        url: SITE_URL,
        image: ref(ids.headshot),
        description: person.description,
        disambiguatingDescription: person.disambiguatingDescription,
        jobTitle: person.jobTitle,
        homeLocation: {
            "@type": "Place",
            name: `${person.location.city}, ${person.location.region}`,
            address: {
                "@type": "PostalAddress",
                addressLocality: person.location.city,
                addressRegion: person.location.region,
                addressCountry: person.location.country,
            },
        },
        sameAs: [links.linkedin, links.github],
        knowsAbout: skills,
        alumniOf: institutions.map((name) => ({ "@type": "CollegeOrUniversity", name })),
        hasCredential: education.map((item) => ({
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: degreeName(item),
            recognizedBy: { "@type": "CollegeOrUniversity", name: item.institution },
        })),
        worksFor: [ref(ids.untapWeb), ...roles(resume.sections.experience.items)],
        subjectOf: ref(ids.cv),
    };
}

export function websiteNode(): Node {
    return {
        "@type": "WebSite",
        "@id": ids.website,
        url: SITE_URL,
        name: siteConfig.name,
        alternateName: "chris.melson.us",
        description: siteConfig.description,
        inLanguage: LANGUAGE,
        publisher: ref(ids.person),
        author: ref(ids.person),
    };
}

/* ------------------------------------------------------------------ pages */

export type Crumb = { name: string; url: string };

export function breadcrumbNode(pageUrl: string, trail: Crumb[]): Node {
    return {
        "@type": "BreadcrumbList",
        "@id": pageId(pageUrl, "breadcrumb"),
        itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };
}

export type PageOptions = {
    type: string | string[];
    url: string;
    name: string;
    description?: string;
    breadcrumb?: boolean;
    extra?: Record<string, unknown>;
};

export function webPageNode({ type, url, name, description, breadcrumb = true, extra = {} }: PageOptions): Node {
    return {
        "@type": type,
        "@id": pageId(url, "webpage"),
        url,
        name,
        ...(description ? { description } : {}),
        isPartOf: ref(ids.website),
        inLanguage: LANGUAGE,
        ...(breadcrumb ? { breadcrumb: ref(pageId(url, "breadcrumb")) } : {}),
        ...extra,
    };
}

/* -------------------------------------------------------------- articles */

/** Word count of the readable text: markup, inline SVG and link targets do not count. */
export function wordCount(markdown: string): number {
    const text = markdown
        .replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\]\([^)]*\)/g, "] ")
        .replace(/`{3}[\s\S]*?`{3}/g, " ");
    return text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

export const BLOG_PATH = "/guide/operational-architecture/blog";
export const blogUrl = () => `${SITE_URL}${BLOG_PATH}`;
export const postUrl = (slug: string) => `${blogUrl()}/${slug}`;

export function blogNode(postIds: string[] = []): Node {
    return {
        "@type": "Blog",
        "@id": ids.blog,
        name: "Operational Architecture Blog",
        url: blogUrl(),
        description: "Insights, articles, and analysis on operational architecture, engineering management, and organizational scaling.",
        inLanguage: LANGUAGE,
        isPartOf: ref(ids.website),
        author: ref(ids.person),
        publisher: ref(ids.person),
        ...(postIds.length > 0 ? { blogPost: postIds.map(ref) } : {}),
    };
}

/** The post's own hero when it sets one, else the social card the page already advertises. */
function postImage(post: PostInput): string {
    return post.ogImage
        ? abs(post.ogImage)
        : abs(`/api/og?title=${encodeURIComponent(post.title)}&date=${post.date}`);
}

/** `onOwnPage: false` is for listings, where the post's own WebPage node is not part of the graph. */
export function blogPostingNode(input: PostInput, { onOwnPage = true } = {}): Node {
    const post = postSchema.parse(input);
    const url = postUrl(post.slug);
    return {
        "@type": "BlogPosting",
        "@id": pageId(url, "article"),
        url,
        ...(onOwnPage ? { mainEntityOfPage: ref(pageId(url, "webpage")) } : {}),
        isPartOf: ref(ids.blog),
        headline: post.title,
        ...(post.seoTitle ? { alternativeHeadline: post.seoTitle } : {}),
        description: post.summary,
        author: ref(ids.person),
        publisher: ref(ids.person),
        datePublished: post.date,
        dateModified: post.lastUpdated ?? post.date,
        image: [postImage(post)],
        wordCount: wordCount(post.content),
        inLanguage: LANGUAGE,
        isAccessibleForFree: true,
        ...(post.keywords?.length ? { keywords: post.keywords.join(", ") } : {}),
    };
}

export const CASE_STUDIES_PATH = "/guide/operational-architecture/case-studies";
export const caseStudyUrl = (slug: string) => `${SITE_URL}${CASE_STUDIES_PATH}/${slug}`;

export function caseStudyNode(input: CaseStudyInput, { onOwnPage = true } = {}): Node {
    const study = caseStudySchema.parse(input);
    const url = caseStudyUrl(study.slug);
    const { situation, task, action, result } = study.fullReport;
    return {
        "@type": "Article",
        "@id": pageId(url, "article"),
        url,
        ...(onOwnPage ? { mainEntityOfPage: ref(pageId(url, "webpage")) } : {}),
        headline: study.title,
        ...(study.seoTitle ? { alternativeHeadline: study.seoTitle } : {}),
        description: study.summary.executive,
        author: ref(ids.person),
        publisher: ref(ids.person),
        datePublished: study.date,
        dateModified: study.date,
        image: [abs("/opengraph-image")],
        inLanguage: LANGUAGE,
        ...(onOwnPage ? { articleBody: `Situation: ${situation}\nTask: ${task}\nAction: ${action}\nResult: ${result}` } : {}),
    };
}

/* -------------------------------------------------------------- projects */

export const LAB_URL = `${SITE_URL}/guide/lab`;
export const projectId = (slug: string) => pageId(LAB_URL, `project-${slug}`);

export function projectNode(input: ProjectInput): Node {
    const project = projectSchema.parse(input);
    return {
        "@type": "SoftwareSourceCode",
        "@id": projectId(project.slug),
        name: project.name,
        description: project.description,
        codeRepository: project.repository,
        ...(project.website ? { url: project.website } : {}),
        image: abs(project.image),
        keywords: project.keywords.join(", "),
        creator: ref(ids.person),
        inLanguage: LANGUAGE,
    };
}
