"use client";

import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

interface TrustBadgeProps {
    label: string;
    className?: string;
}

export const TrustBadge = ({ label, className }: TrustBadgeProps) => {
    const { mode } = usePersonaStore();

    // Boardroom: Bank Seal / Verified
    if (mode === 'executive') {
        return (
            <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 shadow-sm",
                className
            )}>
                <div className="w-2 h-2 rounded-full bg-blue-700" />
                <span className="text-xs font-serif font-bold tracking-wide text-slate-800 uppercase">
                    {label}
                </span>
            </div>
        );
    }

    // Architect: Blueprint / Spec Stamp
    if (mode === 'strategist') {
        return (
            <div className={cn(
                "inline-flex items-center px-3 py-1 border border-dashed border-indigo-400 bg-indigo-50/50",
                className
            )}>
                <span className="text-xs font-mono font-medium text-indigo-900 uppercase tracking-widest">
                    [REF: {label}]
                </span>
            </div>
        );
    }

    // Engineer (Engine Room): Terminal
    if (mode === 'engineer') {
        return (
            <div className={cn(
                "inline-flex items-center px-2 py-0.5 bg-black border border-green-500/30",
                className
            )}>
                <span className="text-xs font-mono text-green-500">
                    &lt;{label}&gt;
                </span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 h-3 bg-green-500 ml-1 block"
                />
            </div>
        );
    }

    return null;
};
