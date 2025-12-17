"use client";

import { useEffect, useState } from "react";
import { usePersonaStore } from "@/lib/store";
import { PersonaToggle } from "@/components/PersonaToggle";
import { ProjectCard, ProjectData } from "@/components/ProjectCard";
import resume from "@/data/resume.json";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDownCircle } from "lucide-react";
import { PowerPointArrow, MagicTapArrow } from "@/components/CustomArrows";
import { AiFaq } from "@/features/ai-faq";
import Image from "next/image";
import chartSlide from "../../public/chart-slide.png";

// --- Project Data ---
/**
 * Static configuration for the portfolio projects.
 * This is the source of truth for all cards, mapping data to the different persona views.
 * 
 * Future improvement: Move this to a separate data file or CMS.
 */
const projects: ProjectData[] = [
    {
        title: "HA Circadian Lights",
        description: "Automated adaptive lighting engine for Home Assistant. Dynamically adjusts Kelvin {{Color Temp}} and brightness {{Brightness}} based on solar position. These are the live values from my home.",
        link: "github.com/mels0n/HA_circadian_lights",
        image: "/circadian_lights.png",
        kpis: [{ label: "Brightness", value: "-" }, { label: "Color Temp", value: "-" }],
        liveStats: {
            url: "/api/circadian",
            mapping: {
                "sensor.circadian_brightness": "Brightness",
                "sensor.circadian_color_temp": "Color Temp"
            }
        },
        manaCost: "{1}{U}{R}",
        typeLine: "Artifact Creature — Robot",
        flavorText: "The sun sets, but the light remains.",
        tags: ["home-assistant", "yaml", "automation"]
    },
    {
        title: "Polymorphic Portfolio",
        description: "This very website. A trimodal interactive portfolio powered by Next.js 14, Tailwind, and Framer Motion. Features hot-swappable persona modes.",
        link: "github.com/mels0n/aboutme",
        image: "/aboutme_portfolio.png",
        kpis: [{ label: "Lighthouse", value: "100" }, { label: "Mode", value: "Trimodal" }],
        manaCost: "{5}{U}",
        typeLine: "Artifact Creature — Turtle Warrior",
        flavorText: "It changes as you observe it.",
        tags: ["nextjs", "tailwind", "framer"]
    },
    {
        title: "Distributed Swarm",
        description: "Distributed transcoding construct using Docker Swarm. Parallelizes media processing across nodes for high-efficiency throughput.",
        link: "github.com/mels0n/jellyfin-rffmpeg-swarm",
        image: "/distributed_swarm.png", // Docker Swarm Image (Confirmed Working)
        kpis: [{ label: "Efficiency", value: "+400%" }, { label: "Nodes", value: "5 Active" }],
        manaCost: "{1}{U}",
        typeLine: "Legendary Artifact Creature — Equipment Jellyfish",
        flavorText: "The swarm consumes the queue.",
        tags: ["docker", "ffmpeg", "cluster"]
    },
    {
        title: "Tabletop Scheduler",
        description: "Automated conflict resolution protocol for social coordination. Ensures optimal quorum for recurring events.",
        link: "github.com/mels0n/tabletop_scheduler",
        image: "/tabletop_scheduler.png", // User provided screenshot
        kpis: [{ label: "Conflicts", value: "0 Detected" }, { label: "Uptime", value: "99.9%" }],
        manaCost: "{0}",
        typeLine: "Legendary Artifact",
        flavorText: "Time is but a resource to be managed.",
        tags: ["typescript", "logic-solver", "calendar"]
    },
    {
        title: "Retirement Tax Planner",
        description: "Strategic forecasting engine for long-term capital preservation and tax liability minimization.",
        link: "github.com/mels0n/retirement_tax_plan",
        image: "/retirement.png", // User provided screenshot
        kpis: [{ label: "ROI", value: "Maximized" }, { label: "Risk", value: "Mitigated" }],
        manaCost: "{1}",
        typeLine: "Legendary Artifact — Equipment",
        flavorText: "Death and taxes. One can be delayed.",
        tags: ["finance", "algorithm", "python"]
    },
    {
        title: "Stop Gerrymandering",
        description: "Geospatial analysis tool correcting grid logic errors to ensure fair representation borders.",
        link: "github.com/mels0n/stopgerrymandering",
        image: "/gerrymandering.png", // User provided screenshot
        kpis: [{ label: "Fairness", value: "Optimized" }, { label: "Bias", value: "-100%" }],
        manaCost: "",
        typeLine: "Artifact Land",
        flavorText: "Draw the lines before they draw you.",
        tags: ["gis", "data-viz", "civic-tech"]
    }
];

/**
 * Main Page Component.
 * 
 * Responsible for:
 * 1. Intro sequence orchestration.
 * 2. Global "Persona Mode" state management via Zustand wrapper.
 * 3. Responsive layout and theme synchronization.
 * 4. Rendering the sticky header, hero section, experience log, and project grid.
 */
export default function Home() {
    const { mode, setMode, cycleMode } = usePersonaStore();
    const [ctaFlash, setCtaFlash] = useState(false);

    /*
     * Side Effect: Intro Animation
     * On first load (sessionStorage), cycles through all modes to demonstrate the polymorphic nature of the site.
     * 
     * Side Effects:
     * - Reads/Writes to sessionStorage.
     * - Mutates global persona state multiple times with delays.
     */
    useEffect(() => {
        // Check if we've already played the intro this session
        const hasPlayed = sessionStorage.getItem("hasPlayedIntro");

        if (!hasPlayed) {
            // Start Intro Sequence
            const runIntro = async () => {
                // Ensure starting at executive
                setMode('executive');

                // Wait 1s
                await new Promise(r => setTimeout(r, 1000));
                setMode('strategist');

                // Wait 1s
                await new Promise(r => setTimeout(r, 1000));
                setMode('engineer');

                // Wait 1s
                await new Promise(r => setTimeout(r, 1000));
                setMode('executive');

                // Trigger CTA Flash after a brief moment ensuring reuse
                setTimeout(() => setCtaFlash(true), 500);

                // Mark as played
                sessionStorage.setItem("hasPlayedIntro", "true");
            };

            runIntro();
        } else {
            // Ensure we respect the previously set mode or default to executive if null
            if (!mode) setMode('executive');
            document.documentElement.setAttribute("data-theme", mode || 'executive');
        }
    }, []); // Run once on mount

    // Sync theme whenever mode changes (handled in the intro or by user)
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", mode);
    }, [mode]);

    return (
        <motion.main
            className="min-h-screen pb-20 transition-colors duration-500 overflow-x-hidden touch-pan-y"
            onPanEnd={(e, info) => {
                // Disable swipe on desktop (md breakpoint is 768px)
                if (typeof window !== 'undefined' && window.innerWidth >= 768) return;

                if (info.offset.x > 50) cycleMode('prev');
                if (info.offset.x < -50) cycleMode('next');
            }}
        >

            {/* --- Sticky Header / Toggle --- */}
            <div className="sticky top-0 z-50 py-4 backdrop-blur-md bg-background/80 border-b border-border/50 flex justify-center items-center gap-2">

                {/* External CTA (Left of Toggle) */}
                <AnimatePresence mode="wait">
                    {mode === 'executive' && (
                        <motion.div
                            key="exec-cta"
                            initial={{ opacity: 0, x: 10 }}
                            animate={ctaFlash ? {
                                opacity: [1, 0.3, 1, 0.3, 1, 0.3, 1],
                                x: 0,
                                transition: { duration: 2, ease: "easeInOut" }
                            } : { opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onAnimationComplete={() => {
                                if (ctaFlash) setCtaFlash(false);
                            }}
                            className="flex items-center gap-1 text-blue-600 font-bold uppercase tracking-wider text-sm"
                        >
                            <span>Drill Down</span>
                            <PowerPointArrow className="w-6 h-6" />
                        </motion.div>
                    )}

                    {mode === 'strategist' && (
                        <motion.div
                            key="strat-cta"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                            className="flex items-center gap-1 text-emerald-700 font-serif font-bold italic text-lg"
                        >
                            <span>Reroll</span>
                            <MagicTapArrow className="w-6 h-6 ml-1" />
                        </motion.div>
                    )}

                    {mode === 'engineer' && (
                        <motion.div
                            key="eng-cta"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-green-500 font-mono text-lg"
                        >
                            <span>sudo</span>
                            <span className="font-bold text-xl">&gt;</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <PersonaToggle />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">

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
                                    <h1 className="text-xl md:text-2xl font-serif text-foreground/60 italic">
                                        Prepared By: <span className="text-foreground font-bold not-italic">Chris Melson</span>
                                    </h1>
                                </div>

                                {/* --- Chart Image (Frameless) --- */}
                                <div className="w-full max-w-3xl relative">
                                    <Image
                                        src={chartSlide}
                                        alt="Operational Chaos to Sustainable Growth Chart"
                                        className="w-full h-auto object-contain max-h-[50vh] drop-shadow-lg"
                                        priority
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
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

                                <h3 className="text-xl md:text-2xl font-serif text-accent font-bold tracking-wide">
                                    Deckcraft • Tabletop • Logic
                                </h3>

                                <figure className="space-y-4">
                                    <blockquote className="text-lg text-foreground/80 italic font-serif">
                                        "Victory is not found in strength alone, but in the optimal allocation of resources."
                                    </blockquote>
                                    <figcaption className="text-base font-serif text-foreground/60 flex flex-col items-center">
                                        <span className="font-bold text-foreground">— Chris Melson</span>
                                        <span className="text-xs uppercase tracking-wider opacity-75 text-center px-4">
                                            Operating Model Creator • Riverfolk Company C.E.O. • Owner of the Mox Opal
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

                {/* --- Annual Report Check (Removed, integrated into Hero) --- */}

                {/* --- Main Content Grid (Split Layout on Large Screens) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* --- Left Column: Experience (Reduced Size) --- */}
                    <section className="w-full">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
                            <h3 className={cn(
                                "text-lg uppercase tracking-widest",
                                mode === 'engineer' ? "font-mono font-bold text-highlight normal-case" : "font-display font-bold text-foreground"
                            )}>
                                {mode === 'strategist' ? 'Campaign History' :
                                    mode === 'engineer' ? 'sudo dmesg | tail' : 'Experience Log'}
                            </h3>
                            <a
                                href="/christopher-melson-cv.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "text-xs font-bold tracking-wider flex items-center gap-1 hover:underline",
                                    mode === 'engineer' ? "normal-case" : "uppercase",
                                    mode === 'executive' ? "text-blue-600" : mode === 'strategist' ? "text-emerald-700" : "text-green-500"
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
                                        <h4 className={cn(
                                            "text-lg font-bold leading-tight", // Reduced size
                                            mode === 'executive' ? "text-foreground font-display" :
                                                mode === 'engineer' ? "text-highlight font-mono" : "text-foreground font-serif"
                                        )}>
                                            {job.company}
                                        </h4>
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
                                                mode === 'engineer' ? "text-foreground/60 font-mono" : "text-foreground/50 font-sans"
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
                                    mode === 'executive' ? "text-foreground/40 font-serif" :
                                        mode === 'strategist' ? "text-accent/60 font-serif" : "text-highlight/60 font-mono"
                                )}>
                                    {mode === 'strategist' ? '...complete history in the Archives' :
                                        mode === 'engineer' ? '// ...full output in logs' : '...continued on CV'}
                                </span>
                            </div>

                            {/* --- Education Section --- */}
                            <div className="pt-8 border-t border-border mt-8">
                                <h3 className={cn(
                                    "text-lg uppercase tracking-widest mb-4",
                                    mode === 'engineer' ? "font-mono font-bold text-highlight lowercase" : "font-display font-bold text-foreground"
                                )}>
                                    {mode === 'strategist' ? 'Rulebook Mastery' :
                                        mode === 'engineer' ? 'source /etc/profile' : 'Training Log'}
                                </h3>
                                <div className="space-y-4">
                                    {resume.sections.education.items.map((edu: any) => (
                                        <div key={edu.id} className="flex justify-between items-baseline">
                                            <div>
                                                <h4 className={cn(
                                                    "font-bold",
                                                    mode === 'executive' ? "text-foreground" :
                                                        mode === 'strategist' ? "text-foreground serif" : "text-highlight font-mono"
                                                )}>{edu.institution}</h4>
                                                <p className="text-sm text-foreground/70">{edu.area}, {edu.studyType}</p>
                                            </div>
                                            <span className="text-xs text-foreground/50">{edu.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- Right Column: Projects --- */}
                    <section className="w-full">
                        <div className="flex items-center gap-4 mb-6 pb-2 border-b border-border">
                            <h3 className={cn(
                                "text-lg uppercase tracking-widest",
                                mode === 'engineer' ? "font-mono font-bold text-highlight lowercase" : "font-display font-bold text-foreground"
                            )}>
                                {mode === 'strategist' ? 'Artifacts' :
                                    mode === 'engineer' ? 'ls -ahl /projects' : 'Key Initiatives'}
                            </h3>
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
            <AiFaq />
        </motion.main>
    );
}
