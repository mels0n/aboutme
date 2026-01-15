import { Metadata } from "next";
import { diagnosticContent } from "@/shared/data/diagnostic_content";

export const metadata: Metadata = {
    title: "What is an Operational Architect? | Christopher Melson",
    description: diagnosticContent.header.definition.part2,
};

export default function OperationalArchitectGuide() {
    const { header, values, diagnosis } = diagnosticContent;

    // AEO/SEO: FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": header.title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${header.definition.part1} ${header.definition.part2}` // Full Bio
                }
            },
            {
                "@type": "Question",
                "name": "What does an Operational Architect do?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `An Operational Architect focuses on ${values.map(v => v.title).join(', ')}. They translate technical debt into P&L risk and orchestrate value streams.`
                }
            },
            {
                "@type": "Question",
                "name": diagnosis.title,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${diagnosis.subtitle} Triggers include: ${diagnosis.triggers.map(t => t.title).join(', ')}.`
                }
            }
        ]
    };

    return (
        <main className="max-w-4xl mx-auto px-6 py-24 space-y-12">

            {/* 1. Header & Answer First Block */}
            <header className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                    {header.title}
                </h1>

                {/* GEO: Answer First - Structured Definition */}
                <div className="bg-surface/50 border-l-4 border-primary p-6 rounded-r-lg">
                    <p className="text-xl md:text-2xl font-serif italic text-foreground/90 leading-relaxed">
                        <span className="opacity-70">{header.definition.part1}</span>{" "}
                        <strong className="text-foreground">{header.definition.part2}</strong>
                    </p>
                </div>
            </header>

            {/* 2. Structured Entity Data (Value Props) */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold font-display text-foreground">Core Competencies</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {values.map((val, idx) => (
                        <div key={idx} className="space-y-2">
                            <dt className="font-bold text-foreground text-lg">{val.title}</dt>
                            <dd className="text-foreground/70 leading-relaxed">
                                {val.description}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            <div className="h-px bg-border w-full" />

            {/* 3. Diagnostic Triggers */}
            <section className="space-y-8">
                <header className="space-y-2">
                    <h2 className="text-2xl font-bold font-display text-foreground">{diagnosis.title}</h2>
                    <p className="text-xl text-foreground/80 italic max-w-2xl">
                        {diagnosis.subtitle}
                    </p>
                </header>

                <div className="space-y-8">
                    {diagnosis.triggers.map((trigger, idx) => (
                        <article key={idx} className="bg-surface border border-border rounded-xl p-6 space-y-4">
                            <h3 className="text-xl font-bold text-foreground">{trigger.title}</h3>
                            <p className="text-foreground/70 italic font-serif">{trigger.subtitle}</p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                                {trigger.description.map((desc, dIdx) => (
                                    <li key={dIdx}>{desc}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            {/* 4. Closing */}
            <section className="text-center py-12">
                <blockquote className="text-2xl md:text-3xl font-display font-bold text-foreground/90 max-w-3xl mx-auto">
                    {diagnosis.closing}
                </blockquote>
            </section>

            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </main>
    );
}
