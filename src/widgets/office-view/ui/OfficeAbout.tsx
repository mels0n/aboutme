"use client";

import { useState, useEffect } from 'react';
import { usePersonaStore } from "@/shared/lib/store";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/shared/lib/utils";
import { X, Info, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";
import { aboutContent } from "@/shared/data/about-content";
import Image from "next/image";

interface OfficeAboutProps {
    mode?: 'executive' | 'strategist' | 'engineer';
}

export const OfficeAbout = ({ mode: propMode }: OfficeAboutProps) => {
    const { mode: storeMode } = usePersonaStore();
    const mode = propMode || storeMode;
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Context-aware styles
    // Context-aware styles
    const theme = {
        executive: {
            button: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100",
            modal: "bg-surface border-border text-slate-900 border-blue-900/10",
            accent: "text-blue-700",
            border: "border-blue-100",
            bg: "bg-blue-50/50",
            toggleActive: "border-blue-600 text-blue-800 font-bold",
            toggleInactive: "border-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 px-2 rounded-md",
        },
        strategist: {
            button: "text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
            modal: "bg-surface border-border text-indigo-950 border-indigo-900/10",
            accent: "text-indigo-700",
            border: "border-indigo-100",
            bg: "bg-indigo-50/50",
            toggleActive: "border-indigo-500 text-indigo-700 font-bold",
            toggleInactive: "border-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 px-2 rounded-md",
        },
        engineer: {
            button: "text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
            modal: "bg-surface border-border text-zinc-900 border-emerald-900/10",
            accent: "text-emerald-700",
            border: "border-emerald-100",
            bg: "bg-emerald-50/50",
            toggleActive: "border-emerald-500 text-emerald-700 font-bold",
            toggleInactive: "border-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 px-2 rounded-md",
        }
    }[mode];

    // Polymorphic Content Data
    const content = aboutContent;

    return (
        <>
            {/* FAB */}
            <motion.button
                layout
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed z-40 bottom-6 right-6 px-4 py-2 rounded-full border shadow-sm backdrop-blur-sm transition-all duration-300 flex items-center gap-2 cursor-pointer",
                    theme.button
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide font-serif">About Me</span>
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 pt-28 md:pt-4 backdrop-blur-sm bg-slate-900/20" onClick={() => setIsOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "relative w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] md:max-h-[90vh]",
                                theme.modal
                            )}
                        >
                            {/* Polymorphic Backgrounds */}
                            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
                                {mode === 'strategist' && <BlueprintGrid />}
                                {mode === 'executive' && <ExecutiveAbstract />}
                                {mode === 'engineer' && <TechMatrix />}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-20 text-foreground/40 hover:text-foreground transition-colors p-2 hover:bg-black/5 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="relative z-10 p-8 pb-6 border-b border-foreground/10 flex items-center gap-6 bg-surface/80 backdrop-blur-sm">
                                {/* Headshot */}
                                <div className={cn("w-20 h-20 rounded-full overflow-hidden border-2 bg-white", theme.border, theme.accent)}>
                                    <Image
                                        src="/chris-melson-headshot.jpg"
                                        alt="Christopher Melson"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-foreground">Christopher Melson</h2>
                                    <p className="text-sm font-serif text-foreground/70 tracking-wide">Executive | Operational Architect | Strategic Operator</p>
                                    <p className="text-sm font-serif text-foreground/60 italic mt-1">Ensure Strategy Survives Contact with Reality</p>
                                </div>
                            </div>

                            {/* View Toggle Bar */}
                            <div className={cn(
                                "relative z-10 px-6 py-3 flex gap-4 text-sm font-medium border-b border-foreground/5 bg-surface/50 backdrop-blur-sm"
                            )}>
                                <button
                                    className={cn(
                                        "pb-1 border-b-2 transition-colors cursor-default",
                                        theme.toggleActive
                                    )}
                                >
                                    Persona Context
                                </button>
                                <Link
                                    href="/about"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "pb-1 border-b-2 transition-all flex items-center gap-2",
                                        theme.toggleInactive
                                    )}
                                >
                                    Full Biography
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* Dynamic Body */}
                            <div className="p-8 overflow-y-auto relative z-10 flex-1 touch-pan-y">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mode}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className={cn(
                                            "space-y-6 leading-relaxed text-foreground/90 font-serif"
                                        )}
                                    >
                                        <div className="space-y-4">
                                            {aboutContent.popouts[mode].bioParagraphs.map((paragraph, idx) => (
                                                <p key={idx} className={idx === 0 ? "font-bold text-lg mb-4" : ""}>
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>

                                        <div className="mt-8 grid gap-6">
                                            {aboutContent.popouts[mode].stats.map((stat, idx) => (
                                                <div key={idx}>
                                                    <span className="text-xs font-bold uppercase tracking-wider opacity-60 block mb-1">{stat.label}</span>
                                                    <span className="text-lg font-serif italic text-foreground/80">{stat.value}</span>
                                                </div>
                                            ))}
                                        </div>


                                    </motion.div>
                                </AnimatePresence>
                            </div>



                        </motion.div>
                    </div >
                )}
            </AnimatePresence >
        </>
    );
};
