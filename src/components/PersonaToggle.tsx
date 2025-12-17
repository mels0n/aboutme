"use client";

import { usePersonaStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Briefcase, Sword, Terminal } from "lucide-react";

/**
 * A floating control toggle that allows the user to switch between application personas
 * (Executive, Strategist, Engineer).
 * 
 * Uses Framer Motion for the sliding pill animation.
 */
export function PersonaToggle() {
    // Access global persona state
    const { mode, setMode } = usePersonaStore();

    // Configuration for the available toggle options
    const options = [
        { id: "executive", label: "Executive", icon: Briefcase },
        { id: "strategist", label: "Strategist", icon: Sword },
        { id: "engineer", label: "Engineer", icon: Terminal },
    ] as const;

    return (
        <div className="relative flex items-center bg-surface/95 backdrop-blur-md p-1 rounded-lg border border-border w-fit shadow-xl z-50">
            {options.map((opt) => {
                const isActive = mode === opt.id;
                return (
                    <button
                        key={opt.id}
                        onClick={() => setMode(opt.id)}
                        className={cn(
                            "relative px-4 py-2 sm:px-6 sm:py-3 rounded-md text-sm font-semibold transition-colors z-10 flex items-center gap-2",
                            isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-background shadow-sm rounded-md border border-border"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <opt.icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10 hidden sm:inline">{opt.label}</span>
                    </button>
                )
            })}
        </div>
    );
}
