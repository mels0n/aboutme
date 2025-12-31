"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Defines content and styling configuration for the TCG-style GameCard.
 */
export interface CardProps {
    /** The card title/name. */
    title: string;
    /** The main rules text or project description. */
    description: string;
    /** The target URL for the "Link to Source" action. */
    link: string;
    /** Optional URL for the card art. */
    image?: string;
    /** Optional mana cost symbol (e.g., "{3}"). Defaults to "{3}". */
    manaCost?: string;
    /** The card type line (e.g., "Creature - Human"). Defaults to "Enchantment". */
    typeLine?: string;
    /** Optional flavor text at the bottom. */
    flavorText?: string;
    /** Configuration for live data fetching. */
    liveStats?: {
        /** API endpoint to poll. */
        url: string;
        /** Map of JSON keys to display labels. */
        mapping: Record<string, string>;
    };
}

/**
 * A highly stylized Project Card mimicking a Trading Card Game (TCG) aesthetic.
 * Used for the 'Strategist' persona to present projects as deck-building assets.
 * 
 * @param props - CardProps configuration.
 */
export function GameCard({ title, description, link, image, manaCost = "{3}", typeLine = "Enchantment", flavorText, liveStats }: CardProps) {
    // Stores dynamic stats fetched from liveStats.url
    const [fetchedStats, setFetchedStats] = useState<Record<string, string>>({});

    /*
     * Side Effect: Live Data Polling
     * Polls the liveStats.url every 60 seconds to update fetchedStats.
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
    const textSizeClass = description.length > 120 ? "text-[10px] leading-tight" : "text-xs leading-snug";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            whileHover={{ scale: 1.05, rotate: 1, zIndex: 10 }}
            className="bg-[#1c1c1c] p-[10px] rounded-xl shadow-2xl border border-black group h-full aspect-[5/7] w-full max-w-[280px] mx-auto"
        >
            {/* Card Border */}
            <div className="bg-[#2a2520] h-full rounded-lg flex flex-col border border-[#5c4d3c] relative overflow-hidden">

                {/* Title Bar */}
                <div className="mx-1 mt-1 bg-[#dcd0c0] border border-[#a89f8a] rounded-t-sm px-2 py-1 flex justify-between items-center shadow-inner">
                    <span className="font-bold text-[#1f1b16] text-sm tracking-tight font-serif">{title}</span>
                    <span className="font-bold text-xs bg-[#c0b8b0] px-1 rounded-full border border-gray-400 font-serif">{manaCost}</span>
                </div>

                {/* Art Box */}
                <div className="mx-1 border border-[#1f1b16] bg-[#0c0c0c] h-[45%] shrink-0 relative overflow-hidden group-hover:brightness-110 transition-all">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#dcd0c0]/20 font-serif italic text-xs">
                            [Illustration]
                        </div>
                    )}
                </div>

                {/* Type Line */}
                <div className="mx-1 mt-[2px] bg-[#dcd0c0] border-x border-b border-[#a89f8a] px-2 py-0.5 flex justify-between items-center shadow-inner z-10 shrink-0">
                    <span className="font-bold text-[#1f1b16] text-xs font-serif">{typeLine}</span>
                    <div className="w-3 h-3 bg-black rounded-full border border-gray-500" />
                </div>

                {/* Text Box */}
                <div className="mx-1 mb-1 mt-[2px] bg-[#dcd0c0]/90 border border-[#a89f8a] p-2 flex-grow flex flex-col justify-between overflow-hidden">
                    <p className={`text-[#1f1b16] font-serif ${textSizeClass}`}>
                        {description}
                    </p>

                    {/* Live Stats for Circadian Project */}
                    {Object.keys(fetchedStats).length > 0 && (
                        <div className={`mt-2 font-serif text-[#1f1b16] flex flex-wrap gap-2 ${textSizeClass}`}>
                            {Object.entries(fetchedStats).map(([label, value]) => (
                                <span key={label}>
                                    <span>{"{" + label + "}"}</span>: {value}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="my-2 flex items-center gap-1 text-xs text-[#1f1b16] font-serif">
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#c0b8b0] border border-gray-500 text-[10px] font-bold shadow-sm" title="Tap">{`{T}`}</span>
                        <span>:</span>
                        <a href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-red-800">
                            Link to Source
                        </a>
                    </div>
                    {flavorText && (
                        <div className="mt-2 text-[10px] italic text-[#4a4036] font-serif shrink-0 border-t border-[#a89f8a]/50 pt-1">
                            {flavorText}
                        </div>
                    )}
                </div>
            </div>
        </motion.div >
    );
}
