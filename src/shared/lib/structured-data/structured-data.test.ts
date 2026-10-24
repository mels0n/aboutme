import { describe, expect, it } from "vitest";
import { faqContent } from "@/shared/data/faq_content";
import { officeCaseStudies } from "@/shared/data/office_case_studies";
import { officeBlogPosts } from "@/shared/data/published_blog_posts";
import { projectInputs, plainDescription } from "@/entities/project/model/structured-data";
import {
    aboutGraph, blogIndexGraph, blogPostGraph, caseStudyGraph, caseStudyIndexGraph,
    faqGraph, guideGraph, homeGraph, labGraph, officeGraph, serializeGraph,
    type JsonLdGraph,
} from "./index";
import { ids } from "./config";
import { blogPostingNode, wordCount } from "./nodes";
import type { PostInput } from "./schema";
import { finalizeGraph, graphProblems } from "./validate";

const page = { name: "A page", description: "A description" };
const node = (graph: JsonLdGraph, type: string) =>
    graph["@graph"].find((n) => n["@type"] === type || (Array.isArray(n["@type"]) && n["@type"].includes(type)));
const byId = (graph: JsonLdGraph, id: string) => graph["@graph"].find((n) => n["@id"] === id);

const post: PostInput = {
    slug: "sample-post",
    title: "A sample post",
    summary: "What the post is about.",
    date: "2026-05-20",
    content: "Plain words here.\n\n<svg><text>ignored words in a chart</text></svg>\n\nSee [the docs](https://example.com/a/long/path) now.",
};

const allGraphs = (): [string, JsonLdGraph][] => [
    ["home", homeGraph(page, projectInputs.filter((p) => p.website))],
    ["about", aboutGraph(page)],
    ["faq", faqGraph(page, faqContent)],
    ["guide", guideGraph(page, [{ question: "Q?", answer: "A." }])],
    ["lab", labGraph(page, projectInputs)],
    ["office", officeGraph(page)],
    ["blog index", blogIndexGraph(page, officeBlogPosts)],
    ["case study index", caseStudyIndexGraph(page, officeCaseStudies)],
    ...officeBlogPosts.map((p): [string, JsonLdGraph] => [`post ${p.slug}`, blogPostGraph(p)]),
    ...officeCaseStudies.map((s): [string, JsonLdGraph] => [`case study ${s.slug}`, caseStudyGraph(s)]),
];

describe("every page graph", () => {
    it.each(allGraphs())("%s is sound and carries the Person and WebSite it refers to", (_name, graph) => {
        expect(graphProblems(graph)).toEqual([]);
        expect(byId(graph, ids.person)).toBeDefined();
        expect(byId(graph, ids.website)).toBeDefined();
        expect(graph["@graph"].filter((n) => n["@type"] === "Person")).toHaveLength(1);
    });

    it("never states an email address or phone number", () => {
        const text = allGraphs().map(([, g]) => serializeGraph(g)).join("\n");
        expect(text).not.toMatch(/mailto:|@[a-z0-9-]+\.[a-z]{2,}/i);
        expect(text).not.toMatch(/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/);
    });
});

describe("Person entity", () => {
    const graph = homeGraph(page, []);
    const person = byId(graph, ids.person)!;

    it("is the canonical, stable-id entity the Fair Maps site points at", () => {
        expect(ids.person).toBe("https://chris.melson.us/#person");
        expect(person).toMatchObject({
            name: "Chris Melson",
            jobTitle: "Transformation Executive & Operational Architect",
            description: "Operational Architect for the Agentic Age",
            url: "https://chris.melson.us",
        });
        expect(person.alternateName).toContain("Christopher Melson");
        expect(person.sameAs).toEqual([
            "https://www.linkedin.com/in/chris-melson/",
            "https://github.com/mels0n",
        ]);
    });

    it("states location at city level only", () => {
        expect(JSON.stringify(person.homeLocation)).toContain("Saint Louis");
        expect(JSON.stringify(person.homeLocation)).not.toMatch(/streetAddress|postalCode/);
    });

    it("lists the Skills & Expertise keywords, both institutions and every degree", () => {
        expect(person.knowsAbout).toContain("Post-Merger Integration (PMI)");
        expect((person.knowsAbout as string[]).length).toBe(13);
        const alumni = (person.alumniOf as { name: string }[]).map((a) => a.name);
        expect(alumni).toEqual(["Webster University", "Ranken Technical College"]);
        const degrees = (person.hasCredential as { name: string }[]).map((c) => c.name);
        expect(degrees).toContain("Master of Business Administration (MBA)");
        expect(degrees).toContain("Bachelor of Science (BS), Computer Science");
    });

    it("dates roles year-month and leaves out the undated 'Previous Roles' row", () => {
        const roles = (person.worksFor as Record<string, unknown>[]).filter((w) => w["@type"] === "EmployeeRole");
        expect(roles).toHaveLength(4);
        expect(roles[0]).toMatchObject({
            roleName: "Head of FX Operations Programs and Strategy",
            startDate: "2023-10",
            endDate: "2025-11",
        });
        expect(person.worksFor).toContainEqual({ "@id": ids.untapWeb });
    });

    it("links the CV PDF", () => {
        expect(byId(graph, ids.cv)).toMatchObject({ url: "https://chris.melson.us/christopher-melson-cv.pdf" });
    });

    it("keeps authored copy free of em dashes", () => {
        const authored = [person, byId(graph, ids.website), byId(graph, ids.cv)];
        expect(JSON.stringify(authored)).not.toContain("—");
    });
});

describe("home page", () => {
    const graph = homeGraph(page, projectInputs.filter((p) => p.website));
    const profile = node(graph, "ProfilePage")!;

    it("is the ProfilePage whose main entity is the Person", () => {
        expect(profile.mainEntity).toEqual({ "@id": ids.person });
        expect(profile.isPartOf).toEqual({ "@id": ids.website });
    });

    it("WebSite is published and authored by the Person", () => {
        expect(byId(graph, ids.website)).toMatchObject({
            "@type": "WebSite",
            inLanguage: "en-US",
            publisher: { "@id": ids.person },
            author: { "@id": ids.person },
        });
    });

    it("credits Fair Maps to the Person", () => {
        const fairMaps = graph["@graph"].find((n) => n.name === "Fair Maps")!;
        expect(fairMaps).toMatchObject({
            url: "https://fairmaps.melson.us",
            codeRepository: "https://github.com/mels0n/str-redistricting",
            creator: { "@id": ids.person },
        });
        expect(profile.mentions).toContainEqual({ "@id": fairMaps["@id"] });
    });
});

describe("blog", () => {
    it("types a post as BlogPosting inside a Blog, with the Person as author and publisher", () => {
        const graph = blogPostGraph(post);
        const article = node(graph, "BlogPosting")!;
        expect(article).toMatchObject({
            "@id": "https://chris.melson.us/guide/operational-architecture/blog/sample-post#article",
            headline: "A sample post",
            datePublished: "2026-05-20",
            dateModified: "2026-05-20",
            author: { "@id": ids.person },
            publisher: { "@id": ids.person },
            isPartOf: { "@id": ids.blog },
            mainEntityOfPage: { "@id": "https://chris.melson.us/guide/operational-architecture/blog/sample-post#webpage" },
        });
        expect(article.articleBody).toBeUndefined();
        expect(node(graph, "Blog")).toBeDefined();
    });

    it("uses lastUpdated for dateModified and an absolute image", () => {
        const article = blogPostingNode({ ...post, lastUpdated: "2026-06-01", ogImage: "/images/blog/x.jpg" });
        expect(article.dateModified).toBe("2026-06-01");
        expect(article.image).toEqual(["https://chris.melson.us/images/blog/x.jpg"]);
        expect(blogPostingNode(post).image).toEqual([
            "https://chris.melson.us/api/og?title=A%20sample%20post&date=2026-05-20",
        ]);
    });

    it("emits keywords only when the post has them", () => {
        expect(blogPostingNode(post).keywords).toBeUndefined();
        expect(blogPostingNode({ ...post, keywords: ["a", "b"] }).keywords).toBe("a, b");
    });

    it("counts words of the readable text, not markup or link targets", () => {
        expect(wordCount(post.content)).toBe(7);
    });

    it("the index lists every post by reference and defines each one", () => {
        const graph = blogIndexGraph(page, officeBlogPosts);
        const blog = byId(graph, ids.blog)!;
        expect(blog.blogPost).toHaveLength(officeBlogPosts.length);
        expect(graph["@graph"].filter((n) => n["@type"] === "BlogPosting")).toHaveLength(officeBlogPosts.length);
    });

    it("rejects a title too long for a search result unless a seoTitle is set", () => {
        const long = "A".repeat(61);
        expect(() => blogPostingNode({ ...post, title: long })).toThrow(/seoTitle/);
        const node = blogPostingNode({ ...post, title: long, seoTitle: "Short title" });
        expect(node).toMatchObject({ headline: long, alternativeHeadline: "Short title" });
        expect(() => blogPostingNode({ ...post, title: long, seoTitle: "B".repeat(61) })).toThrow(/seoTitle/);
    });

    it("every published post and case study has a search title of 60 characters or fewer", () => {
        for (const item of [...officeBlogPosts, ...officeCaseStudies]) {
            expect((item.seoTitle ?? item.title).length, item.slug).toBeLessThanOrEqual(60);
        }
    });

    it("rejects a post with a malformed date at build time", () => {
        expect(() => blogPostingNode({ ...post, date: "May 20" })).toThrow();
    });
});

describe("breadcrumbs", () => {
    it("run Home, section, page with absolute URLs", () => {
        const crumbs = node(blogPostGraph(post), "BreadcrumbList")!.itemListElement as { position: number; name: string; item: string }[];
        expect(crumbs.map((c) => c.name)).toEqual(["Home", "Operational Architecture", "Blog", "A sample post"]);
        expect(crumbs.map((c) => c.position)).toEqual([1, 2, 3, 4]);
        for (const crumb of crumbs) expect(crumb.item).toMatch(/^https:\/\/chris\.melson\.us/);
    });
});

describe("page types", () => {
    it("types /about as AboutPage about the Person", () => {
        expect(node(aboutGraph(page), "AboutPage")).toMatchObject({ mainEntity: { "@id": ids.person } });
    });

    it("marks the guide as an Article and an FAQPage", () => {
        const graph = guideGraph(page, [{ question: "Q?", answer: "A." }]);
        expect(node(graph, "Article")).toBeDefined();
        expect(node(graph, "FAQPage")).toBeDefined();
    });

    it("types case studies as Article", () => {
        const graph = caseStudyGraph(officeCaseStudies[0]);
        expect(node(graph, "Article")).toMatchObject({ author: { "@id": ids.person } });
    });
});

describe("projects", () => {
    it("drops card sentences that hold live-value placeholders", () => {
        expect(plainDescription("Adjusts {{Color Temp}} by sun. These are live values. Plain sentence.")).toBe(
            "These are live values. Plain sentence.",
        );
        for (const project of projectInputs) expect(project.description).not.toContain("{{");
    });
});

describe("graph validation", () => {
    const base = { "@type": "Thing", "@id": "https://chris.melson.us/#a" };

    it("flags a reference that is not defined in the graph", () => {
        expect(() => finalizeGraph([{ ...base, about: { "@id": "https://chris.melson.us/#missing" } }])).toThrow(/not defined/);
    });

    it("flags a relative or non-https URL", () => {
        expect(() => finalizeGraph([{ ...base, url: "/about" }])).toThrow(/absolute/);
        expect(() => finalizeGraph([{ ...base, sameAs: ["http://example.com"] }])).toThrow(/absolute/);
    });

    it("flags duplicate ids and personal contact data", () => {
        expect(() => finalizeGraph([base, base])).toThrow(/duplicate/);
        expect(() => finalizeGraph([{ ...base, description: "write me at someone@example.com" }])).toThrow(/email/);
    });
});

describe("serialization", () => {
    it("escapes markup so data can never close the script tag", () => {
        const graph = finalizeGraph([{ "@type": "Thing", name: "</script><script>alert(1)</script>" }]);
        const text = serializeGraph(graph);
        expect(text).not.toContain("<");
        expect(JSON.parse(text)["@graph"][0].name).toBe("</script><script>alert(1)</script>");
    });
});
