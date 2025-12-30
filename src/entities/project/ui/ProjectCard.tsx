"use client";

import { usePersonaStore } from "@/lib/store";
import { ExecutiveCard } from "@/components/ExecutiveCard";
import { GameCard } from "@/components/GameCard";
import { TerminalCard } from "@/components/TerminalCard";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Validated data shape for a project, containing fields for all persona variants.
 * This is arguably a "God Object" type for frontend display, aggregating props for all card types.
 */
export interface ProjectData {
    /** Primary project name. */
    title: string;
    /** 
     * Short summary of the project.
     * Supports `{{Key}}` templating syntax for injecting live stats (e.g., `{{Brightness}}`).
     */
    description: string;
    /** External link to project or source. */
    link: string;
    /** Image URL for visual cards (Strategist). */
    image?: string;
    /** 
     * Configuration for real-time data fetching.
     * Passed down to underlying card implementations.
     */
    liveStats?: {
        url: string;
        // Mapping JSON key -> KPI Label to update
        /** 
         * Maps JSON response keys to display labels.
         * Keys must match the `{{Key}}` placeholders in `description` if injection is used.
         */
        mapping: Record<string, string>;
    };
    // Variant specific data
    /** Initial static KPIs for Executive view. */
    kpis?: { label: string; value: string }[];
    /** Mana cost for Strategist (GameCard) view. */
    manaCost?: string;
    /** Card type line for Strategist (GameCard) view. */
    typeLine?: string;
    /** Flavor text for Strategist (GameCard) view. */
    flavorText?: string;
    /** Tech stack tags for Engineer (TerminalCard) view. */
    tags?: string[];
}

interface ProjectCardProps {
    project: ProjectData;
}

/**
 * A HOC-like Presentational Component that switches the visual representation
 * of a project based on the currently active `PersonaMode`.
 * 
 * Uses `framer-motion`'s `AnimatePresence` to handle smooth transitions between card types.
 * 
 * @param props - Contains the full data object for the project.
 */
export function ProjectCard({ project }: ProjectCardProps) {
    // Subscribe to global persona mode
    const mode = usePersonaStore((state) => state.mode);

    return (
        <div className="h-full relative group">
            <AnimatePresence mode="wait">
                {mode === "executive" && (
                    <motion.div key="exec" className="h-full" exit={{ opacity: 0 }}>
                        <ExecutiveCard
                            title={project.title}
                            description={project.description}
                            link={project.link}
                            stats={project.kpis}
                            liveStats={project.liveStats}
                        />
                    </motion.div>
                )}

                {mode === "strategist" && (
                    <motion.div key="strat" className="h-full" exit={{ opacity: 0 }}>
                        <GameCard
                            title={project.title}
                            description={project.description}
                            link={project.link}
                            image={project.image}
                            manaCost={project.manaCost}
                            typeLine={project.typeLine}
                            flavorText={project.flavorText}
                            liveStats={project.liveStats}
                        />
                    </motion.div>
                )}

                {mode === "engineer" && (
                    <motion.div key="eng" className="h-full" exit={{ opacity: 0 }}>
                        <TerminalCard
                            title={project.title}
                            description={project.description}
                            link={project.link}
                            tags={project.tags}
                            liveStats={project.liveStats}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
