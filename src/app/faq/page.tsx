import type { Metadata } from 'next';
import { faqContent } from "@/shared/data/faq_content";
import Link from 'next/link';
import { siteConfig } from "@/shared/config/site-config";
import { ArrowLeft, ExternalLink, CalendarCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: `FAQ: The Objection Handling Engine | ${siteConfig.name}`,
    description: "Deep-dive answers on Operational Architecture, Tri-Modal Leadership, and Engagement Logistics. Designed for Answer Engines and Executive Due Diligence.",
    alternates: {
        canonical: '/faq',
    },
};

export default function FAQPage() {
    // Generate FAQ Schema for AEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "description": "Operational Architect FAQ - Roles, Engagement Models, and Technical Strategy",
        "mainEntity": faqContent.flatMap(section =>
            section.items.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        )
    };

    return (
        <main className="min-h-screen bg-white text-slate-900 font-serif">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Portfolio
                    </Link>
                    <Link
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        className="hidden md:flex items-center gap-2 text-sm font-sans font-bold text-slate-900 border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-all"
                    >
                        Connect <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-6 border-b border-slate-100 bg-slate-50/50">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-block px-3 py-1 mb-6 text-xs font-sans font-bold tracking-[0.2em] uppercase text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                        Knowledge Base
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                        Objection Handling <span className="text-blue-700">Engine</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-2xl">
                        A semantic deep-dive into the role of an Operational Architect.
                        Designed for clarity, structured for machines, written for leaders.
                    </p>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

                {faqContent.map((section, sIdx) => (
                    <section key={sIdx} aria-labelledby={`section-${sIdx}`}>
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-10">
                            <h2
                                id={`section-${sIdx}`}
                                className="text-2xl font-sans font-bold text-slate-900 uppercase tracking-wide"
                            >
                                {section.title}
                            </h2>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Q&A Items */}
                        <div className="grid gap-12">
                            {section.items.map((item, iIdx) => (
                                <article key={iIdx} className="group hover:bg-slate-50/50 -mx-6 px-6 py-6 rounded-2xl transition-colors">
                                    <h3 className="text-xl md:text-2xl font-bold font-sans text-slate-900 mb-4 flex items-start gap-3">
                                        <span className="text-blue-200 font-display select-none">Q.</span>
                                        {item.question}
                                    </h3>
                                    <div className="prose prose-lg prose-slate max-w-none ml-0 md:ml-9 text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                                        {/* Injecting line breaks if needed, or just rendering text */}
                                        {item.answer.split('\n').map((line, lineIdx) => {
                                            if (!line.trim()) return null;

                                            // Check for numbered list items (e.g., "1. **Title:** Body")
                                            const isListItem = /^\d+\.\s/.test(line);

                                            if (isListItem) {
                                                return (
                                                    <div key={lineIdx} className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-5 last:mb-0">
                                                        <span dangerouslySetInnerHTML={{
                                                            __html: line.replace(/^\d+\.\s/, '') // Remove number prefix for cleaner look
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong class="block text-slate-900 font-bold mb-1">$1</strong>')
                                                        }} />
                                                    </div>
                                                );
                                            }

                                            return (
                                                <p key={lineIdx} className="mb-4 last:mb-0">
                                                    <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>') }} />
                                                </p>
                                            );
                                        })}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}

            </div>

            {/* CTA Footer */}
            <footer className="bg-slate-900 text-white py-24 px-6 mt-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
                </div>

                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                        Ready to audit your Operational Architecture?
                    </h2>
                    <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl mx-auto">
                        Stop burning capital on execution failure. Book a Red Flag Diagnostic to identify the structural risks in your People, Process, and Technology.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <a
                            href={siteConfig.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold uppercase tracking-wider rounded-lg transition-all hover:scale-105 shadow-lg shadow-blue-900/50"
                        >
                            <CalendarCheck className="w-5 h-5" />
                            Inquire About Executive Availability
                        </a>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-sans font-bold uppercase tracking-wider rounded-lg transition-all"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}
