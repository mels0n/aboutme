"use client";

import { useState } from "react";
import { usePersonaStore } from "@/shared/lib/store";
import { officeCaseStudies, OfficeCaseStudy } from "@/shared/data/office_case_studies";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { TrustBadge } from "./branding/TrustBadge";
import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";
import { cn } from "@/shared/lib/utils";

interface CaseStudiesGridProps {
    mode?: 'executive' | 'strategist' | 'engineer';
}

export const CaseStudiesGrid = ({ mode: propMode }: CaseStudiesGridProps) => {
    const { mode: storeMode } = usePersonaStore();
    const mode = propMode || storeMode;
    const [selectedStudy, setSelectedStudy] = useState<{ study: OfficeCaseStudy, idx: number } | null>(null);
    const [isFullReport, setIsFullReport] = useState(false);

    // Reset full report view when closing or changing study
    const handleClose = () => {
        setSelectedStudy(null);
        setIsFullReport(false);
    };

    return (
        <section className="w-full max-w-6xl mx-auto space-y-12 pb-12">
            <div className="border-b border-foreground/10 pb-4 flex justify-between items-end">
                <h3 className="text-xl font-mono uppercase tracking-widest text-foreground/80">
                    Recent Case Studies
                </h3>
                <span className="text-xs font-mono text-foreground/40">
                    Index 01-03
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {officeCaseStudies.map((study, idx) => (
                    <motion.div
                        layoutId={`card-${idx}`}
                        key={idx}
                        onClick={() => setSelectedStudy({ study, idx })}
                        className="group relative flex flex-col gap-6 p-6 border border-border hover:border-foreground/30 transition-colors bg-surface/50 overflow-hidden cursor-pointer h-full"
                    >
                        {/* Polymorphic Backgrounds */}
                        {mode === 'strategist' && <BlueprintGrid />}
                        {mode === 'executive' && <ExecutiveAbstract />}
                        {mode === 'engineer' && <TechMatrix />}

                        <div className="relative z-10 flex justify-between items-start">
                            <TrustBadge label={`CS-0${idx + 1}`} />
                            <ArrowUpRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground transition-colors" />
                        </div>

                        <motion.h4 layoutId={`title-${idx}`} className="relative z-10 text-2xl font-bold font-display leading-tight min-h-[4rem]">
                            {study.title}
                        </motion.h4>

                        <div className="min-h-[120px] relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <p className="text-sm font-serif leading-relaxed text-foreground/80 mb-4 line-clamp-4">
                                        {study.summary[mode]}
                                    </p>

                                    {/* Additional Badge based on content context if needed */}
                                    {mode === 'engineer' && (
                                        <div className="font-mono text-xs text-green-500/60 mt-2">
                                            // verified_by_ops
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="relative z-10 mt-auto pt-6 border-t border-border grid grid-cols-2 gap-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="col-span-2 grid grid-cols-2 gap-4"
                                >
                                    {study.stats[mode].slice(0, 2).map((stat, sIdx) => (
                                        <div key={sIdx}>
                                            <div className="text-xs text-foreground/40 uppercase tracking-wider mb-1">
                                                {stat.label}
                                            </div>
                                            <div className="text-sm md:text-lg font-mono font-bold text-foreground truncate">
                                                {stat.value}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedStudy && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />

                        <motion.div
                            layoutId={`card-${selectedStudy.idx}`}
                            className="w-full max-w-4xl max-h-[85vh] overflow-hidden bg-surface border border-border shadow-2xl relative z-10 flex flex-col rounded-lg"
                        >
                            {/* Polymorphic Backgrounds in Modal - Subtle opacity for readability */}
                            <div className="opacity-50 pointer-events-none absolute inset-0">
                                {mode === 'strategist' && <BlueprintGrid />}
                                {mode === 'executive' && <ExecutiveAbstract />}
                                {mode === 'engineer' && <TechMatrix />}
                            </div>

                            {/* Header */}
                            <div className="relative z-20 bg-surface/95 backdrop-blur-sm border-b border-border p-6 md:p-8 flex justify-between items-start gap-4 flex-shrink-0">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <TrustBadge label={`CASE REPORT: CS-0${selectedStudy.idx + 1}`} />
                                        {isFullReport && (
                                            <span className={cn(
                                                "text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                mode === 'engineer' ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                                                    mode === 'strategist' ? "text-indigo-600 bg-indigo-50 border-indigo-200" :
                                                        "text-blue-600 bg-blue-50 border-blue-200"
                                            )}>
                                                Operational Architect Approved
                                            </span>
                                        )}
                                    </div>
                                    <motion.h2 layoutId={`title-${selectedStudy.idx}`} className="text-3xl md:text-4xl font-bold font-display leading-tight">
                                        {selectedStudy.study.title}
                                    </motion.h2>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors flex-shrink-0"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* View Toggle Bar */}
                            <div className="bg-surface/50 border-b border-border px-6 md:px-8 py-3 flex gap-4 text-sm font-medium relative z-20 backdrop-blur-sm flex-shrink-0">
                                <button
                                    onClick={() => setIsFullReport(false)}
                                    className={cn(
                                        "pb-1 border-b-2 transition-colors",
                                        !isFullReport
                                            ? "border-foreground text-foreground"
                                            : "border-transparent text-foreground/50 hover:text-foreground/80"
                                    )}
                                >
                                    Persona Brief
                                </button>
                                <button
                                    onClick={() => setIsFullReport(true)}
                                    className={cn(
                                        "pb-1 border-b-2 transition-all flex items-center gap-2",
                                        isFullReport
                                            ? mode === 'engineer' ? "border-emerald-500 text-emerald-700 font-bold"
                                                : mode === 'strategist' ? "border-indigo-500 text-indigo-700 font-bold"
                                                    : "border-blue-600 text-blue-800 font-bold"
                                            : "border-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 px-2 rounded-md" // Added mild background on hover for better visibility
                                    )}
                                >
                                    <span className="md:hidden">Tap to Expand S.T.A.R.</span>
                                    <span className="hidden md:inline">Detailed S.T.A.R. Report</span>
                                    {!isFullReport && <ArrowUpRight className="w-4 h-4 text-foreground/70" />}
                                </button>
                            </div>

                            {/* Body Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 relative z-10">

                                {!isFullReport ? (
                                    /* --- PERSONA BRIEF VIEW --- */
                                    <motion.div
                                        key="brief"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-foreground/5 rounded-lg border border-foreground/10">
                                            {selectedStudy.study.stats[mode].map((stat, idx) => (
                                                <div key={idx}>
                                                    <div className="text-xs text-foreground/70 uppercase tracking-widest mb-1">
                                                        {stat.label}
                                                    </div>
                                                    <div className="text-lg font-mono font-bold text-foreground">
                                                        {stat.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-8">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={mode}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-8"
                                                >
                                                    {selectedStudy.study.details[mode].map((section, sIdx) => (
                                                        <div key={sIdx} className="space-y-3">
                                                            <h3 className={cn(
                                                                "text-lg font-bold uppercase tracking-wide",
                                                                mode === 'engineer' ? "font-mono text-green-600" :
                                                                    mode === 'strategist' ? "font-sans text-indigo-700" : "font-display text-blue-900"
                                                            )}>
                                                                {mode === 'engineer' ? `> ${section.heading}` : section.heading}
                                                            </h3>
                                                            <div className="text-foreground/80 leading-relaxed font-serif">
                                                                <RichText content={section.body} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* --- FULL STAR REPORT VIEW --- */
                                    <motion.div
                                        key="star"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-12 max-w-3xl mx-auto"
                                    >
                                        <div className="prose prose-slate max-w-none">
                                            <div className="border-l-4 border-slate-300 pl-6 py-1 mb-8">
                                                <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">SITUATION</span>
                                                <div className="text-lg text-slate-800 font-serif leading-relaxed mt-2">
                                                    <RichText content={selectedStudy.study.fullReport.situation} />
                                                </div>
                                            </div>

                                            <div className="border-l-4 border-amber-300 pl-6 py-1 mb-8">
                                                <span className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">TASK</span>
                                                <div className="text-lg text-slate-800 font-serif leading-relaxed mt-2">
                                                    <RichText content={selectedStudy.study.fullReport.task} />
                                                </div>
                                            </div>

                                            <div className="border-l-4 border-blue-400 pl-6 py-1 mb-8">
                                                <span className="text-xs font-bold font-mono text-blue-600 uppercase tracking-widest">ACTION</span>
                                                <div className="text-lg text-slate-800 font-serif leading-relaxed mt-2">
                                                    <RichText content={selectedStudy.study.fullReport.action} />
                                                </div>
                                            </div>

                                            <div className="border-l-4 border-emerald-400 pl-6 py-1 mb-8 bg-emerald-50/50 -mr-6 pr-6 rounded-r-lg">
                                                <span className="text-xs font-bold font-mono text-emerald-600 uppercase tracking-widest">RESULT</span>
                                                <div className="text-lg text-foreground font-serif leading-relaxed mt-2">
                                                    <RichText content={selectedStudy.study.fullReport.result} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            </div>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >
        </section >
    );
};

// Helper for markdown parsing (Bold and Bullets)
const RichText = ({ content }: { content: string }) => {
    // 1. Handle newlines first
    const lines = content.split('\n');

    return (
        <>
            {lines.map((line, lineIdx) => {
                const cleanLine = line.trim();

                // Check if line is fully bold (Header usage)
                const isHeader = cleanLine.startsWith('**') && cleanLine.endsWith('**') && cleanLine.length > 4;

                if (isHeader) {
                    return (
                        <div key={lineIdx} className="font-bold text-foreground mt-6 mb-2">
                            {cleanLine.slice(2, -2)}
                        </div>
                    );
                }

                // Check if line is a bullet point (starts with * )
                const isBullet = cleanLine.startsWith('* ');
                const contentLine = isBullet ? cleanLine.substring(2) : line;

                // Split by bold syntax **text**
                const parts = contentLine.split(/(\*\*.*?\*\*)/g);

                const renderedParts = parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIdx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={partIdx}>{part}</span>;
                });

                if (isBullet) {
                    return (
                        <div key={lineIdx} className="flex gap-2 mb-1 pl-4">
                            <span className="text-foreground/40">•</span>
                            <span>{renderedParts}</span>
                        </div>
                    );
                }

                // Standard paragraph line - only add break if not last line and not empty
                return (
                    <span key={lineIdx} className="block min-h-[1.5em]">
                        {renderedParts}
                    </span>
                );
            })}
        </>
    );
};
