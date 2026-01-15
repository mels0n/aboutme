"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePersonaStore } from "@/shared/lib/store";
import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";
import { IconStrategy, IconExecution, IconResilience } from "./branding/ThreePillarsIcons";
import { cn } from "@/shared/lib/utils";
import { diagnosticContent } from "@/shared/data/diagnostic_content";

interface OfficeFAQModalProps {
    isOpen: boolean;
    onClose: () => void;
    view: 'definition' | 'diagnosis';
}

export const OfficeFAQModal = ({ isOpen, onClose, view }: OfficeFAQModalProps) => {
    const { mode, cycleMode } = usePersonaStore();
    const { header, values, diagnosis } = diagnosticContent;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center px-4 pt-28 pb-4 sm:px-6 md:py-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        layoutId={`faq-modal-${view}`} // distinct layout ID for different morals if needed, but shared is smoother
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn(
                            "w-full max-w-4xl max-h-[85dvh] md:max-h-[90vh] overflow-hidden bg-surface border border-border shadow-2xl relative z-10 flex flex-col rounded-lg touch-pan-y",
                        )}
                        onPanEnd={(e, info) => {
                            if (info.offset.x > 50) cycleMode('prev');
                            if (info.offset.x < -50) cycleMode('next');
                        }}
                    >
                        {/* Polymorphic Background */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            {mode === 'strategist' && <BlueprintGrid />}
                            {mode === 'executive' && <ExecutiveAbstract />}
                            {mode === 'engineer' && <TechMatrix />}
                        </div>

                        {/* Header */}
                        <div className="relative z-10 flex justify-between items-center p-6 border-b border-border bg-surface/80 backdrop-blur-sm shrink-0">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground transition-all duration-300">
                                    {view === 'definition' ? header.title : diagnosis.title}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-foreground" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="relative z-10 overflow-y-auto p-6 md:p-8 space-y-10 text-foreground/80 leading-relaxed custom-scrollbar">

                            {view === 'definition' && (
                                <>
                                    {/* Definition Content */}
                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-lg md:text-xl leading-relaxed transition-all duration-300">
                                            <span className="text-foreground/80">{header.definition.part1}</span> <span className="text-foreground font-bold">{header.definition.part2}</span>
                                        </p>
                                    </div>

                                    {/* The 6 Values */}
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {values.map((value, idx) => (
                                            <div key={idx} className="bg-surface/50 p-6 rounded-lg border border-border/50">
                                                <strong className="block text-foreground mb-2">{value.title}</strong>
                                                <p className="text-sm leading-relaxed text-foreground/80">{value.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {view === 'diagnosis' && (
                                <>
                                    {/* Diagnosis Subtitle */}
                                    <div className="space-y-4">
                                        <p className="text-base md:text-lg leading-relaxed max-w-2xl">
                                            {diagnosis.subtitle}
                                        </p>
                                    </div>

                                    {/* Triggers List */}
                                    <div className="space-y-8 text-left">
                                        <ul className="space-y-6">
                                            {diagnosis.triggers.map((trigger, idx) => (
                                                <li key={idx} className="flex gap-4 items-start bg-surface/30 p-5 rounded-lg border border-border/30">
                                                    <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                                    <div className="space-y-4 w-full">
                                                        <div>
                                                            <strong className="text-foreground block text-lg font-bold">{trigger.title}</strong>
                                                            <p className="text-sm md:text-base leading-relaxed text-foreground/70 italic">
                                                                {trigger.subtitle}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-3 pl-4 border-l-2 border-border/50">
                                                            {trigger.description.map((desc, dIdx) => (
                                                                <p key={dIdx} className="text-sm leading-relaxed">
                                                                    <strong className="text-foreground">{desc.split(':')[0]}:</strong> {desc.split(':').slice(1).join(':').trim()}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Closing */}
                                    <div className="text-left pt-8 border-t border-border/50">
                                        <p className="text-xl md:text-2xl italic text-foreground/80 mb-8">
                                            {diagnosis.closing}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

