"use client";

import { useEffect, useState, useRef } from "react";
import { usePersonaStore } from "@/shared/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export const ModeTransitionGlitch = () => {
    const { mode } = usePersonaStore();
    const [isActive, setIsActive] = useState(false);
    const prevMode = useRef(mode);

    useEffect(() => {
        // Trigger glitch only when mode changes
        if (prevMode.current !== mode) {
            setIsActive(true);
            prevMode.current = mode;

            // Reset after animation
            const timer = setTimeout(() => setIsActive(false), 500);
            return () => clearTimeout(timer);
        }
    }, [mode]);

    // Random slice positions for the glitch effect
    const slice1 = Math.floor(Math.random() * 20 + 10) + "%";
    const slice2 = Math.floor(Math.random() * 20 + 40) + "%";
    const slice3 = Math.floor(Math.random() * 20 + 70) + "%";

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] pointer-events-none"
                    aria-hidden="true"
                >
                    {/* Visual Noise Layer */}
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse" />

                    {/* Chromatic Aberration / Flash */}
                    {mode === 'executive' && (
                        <div className="absolute inset-0 bg-blue-500/30 mix-blend-hard-light" />
                    )}
                    {mode === 'strategist' && (
                        <div className="absolute inset-0 bg-indigo-500/30 mix-blend-hard-light" />
                    )}
                    {mode === 'engineer' && (
                        <div className="absolute inset-0 bg-green-500/30 mix-blend-hard-light" />
                    )}

                    {/* Horizontal Glitch Strips */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 0.15, ease: "linear" }}
                        className="absolute h-2 w-full bg-white/80 top-[20%] opacity-70 mix-blend-difference"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "-100%" }}
                        transition={{ duration: 0.15, ease: "linear", delay: 0.05 }}
                        className="absolute h-4 w-full bg-white/60 top-[60%] opacity-70 mix-blend-difference"
                    />

                    {/* Solid Flash */}
                    <motion.div
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-background"
                    />

                    {/* Scanline Effect (CSS) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.1) 51%)',
                        backgroundSize: '100% 4px'
                    }} />

                </motion.div>
            )}
        </AnimatePresence>
    );
};
