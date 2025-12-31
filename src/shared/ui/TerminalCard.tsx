"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Defines configuration for the developer/engineer-focused terminal card.
 */
export interface CardProps {
    /** Project title (command name). */
    title: string;
    /** Output description text. */
    description: string;
    /** External link protocol. */
    link: string;
    /** Array of technical tags (e.g., ["Next.js", "Docker"]). */
    tags?: string[];
    /** Live data fetch configuration. */
    liveStats?: {
        /** JSON endpoint. */
        url: string;
        /** Mapping of JSON keys to internal variable names. */
        mapping: Record<string, string>;
    };
}

/**
 * A brutalist, terminal-inspired card component designed for the 'Engineer' persona.
 * Emulates a CLI environment with green-text-on-black aesthetics and monospaced typography.
 * 
 * Includes logic for injecting live values directly into the description text stream (stdout style).
 * 
 * @param props - CardProps configuration.
 */
export function TerminalCard({ title, description, link, tags, liveStats }: CardProps) {
    // Current register of fetched live variables
    const [fetchedStats, setFetchedStats] = useState<Record<string, string>>({});

    /*
     * Side Effect: Live Data Polling (Daemon)
     * Polls the liveStats.url every 60s to update the environment variables (fetchedStats).
     * 
     * Performance Note:
     * We explicitly depend on `liveStats.url` and `liveStats.mapping` primitives rather than
     * the full object. This prevents unnecessary re-subscriptions if the parent component
     * passes a new object reference with identical content on every render.
     */
    useEffect(() => {
        if (!liveStats) return;

        const fetchData = async () => {
            try {
                const res = await fetch(liveStats.url);
                const data = await res.json();

                const newStats: Record<string, string> = {};
                Object.entries(liveStats.mapping).forEach(([jsonKey, label]) => {
                    if (data[jsonKey] !== undefined) {
                        newStats[label] = data[jsonKey].toString();
                    }
                });
                setFetchedStats(newStats);
            } catch (err) {
                console.error("Failed to fetch live stats", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [liveStats?.url, liveStats?.mapping]);

    // Enhance description with live values using generic templating
    const renderDescription = () => {
        // If no stats fetched yet, strip templates to show clean static text
        if (Object.keys(fetchedStats).length === 0) {
            return description.replace(/{{(.*?)}}/g, "");
        }

        // Split by the template pattern {{Key}} to interleave React nodes
        const parts = description.split(/{{(.*?)}}/g);

        return parts.map((part, i) => {
            // Even indices are static text, odd indices are keys captured by regex
            if (i % 2 === 1) {
                const key = part.trim();
                const value = fetchedStats[key];

                if (value) {
                    return <span key={i} className="text-cyan-400 font-bold">({value})</span>;
                }
                // If key not found in stats, return empty string (or fallback)
                return null;
            }
            return part;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-black border border-green-500/30 p-4 font-mono text-sm h-full flex flex-col shadow-[0_0_10px_rgba(0,255,65,0.1)] hover:border-green-500/80 transition-colors"
        >
            <div className="flex justify-between items-center mb-2 border-b border-green-900/50 pb-2">
                <span className="text-green-500 font-bold">{`> ${title}`}</span>
                <span className="text-xs text-green-800">[PID: {Math.floor(Math.random() * 9000) + 1000}]</span>
            </div>

            <div className="text-green-400/80 mb-4 flex-grow leading-relaxed">
                <span className="text-green-700 select-none mr-2">$</span>
                {renderDescription()}
            </div>

            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    {tags?.map(tag => (
                        <span key={tag} className="text-[10px] bg-green-900/20 text-green-300 px-1 border border-green-800">
                            {tag}
                        </span>
                    ))}
                </div>
                <a href={`https://${link}`} className="block text-right text-xs text-cyan-500 hover:text-cyan-400 hover:underline decoration-dashed">
                    {`-> LINK_ESTABLISHED`}
                </a>
            </div>
        </motion.div>
    );
}
