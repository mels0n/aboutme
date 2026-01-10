import { Metadata } from "next";
import { officeCaseStudies } from "@/shared/data/office_case_studies";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors mb-12"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
            </Link>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
                Operational Architecture Case Studies
            </h1>
            <p className="text-xl text-foreground/70 mb-16 leading-relaxed">
                A deep dive into the methodology behind complex operational turnarounds.
                These reports detail the "Structure" behind the "Strategy".
            </p>

            <div className="space-y-16">
                {officeCaseStudies.map((study, idx) => (
                    <article key={idx} className="border-t border-current/10 pt-16 group">
                        <header className="mb-8">
                            <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">
                                Case Study CS-0{idx + 1}
                            </div>
                            <h2 className="text-3xl font-bold font-display mb-4 group-hover:text-blue-700 transition-colors">
                                <Link href={`/guide/operational-architecture/case-studies/${study.slug}`}>
                                    {study.title}
                                </Link>
                            </h2>
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-slate-800 mb-6">
                                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide opacity-70">Executive Summary</h3>
                                <p className="leading-relaxed">{study.summary.executive}</p>
                            </div>

                            {/* GEO Highlights Preview */}
                            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                {study.fullReport.geoHighlights.map((highlight, hIdx) => (
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

                            <Link
                                href={`/guide/operational-architecture/case-studies/${study.slug}`}
                                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors border-b-2 border-blue-600/20 hover:border-blue-800 pb-1"
                            >
                                Read Full S.T.A.R. Report
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
