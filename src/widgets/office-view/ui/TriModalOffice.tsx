"use client";

import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { IconExecution, IconResilience, IconStrategy } from "./branding/ThreePillarsIcons";

export const TriModalOffice = () => {
    const { mode, setMode } = usePersonaStore();

    const buttons = [
        {
            id: 'executive',
            label: 'Boardroom',
            sub: 'ROI • Risk • EBITDA',
            icon: IconResilience,
            activeClass: "bg-blue-600 text-white border-blue-600"
        },
        {
            id: 'strategist',
            label: 'Architect',
            sub: 'TOM • Process • Governance',
            icon: IconStrategy,
            activeClass: "bg-emerald-700 text-white border-emerald-700"
        },
        {
            id: 'engineer',
            label: 'Engine Room',
            sub: 'Tech Stack • API • Security',
            icon: IconExecution,
            activeClass: "bg-indigo-600 text-white border-indigo-600"
        }
    ] as const;

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full max-w-4xl mx-auto mb-16">
            {buttons.map((btn) => (
                <button
                    key={btn.id}
                    onClick={() => setMode(btn.id)}
                    className={cn(
                        "group relative w-full md:w-1/3 p-6 text-left border transition-all duration-300",
                        mode === btn.id
                            ? btn.activeClass
                            : "bg-surface border-border hover:border-foreground/30 text-foreground/60 hover:text-foreground"
                    )}
                >
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono uppercase tracking-widest opacity-70">
                                Mode 0{buttons.indexOf(btn) + 1}
                            </span>
                            <btn.icon className={cn(
                                "w-6 h-6",
                                mode === btn.id ? "opacity-100" : "opacity-40"
                            )} />
                        </div>

                        <span className="text-2xl font-bold font-display">
                            {btn.label}
                        </span>
                        <span className="text-xs opacity-80 font-sans mt-2">
                            {btn.sub}
                        </span>
                    </div>
                    {mode === btn.id && (
                        <motion.div
                            layoutId="active-glow"
                            className="absolute inset-0 bg-white/5 pointer-events-none"
                        />
                    )}
                </button>
            ))}
        </div>
    );
};
