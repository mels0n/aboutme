"use client";

import { useState, useEffect } from 'react';
import { usePersonaStore } from "@/shared/lib/store";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/shared/lib/utils";
import { sendEvent } from '@/shared/lib/analytics';
import { X, ArrowUpRight } from 'lucide-react';
import { MANIFESTO_CONTENT } from "@/shared/data/lab-content";
import Link from 'next/link';
import { TrustBadge } from "@/shared/ui/TrustBadge";

/**
 * # Persona Explanation Feature
 * 
 * ## Overview
 * This component renders a context-aware "About" button fixed to the top-right of the viewport.
 * It serves as a meta-layer to explain the "Tri-modal" persona concept of the portfolio.
 * 
 * ## Architecture
 * - **Layer**: Feature (Business logic + UI specific to the "Persona" domain)
 * - **State**: Consumes global `usePersonaStore` to determine the active theme (Executive, Strategist, Engine Room).
 * - **UI Pattern**: Modal Overlay with backdrop blur.
 * 
 * ## Design System Integration
 * The component dynamically switches its Tailwind classes based on the `mode` state:
 * - `Executive`: Corporate blue, Serif type.
 * - `Strategist`: Emerald green, Italic Serif (Game/Fantasy feel).
 * - `Engine Room`: Monospace terminal green, High contrast.
 * 
 * @returns {JSX.Element} The floating action button and its associated modal portal.
 */
export function PersonaExplanation() {
    const { mode } = usePersonaStore();
    const [isOpen, setIsOpen] = useState(false);

    // --- Configuration ---
    const buttonText = MANIFESTO_CONTENT.buttonText[mode];
    const explanationText = MANIFESTO_CONTENT.explanations[mode];

    /**
     * Theming configuration for the component.
     */
    const styles = {
        executive: {
            // Clean, corporate, serif
            button: "font-serif text-blue-800 bg-white/50 border-blue-200 hover:bg-blue-50 shadow-sm",
            modal: "font-serif border-blue-100 bg-white text-slate-800 shadow-xl",
            text: "text-slate-700",
            close: "text-slate-400 hover:text-blue-600",
            headerBadge: "bg-blue-50 text-blue-900",
            toggleActive: "border-blue-600 text-blue-800 font-bold",
            toggleInactive: "border-transparent text-slate-500 hover:text-slate-800",
        },
        strategist: {
            // Game UI, mystic, italic serif
            button: "font-serif italic text-emerald-900 bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100/50 shadow-sm",
            modal: "font-serif italic bg-[#fdfbf7] text-emerald-900 border-emerald-700/30 shadow-2xl", // Warm paper tone
            text: "text-emerald-950",
            close: "text-emerald-700/50 hover:text-emerald-900",
            headerBadge: "bg-emerald-100 text-emerald-900",
            toggleActive: "border-emerald-600 text-emerald-900 font-bold",
            toggleInactive: "border-transparent text-emerald-900/50 hover:text-emerald-900",
        },
        engineer: {
            // Terminal, high contrast, mono
            button: "font-mono text-green-400 bg-black/50 border-green-500/50 hover:bg-green-900/20 shadow-md",
            modal: "font-mono bg-black/95 text-green-400 border-green-500 shadow-green-900/20 shadow-2xl",
            text: "text-green-300",
            close: "text-green-500/50 hover:text-green-400",
            headerBadge: "bg-green-900/20 text-green-400",
            toggleActive: "border-green-500 text-green-400 font-bold",
            toggleInactive: "border-transparent text-green-500/50 hover:text-green-400",
        }
    }[mode];

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <>
            {/* 
              Position strategy: Fixed to viewport. 
              Z-Index: 60 (Below modal backdrop but above standard sticky headers).
            */}
            <motion.button
                layout
                onClick={() => {
                    setIsOpen(true);
                    sendEvent('manifesto_opened', { context: mode });
                }}
                className={cn(
                    "fixed z-[60] px-4 py-2 border rounded-md transition-all duration-300 backdrop-blur-md text-sm md:text-base cursor-pointer",
                    // Position: Fixed Bottom-Right (Standard FAB)
                    "bottom-4 right-4",
                    styles.button
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}

                // Analytics & State
                data-active-lens={mode}
                id="polymorphic-identity-resolver"

                // Accessibility
                aria-label="View Portfolio Concept and Manifesto"
                title="Read the design philosophy behind this portfolio"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls="persona-explanation-modal"
            >
                {buttonText}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-background/30"
                        onClick={() => setIsOpen(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-describedby="persona-modal-desc"
                        id="persona-explanation-modal"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "relative w-full max-w-lg rounded-lg border overflow-hidden flex flex-col",
                                styles.modal
                            )}
                        >
                            {/* Header */}
                            <div className={cn(
                                "flex items-center justify-between p-6 border-b",
                                mode === 'engineer' ? "border-green-500/30" : "border-slate-200/50"
                            )}>
                                <div className="flex items-center gap-3">
                                    <TrustBadge label={`Persona: ${mode}`} />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={cn("transition-colors", styles.close)}
                                    aria-label="Close"
                                    autoFocus
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* View Toggle Bar */}
                            <div className={cn(
                                "px-6 py-3 flex gap-4 text-sm font-medium border-b",
                                mode === 'engineer' ? "border-green-500/30 bg-green-900/10" : "border-slate-200/50 bg-slate-50/50"
                            )}>
                                <button
                                    className={cn(
                                        "pb-1 border-b-2 transition-colors cursor-default",
                                        styles.toggleActive
                                    )}
                                >
                                    Persona Context
                                </button>
                                <Link
                                    href="/about"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "pb-1 border-b-2 transition-all flex items-center gap-2",
                                        styles.toggleInactive
                                    )}
                                >
                                    Full Biography
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* Content */}
                            <div className={cn("p-8 text-lg leading-relaxed", styles.text)} id="persona-modal-desc">
                                <p className="mb-4">
                                    {MANIFESTO_CONTENT.intro}
                                </p>
                                <p>
                                    {explanationText}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                )}
            </AnimatePresence >
        </>
    );
}
