import { pageMetadata } from "@/shared/lib/seo/metadata";
import { officeBlogPosts } from "@/shared/data/published_blog_posts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JsonLdScript } from "@/shared/ui/JsonLdScript";
import { blogIndexGraph } from "@/shared/lib/structured-data";

const BLOG_TITLE = "Operational Architecture Blog";
const BLOG_DESCRIPTION = "Insights, articles, and analysis on operational architecture, engineering management, and organizational scaling.";

export const metadata = pageMetadata({ title: BLOG_TITLE, description: BLOG_DESCRIPTION, path: "/guide/operational-architecture/blog" });

export default function BlogListPage() {
    const sortedPosts = [...officeBlogPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10 md:py-16 font-serif text-foreground">
            <JsonLdScript graph={blogIndexGraph({ name: BLOG_TITLE, description: BLOG_DESCRIPTION }, sortedPosts)} />

            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors mb-6 md:mb-12"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
            </Link>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 md:mb-8">
                Operational Architecture Blog
            </h1>
            <p className="text-xl text-foreground/70 mb-8 md:mb-12 leading-relaxed max-w-3xl">
                Insights, analysis, and strategic perspectives on building resilient organizations,
                scaling engineering teams, and navigating the agentic shift.
            </p>

            <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 border-t border-current/10 pt-8 md:pt-12">
                {sortedPosts.map((post, idx) => (
                    <li key={post.id} className={idx === 0 ? "md:col-span-2" : undefined}>
                        <article className="group relative flex h-full flex-col rounded-lg border border-slate-200 bg-white/60 p-6 md:p-8 transition-colors hover:border-blue-700/40 hover:bg-blue-50/30">
                            <div className="text-xs font-sans uppercase tracking-widest text-foreground/50 mb-3">
                                {idx === 0 && <span className="text-blue-700 font-bold">Latest · </span>}
                                <time dateTime={post.date}>
                                    {new Date(`${post.date}T00:00:00`).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                                <span aria-hidden="true"> · </span>
                                {Math.ceil(post.content.split(/\s+/).length / 225)} min read
                            </div>
                            <h2 className={`font-bold font-display leading-tight mb-3 group-hover:text-blue-700 transition-colors ${idx === 0 ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                                {/* Stretched link: the whole card is the click target. */}
                                <Link
                                    href={`/guide/operational-architecture/blog/${post.slug}`}
                                    className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-blue-700"
                                >
                                    {post.title}
                                </Link>
                            </h2>
                            <p className={`text-foreground/75 leading-relaxed mb-6 ${idx === 0 ? "line-clamp-5 md:text-lg" : "line-clamp-4"}`}>
                                {post.polymorphicSummary.executive}
                            </p>
                            {post.geoHighlights.length > 0 && (
                                <dl className={`grid gap-x-6 gap-y-3 mb-6 pt-4 border-t border-slate-200 font-sans ${idx === 0 ? "sm:grid-cols-3" : ""}`}>
                                    {post.geoHighlights.map((highlight) => (
                                        <div key={highlight.label}>
                                            <dt className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                                                {highlight.label}
                                            </dt>
                                            <dd className="text-sm font-semibold text-slate-800 leading-snug">
                                                {highlight.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                            <span className="mt-auto inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-blue-600 group-hover:text-blue-800 transition-colors" aria-hidden="true">
                                Read article &rarr;
                            </span>
                        </article>
                    </li>
                ))}
            </ol>
        </main>
    );
}
