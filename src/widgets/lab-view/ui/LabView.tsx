"use client";

import { useEffect, useState } from "react";
import { usePersonaStore } from "@/shared/lib/store";
import { ProjectCard } from "@/entities/project/ui/ProjectCard";
import { projects } from "@/entities/project/model/data";
import resume from "@/shared/data/resume.json";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { ArrowDownCircle } from "lucide-react";

import Image from "next/image";
import { PersonaExplanation } from "@/features/persona-explanation";
import { LAB_CONTENT } from "@/shared/data/lab-content";

export const LabView = () => {
    const { mode, setMode, introDismissed } = usePersonaStore();

    // Intro sequence logic was in Page.tsx. 
    // Since "The Lab" is now a sub-view, we might want to run the intro only if accessing Lab for the first time?
    // Or should we preserve the exact behavior?
    // The user said "The Lab will house the current site".
    // I will preserve the useEffect logic here.

    // Intro animation removed per user request
    useEffect(() => {
        if (!mode) setMode('executive');
    }, [mode, setMode]);

    // Theme effect is now handled at the Page level to ensure clean switching?
    // Actually, Office view uses the same theme variables but cleaner usage?
    // No, Office view likely wants a clean "light/dark" but not the "green/blue/emerald" strong overrides 
    // UNLESS Office view specifically also changes theme.
    // The user said "Reuse your existing polymorphic content engine... change the text/data".
    // But for "The Office" view, styling should be "minimalist... systems-thinking".
    // "Do NOT use the RPG or CLI themes here."
    // This implies that when in OFFICE view, the `data-theme` attribute on HTML/Body might need to be reset or set to a specific "office" theme?
    // The current `useEffect` in `page.tsx` sets `data-theme` based on `mode`.
    // If I keep `mode` (executive/strategist/engineer) active even in Office view (for the buttons), 
    // then `data-theme` will be set to e.g. "engineer".
    // If "engineer" theme includes the monospace font and green matrix colors, that might clash with "clean minimalist".
    // I might need to prevent the global theme update if in OFFICE view.

    return (
        <motion.div
            key="lab-view"
            initial={{ opacity: 0 }}
            animate={introDismissed ? { opacity: 1 } : { opacity: 0 }}
            exit={{ opacity: 0 }}
            className="w-full"
        >
            <PersonaExplanation />

            {/* Note: Nav is removed from here as it will be in the parent layout */}

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 flex flex-col gap-12">

                {/* --- Hero Section --- */}
                <section className="min-h-[30vh] flex flex-col justify-center items-center text-center">
                    <AnimatePresence mode="wait">
                        {mode === "executive" && (
                            <motion.div
                                key="exec-hero"
                                initial={{ opacity: 1, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="w-full max-w-5xl relative flex flex-col items-center text-center space-y-8"
                            >
                                {/* --- Header --- */}
                                <div className="space-y-4">
                                    <div className="inline-block px-4 py-1.5 border border-foreground/10 rounded-full text-sm font-bold uppercase tracking-widest text-highlight bg-background/50 backdrop-blur-sm">
                                        Executive Summary
                                    </div>

                                </div>

                                {/* --- Strategic Report (Text Replacement) --- */}
                                <div className="w-full max-w-4xl relative text-left bg-surface/50 border border-border p-8 rounded-sm shadow-md backdrop-blur-sm">
                                    <div className="border-b-2 border-foreground/10 pb-4 mb-6">
                                        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
                                            {LAB_CONTENT.executive.report.title}
                                        </h2>
                                        <p className="text-sm md:text-base font-mono text-foreground/60 mt-2 uppercase tracking-wider">
                                            {LAB_CONTENT.executive.report.subject}
                                        </p>
                                    </div>

                                    <div className="prose prose-lg max-w-none text-foreground/80 font-serif leading-relaxed space-y-4">
                                        {LAB_CONTENT.executive.report.body.map((paragraph, index) => (
                                            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                                        ))}
                                    </div>

                                    {/* Footer / Signature */}
                                    <div className="mt-8 pt-6 border-t border-foreground/5 flex justify-end">
                                        <div className="text-right">
                                            <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-1">Prepared By</p>
                                            <p className="text-lg font-serif text-foreground font-bold">{LAB_CONTENT.executive.report.preparedBy}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {mode === "strategist" && (
                            <motion.div key="strat-hero" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6 max-w-3xl relative">
                                {/* Decorative Flourishes */}
                                <div className="absolute -top-10 -left-10 text-6xl opacity-10 rotate-12">⚔️</div>
                                <div className="absolute -bottom-10 -right-10 text-6xl opacity-10 -rotate-12">🛡️</div>

                                <h1 className="text-6xl md:text-8xl font-display text-foreground drop-shadow-sm">
                                    The Strategist
                                </h1>
                                <div className="h-1 w-32 bg-highlight mx-auto rounded-full my-4" />

                                <h2 className="text-xl md:text-2xl font-serif text-accent font-bold tracking-wide">
                                    Deckcraft • Tabletop • Logic
                                </h2>

                                <figure className="space-y-4">
                                    <blockquote className="text-lg text-foreground/80 italic font-serif">
                                        "Victory is not found in strength alone, but in the optimal allocation of resources."
                                    </blockquote>
                                    <figcaption className="text-base font-serif text-foreground/60 flex flex-col items-center">
                                        <span className="font-bold text-foreground">- Chris Melson</span>
                                        <span className="text-xs uppercase tracking-wider opacity-75 text-center px-4">
                                            Riverfolk Company C.E.O. • V.P. of Engine Building • Owner of the Mox Opal
                                        </span>
                                    </figcaption>
                                </figure>
                            </motion.div>
                        )}

                        {mode === "engineer" && (
                            <motion.div key="eng-hero" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="w-full max-w-4xl text-left font-mono">
                                <div className="text-highlight mb-4">{`> initializing_portfolio_sequence...`}</div>
                                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                                    <span className="text-highlight">root@melson:</span><span className="text-foreground">~#</span> whoami
                                </h1>
                                <div className="bg-surface border border-border p-6 rounded-sm shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-highlight to-transparent opacity-50" />
                                    <pre className="text-sm md:text-base text-foreground/90 whitespace-pre-wrap">
                                        {`{
  "user": "Chris Melson",
  "role": "Homelab Enthusiast",
  "stack": ["Docker Swarm", "Home Assistant", "UniFi", "Synology"],
  "status": "ONLINE",
  "uptime": "99.999%"
}`}
                                    </pre>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* --- Main Content Grid (Split Layout on Large Screens) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* --- Left Column: Experience (Reduced Size) --- */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
                            <h2 className={cn(
                                "text-lg uppercase tracking-widest",
                                mode === 'engineer' ? "font-mono font-bold text-highlight normal-case" : "font-display font-bold text-foreground"
                            )}>
                                {mode === 'strategist' ? 'Campaign History' :
                                    mode === 'engineer' ? 'sudo dmesg | tail' : 'Experience Log'}
                            </h2>
                            <a
                                href="/christopher-melson-cv.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "text-xs font-bold tracking-wider flex items-center gap-1 hover:underline",
                                    mode === 'engineer' ? "normal-case" : "uppercase"
                                )}
                            >
                                <ArrowDownCircle className="w-4 h-4" />
                                {mode === 'strategist' ? 'Consult the Archives' :
                                    mode === 'engineer' ? 'wget dmesg -O resume.pdf' : 'Download Full CV'}
                            </a>
                        </div>

                        <div className="space-y-8">
                            {resume.sections.experience.items.slice(0, 3).map((job: any) => (
                                <div key={job.id} className="group">
                                    <div className="flex flex-col mb-1">
                                        <h3 className={cn(
                                            "text-lg font-bold leading-tight", // Reduced size
                                            mode === 'executive' ? "text-foreground font-display" :
                                                mode === 'engineer' ? "text-highlight font-mono" : "text-foreground font-serif"
                                        )}>
                                            {job.company}
                                        </h3>
                                        <div className="flex justify-between items-baseline mt-1">
                                            <span className={cn(
                                                "text-sm font-semibold",
                                                mode === 'executive' ? "text-highlight" :
                                                    mode === 'strategist' ? "text-accent italic" : "text-foreground/80"
                                            )}>
                                                {job.position}
                                            </span>
                                            <span className={cn(
                                                "text-xs",
                                                mode === 'engineer' ? "text-foreground/80 font-mono" : "text-foreground/70 font-sans"
                                            )}>
                                                {job.date}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Summary with Styled Bullets */}
                                    <div
                                        className={cn(
                                            "prose prose-sm max-w-none text-foreground/70 dark:prose-invert text-xs leading-relaxed",
                                            "[&_ul]:pl-5 [&_li]:mb-1", // Base padding

                                            // Explicit Mode Styling
                                            mode === 'executive' ? "[&_ul]:list-[square] marker:text-blue-600" :
                                                mode === 'strategist' ? "[&_ul]:list-disc marker:text-emerald-700" :
                                                    // Engineer: Tech style (Decimal with leading zero + mono font)
                                                    "[&_ul]:list-[decimal-leading-zero] marker:text-green-500 font-mono"
                                        )}
                                        dangerouslySetInnerHTML={{ __html: job.summary }}
                                    />
                                </div>
                            ))}

                            {/* --- Experience Footer (Continued...) --- */}
                            <div className="flex justify-end mt-2 mb-6">
                                <span className={cn(
                                    "text-xs italic",
                                    mode === 'executive' ? "text-foreground/60 font-serif" :
                                        mode === 'strategist' ? "text-accent/80 font-serif" : "text-highlight/80 font-mono"
                                )}>
                                    {mode === 'strategist' ? '...complete history in the Archives' :
                                        mode === 'engineer' ? '// ...full output in logs' : '...continued on CV'}
                                </span>
                            </div>

                            {/* --- Education Section --- */}
                            <div className="pt-8 border-t border-border mt-8">
                                <h2 className={cn(
                                    "text-lg uppercase tracking-widest mb-4",
                                    mode === 'engineer' ? "font-mono font-bold text-highlight lowercase" : "font-display font-bold text-foreground"
                                )}>
                                    {mode === 'strategist' ? 'Rulebook Mastery' :
                                        mode === 'engineer' ? 'source /etc/profile' : 'Training Log'}
                                </h2>
                                <div className="space-y-4">
                                    {resume.sections.education.items.map((edu: any) => (
                                        <div key={edu.id} className="flex justify-between items-baseline">
                                            <div>
                                                <h3 className={cn(
                                                    "font-bold",
                                                    mode === 'executive' ? "text-foreground" :
                                                        mode === 'strategist' ? "text-foreground serif" : "text-highlight font-mono"
                                                )}>{edu.institution}</h3>
                                                <p className="text-sm text-foreground/70">{edu.area}, {edu.studyType}</p>
                                            </div>
                                            <span className="text-xs text-foreground/70">{edu.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- Right Column: Projects --- */}
                    <section className="w-full">
                        <div className="flex items-center gap-4 mb-6 pb-2 border-b border-border">
                            <h2 className={cn(
                                "text-lg uppercase tracking-widest",
                                mode === 'engineer' ? "font-mono font-bold text-highlight lowercase" : "font-display font-bold text-foreground"
                            )}>
                                {mode === 'strategist' ? 'Artifacts' :
                                    mode === 'engineer' ? 'ls -ahl /projects' : 'Key Initiatives'}
                            </h2>
                        </div>

                        <div className={cn(
                            "grid gap-6",
                            mode === 'executive' ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2" // Adjust grid for column width
                        )}>
                            {projects.map((project) => (
                                <ProjectCard key={project.title} project={project} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>

        </motion.div>
    );
};
