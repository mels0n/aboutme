"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aboutContent } from "@/shared/data/about-content";
import { cn } from "@/shared/lib/utils";

export const AboutHeader = () => {
    const { name, titles, tagline } = aboutContent.header;

    return (
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-border/40 pb-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative shrink-0"
            >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-surface shadow-xl relative z-10">
                    <Image
                        src="/chris-melson-headshot.jpg"
                        alt={name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border border-blue-200/50 scale-110 -z-10" />
            </motion.div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 pt-2">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold font-display text-foreground tracking-tight"
                >
                    {name}
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center md:justify-start gap-x-3 text-lg md:text-xl text-foreground/70 font-serif"
                >
                    {titles.map((title, i) => (
                        <span key={i} className="flex items-center">
                            {title}
                            {i < titles.length - 1 && (
                                <span className="ml-3 text-foreground/20 text-sm">|</span>
                            )}
                        </span>
                    ))}
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 font-serif italic text-lg"
                >
                    {tagline}
                </motion.p>
            </div>
        </section>
    );
};
