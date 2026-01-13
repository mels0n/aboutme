"use client";

import { aboutContent } from "@/shared/data/about-content";

export const ClosingQuote = () => {
    const { closing } = aboutContent.bio;

    return (
        <div className="pt-16 pb-8 border-t border-border/40 text-center">
            <p className="text-2xl md:text-4xl font-display font-bold text-foreground max-w-3xl mx-auto leading-tight">
                "{closing}"
            </p>
        </div>
    );
};
