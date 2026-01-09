"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePersonaStore } from "@/shared/lib/store";
import { PersonaToggle } from "@/shared/ui/PersonaToggle";
import { ViewToggle } from "@/shared/ui/ViewToggle";
import { motion, AnimatePresence } from "framer-motion";
import { LabView } from "@/widgets/lab-view/ui/LabView";
import { OfficeView } from "@/widgets/office-view/ui/OfficeView";
import { OfficeNavControls } from "@/widgets/office-view/ui/OfficeNavControls";
import { GatekeeperModal } from "@/widgets/gatekeeper/ui/GatekeeperModal"; // Adjust path if needed
import { ModeTransitionGlitch } from "@/shared/ui/ModeTransitionGlitch";

import { ChevronsRight, RefreshCw } from "lucide-react";

export function HomeClient() {
    return (
        <Suspense fallback={null}>
            <HomeContent />
        </Suspense>
    );
}

function HomeContent() {
    const searchParams = useSearchParams();
    const { mode, cycleMode, viewMode, setMode, introDismissed } = usePersonaStore();

    // Sync theme whenever mode changes and handle Deep Linking
    useEffect(() => {
        // Deep Linking for Mode
        const modeParam = searchParams.get('mode');
        if (modeParam && ['executive', 'strategist', 'engineer'].includes(modeParam)) {
            setMode(modeParam as 'executive' | 'strategist' | 'engineer');
        }

        // In OFFICE mode, we force 'executive' theme for a professional consistent look,
        // unless we strictly want to support thematic buttons.
        // The buttons in OfficeView use explicit colors (blue, emerald, indigo)
        // so 'executive' theme (likely blue/white/neutral) is the safest base.
        if (viewMode === 'OFFICE') {
            document.documentElement.setAttribute("data-theme", 'executive');
        } else {
            document.documentElement.setAttribute("data-theme", mode);
        }
    }, [mode, viewMode, searchParams, setMode]);

    return (
        <motion.main
            className="min-h-screen transition-colors duration-500 overflow-x-hidden touch-pan-y"
            onPanEnd={(e, info) => {
                // Disable swipe on desktop (md breakpoint is 768px)
                if (typeof window !== 'undefined' && window.innerWidth >= 768) return;

                // Cycle modes on swipe (Global)
                if (info.offset.x > 50) cycleMode('prev');
                if (info.offset.x < -50) cycleMode('next');
            }}
        >
            <AnimatePresence mode="wait">
                {!introDismissed && <GatekeeperModal />}
            </AnimatePresence>
            {introDismissed && <ModeTransitionGlitch />}

            {/* --- Sticky Header / Toggle --- */}
            <nav className="fixed top-0 left-0 w-full z-50 py-4 px-6 backdrop-blur-md bg-background/80 border-b border-border/50 flex items-center justify-between gap-4">

                {/* Left Side: Empty Spacer (Hidden on mobile to save space, present on desktop for balance if needed) */}
                <div className="hidden md:block flex-1" />

                {/* Center: Controls (Office or Lab) */}
                {/* On Mobile: It flows naturally. On Desktop: Absolute center. */}
                <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex justify-center items-center">
                    <AnimatePresence mode="wait">
                        {viewMode === 'OFFICE' ? (
                            <motion.div
                                key="office-nav"
                                initial={{ opacity: 0, y: -10 }}
                                animate={introDismissed ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <OfficeNavControls />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="lab-nav"
                                initial={{ opacity: 0, y: 10 }}
                                animate={introDismissed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-4"
                            >
                                <div className="hidden lg:flex items-center">
                                    {mode === 'executive' && (
                                        <div className="flex items-center gap-1 text-blue-600 font-bold uppercase tracking-wider text-sm mr-4">
                                            <span>Drill Down</span>
                                            <ChevronsRight className="w-5 h-5" />
                                        </div>
                                    )}
                                    {mode === 'strategist' && (
                                        <div className="flex items-center gap-1 text-emerald-700 font-serif font-bold italic text-lg mr-4">
                                            <span>Reroll</span>
                                            <RefreshCw className="w-5 h-5 ml-1" />
                                        </div>
                                    )}
                                    {mode === 'engineer' && (
                                        <div className="flex items-center gap-2 text-green-500 font-mono text-lg mr-4">
                                            <span>sudo</span>
                                            <span className="font-bold text-xl">&gt;</span>
                                        </div>
                                    )}
                                </div>
                                <PersonaToggle />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side: View Toggle */}
                <div className="flex-shrink-0 flex justify-end">
                    <ViewToggle />
                </div>
            </nav>

            {/* --- Main Content Area --- */}
            <AnimatePresence mode="wait">
                {viewMode === 'OFFICE' ? (
                    <OfficeView key="office" />
                ) : (
                    <LabView key="lab" />
                )}
            </AnimatePresence>

        </motion.main>
    );
}
