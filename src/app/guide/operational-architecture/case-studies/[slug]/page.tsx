
import { Metadata } from "next";
import { officeCaseStudies } from "@/shared/data/office_case_studies";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all case studies to support SSG
export async function generateStaticParams() {
    return officeCaseStudies.map((study) => ({
        slug: study.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const study = officeCaseStudies.find((s) => s.slug === slug);
    if (!study) return {};

    return {
        title: `${study.title} | Case Study`,
        description: study.summary.executive,
        alternates: {
            canonical: `/guide/operational-architecture/case-studies/${study.slug}`,
        }
    };
}

export default async function CaseStudyPage({ params }: Props) {
    const { slug } = await params;
    const study = officeCaseStudies.find((s) => s.slug === slug);

    if (!study) {
        notFound();
    }

    // AEO: Article + HowTo Schema
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": study.title,
            "description": study.summary.executive,
            "author": {
                "@type": "Person",
                "name": "Chris Melson",
                "jobTitle": "Operational Architect"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Christopher Melson | Polymorphic Portfolio",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://chris.melson.us/opengraph-image"
                }
            },
            "datePublished": study.date,
            "dateModified": study.date,
            "articleBody": `
                Situation: ${study.fullReport.situation}
                Task: ${study.fullReport.task}
                Action: ${study.fullReport.action}
                Result: ${study.fullReport.result}
            `
        },
        {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to solve: ${study.title}`,
            "description": study.fullReport.task,
            "step": study.fullReport.action.split('\n')
                .filter(line => line.trim().length > 0)
                .map((line, index) => ({
                    "@type": "HowToStep",
                    "position": index + 1,
                    "text": line.replace(/^\* /, '').replace(/\*+/g, '') // Clean markdown symbols
                }))
        }
    ];

    return (
        <main className="min-h-screen bg-white text-slate-900 font-serif py-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-3xl mx-auto">
                <Link
                    href="/guide/operational-architecture/case-studies"
                    className="inline-flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors mb-12"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Case Studies
                </Link>

                <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8 leading-tight">
                    {study.title}
                </h1>

                {/* Executive Summary Card */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg text-slate-800 mb-12">
                    <h2 className="font-bold mb-2 text-sm uppercase tracking-wide opacity-70">Executive Summary</h2>
                    <p className="leading-relaxed text-lg">{study.summary.executive}</p>
                </div>

                {/* GEO Highlights */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
                    {study.fullReport.geoHighlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="flex flex-col">
                            <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                                {highlight.label}
                            </dt>
                            <dd className="font-bold text-slate-900 leading-tight">
                                {highlight.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* S.T.A.R. Report Content */}
                <div className="prose prose-lg prose-slate max-w-none">
                    <div className="mb-12">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-emerald-700 mb-4">Situation</h3>
                        <p className="whitespace-pre-line leading-relaxed">{study.fullReport.situation}</p>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-amber-600 mb-4">Task</h3>
                        <p className="whitespace-pre-line leading-relaxed">{study.fullReport.task}</p>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-blue-700 mb-4">Action</h3>
                        <div className="whitespace-pre-line leading-relaxed">
                            {study.fullReport.action.split('\n').map((line, i) => (
                                <p key={i} className="mb-4">
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

                    <div className="mb-12 bg-emerald-50/50 p-8 -mx-6 rounded-xl border border-emerald-100">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-emerald-800 mb-4">Result</h3>
                        <div className="whitespace-pre-line leading-relaxed">
                            {study.fullReport.result.split('\n').map((line, i) => (
                                <p key={i} className="mb-4">
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
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-sm font-mono uppercase tracking-widest">
                <Link href="/" className="text-blue-600 hover:underline">← Return to Office</Link>
                <span className="text-gray-400">System Reference: OA-2026-CS</span>
            </div>
        </main>
    );
}
