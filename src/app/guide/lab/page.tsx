import { Metadata } from "next";
import { LAB_CONTENT, MANIFESTO_CONTENT } from "@/shared/data/lab-content";

export const metadata: Metadata = {
    title: "The Lab | Cognitive Refactoring & Innovation",
    description: "A digital workspace dedicated to non-revenue-generating activities that yield high intellectual returns. The Lab is the 'Shadow IT' sector of the professional brand.",
};

export default function LabGuidePage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-24 space-y-12">
            <header className="space-y-4">
                <h1 className="text-4xl font-display font-bold text-foreground">The Lab</h1>
                <p className="text-xl text-foreground/70 font-serif italic">
                    {LAB_CONTENT.executive.report.subject}
                </p>
            </header>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold font-display text-foreground">Manifesto</h2>
                <div className="prose prose-lg text-foreground/80">
                    <p>{MANIFESTO_CONTENT.intro}</p>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold font-display text-foreground">Strategic Intent</h2>
                <div className="prose prose-lg text-foreground/80">
                    {LAB_CONTENT.executive.report.body.map((p, i) => (
                        <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                    ))}
                </div>
            </section>

            <section className="bg-surface/50 border border-border p-8 rounded-lg space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Schema Metadata</h3>
                <p className="text-sm text-foreground/60">
                    This page serves as the Semantic Twin for "The Lab" feature slice, ensuring that the underlying logic and creative intent are indexed by AI agents.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {Object.entries(MANIFESTO_CONTENT.explanations).map(([mode, text]) => (
                        <div key={mode} className="p-4 bg-background border border-border rounded">
                            <h4 className="font-bold capitalize mb-2">{mode}</h4>
                            <p className="text-xs text-foreground/70">{text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
