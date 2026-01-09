"use client";

import { useEffect, useState } from "react";
import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FlaskConical } from "lucide-react";

export const ViewToggle = () => {
    const { viewMode, setViewMode } = usePersonaStore();

    return (
        <div className="relative flex items-center bg-muted/20 rounded-full p-0.5 border border-border/60">
            <button
                onClick={() => setViewMode('OFFICE')}
                aria-label="The Office"
                className={cn(
                    "relative z-10 px-3 py-1.5 sm:px-4 sm:py-1 text-xs font-medium tracking-wide transition-colors duration-300 flex items-center justify-center",
                    viewMode === 'OFFICE' ? "text-background" : "text-foreground/70 hover:text-foreground"
                )}
            >
                <span className="hidden sm:block">The Office</span>
                <Briefcase className="w-4 h-4 sm:hidden" />
            </button>
            <button
                onClick={() => setViewMode('LAB')}
                aria-label="The Lab"
                className={cn(
                    "relative z-10 px-3 py-1.5 sm:px-4 sm:py-1 text-xs font-medium tracking-wide transition-colors duration-300 flex items-center justify-center",
                    viewMode === 'LAB' ? "text-background" : "text-foreground/70 hover:text-foreground"
                )}
            >
                <span className="hidden sm:block">The Lab</span>
                <FlaskConical className="w-4 h-4 sm:hidden" />
            </button>
            <motion.div
                className="absolute top-0.5 bottom-0.5 bg-foreground/80 rounded-full shadow-sm"
                initial={false}
                animate={{
                    left: viewMode === 'OFFICE' ? '2px' : '50%',
                    right: viewMode === 'OFFICE' ? '50%' : '2px',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    width: "calc(50% - 2px)"
                }}
            />
        </div>
    );
};
