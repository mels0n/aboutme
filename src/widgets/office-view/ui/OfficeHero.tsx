import { useState } from "react";
import { motion } from "framer-motion";
import { OfficeFAQModal } from "./OfficeFAQModal";
import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { ArrowUp } from "lucide-react";

export const OfficeHero = () => {
    const { mode } = usePersonaStore();
    const [showFaq, setShowFaq] = useState(false);

    return (
        <section className="w-full flex flex-col items-center text-center space-y-8 pt-0 pb-16 relative">

            {/* Visual Connector to Nav Bar */}
            <motion.div
                initial={{ height: 0 }}
                animate={{ height: 48 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-0 w-px bg-gradient-to-b from-border to-transparent opacity-50 hidden md:block"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 max-w-5xl px-4"
            >
                {/* 0. Identity */}
                <h2 className="text-sm md:text-base font-bold tracking-[0.3em] text-foreground/80 uppercase">
                    Chris Melson
                </h2>

                {/* 1. Headline & Modal Trigger */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground relative inline-block font-serif">
                    Operational <span className="relative inline-block">
                        Architect
                        <button
                            onClick={() => setShowFaq(true)}
                            className={cn(
                                "absolute -top-10 -right-24 md:-right-32 text-xs md:text-sm font-sans font-bold tracking-tight px-4 py-2 rounded-xl border-2 transition-all hover:-translate-y-1 hover:shadow-md text-left leading-tight w-44 md:w-auto",
                                mode === 'engineer' ? "text-emerald-700 bg-emerald-50/90 border-emerald-200/60 hover:border-emerald-300" :
                                    mode === 'strategist' ? "text-indigo-700 bg-indigo-50/90 border-indigo-200/60 hover:border-indigo-300" :
                                        "text-blue-700 bg-blue-50/90 border-blue-200/60 hover:border-blue-300"
                            )}
                        >
                            Do I need an Operational Architect? ↗
                        </button>
                    </span><br />
                    <span className="text-foreground/50">for the Agentic Age.</span>
                </h1>

                {/* 2. Sub-Headline */}
                <h2 className="text-lg md:text-xl font-light text-foreground/80 tracking-wide font-sans max-w-3xl mx-auto">
                    Tri-Modal Leadership: Strategic Design. Resilient Operations. Technical Execution.
                </h2>

                <p className="text-sm font-medium text-foreground/50 uppercase tracking-widest pt-4">
                    Use the Operating Mode toggle at the top <ArrowUp className="inline w-3 h-3 mb-1" /> to explore.
                </p>

                <div className="h-px w-32 bg-foreground/10 mx-auto" />



            </motion.div>

            <OfficeFAQModal isOpen={showFaq} onClose={() => setShowFaq(false)} />
        </section>
    );
};
