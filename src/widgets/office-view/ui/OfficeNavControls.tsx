"use client";

import { useEffect, useState } from "react";
import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { IconExecution, IconResilience, IconStrategy } from "./branding/ThreePillarsIcons";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const OfficeNavControls = () => {
    const { mode, setMode } = usePersonaStore();
    const [showHint, setShowHint] = useState(false);

    const controls = [
        {
            id: 'executive',
            label: 'Boardroom',
            icon: IconResilience,
            activeClass: "text-blue-700 bg-blue-50 border-blue-200"
        },
        {
            id: 'strategist',
            label: 'Architect',
            icon: IconStrategy,
            activeClass: "text-indigo-900 bg-indigo-50 border-indigo-200"
        },
        {
            id: 'engineer',
            label: 'Engine Room',
            icon: IconExecution,
            activeClass: "text-emerald-800 bg-emerald-50 border-emerald-200"
        }
    ] as const;

    useEffect(() => {
        const hasPlayed = sessionStorage.getItem("office_intro_played");

        if (!hasPlayed) {
            const runIntro = async () => {
                // Initial delay
                await new Promise(r => setTimeout(r, 1000));

                setMode('strategist');
                await new Promise(r => setTimeout(r, 800));

                setMode('engineer');
                await new Promise(r => setTimeout(r, 800));

                setMode('executive');
                sessionStorage.setItem("office_intro_played", "true");

                // Show hint after sequence
                setTimeout(() => setShowHint(true), 500);
            };
            runIntro();
        } else {
            // Already played, just show hint
            setShowHint(true);
        }
    }, []); // Run once on mount



    return (
        <div className="relative flex items-center gap-2 bg-surface/80 backdrop-blur-sm p-1 rounded-full border border-border/40 shadow-sm group">
            {/* Hint Arrow (Left Side) */}
            <AnimatePresence mode="wait">
                {showHint && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-full mr-4 flex items-center gap-2 pointer-events-none z-50 whitespace-nowrap"
                    >
                        <span className="text-xs font-sans font-bold text-foreground/80 tracking-widest hidden md:inline-block uppercase">
                            Operating Mode
                        </span>
                        <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatDelay: 1 }}
                        >
                            <ArrowRight className="w-5 h-5 text-foreground stroke-[3px]" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {controls.map((ctrl) => (
                <button
                    key={ctrl.id}
                    onClick={() => setMode(ctrl.id)}
                    className={cn(
                        "relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-300 border border-transparent",
                        mode === ctrl.id
                            ? cn("font-bold shadow-sm", ctrl.activeClass)
                            : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                    )}
                >
                    <ctrl.icon className={cn(
                        "w-4 h-4",
                        mode === ctrl.id ? "opacity-100" : "opacity-60"
                    )} />
                    <span className="hidden md:inline-block leading-none pb-px">
                        {ctrl.label}
                    </span>

                    {mode === ctrl.id && (
                        <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-full border border-current opacity-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};
