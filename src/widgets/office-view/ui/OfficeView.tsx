"use client";

import { OfficeHero } from "./OfficeHero";
import { CaseStudiesGrid } from "./CaseStudiesGrid";
import { OfficeBlogGrid } from "./OfficeBlogGrid"; // Added import
import { OfficeExperience } from "./OfficeExperience";
import { motion, AnimatePresence } from "framer-motion";
import { usePersonaStore } from "@/shared/lib/store";
import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";
import { cn } from "@/shared/lib/utils";
import { OfficeAbout } from "./OfficeAbout";
import { Footer } from "@/widgets/shared/Footer";

interface OfficeViewProps {
    mode?: 'executive' | 'strategist' | 'engineer';
}

export const OfficeView = ({ mode: propMode }: OfficeViewProps) => {
    const { mode: storeMode, introDismissed } = usePersonaStore();
    const mode = propMode || storeMode;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="office-view"
                initial={{ opacity: 0 }}
                animate={introDismissed ? { opacity: 1 } : { opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className={cn(
                    "w-full min-h-screen pt-32 pb-20 px-6 transition-colors duration-700 ease-in-out relative",
                    // Executive Mode (Default)
                    mode === 'executive' && "bg-slate-50 text-slate-900 font-sans",
                    // Strategist Mode
                    mode === 'strategist' && "bg-[#F0F4F8] text-indigo-950 font-sans", // Light Indigo/Paper tint
                    // Engineer Mode
                    mode === 'engineer' && "bg-[#F4F4F5] text-zinc-900 font-mono" // Light Zinc tint
                )}
            >
                {/* Global Background Patterns */}
                <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700">
                    {/* Executive Pattern */}
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-700 text-slate-900", // Ensure color prop creates contrast
                        mode === 'executive' ? "opacity-10" : "opacity-0"
                    )}>
                        <ExecutiveAbstract />
                    </div>

                    {/* Strategist Pattern */}
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-700 text-indigo-400", // Increased contrast color
                        mode === 'strategist' ? "opacity-15" : "opacity-0" // Adjusted opacity
                    )}>
                        <BlueprintGrid />
                    </div>

                    {/* Engineer Pattern */}
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-700 text-zinc-400", // Increased contrast color
                        mode === 'engineer' ? "opacity-15" : "opacity-0" // Adjusted opacity
                    )}>
                        <TechMatrix />
                    </div>
                </div>

                {/* Content Wrapper */}
                <div className={cn(
                    "relative z-10",
                    // Font Switching
                    mode === 'executive' && "[&_h1]:font-serif [&_h2]:font-sans",
                    mode === 'strategist' && "[&_h1]:font-sans [&_h2]:font-sans",
                    mode === 'engineer' && "font-mono"
                )}>
                    <OfficeHero mode={mode} />
                    <CaseStudiesGrid mode={mode} />
                    <OfficeBlogGrid mode={mode} />
                    <OfficeExperience />
                    <OfficeAbout mode={mode} />
                    <Footer />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
