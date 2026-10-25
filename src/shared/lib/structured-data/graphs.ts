import resume from "../../data/resume.json";
import { LANGUAGE, SITE_URL, abs, ids, pageId } from "./config";
import {
    CASE_STUDIES_PATH, LAB_URL,
    blogNode, blogPostingNode, blogUrl, breadcrumbNode, caseStudyNode, caseStudyUrl,
    cvNode, headshotNode, ogImageNode, personNode, postUrl, projectId, projectNode,
    untapWebNode, webPageNode, websiteNode, type Crumb,
} from "./nodes";
import {
    faqSectionSchema, type CaseStudyInput, type JsonLdGraph, type JsonLdNode, type PostInput, type ProjectInput,
} from "./schema";
import { finalizeGraph } from "./validate";

/*
 * One builder per page type. Every graph carries the Person and WebSite it
 * refers to in full, so each page's @id references resolve without the
 * crawler having to fetch another page.
 */

const ref = (id: string) => ({ "@id": id });
const HOME: Crumb = { name: "Home", url: SITE_URL };
const GUIDE_URL = `${SITE_URL}/guide/operational-architecture`;
const GUIDE: Crumb = { name: "Operational Architecture", url: GUIDE_URL };
const BLOG: Crumb = { name: "Blog", url: blogUrl() };
const CASE_STUDIES: Crumb = { name: "Case Studies", url: `${SITE_URL}${CASE_STUDIES_PATH}` };

function entityNodes(): JsonLdNode[] {
    return [personNode(resume), websiteNode(), headshotNode(), untapWebNode(), cvNode()];
}

function graph(...pageNodes: (JsonLdNode | JsonLdNode[])[]): JsonLdGraph {
    return finalizeGraph([...entityNodes(), ...pageNodes.flat()]);
}

type Page = { name: string; description: string };

/* ------------------------------------------------------------------ home */

export function homeGraph(page: Page, projects: ProjectInput[]): JsonLdGraph {
    const nodes = projects.map(projectNode);
    return graph(
        webPageNode({
            type: "ProfilePage",
            url: SITE_URL,
            ...page,
            breadcrumb: false,
            extra: {
                about: ref(ids.person),
                mainEntity: ref(ids.person),
                primaryImageOfPage: ref(ids.ogImage),
                mentions: nodes.map((node) => ref(node["@id"] as string)),
            },
        }),
        ogImageNode(),
        nodes,
    );
}

/* ---------------------------------------------------------------- about */

export function aboutGraph(page: Page): JsonLdGraph {
    const url = `${SITE_URL}/about`;
    return graph(
        webPageNode({
            type: "AboutPage",
            url,
            ...page,
            extra: { about: ref(ids.person), mainEntity: ref(ids.person), primaryImageOfPage: ref(ids.headshot) },
        }),
        breadcrumbNode(url, [HOME, { name: "About", url }]),
    );
}

/* ------------------------------------------------------------------ FAQ */

type FaqSections = { items: { question: string; answer: string }[] }[];

function questions(sections: FaqSections) {
    return faqSectionSchema.parse(sections).flatMap((section) =>
        section.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    );
}

export function faqGraph(page: Page, sections: FaqSections): JsonLdGraph {
    const url = `${SITE_URL}/faq`;
    return graph(
        webPageNode({
            type: "FAQPage",
            url,
            ...page,
            extra: { about: ref(ids.person), mainEntity: questions(sections) },
        }),
        breadcrumbNode(url, [HOME, { name: "FAQ", url }]),
    );
}

/* ---------------------------------------------------------------- guide */

export function guideGraph(page: Page, faq: { question: string; answer: string }[]): JsonLdGraph {
    return graph(
        webPageNode({
            type: "FAQPage",
            url: GUIDE_URL,
            ...page,
            extra: { mainEntity: questions([{ items: faq }]) },
        }),
        {
            "@type": "Article",
            "@id": pageId(GUIDE_URL, "article"),
            url: GUIDE_URL,
            mainEntityOfPage: ref(pageId(GUIDE_URL, "webpage")),
            headline: page.name,
            description: page.description,
            author: ref(ids.person),
            publisher: ref(ids.person),
            image: [abs("/opengraph-image")],
            inLanguage: LANGUAGE,
        },
        breadcrumbNode(GUIDE_URL, [HOME, GUIDE]),
    );
}

/* ------------------------------------------------------- lab and office */

export function labGraph(page: Page, projects: ProjectInput[]): JsonLdGraph {
    const nodes = projects.map(projectNode);
    return graph(
        webPageNode({
            type: "CollectionPage",
            url: LAB_URL,
            ...page,
            extra: {
                about: ref(ids.person),
                mainEntity: {
                    "@type": "ItemList",
                    name: "Projects in The Lab",
                    numberOfItems: nodes.length,
                    itemListElement: projects.map((project, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        item: ref(projectId(project.slug)),
                    })),
                },
            },
        }),
        breadcrumbNode(LAB_URL, [HOME, { name: "The Lab", url: LAB_URL }]),
        nodes,
    );
}

export function officeGraph(page: Page): JsonLdGraph {
    const url = `${SITE_URL}/guide/office`;
    return graph(
        webPageNode({ type: "WebPage", url, ...page, extra: { about: ref(ids.person) } }),
        breadcrumbNode(url, [HOME, { name: "The Office", url }]),
    );
}

/* ----------------------------------------------------------------- blog */

const articleId = (slug: string) => pageId(postUrl(slug), "article");

export function blogIndexGraph(page: Page, posts: PostInput[]): JsonLdGraph {
    return graph(
        webPageNode({
            type: "CollectionPage",
            url: blogUrl(),
            ...page,
            extra: { mainEntity: ref(ids.blog) },
        }),
        breadcrumbNode(blogUrl(), [HOME, GUIDE, BLOG]),
        blogNode(posts.map((post) => articleId(post.slug))),
        posts.map((post) => blogPostingNode(post, { onOwnPage: false })),
    );
}

export function blogPostGraph(post: PostInput): JsonLdGraph {
    const url = postUrl(post.slug);
    return graph(
        webPageNode({
            type: "WebPage",
            url,
            name: post.seoTitle ?? post.title,
            description: post.summary,
            extra: { mainEntity: ref(articleId(post.slug)) },
        }),
        breadcrumbNode(url, [HOME, GUIDE, BLOG, { name: post.seoTitle ?? post.title, url }]),
        blogNode(),
        blogPostingNode(post),
    );
}

/* --------------------------------------------------------- case studies */

export function caseStudyIndexGraph(page: Page, studies: CaseStudyInput[]): JsonLdGraph {
    const url = CASE_STUDIES.url;
    return graph(
        webPageNode({
            type: "CollectionPage",
            url,
            ...page,
            extra: {
                mainEntity: {
                    "@type": "ItemList",
                    numberOfItems: studies.length,
                    itemListElement: studies.map((study, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        item: ref(pageId(caseStudyUrl(study.slug), "article")),
                    })),
                },
            },
        }),
        breadcrumbNode(url, [HOME, GUIDE, CASE_STUDIES]),
        // The index lists the studies; each study's body and page node are on its own page.
        studies.map((study) => caseStudyNode(study, { onOwnPage: false })),
    );
}

export function caseStudyGraph(study: CaseStudyInput): JsonLdGraph {
    const url = caseStudyUrl(study.slug);
    return graph(
        webPageNode({
            type: "WebPage",
            url,
            name: study.seoTitle ?? study.title,
            description: study.summary.executive,
            extra: { mainEntity: ref(pageId(url, "article")) },
        }),
        breadcrumbNode(url, [HOME, GUIDE, CASE_STUDIES, { name: study.seoTitle ?? study.title, url }]),
        caseStudyNode(study),
    );
}
