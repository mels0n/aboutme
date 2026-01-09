"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePersonaStore } from "@/shared/lib/store";
import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";
import { IconStrategy, IconExecution, IconResilience } from "./branding/ThreePillarsIcons";
import { cn } from "@/shared/lib/utils";

interface OfficeFAQModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OfficeFAQModal = ({ isOpen, onClose }: OfficeFAQModalProps) => {
    const { mode, cycleMode } = usePersonaStore();

    const fontModeClass = mode === 'executive' ? "font-serif" :
        mode === 'strategist' ? "font-sans" : "font-mono";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
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
                        layoutId="faq-modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn(
                            "w-full max-w-4xl max-h-[90vh] overflow-hidden bg-surface border border-border shadow-2xl relative z-10 flex flex-col rounded-lg touch-pan-y",
                            fontModeClass // Apply font globally to the card
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
                                    What is an Operational Architect?
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

                            {/* Definition */}
                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg md:text-xl leading-relaxed transition-all duration-300">
                                    <span className="text-foreground/80">The era of the "Generalist Operations Executive", who simply keeps the lights on, is over.</span> <span className="text-foreground font-bold">An Operational Architect does not just run the machine; I design the underlying systems that create resilience.</span>
                                </p>
                            </div>

                            {/* The 6 Values */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-surface/50 p-6 rounded-lg border border-border/50">
                                    <strong className="block text-foreground mb-2">1. Financial Translation</strong>
                                    <p className="text-sm leading-relaxed text-foreground/80">Translating technical debt into P&L risk and EBITDA impact to align engineering reality with board expectations.</p>
                                </div>
                                <div className="bg-surface/50 p-6 rounded-lg border border-border/50">
                                    <strong className="block text-foreground mb-2">2. Technical Due Diligence</strong>
                                    <p className="text-sm leading-relaxed text-foreground/80">Conducting forensic TDD to expose "spaghetti code" and security vulnerabilities before they destroy value.</p>
                                </div>
                                <div className="bg-surface/50 p-6 rounded-lg border border-border/50">
                                    <strong className="block text-foreground mb-2">3. Value Orchestration</strong>
                                    <p className="text-sm leading-relaxed text-foreground/80">Orchestrating value streams to ensure stability and continuity during high-stakes transformation.</p>
                                </div>
                                <div className="bg-surface/50 p-6 rounded-lg border border-border/50">
                                    <strong className="block text-foreground mb-2">4. Regulatory Safeguarding</strong>
                                    <p className="text-sm leading-relaxed text-foreground/80">Embedding rigid compliance standards (EU DORA, GDPR) into workflows to immunize the organization against regulatory risk.</p>
                                </div>
                                <div className="bg-surface/50 p-6 rounded-lg border border-border/50">
                                    <strong className="block text-foreground mb-2">5. Intelligence Unification</strong>
                                    <p className="text-sm leading-relaxed text-foreground/80">Eliminating "Data Blind Spots" by migrating fragmented communication into a centralized Enterprise Stack.</p>
                                </div>
                                <div className="bg-surface/50 p-6 rounded-lg border border-border/50">
                                    <strong className="block text-foreground mb-2">6. Cultural Restoration</strong>
                                    <p className="text-sm leading-relaxed text-foreground/80">Diagnosing and dismantling toxic "Shadow Cultures" to reverse high attrition and rebuild leadership density.</p>
                                </div>
                            </div>

                            <div className="h-px bg-border/50 w-full" />

                            {/* Diagnosis */}
                            <div className="space-y-8 text-left">
                                <div className="space-y-4">
                                    <h3 className="text-xl md:text-2xl font-bold text-foreground">Do You Need One?</h3>
                                    <p className="text-base md:text-lg leading-relaxed max-w-2xl">
                                        Strategy is cheap. Execution is expensive. You need an Operational Architect when your vision outpaces your operational reality.
                                    </p>
                                </div>

                                <ul className="space-y-6">
                                    <li className="flex gap-4 items-start bg-surface/30 p-5 rounded-lg border border-border/30">
                                        <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                        <div className="space-y-4 w-full">
                                            <div>
                                                <strong className="text-foreground block text-lg font-bold">1. You are Post-Merger (The Integration Trap)</strong>
                                                <p className="text-sm md:text-base leading-relaxed text-foreground/70 italic">
                                                    You acquired a competitor for their market share, but you inherited their debt.
                                                </p>
                                            </div>
                                            <div className="space-y-3 pl-4 border-l-2 border-border/50">
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">The Tech Mismatch:</strong> Their "proprietary tech" is actually a siloed spaghetti of legacy code that refuses to talk to your centralized Enterprise Stack.</p>
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">The Culture Clash:</strong> The "One Company" memo went out, but the reality is "Us vs. Them." Attrition is spiking because high-performers are fleeing a toxic, unmanaged environment.</p>
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">The Data Blackout:</strong> You cannot see the fire through the smoke. You are relying on localized spreadsheets rather than a unified dashboard to make P&L decisions.</p>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex gap-4 items-start bg-surface/30 p-5 rounded-lg border border-border/30">
                                        <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                        <div className="space-y-4 w-full">
                                            <div>
                                                <strong className="text-foreground block text-lg font-bold">2. You are Scaling (The Growth Paradox)</strong>
                                                <p className="text-sm md:text-base leading-relaxed text-foreground/70 italic">
                                                    You are investing millions in "Digital Transformation," but your velocity is slowing down.
                                                </p>
                                            </div>
                                            <div className="space-y-3 pl-4 border-l-2 border-border/50">
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">Bureaucracy as a Service:</strong> Your rigid operating model now requires 14 signatures to deploy a single line of code, paralyzing your engineers.</p>
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">Process Fracture:</strong> Workflows that worked for 50 people are breaking at 500. You are throwing bodies at problems that require automation.</p>
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">The "Shadow Ops" Risk:</strong> Your teams are bypassing IT to get things done using personal WhatsApps or unsecured tools to handle sensitive client data because the official tools are too slow.</p>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex gap-4 items-start bg-surface/30 p-5 rounded-lg border border-border/30">
                                        <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                        <div className="space-y-4 w-full">
                                            <div>
                                                <strong className="text-foreground block text-lg font-bold">3. You are Flying Blind (The Strategic Disconnect)</strong>
                                                <p className="text-sm md:text-base leading-relaxed text-foreground/70 italic">
                                                    You lack a Target Operating Model (TOM) and rely on functional silos rather than cross-functional value streams.
                                                </p>
                                            </div>
                                            <div className="space-y-3 pl-4 border-l-2 border-border/50">
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">The "Feelings" Metric:</strong> Your decisions are based on loud opinions and anecdotes rather than forensic data. You measure "activity" (emails sent) rather than "outcomes" (resolution time).</p>
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">Siloed Intelligence:</strong> Sales is selling a vision that Operations cannot deliver, and Support is fixing products that Engineering thinks are perfect.</p>
                                                <p className="text-sm leading-relaxed"><strong className="text-foreground">Regulatory Exposure:</strong> You are scaling into regulated markets (DORA, GDPR) but your compliance strategy is a checkbox, not an architectural safeguard.</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Closing */}
                            <div className="text-left pt-8 border-t border-border/50">
                                <p className="text-xl md:text-2xl italic text-foreground/80 mb-8">
                                    "Operational incoherence isn't just a people problem it is a design flaw. I fix the blueprint."
                                </p>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

