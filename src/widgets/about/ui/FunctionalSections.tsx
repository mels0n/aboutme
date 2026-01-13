"use client";

import { useState } from "react";
import { aboutContent } from "@/shared/data/about-content";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FunctionalSections = () => {
    const { sections } = aboutContent.bio;

    return (
        <div className="space-y-6">
            {sections
                .map((section) => (
                    <PersonaCard key={section.id} section={section} />
                ))}
        </div>
    );
};

const PersonaCard = ({ section }: { section: typeof aboutContent.bio.sections[0] }) => {
    // Default to closed as requested
    const [isOpen, setIsOpen] = useState(false);

    // Theme coloring based on ID
    const isBoardroom = section.id === 'boardroom';
    const isArchitect = section.id === 'architect';
    const isEngine = section.id === 'engine-room';
    const isPersonal = section.id === 'personal';

    const colors =
        isBoardroom ? { text: "text-blue-900", border: "border-blue-200", bg: "bg-blue-50/50", card: "bg-white", chevron: "text-blue-400" } :
            isArchitect ? { text: "text-indigo-900", border: "border-indigo-200", bg: "bg-indigo-50/50", card: "bg-white", chevron: "text-indigo-400" } :
                isEngine ? { text: "text-emerald-900", border: "border-emerald-200", bg: "bg-emerald-50/50", card: "bg-white", chevron: "text-emerald-400" } :
                    isPersonal ? { text: "text-amber-900", border: "border-amber-200", bg: "bg-amber-50/50", card: "bg-white", chevron: "text-amber-400" } :
                        { text: "text-foreground", border: "border-border", bg: "bg-surface", card: "bg-surface", chevron: "text-foreground/40" };


    return (
        <section
            className={cn(
                "relative rounded-3xl border shadow-sm transition-all overflow-hidden hover:shadow-md",
                colors.card,
                colors.border,
                colors.bg
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-start justify-between p-8 text-left focus:outline-none group"
            >
                <div>
                    <h2 className={cn("text-2xl font-display font-bold tracking-tight leading-tight", colors.text)}>
                        {section.title.split(":")[0]}
                    </h2>
                    <p className={cn("text-base font-serif italic opacity-70 mt-1", colors.text)}>
                        {section.title.split(":")[1]}
                    </p>
                </div>

                <div className={cn(
                    "p-2 rounded-full bg-white/50 border transition-all duration-300",
                    colors.border,
                    isOpen ? "rotate-180" : "rotate-0"
                )}>
                    <ChevronDown className={cn("w-5 h-5", colors.chevron)} />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-8 pb-8 pt-0">
                            <div className="text-foreground/80 leading-relaxed space-y-4 text-base font-light border-t border-dashed border-slate-200 pt-6">
                                {section.content.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
