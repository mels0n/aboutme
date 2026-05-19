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
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.summary,
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = officeBlogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
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
        "image": ["https://chris.melson.us/opengraph-image"],
        "wordCount": post.content.split(/\s+/).length,
        "articleBody": post.content,
    };

    return (
        <main className="max-w-3xl mx-auto px-6 py-20 font-serif text-foreground">
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

            <header className="mb-12 text-center">
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

            <article className="prose prose-lg prose-slate max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">
                {/* GEO Optimization: Structured Data Block */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 p-6 bg-slate-50 rounded-lg border border-slate-200 not-prose">
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
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

            </article>

            <div className="mt-16 pt-16 border-t border-border">
                <p className="text-sm text-center opacity-50 font-mono">
                    Original content published on chris.melson.us
                </p>
            </div>
        </main>
    );
}
