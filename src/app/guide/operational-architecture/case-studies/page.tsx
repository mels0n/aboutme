import { Metadata } from "next";
import { officeCaseStudies } from "@/shared/data/office_case_studies";

export const metadata: Metadata = {
    title: "Operational Architecture Case Studies | Chris Melson",
    description: "Detailed breakdown of operational turnarounds, including DORA compliance, Post-Merger Integration, and Strategic Asset Rescue.",
};

export default function CaseStudiesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Operational Architecture Case Studies",
        "author": {
            "@type": "Person",
            "name": "Chris Melson",
            "jobTitle": "Operational Architect"
        },
        "hasPart": officeCaseStudies.map((study) => ({
            "@type": "Article",
            "headline": study.title,
            "description": study.summary.strategist,
            "articleBody": `
        Situation: ${study.fullReport.situation}
        Task: ${study.fullReport.task}
        Action: ${study.fullReport.action}
        Result: ${study.fullReport.result}
      `
        }))
    };

    return (
        <main className="max-w-4xl mx-auto px-6 py-20 font-serif text-foreground">
            <SectionJsonLd data={jsonLd} />

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
                Operational Architecture Case Studies
            </h1>
            <p className="text-xl text-foreground/70 mb-16 leading-relaxed">
                A deep dive into the methodology behind complex operational turnarounds.
                These reports detail the "Structure" behind the "Strategy".
            </p>

            <div className="space-y-24">
                {officeCaseStudies.map((study, idx) => (
                    <article key={idx} className="border-t border-current/10 pt-16">
                        <header className="mb-8">
                            <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">
                                Case Study CS-0{idx + 1}
                            </div>
                            <h2 className="text-3xl font-bold font-display mb-4">
                                {study.title}
                            </h2>
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-slate-800">
                                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide opacity-70">Executive Summary</h3>
                                <p className="leading-relaxed">{study.summary.executive}</p>
                            </div>
                        </header>

                        <section className="prose prose-slate max-w-none">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold uppercase tracking-widest text-emerald-700 mb-2">Situation</h3>
                                <p className="whitespace-pre-line leading-relaxed">{study.fullReport.situation}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-bold uppercase tracking-widest text-amber-600 mb-2">Task</h3>
                                <p className="whitespace-pre-line leading-relaxed">{study.fullReport.task}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-bold uppercase tracking-widest text-blue-700 mb-2">Action</h3>
                                <div className="whitespace-pre-line leading-relaxed">
                                    {/* Render with simple bold formatting preservation */}
                                    {study.fullReport.action.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2">
                                            {line.startsWith('* ') ? (
                                                <span className="flex gap-2 ml-4">
                                                    <span>•</span>
                                                    <span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                </span>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                            )}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8 bg-emerald-50/50 p-6 -mx-6 rounded-lg">
                                <h3 className="text-lg font-bold uppercase tracking-widest text-emerald-800 mb-2">Result</h3>
                                <div className="whitespace-pre-line leading-relaxed">
                                    {study.fullReport.result.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2">
                                            {line.startsWith('* ') ? (
                                                <span className="flex gap-2 ml-4">
                                                    <span>•</span>
                                                    <span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                </span>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                            )}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </section>
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
