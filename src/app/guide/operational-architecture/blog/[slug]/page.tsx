import { Metadata } from "next";
import { notFound } from "next/navigation";
import { officeBlogPosts } from "@/shared/data/office_blog_posts";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { BreadcrumbSchema } from "@/shared/ui/BreadcrumbSchema";

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
        <main className="max-w-3xl mx-auto px-6 py-10 md:py-20 font-serif text-foreground">
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

            <header className="mb-6 md:mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm font-mono tracking-widest opacity-60">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.role}</span>
                    <span>•</span>
                    <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </time>
                </div>
            </header>

            <article className={[
                "prose prose-lg prose-slate max-w-none text-foreground/80 leading-relaxed",
                // Tables
                "prose-table:border-collapse prose-table:w-full prose-table:text-sm prose-table:my-8",
                "prose-th:border prose-th:border-border prose-th:bg-surface/50 prose-th:p-3 prose-th:text-left prose-th:font-mono prose-th:text-xs prose-th:uppercase prose-th:tracking-wider",
                "prose-td:border prose-td:border-border prose-td:p-3 prose-td:align-top",
                // Headings
                "prose-headings:font-display prose-headings:font-bold",
                "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
                // Accent — /guide routes always render the default (executive)
                // theme, so this mirrors OfficeBlogModal's executive variant.
                "prose-headings:text-blue-800 prose-a:text-blue-700 prose-strong:text-blue-900",
            ].join(" ")}>
                {/* GEO Optimization: Structured Data Block */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-12 p-4 md:p-6 bg-slate-50 rounded-lg border border-slate-200 not-prose">
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

            <div className="mt-10 pt-10 md:mt-16 md:pt-16 border-t border-border">
                <p className="text-sm text-center opacity-50 font-mono">
                    Original content published on chris.melson.us
                </p>
            </div>
        </main>
    );
}
