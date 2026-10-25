"use client";

import { useEffect, useRef, useState } from "react";
import { usePersonaStore } from "@/shared/lib/store";
import { PersonaToggle } from "@/shared/ui/PersonaToggle";
import { ViewToggle } from "@/shared/ui/ViewToggle";
import { motion, AnimatePresence } from "framer-motion";
import { LabView } from "@/widgets/lab-view/ui/LabView";
import { OfficeView } from "@/widgets/office-view/ui/OfficeView";
import { OfficeNavControls } from "@/widgets/office-view/ui/OfficeNavControls";
import { GatekeeperModal } from "@/widgets/gatekeeper/ui/GatekeeperModal";
import { ModeTransitionGlitch } from "@/shared/ui/ModeTransitionGlitch";

import { ChevronsRight, HelpCircle, RefreshCw } from "lucide-react";



interface HomeClientProps {
    initialMode?: 'executive' | 'strategist' | 'engineer';
    initialView?: 'OFFICE' | 'LAB';
}

// No Suspense boundary: nothing here reads search params during render, so
// the full page is in the server HTML rather than a loading skeleton.
export function HomeClient({ initialMode, initialView }: HomeClientProps) {
    const { mode, cycleMode, viewMode, setMode, setViewMode, introOpen, setIntroOpen } = usePersonaStore();
    const [hasHydrated, setHasHydrated] = useState(false);
    const introTrigger = useRef<HTMLButtonElement>(null);
    const introWasOpen = useRef(false);

    // Leaving the page with the explainer open must not re-open it on return.
    // The reset lives here, not in the modal: React StrictMode (on in dev)
    // runs a mounted component's effect cleanup once, which would close the
    // modal right after it opened. Here that rehearsal runs at page mount,
    // while the explainer is still closed.
    useEffect(() => () => setIntroOpen(false), [setIntroOpen]);

    // Return focus to the "How this site works" button when the explainer closes.
    useEffect(() => {
        if (introWasOpen.current && !introOpen) introTrigger.current?.focus();
        introWasOpen.current = introOpen;
    }, [introOpen]);

    // Initialize state from props (Server-Side SEO / Direct Link)
    useEffect(() => {
        if (initialMode) setMode(initialMode);
        if (initialView) setViewMode(initialView);
        setHasHydrated(true);
    }, [initialMode, initialView, setMode, setViewMode]);

    // Sync theme whenever mode changes and handle Deep Linking
    // 1. Deep Linking: Sync URL -> Store
    // Only run when searchParams change (navigation), not when internal mode changes.

    // Sync theme whenever mode changes and handle Deep Linking
    // 1. Deep Linking: Sync URL -> Store
    // Removed legacy ?mode= param listener. State is initialized via initialMode prop from server.

    // Constraint Violation Fix: Lab View must strictly adhere to root '/' URL.
    useEffect(() => {
        if (viewMode === 'LAB' && typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (url.searchParams.has('mode')) {
                url.searchParams.delete('mode');
                window.history.replaceState({}, '', url.pathname + url.search);
            }
        }
    }, [viewMode]);

    // Theming: Enforce 'executive' for Office consistency; dynamic for others.
    useEffect(() => {
        if (viewMode === 'OFFICE') {
            document.documentElement.setAttribute("data-theme", 'executive');
        } else {
            document.documentElement.setAttribute("data-theme", mode);
        }
    }, [mode, viewMode]);

    const resolvedMode = (initialMode && !hasHydrated) ? initialMode : mode;

    return (
        <motion.main
            className="min-h-screen transition-colors duration-500 overflow-x-hidden touch-pan-y"
            onPanEnd={(e, info) => {
                // Disable swipe on desktop (md breakpoint is 768px)
                if (typeof window !== 'undefined' && window.innerWidth >= 768) return;

                // Explicitly ignore mouse events (only allow touch swipes)
                // This prevents "swiping" with a mouse on smaller window sizes or hybrid devices
                if ((e as PointerEvent).pointerType === 'mouse') return;

                // Cycle modes on swipe (Global)
                if (info.offset.x > 50) cycleMode('prev');
                if (info.offset.x < -50) cycleMode('next');
            }}
        >
            <AnimatePresence mode="wait">
                {hasHydrated && introOpen && <GatekeeperModal />}
            </AnimatePresence>
            {/* Mounted only after the URL and stored lens are applied, so the
                initial mode sync is not mistaken for a lens switch. */}
            {hasHydrated && <ModeTransitionGlitch />}

            {/* --- Sticky Header / Toggle --- */}
            <nav className="fixed top-0 left-0 w-full z-50 py-4 px-6 backdrop-blur-md bg-background/80 border-b border-border/50 flex items-center justify-between gap-4">

                {/* Left Side: "How this site works" opens the explainer modal on request */}
                <div className="md:flex-1 flex items-center">
                    <button
                        ref={introTrigger}
                        type="button"
                        onClick={() => setIntroOpen(true)}
                        className="inline-flex items-center gap-2 min-h-11 min-w-11 lg:min-w-0 -ml-3 px-3 rounded-md text-xs font-sans text-foreground/60 hover:text-foreground transition-colors"
                        aria-haspopup="dialog"
                    >
                        <HelpCircle className="w-4 h-4" aria-hidden="true" />
                        <span className="sr-only lg:not-sr-only">How this site works</span>
                    </button>
                </div>

                {/* Center: Controls (Office or Lab) */}
                {/* On Mobile: It flows naturally. On Desktop: Absolute center. */}
                <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex justify-center items-center">
                    {/* initial={false}: visible in the first paint; switching views still animates */}
                    <AnimatePresence mode="wait" initial={false}>
                        {viewMode === 'OFFICE' ? (
                            <motion.div
                                key="office-nav"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <OfficeNavControls />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="lab-nav"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
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
            <AnimatePresence mode="wait" initial={false}>
                {viewMode === 'OFFICE' ? (
                    <OfficeView key="office" mode={resolvedMode} />
                ) : (
                    <LabView key="lab" />
                )}
            </AnimatePresence>

        </motion.main>
    );
}
