import { useState } from "react";
import { motion } from "framer-motion";
import { OfficeFAQModal } from "./OfficeFAQModal";
import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { ArrowUp } from "lucide-react";
import { ResumeBento } from "@/widgets/about/ui/ResumeBento";
import { FAQBento } from "./FAQBento";

interface OfficeHeroProps {
    mode?: 'executive' | 'strategist' | 'engineer';
}

export const OfficeHero = ({ mode: propMode }: OfficeHeroProps) => {
    const { mode: storeMode, introDismissed } = usePersonaStore();
    const mode = propMode || storeMode;
    const [showFaq, setShowFaq] = useState(false);
    const [faqView, setFaqView] = useState<'definition' | 'diagnosis'>('definition');

    return (

        <section className="w-full flex flex-col items-center text-center space-y-8 pt-0 pb-16 relative">

            {/* Visual Connector to Nav Bar */}
            <motion.div
                initial={{ height: 0 }}
                animate={introDismissed ? { height: 48 } : { height: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-0 w-px bg-gradient-to-b from-border to-transparent opacity-50 hidden md:block"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={introDismissed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative"
            >

                {/* 1. Left: Resume Bento (Desktop: span 2/3, Mobile: span 1) */}
                <div className="hidden md:flex md:col-span-3 lg:col-span-2 justify-end order-first">
                    <ResumeBento mode={mode} />
                </div>

                {/* 2. Center: Hero Content - Col Span 6/8 */}
                <div className="space-y-8 md:col-span-6 lg:col-span-8 flex flex-col items-center text-center mx-auto">
                    {/* 0. Identity */}
                    <div>
                        <h2 className={cn(
                            "text-sm md:text-base font-bold text-foreground/80 uppercase",
                            mode === 'engineer' ? "tracking-widest" : "tracking-[0.3em]"
                        )}>
                            Chris Melson
                        </h2>
                        <p className="text-xs md:text-sm font-serif italic text-foreground/60 mt-1">
                            Ensuring Strategy Survives Contact with Reality
                        </p>
                    </div>

                    {/* 1. Headline */}
                    <h1 className={cn(
                        "text-5xl md:text-7xl font-bold text-foreground relative inline-block font-display",
                        mode === 'engineer' ? "tracking-tighter" : "tracking-tight"
                    )}>
                        Operational <span className="relative inline-block">
                            Architect
                        </span><br />

                        <span className="relative z-10">for the Agentic Age.</span>
                    </h1>

                    {/* 2. Sub-Headline */}
                    {/* 2. Sub-Headline */}
                    <h2 className={cn(
                        "text-lg md:text-xl font-light text-foreground/80 font-sans max-w-3xl mx-auto",
                        mode === 'engineer' ? "tracking-tight" : "tracking-wide"
                    )}>
                        Tri-Modal Leadership: Strategic Design. Resilient Operations. Technical Execution.
                    </h2>

                    <p className={cn(
                        "text-sm font-medium uppercase tracking-widest pt-4 transition-colors duration-300",
                        mode === 'engineer' ? "text-emerald-600" :
                            mode === 'strategist' ? "text-indigo-600" :
                                "text-blue-600"
                    )}>
                        Use the Operating Mode toggle at the top <ArrowUp className="inline w-3 h-3 mb-1" /> to explore.
                    </p>

                    <div className="h-px w-32 bg-foreground/10 mx-auto" />
                </div>

                {/* 3. Right: FAQ Bento (Desktop Only) - Col Span 2/3 */}
                <div className="hidden md:flex md:col-span-3 lg:col-span-2 justify-start order-last">
                    <FAQBento
                        mode={mode}
                        onWhatIsIt={() => { setFaqView('definition'); setShowFaq(true); }}
                        onDoINeedOne={() => { setFaqView('diagnosis'); setShowFaq(true); }}
                    />
                </div>

            </motion.div>

            <OfficeFAQModal
                isOpen={showFaq}
                onClose={() => setShowFaq(false)}
                view={faqView}
            />
        </section >
    );
};
