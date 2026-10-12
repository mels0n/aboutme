import { Metadata } from "next";
import { notFound } from "next/navigation";
import { officeBlogPosts } from "@/shared/data/published_blog_posts";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BreadcrumbSchema } from "@/shared/ui/BreadcrumbSchema";

// Slugs not prerendered at build 404 instead of rendering on demand.
export const dynamicParams = false;

function headingSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function nodeText(children: ReactNode): string {
    if (typeof children === "string" || typeof children === "number") return String(children);
    if (Array.isArray(children)) return children.map(nodeText).join("");
    if (children && typeof children === "object" && "props" in children) {
        return nodeText((children as { props: { children?: ReactNode } }).props.children);
    }
    return "";
}

// Posts use either ## or ### as their top section level. The table of
// contents follows whichever is the shallowest level with 2+ headings.
function tableOfContents(markdown: string): { id: string; text: string }[] {
    for (const level of [2, 3]) {
        const pattern = new RegExp(`^${"#".repeat(level)} (.+)$`, "gm");
        const items = [...markdown.matchAll(pattern)].map((m) => {
            const text = m[1]
                .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
                .replace(/[*_`]/g, "")
                .trim();
            return { id: headingSlug(text), text };
        });
        if (items.length >= 2) return items;
    }
    return [];
}

export async function generateStaticParams() {
    return officeBlogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = officeBlogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: "Article Not Found",
        };
    }

    const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&date=${post.date}`;

    return {
        title: post.title,
        description: post.summary,
        alternates: {
            canonical: `/guide/operational-architecture/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.summary,
            url: `/guide/operational-architecture/blog/${post.slug}`,
            type: "article",
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.summary,
            images: [ogImageUrl],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = officeBlogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Works Cited is pulled out of the prose flow and rendered as a citation
    // footer, matching OfficeBlogModal.
    let bodyContent = post.content;
    let worksCitedHeader: string | null = null;
    let worksCitedContent: string | null = null;

    const worksCitedMatch = post.content.match(/### Works Cited.*/);
    if (worksCitedMatch?.index !== undefined) {
        bodyContent = post.content.slice(0, worksCitedMatch.index);
        worksCitedHeader = worksCitedMatch[0].replace('### ', '');
        worksCitedContent = post.content.slice(worksCitedMatch.index + worksCitedMatch[0].length);
    }

    const toc = tableOfContents(bodyContent);
    const readMinutes = Math.ceil(post.content.split(/\s+/).length / 225);
    const publishedLabel = new Date(`${post.date}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const postUrl = `https://chris.melson.us/guide/operational-architecture/blog/${post.slug}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": postUrl,
        "url": postUrl,
        "mainEntityOfPage": { "@type": "WebPage", "@id": postUrl },
        "headline": post.title,
        "description": post.summary,
        "author": { "@id": "https://chris.melson.us/#person" },
        "publisher": { "@id": "https://chris.melson.us/#person" },
        "datePublished": post.date,
        "dateModified": post.lastUpdated ?? post.date,
        "image": [post.ogImage ?? "https://chris.melson.us/opengraph-image"],
        "wordCount": post.content.split(/\s+/).length,
        "articleBody": post.content,
    };

    return (
        <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10 md:py-16 font-serif text-foreground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "https://chris.melson.us" },
                { name: "Operational Architecture", url: "https://chris.melson.us/guide/operational-architecture" },
                { name: "Blog", url: "https://chris.melson.us/guide/operational-architecture/blog" },
                { name: post.title, url: postUrl },
            ]} />

            <Link
                href="/guide/operational-architecture/blog"
                className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors mb-8 md:mb-12"
            >
                <ArrowLeft className="w-4 h-4" />
                All articles
            </Link>

            <header className="mb-8 md:mb-12 max-w-4xl">
                <div className="text-xs font-sans uppercase tracking-widest text-foreground/50 mb-4">
                    <time dateTime={post.date}>{publishedLabel}</time>
                    <span aria-hidden="true"> · </span>
                    {readMinutes} min read
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                    {post.title}
                </h1>
                <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                    {post.summary}
                </p>
                <div className="mt-6 text-sm font-sans text-foreground/60">
                    <span className="font-bold text-foreground/80">{post.author}</span>
                    <span aria-hidden="true"> · </span>
                    {post.role}
                </div>
            </header>

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 xl:gap-20 border-t border-border pt-8 md:pt-12">
            <article className={[
                "prose prose-lg prose-slate max-w-3xl text-foreground/80 leading-relaxed",
                // Tables
                "prose-table:border-collapse prose-table:w-full prose-table:text-sm prose-table:my-8",
                "prose-th:border prose-th:border-border prose-th:bg-surface/50 prose-th:p-3 prose-th:text-left prose-th:font-mono prose-th:text-xs prose-th:uppercase prose-th:tracking-wider",
                "prose-td:border prose-td:border-border prose-td:p-3 prose-td:align-top",
                // Headings
                "prose-headings:font-display prose-headings:font-bold prose-headings:scroll-mt-8",
                "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
                // Accent — /guide routes always render the default (executive)
                // theme, so this mirrors OfficeBlogModal's executive variant.
                "prose-headings:text-blue-800 prose-a:text-blue-700 prose-strong:text-blue-900",
            ].join(" ")}>
                {/* GEO Optimization: Structured Data Block. On wide screens
                    it moves into the sidebar. */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-12 p-4 md:p-6 bg-slate-50 rounded-lg border border-slate-200 not-prose lg:hidden">
                    {post.geoHighlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="flex flex-col">
                            <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                {highlight.label}
                            </dt>
                            <dd className="font-bold text-slate-900 leading-tight">
                                {highlight.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="react-markdown">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            // Wide tables scroll instead of overflowing the column
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto w-full my-8">
                                    <table className="w-full text-sm" {...props} />
                                </div>
                            ),
                            // Off-site links open in a new tab; internal links
                            // stay in place so crawlers follow them normally.
                            a: ({ node, href, ...props }) => {
                                const isExternal = !!href
                                    && /^https?:\/\//.test(href)
                                    && !href.startsWith("https://chris.melson.us");

                                return isExternal
                                    ? <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
                                    : <a href={href} {...props} />;
                            },
                            h2: ({ node, children, ...props }) => (
                                <h2 id={headingSlug(nodeText(children))} {...props}>{children}</h2>
                            ),
                            h3: ({ node, children, ...props }) => (
                                <h3 id={headingSlug(nodeText(children))} {...props}>{children}</h3>
                            ),
                            blockquote: ({ node, ...props }) => (
                                <blockquote
                                    className="border-l-4 border-blue-500/50 pl-4 italic bg-surface/30 p-4 rounded-r-lg my-6"
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {bodyContent}
                    </ReactMarkdown>
                </div>

                {worksCitedContent && (
                    <div className="mt-12 pt-8 border-t border-border not-prose">
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 font-mono">
                            {worksCitedHeader}
                        </h3>
                        <div className="text-xs opacity-60 space-y-2 font-mono">
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline hover:opacity-100 transition-opacity text-foreground hover:text-foreground/80"
                                            {...props}
                                        />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul className="list-none space-y-2 pl-0" {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li className="pl-0" {...props} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <div className="inline" {...props} />
                                    ),
                                }}
                            >
                                {worksCitedContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

            </article>

            <aside className="hidden lg:block">
                <div className="sticky top-8 space-y-8 font-sans">
                    <dl className="space-y-4 p-5 bg-slate-50 rounded-lg border border-slate-200">
                        {post.geoHighlights.map((highlight, hIdx) => (
                            <div key={hIdx}>
                                <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                                    {highlight.label}
                                </dt>
                                <dd className="font-serif font-bold text-slate-900 leading-snug">
                                    {highlight.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {toc.length > 0 && (
                        <nav aria-label="On this page" className="max-h-[calc(100vh-24rem)] overflow-y-auto">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                On this page
                            </h2>
                            <ol className="space-y-2 border-l border-border">
                                {toc.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            className="block -ml-px border-l-2 border-transparent pl-4 text-sm leading-snug text-foreground/60 hover:text-blue-700 hover:border-blue-700 transition-colors"
                                        >
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}
                </div>
            </aside>
            </div>

            <div className="mt-10 pt-10 md:mt-16 md:pt-16 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                    href="/guide/operational-architecture/blog"
                    className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    All articles
                </Link>
                <p className="text-sm opacity-50 font-mono">
                    Original content published on chris.melson.us
                </p>
            </div>
        </main>
    );
}
