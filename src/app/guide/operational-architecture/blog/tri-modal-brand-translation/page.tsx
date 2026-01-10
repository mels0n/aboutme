import { Metadata } from "next";
import { officeBlogPosts } from "@/shared/data/office_blog_posts";

const post = officeBlogPosts.find(p => p.slug === "tri-modal-brand-translation")!;

export const metadata: Metadata = {
    title: `${post.title} | ${post.author}`,
    description: post.summary,
    alternates: {
        canonical: `/guide/operational-architecture/blog/${post.slug}`,
    },
};

export default function BlogPostPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "author": {
            "@id": "https://chris.melson.us/#person"
        },
        "datePublished": post.date,
        "description": post.summary,
        "articleBody": post.content
    };

    return (
        <main className="max-w-3xl mx-auto px-6 py-20 font-serif text-foreground">
            <SectionJsonLd data={jsonLd} />

            <header className="mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm font-mono tracking-widest opacity-60">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.role}</span>
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

                {post.content.split('\n').map((line, i) => {
                    if (line.trim() === '') return null;

                    if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-2xl font-bold font-display mt-10 mb-6 text-foreground">{line.substring(4)}</h3>;
                    }
                    if (line.startsWith('#### ')) {
                        return <h4 key={i} className="text-xl font-bold font-display mt-8 mb-4 text-foreground/90">{line.substring(5)}</h4>;
                    }
                    if (line.startsWith('* ')) {
                        return (
                            <div key={i} className="flex gap-3 mb-4 pl-4 border-l-2 border-emerald-500/30 py-1 bg-emerald-50/20">
                                <span className="text-emerald-600 font-bold pl-2">•</span>
                                <div className="pr-2"><span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>
                            </div>
                        );
                    }
                    if (/^\[\d+\]/.test(line)) {
                        return (
                            <div key={i} className="flex gap-3 mb-3 pl-4">
                                <span className="text-foreground/90 font-medium font-mono text-sm">
                                    <span dangerouslySetInnerHTML={{ __html: line }} />
                                </span>
                            </div>
                        );
                    }
                    if (/^\d+\.\s/.test(line)) {
                        return (
                            <div key={i} className="flex gap-3 mb-3 pl-4">
                                <span className="font-mono font-bold text-emerald-700">
                                    {line.split('.')[0]}.
                                </span>
                                <span className="text-foreground/90 font-medium">
                                    <span dangerouslySetInnerHTML={{ __html: line.substring(line.indexOf(' ') + 1).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                </span>
                            </div>
                        );
                    }
                    return (
                        <p key={i} className="mb-6">
                            <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </p>
                    );
                })}
            </article>

            <div className="mt-16 pt-16 border-t border-border">
                <p className="text-sm text-center opacity-50 font-mono">
                    Original content published on chris.melson.us
                </p>
            </div>
        </main>
    );
}

function SectionJsonLd({ data }: { data: any }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
