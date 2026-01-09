"use client";

import { useEffect, useState } from "react";
import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export const ViewToggle = () => {
    const { viewMode, setViewMode } = usePersonaStore();

    return (
        <div className="relative flex items-center bg-muted/20 rounded-full p-0.5 border border-border/60">
            <button
                onClick={() => setViewMode('OFFICE')}
                className={cn(
                    "relative z-10 px-4 py-1 text-xs font-medium tracking-wide transition-colors duration-300",
                    viewMode === 'OFFICE' ? "text-background" : "text-foreground/50 hover:text-foreground"
                )}
            >
                The Office
            </button>
            <button
                onClick={() => setViewMode('LAB')}
                className={cn(
                    "relative z-10 px-4 py-1 text-xs font-medium tracking-wide transition-colors duration-300",
                    viewMode === 'LAB' ? "text-background" : "text-foreground/50 hover:text-foreground"
                )}
            >
                The Lab
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
