"use client";

import { useState } from 'react';
import { usePersonaStore } from "@/shared/lib/store";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/shared/lib/utils";
import { X, Info } from 'lucide-react';

import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";

export const OfficeAbout = () => {
    const { mode } = usePersonaStore();
    const [isOpen, setIsOpen] = useState(false);

    // Context-aware styles
    const theme = {
        executive: {
            button: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100",
            modal: "bg-surface border-border text-slate-900 border-blue-900/10",
            accent: "text-blue-700",
            border: "border-blue-100",
            bg: "bg-blue-50/50"
        },
        strategist: {
            button: "text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
            modal: "bg-surface border-border text-indigo-950 border-indigo-900/10",
            accent: "text-indigo-700",
            border: "border-indigo-100",
            bg: "bg-indigo-50/50"
        },
        engineer: {
            button: "text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
            modal: "bg-surface border-border text-zinc-900 border-emerald-900/10",
            accent: "text-emerald-700",
            border: "border-emerald-100",
            bg: "bg-emerald-50/50"
        }
    }[mode];

    // Polymorphic Content Data
    const content = {
        executive: {

            bio: (
                <>
                    <p className="font-bold text-lg mb-4">I bring engineering truth to the boardroom table.</p>
                    <p>Standard governance often fails because it looks at P&L but ignores the 'black box' of technology that drives it. I don't just advise on strategy; I stress-test it against operational reality.</p>
                    <p className="mt-4">Whether acting as a Board Advisor or Operating Partner, I am the bridge between the Investment Committee and the Server Room. I use my Computer Science background to de-risk capital deployment, ensuring that your governance structure is built on actual data, not just management optimism.</p>
                </>
            ),

            stats: [
                { label: "The Synthesis", value: "Strategy backed by Forensic Execution." },
                { label: "The Outcome", value: "Investment theses that actually survive deployment." }
            ]
        },
        strategist: {

            bio: (
                <>
                    <p className="font-bold text-lg mb-4">I apply a Computer Science mindset to Organizational Design.</p>
                    <p>Most COOs manage people. I engineer the machine that the people operate. I believe that operational incoherence is not a personnel issue; it is a systems failure.</p>
                    <p className="mt-4">As an Interim or Fractional leader, I don't just 'run' operations. I dismantle functional silos and rebuild them as efficient Value Streams. I combine the commercial focus of an MBA with the architectural rigor of an engineer to design a Target Operating Model (TOM) that scales non-linearly.</p>
                </>
            ),

            stats: [
                { label: "The Synthesis", value: "Leadership backed by Systems Engineering." },
                { label: "The Outcome", value: "Growth decoupled from Headcount." }
            ]
        },
        engineer: {

            bio: (
                <>
                    <p className="font-bold text-lg mb-4">I connect the Repository to the Revenue.</p>
                    <p>Technical debt isn't just a code issue; it's a balance sheet liability. I am the executive who can walk into the engine room, read the documentation, and translate it directly into business risk.</p>
                    <p className="mt-4">Whether leading a Due Diligence audit or fixing a stalled transformation, I ensure that 'Compliance' (EU DORA, HIPAA, GDPR) becomes an enabler of speed, not a blocker. I help engineering teams speak the language of the Board, turning technical constraints into commercial assets.</p>
                </>
            ),
            stats: [
                { label: "The Synthesis", value: "Code backed by Capital Strategy." },
                { label: "The Outcome", value: "Velocity without Velocity Drop." }
            ]
        }
    }[mode];

    return (
        <>
            {/* FAB */}
            <motion.button
                layout
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed z-40 bottom-6 right-6 px-4 py-2 rounded-full border shadow-sm backdrop-blur-sm transition-all duration-300 flex items-center gap-2",
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/20" onClick={() => setIsOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "relative w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
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

                            {/* Static Header */}
                            <div className="relative z-10 p-8 pb-6 border-b border-foreground/10 flex items-center gap-6 bg-surface/80 backdrop-blur-sm">
                                {/* Headshot */}
                                <div className={cn("w-20 h-20 rounded-full overflow-hidden border-2 bg-white", theme.border, theme.accent)}>
                                    <img
                                        src="/chris-melson-headshot.jpg"
                                        alt="Christopher Melson"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-foreground">Christopher Melson</h2>
                                    <p className="text-sm font-serif text-foreground/70 tracking-wide">Operational Architect | Executive | Board Advisor</p>
                                </div>
                            </div>

                            {/* Dynamic Body */}
                            <div className="p-8 overflow-y-auto relative z-10 flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mode}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-6 font-serif leading-relaxed"
                                    >


                                        <div className="text-foreground/90 space-y-4">
                                            {content.bio}
                                        </div>

                                        <div className="mt-8 grid gap-6">

                                            {content.stats.map((stat, idx) => (
                                                <div key={idx}>
                                                    <span className="text-xs font-bold uppercase tracking-wider opacity-60 block mb-1">{stat.label}</span>
                                                    <span className={cn("font-display font-bold text-lg", idx === 1 && theme.accent)}>
                                                        {stat.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Sticky Footer */}
                            <div className="relative z-10 p-6 border-t border-foreground/10 bg-surface/90 backdrop-blur-md text-center">
                                <p className="text-sm font-medium font-sans text-foreground">
                                    Available for Fractional & Interim Leadership, Board Appointments, and Advisory.
                                </p>
                            </div>

                        </motion.div>
                    </div >
                )}
            </AnimatePresence >
        </>
    );
};
