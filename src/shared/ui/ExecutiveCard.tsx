"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Defines the content and configuration for an executive-style project card.
 */
export interface CardProps {
    /** The primary title or project name to display. */
    title: string;
    /** A concise summary of the project's purpose and impact. */
    description: string;
    /** The direct URL (without protocol) to the live project or report. */
    link: string;
    /** 
     * Optional static list of key performance indicators (KPIs) to display initially.
     * These values may be hydrated with live data if `liveStats` is provided.
     */
    stats?: { label: string; value: string }[];
    /**
     * Configuration for fetching real-time data to update the stats.
     */
    liveStats?: {
        /** The API endpoint URL to poll for data. */
        url: string;
        /** 
         * Maps JSON response keys to the corresponding `stats` label.
         * Key: API JSON key (e.g., "commits"), Value: Display label (e.g., "Commits").
         */
        mapping: Record<string, string>;
    };
}

/**
 * A minimalist, data-focused card component designed for the 'Executive' persona.
 * Features a clean layout, serif typography for readability, and capabilities for live data polling.
 * 
 * @param props - The CardProps object containing content and configuration.
 */
export function ExecutiveCard({ title, description, link, stats: initialStats, liveStats }: CardProps) {
    // State to hold the currently displayed statistics; initialized with static data.
    const [stats, setStats] = useState(initialStats);

    /*
     * Side Effect: Live Data Polling
     * If liveStats configuration is present, this effect initiates a polling interval
     * to fetch fresh data from the specified URL and update the displayed statistics.
     * 
     * Side Effects:
     * - Initiates a network request (fetch).
     * - Sets a recurring interval timer.
     * - Mutates component state (setStats).
     * 
     * Performance Note:
     * We explicitly depend on `liveStats.url` and `liveStats.mapping` primitives rather than
     * the full object. This prevents unnecessary re-subscriptions if the parent component
     * passes a new object reference with identical content on every render.
     */
    useEffect(() => {
        if (!liveStats || !initialStats) return;

        const fetchData = async () => {
            try {
                const res = await fetch(liveStats.url);
                const data = await res.json();

                // Update stats based on mapping
                setStats(prev => prev?.map(stat => {
                    // Find if any json key maps to this stat label
                    const jsonKey = Object.keys(liveStats.mapping).find(
                        key => liveStats.mapping[key] === stat.label
                    );

                    if (jsonKey && data[jsonKey] !== undefined) {
                        return { ...stat, value: data[jsonKey].toString() };
                    }
                    return stat;
                }));
            } catch (err) {
                console.error("Failed to fetch live stats", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [liveStats?.url, liveStats?.mapping]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                <h3 className="font-display font-bold text-xl text-slate-900">{title}</h3>
                <a href={`https://${link}`} className="text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-highlight">
                    View Report
                </a>
            </div>
            <p className="text-slate-600 font-serif text-sm leading-relaxed mb-6 flex-grow">
                {description}
            </p>
            {stats && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-sm border border-slate-100 mb-6">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">{stat.label}</div>
                            <div className="text-sm font-mono text-slate-900">{stat.value}</div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
