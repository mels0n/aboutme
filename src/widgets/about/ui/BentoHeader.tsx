"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aboutContent } from "@/shared/data/about-content";
import { ExternalLink, Github, Linkedin, FileText, ArrowDownToLine } from "lucide-react";

export const BentoHeader = () => {
    const { name, titles, tagline } = aboutContent.header;
    const { links } = aboutContent;

    return (
        <section className="flex flex-col xl:flex-row gap-8 items-start justify-between border-b border-border/40 pb-12">
            {/* Profile Block */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 flex-1">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative shrink-0"
                >
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-surface shadow-xl relative z-10">
                        <Image
                            src="/chris-melson-headshot.jpg"
                            alt={name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
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
                        className="flex justify-center md:justify-start gap-x-3 text-base md:text-lg text-foreground/70 font-serif whitespace-nowrap"
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
            </div>

            {/* Bento Actions Block */}
            <div className="w-full lg:w-auto flex flex-row gap-3 overflow-x-auto pb-2 lg:pb-0">
                {/* CV Download */}
                {/* CV Download */}
                <a
                    href={links.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:w-32 p-4 bg-surface border border-slate-200 rounded-xl hover:border-blue-400 transition-colors group shrink-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <ArrowDownToLine className="w-4 h-4 opacity-50 text-slate-400 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                    </div>
                    <div className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Download CV</div>
                    <div className="text-[10px] text-slate-400 group-hover:text-blue-400/70 transition-colors">PDF Format</div>
                </a>

                {/* GitHub */}
                <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:w-32 p-4 bg-surface border border-border rounded-xl hover:border-foreground/20 transition-colors group shrink-0"
                >
                    <Github className="w-5 h-5 mb-2 text-foreground/70 group-hover:text-foreground" />
                    <div className="text-xs font-bold text-foreground">GitHub</div>
                    <div className="text-[10px] text-foreground/50">@mels0n</div>
                </a>

                {/* LinkedIn */}
                <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:w-32 p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:border-blue-200 transition-colors group shrink-0"
                >
                    <Linkedin className="w-5 h-5 mb-2 text-blue-700" />
                    <div className="text-xs font-bold text-blue-900">LinkedIn</div>
                    <div className="text-[10px] text-blue-700/60">Connect ↗</div>
                </a>
            </div>
        </section>
    );
};
