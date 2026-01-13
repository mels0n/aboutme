"use client";

import { aboutContent } from "@/shared/data/about-content";
import { cn } from "@/shared/lib/utils";

export const AboutBio = () => {
    const { intro, sections, closing } = aboutContent.bio;

    return (
        <article className="prose prose-slate prose-lg max-w-none space-y-12">
            {/* Intro */}
            <div className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed space-y-6">
                {intro.map((p, i) => (
                    <p key={`intro-${i}`}>{p}</p>
                ))}
            </div>

            {/* Sections */}
            <div className="space-y-16 pt-8">
                {sections.map((section) => {
                    // Theme coloring based on ID
                    const isBoardroom = section.id === 'boardroom';
                    const isArchitect = section.id === 'architect';
                    const isEngine = section.id === 'engine-room';
                    const isPersonal = section.id === 'personal';

                    const headerColor =
                        isBoardroom ? "text-slate-900" :
                            isArchitect ? "text-indigo-900" :
                                isEngine ? "text-emerald-900" :
                                    "text-foreground";

                    const accentColor =
                        isBoardroom ? "bg-slate-900" :
                            isArchitect ? "bg-indigo-600" :
                                isEngine ? "bg-emerald-600" :
                                    "bg-foreground";

                    return (
                        <section key={section.id} id={section.id} className="relative group">
                            <div className={cn("absolute -left-6 top-2 bottom-2 w-1 rounded-full opacity-20", accentColor)} />

                            <h2 className={cn("text-2xl font-sans font-bold mb-6 tracking-tight flex items-center gap-3", headerColor)}>
                                {section.title}
                            </h2>
                            <div className="text-foreground/80 leading-relaxed space-y-4 font-light">
                                {section.content.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Closing */}
            <div className="pt-8 border-t border-border/40">
                <p className="text-2xl md:text-3xl font-display font-bold text-foreground text-center">
                    "{closing}"
                </p>
            </div>
        </article>
    );
};
