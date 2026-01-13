"use client";

import { aboutContent } from "@/shared/data/about-content";

export const AboutIntro = () => {
    const { intro } = aboutContent.bio;

    return (
        <article className="prose prose-slate prose-lg max-w-none">
            <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-foreground/40 mb-6">Introduction</h3>
            <div className="text-base md:text-lg font-serif text-foreground/80 leading-relaxed space-y-6">
                {intro.map((p, i) => (
                    <p key={`intro-${i}`}>{p}</p>
                ))}
            </div>
        </article>
    );
};
