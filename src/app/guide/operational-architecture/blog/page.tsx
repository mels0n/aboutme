import { Metadata } from "next";
import { officeBlogPosts } from "@/shared/data/office_blog_posts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Operational Architecture Blog | Chris Melson",
    description: "Insights, articles, and analysis on operational architecture, engineering management, and organizational scaling.",
};

export default function BlogListPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Operational Architecture Blog",
        "author": {
            "@id": "https://chris.melson.us/#person"
        },
        "hasPart": officeBlogPosts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.date,
            "author": {
                "@type": "Person",
                "name": post.author
            },
            "description": post.summary
        }))
    };

    return (
        <main className="max-w-4xl mx-auto px-6 py-20 font-serif text-foreground">
            <SectionJsonLd data={jsonLd} />

            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors mb-12"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
            </Link>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
                Operational Architecture Blog
            </h1>
            <p className="text-xl text-foreground/70 mb-16 leading-relaxed">
                Insights, analysis, and strategic perspectives on building resilient organizations,
                scaling engineering teams, and navigating the agentic shift.
            </p>

            <div className="space-y-16">
                {officeBlogPosts.map((post, idx) => (
                    <article key={idx} className="border-t border-current/10 pt-16 group">
                        <header className="mb-8">
                            <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <h2 className="text-3xl font-bold font-display mb-4 group-hover:text-blue-700 transition-colors">
                                <Link href={`/guide/operational-architecture/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h2>
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-slate-800 mb-6">
                                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide opacity-70">Executive Summary</h3>
                                <p className="leading-relaxed">{post.polymorphicSummary.executive}</p>
                            </div>

                            {/* GEO Highlights Preview */}
                            {post.geoHighlights && post.geoHighlights.length > 0 && (
                                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                    {post.geoHighlights.map((highlight, hIdx) => (
                                        <div key={hIdx} className="flex flex-col">
                                            <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                                                {highlight.label}
                                            </dt>
                                            <dd className="font-bold text-slate-900 leading-tight text-sm">
                                                {highlight.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            )}

                            <Link
                                href={`/guide/operational-architecture/blog/${post.slug}`}
                                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors border-b-2 border-blue-600/20 hover:border-blue-800 pb-1"
                            >
                                Read Full Article
                                <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </header>
                    </article>
                ))}
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
