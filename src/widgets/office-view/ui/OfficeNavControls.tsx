"use client";

import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { IconExecution, IconStrategy } from "./branding/ThreePillarsIcons";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export const OfficeNavControls = () => {
    const { mode, setMode } = usePersonaStore();

    const controls = [
        {
            id: 'executive',
            label: 'Boardroom',
            icon: Users,
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

    return (
        <div className="relative flex items-center gap-2 bg-surface/80 backdrop-blur-sm p-1 rounded-full border border-border/40 shadow-sm group">
            {controls.map((ctrl) => (
                <button
                    key={ctrl.id}
                    onClick={() => setMode(ctrl.id)}
                    aria-label={`Switch mode to ${ctrl.label}`}
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
