
import { Metadata } from "next";
import { faqData } from "@/shared/data/faq_content";

export const metadata: Metadata = {
    title: "Who Needs an Operational Architect? | Chris Melson",
    description: "Diagnosing the 'Strategic Crisis of the Generalist'. When to hire an Operational Architect vs a Product Manager.",
};

export default function OperationalArchitectFaqPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <main className="max-w-4xl mx-auto px-6 py-20 font-serif text-foreground">
            <SectionJsonLd data={jsonLd} />

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
                The Strategic Crisis of the Generalist
            </h1>
            <p className="text-xl text-foreground/70 mb-16 leading-relaxed">
                Why traditional management structures fail in the face of technical debt,
                and when you need to introduce an Operational Architect.
            </p>

            <div className="space-y-16">
                {faqData.map((item, idx) => (
                    <div key={idx} className="border-t border-current/10 pt-12">
                        <h2 className="text-2xl font-bold font-display mb-4 text-emerald-900 dark:text-emerald-100">
                            {item.question}
                        </h2>
                        <div className="prose prose-lg text-foreground/80 leading-relaxed whitespace-pre-line">
                            {/* Render answer with bold formatting support */}
                            {item.answer.split('\n').map((line, i) => (
                                <p key={i}>
                                    <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                </p>
                            ))}
                        </div>
                    </div>
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
