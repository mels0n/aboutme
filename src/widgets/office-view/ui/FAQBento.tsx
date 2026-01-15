"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";

interface FAQBentoProps {
    mode?: 'executive' | 'strategist' | 'engineer';
    onWhatIsIt: () => void;
    onDoINeedOne: () => void;
}

export const FAQBento = ({ mode = 'executive', onWhatIsIt, onDoINeedOne }: FAQBentoProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "w-full md:w-56 lg:w-48 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 shrink-0 h-auto self-stretch min-h-[220px]",
                "bg-surface/50 border border-border hover:border-foreground/30 relative overflow-hidden group"
            )}
        >
            {/* Polymorphic Backgrounds */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
                {mode === 'strategist' && <BlueprintGrid />}
                {mode === 'executive' && <ExecutiveAbstract />}
                {mode === 'engineer' && <TechMatrix />}
            </div>

            <div className="relative z-10 space-y-1 mb-4">
                <h3 className={cn(
                    "font-display font-black text-xl leading-none tracking-tight",
                    mode === 'engineer' ? "text-emerald-900" :
                        mode === 'strategist' ? "text-[#3f2e1a]" :
                            "text-slate-900"
                )}>
                    OPERATIONAL
                    <br />
                    ARCHITECT
                </h3>
            </div>

            <div className="relative z-10 flex flex-col gap-3 mt-auto">
                {/* Button 1: What is it? */}
                <button
                    onClick={onWhatIsIt}
                    className={cn(
                        "flex items-center justify-between w-full py-4 px-3 rounded-lg transition-colors border group/btn",
                        mode === 'engineer' ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200" :
                            mode === 'strategist' ? "bg-indigo-900/10 hover:bg-indigo-900/20 border-indigo-200/50" :
                                "bg-blue-50/50 hover:bg-blue-100/60 border-blue-100"
                    )}
                >
                    <span className={cn(
                        "text-xs font-bold leading-tight",
                        mode === 'engineer' ? "text-emerald-900" :
                            mode === 'strategist' ? "text-indigo-900" :
                                "text-blue-900"
                    )}>What is it?</span>
                    <ArrowUpRight className={cn(
                        "w-4 h-4 opacity-60 group-hover/btn:opacity-100 transition-opacity",
                        mode === 'engineer' ? "text-emerald-800" :
                            mode === 'strategist' ? "text-indigo-900" :
                                "text-blue-700"
                    )} />
                </button>

                {/* Button 2: Do I need one? */}
                <button
                    onClick={onDoINeedOne}
                    className={cn(
                        "flex items-center justify-between w-full py-4 px-3 rounded-lg transition-colors border group/btn",
                        mode === 'engineer' ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200" :
                            mode === 'strategist' ? "bg-indigo-900/10 hover:bg-indigo-900/20 border-indigo-200/50" :
                                "bg-blue-50/50 hover:bg-blue-100/60 border-blue-100"
                    )}
                >
                    <span className={cn(
                        "text-xs font-bold leading-tight",
                        mode === 'engineer' ? "text-emerald-900" :
                            mode === 'strategist' ? "text-indigo-900" :
                                "text-blue-900"
                    )}>Do I need one?</span>
                    <ArrowUpRight className={cn(
                        "w-4 h-4 opacity-60 group-hover/btn:opacity-100 transition-opacity",
                        mode === 'engineer' ? "text-emerald-800" :
                            mode === 'strategist' ? "text-indigo-900" :
                                "text-blue-700"
                    )} />
                </button>
            </div>
        </motion.div>
    );
};
