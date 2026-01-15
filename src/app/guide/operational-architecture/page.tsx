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
                    "text": `${header.definition.part1} ${header.definition.part2} ${header.definition.part3}` // Full Bio
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
                <div className="bg-surface/50 border-l-4 border-primary p-6 rounded-r-lg space-y-4">
                    <p className="text-xl md:text-2xl font-serif italic text-foreground/90 leading-relaxed">
                        <span className="opacity-70">{header.definition.part1}</span>{" "}
                        <span className="text-foreground">{header.definition.part2}</span>
                    </p>
                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-sans">
                        {header.definition.part3}
                    </p>
                </div>
            </header>

            {/* Comparison Table (Semantic Twin) */}

            <section className="space-y-8">
                <h2 className="text-2xl font-bold font-display text-foreground">The Shift: Steward vs. Architect</h2>
                <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface/50">
                            <tr className="border-b border-border">
                                <th className="py-3 px-4 font-bold text-foreground w-1/4">Role Context</th>
                                <th className="py-3 px-4 font-bold text-foreground/70 w-1/4">Generalist Ops Executive</th>
                                <th className="py-3 px-4 font-bold text-foreground w-1/4 bg-primary/5">Operational Architect</th>
                                <th className="py-3 px-4 font-bold text-foreground/70 w-1/4">The "OA" Advantage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {diagnosticContent.comparison?.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-foreground/5 transition-colors">
                                    {/* Role Context */}
                                    <td className="py-6 px-4 font-bold text-foreground align-top text-sm w-32 md:w-40 border-r border-border/50 bg-surface/50">
                                        {row.role}
                                    </td>

                                    {/* Steward Column */}
                                    <td className="py-6 px-6 text-foreground/80 align-top border-r border-border/50">
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">Focus</div>
                                                <div className="text-sm leading-relaxed">{row.steward.focus}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">Method</div>
                                                <div className="text-sm leading-relaxed">{row.steward.method}</div>
                                            </div>
                                            <div className="pt-2 border-t border-border/10">
                                                <div className="text-sm italic opacity-70 leading-relaxed">"{row.steward.mindset.replace(/"/g, '')}"</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* OA Column (Highlighted) */}
                                    <td className="py-6 px-6 text-foreground align-top bg-primary/5 border-r border-border/50">
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-primary/70 mb-1">Focus</div>
                                                <div className="text-sm font-medium leading-relaxed">{row.engineer.focus}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-primary/70 mb-1">Method</div>
                                                <div className="text-sm font-medium leading-relaxed">{row.engineer.method}</div>
                                            </div>
                                            <div className="pt-2 border-t border-primary/10">
                                                <div className="text-sm italic font-medium leading-relaxed text-primary/90">"{row.engineer.mindset.replace(/"/g, '')}"</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Advantage Column */}
                                    <td className="py-6 px-6 text-foreground/70 align-top text-sm leading-relaxed bg-surface/30">
                                        <div className="space-y-6">
                                            {row.advantage.map((item, i) => (
                                                <div key={i}>
                                                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">{item.label}</div>
                                                    <div className="text-sm leading-relaxed font-medium italic">{item.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 2. Structured Entity Data (Value Props) */}
            <section className="space-y-8">
                <header className="space-y-4">
                    <h2 className="text-2xl font-bold font-display text-foreground">{diagnosticContent.valuesHeader?.title}</h2>
                    <p className="text-lg text-foreground/80 leading-relaxed font-sans max-w-3xl">
                        {diagnosticContent.valuesHeader?.intro}
                    </p>
                </header>
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
        </main >
    );
}
