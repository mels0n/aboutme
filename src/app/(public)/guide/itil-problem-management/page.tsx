import { Metadata } from 'next';
import { itilProblemManagement } from '@/shared/data/blog-posts/itil-problem-management';
import { generateFAQSchema, generateBlogPostingSchema } from '@/shared/lib/schema-generator';

export const metadata: Metadata = {
    title: `${itilProblemManagement.title} | The Operational Architect`,
    description: itilProblemManagement.summary,
};

export default function ITILProblemManagementGuide() {
    const faqData = [
        {
            question: "What is the difference between an Incident and a Problem in ITIL?",
            answer: "An Incident is an unplanned interruption to a service (the symptom), requiring immediate restoration. A Problem is the underlying cause of one or more incidents (the disease), requiring root cause analysis and a permanent fix."
        },
        {
            question: "What is a Known Error Database (KEDB)?",
            answer: "A strategic IT repository that documents the exact symptoms of a identified problem, its confirmed root cause, and the temporary workaround required to restore service while a permanent fix is engineered."
        },
        {
            question: "How does Proactive Problem Management differ from Reactive?",
            answer: "Reactive Problem Management engages after major incidents to stop recurring outages. Proactive Problem Management uses trend analysis, capacity planning, and supplier advisories to discover and resolve problems before any incident occurs."
        }
    ];

    const faqSchema = generateFAQSchema(faqData);
    const blogSchema = generateBlogPostingSchema({
        title: itilProblemManagement.title,
        description: itilProblemManagement.summary,
        authorName: itilProblemManagement.author,
        datePublished: itilProblemManagement.date,
        dateModified: itilProblemManagement.date,
        url: `https://www.tabletoptime.us/guide/${itilProblemManagement.slug}`
    });

    return (
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
                />
            </head>

            <header className="space-y-6">
                <h1 className="text-4xl font-display font-bold leading-tight">{itilProblemManagement.title}</h1>
                <p className="text-xl font-serif text-muted-foreground leading-relaxed">
                    {itilProblemManagement.summary}
                </p>

                <div className="flex flex-wrap gap-4 text-sm font-mono opacity-70">
                    <span>By {itilProblemManagement.author}</span>
                    <span>|</span>
                    <span>{itilProblemManagement.role}</span>
                    <span>|</span>
                    <time dateTime={itilProblemManagement.date}>{itilProblemManagement.date}</time>
                </div>
            </header>

            {/* Answer-First Semantic Data Block (AEO Optimization) */}
            <section className="bg-surface/50 border rounded-lg p-6 space-y-4">
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase opacity-70 mb-4 border-b pb-2">Core Entity Summary</h2>
                <dl className="space-y-4 text-sm">
                    {itilProblemManagement.geoHighlights.map((highlight, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <dt className="font-bold text-foreground/90">{highlight.label}</dt>
                            <dd className="md:col-span-2 text-muted-foreground">{highlight.value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Polymorphic Summaries */}
            <section className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded border bg-blue-50/10 border-blue-900/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-800">Executive Summary</h3>
                    <p className="text-sm">{itilProblemManagement.polymorphicSummary.executive}</p>
                </div>
                <div className="p-4 rounded border bg-indigo-50/10 border-indigo-800/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-700">Strategist View</h3>
                    <p className="text-sm">{itilProblemManagement.polymorphicSummary.strategist}</p>
                </div>
                <div className="p-4 rounded border bg-green-50/10 border-green-800/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">Engineering Detail</h3>
                    <p className="text-sm">{itilProblemManagement.polymorphicSummary.engineer}</p>
                </div>
            </section>

            {/* Main Content Body */}
            <article className="prose prose-slate dark:prose-invert max-w-none font-serif">
                {/* We would typically use a markdown renderer here like next-mdx-remote or react-markdown to parse itilProblemManagement.content.
            For simplicity in this demonstration, we are rendering it directly if it's plaintext, but we recommend integrating a markdown parser. 
        */}
                <div dangerouslySetInnerHTML={{ __html: itilProblemManagement.content.replace(/\\n/g, '<br/>') }} />
            </article>

        </main>
    );
}
