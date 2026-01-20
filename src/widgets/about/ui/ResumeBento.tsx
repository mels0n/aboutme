"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { FileText, ArrowUpRight, Printer, FileJson } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { BlueprintGrid } from "../../office-view/ui/branding/BlueprintGrid";
import { ExecutiveAbstract } from "../../office-view/ui/branding/ExecutiveAbstract";
import { TechMatrix } from "../../office-view/ui/branding/TechMatrix";

const ResumeLink = ({ href, icon: Icon, label, subLabel, external = false, mode, onClick }: { href: string; icon: any; label: string; subLabel: string; external?: boolean; mode?: 'executive' | 'strategist' | 'engineer'; onClick?: (e: React.MouseEvent) => void }) => (
    <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick}
        className={cn(
            "group flex items-center justify-between w-full p-2.5 rounded-lg transition-colors border cursor-pointer",
            mode === 'engineer' ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200" :
                mode === 'strategist' ? "bg-indigo-900/10 hover:bg-indigo-900/20 border-indigo-200/50" :
                    "bg-blue-50/50 hover:bg-blue-100/60 border-blue-100" // Executive
        )}
    >
        <div className="flex items-center gap-3">
            <div className={cn(
                "p-1.5 rounded-md",
                mode === 'engineer' ? "bg-emerald-200/50 text-emerald-800" :
                    mode === 'strategist' ? "bg-indigo-100/50 text-indigo-700" :
                        "bg-blue-100 text-blue-600"
            )}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
                <span className={cn(
                    "text-xs font-bold leading-tight",
                    mode === 'engineer' ? "text-emerald-900" :
                        mode === 'strategist' ? "text-indigo-900" :
                            "text-blue-900"
                )}>{label}</span>
                <span className={cn(
                    "text-[9px] font-medium uppercase tracking-wider",
                    mode === 'engineer' ? "text-emerald-700/60" :
                        mode === 'strategist' ? "text-indigo-700/60" :
                            "text-blue-600/60"
                )}>{subLabel}</span>
            </div>
        </div>
        {external && <ArrowUpRight className={cn(
            "w-3 h-3 transition-colors",
            mode === 'engineer' ? "text-emerald-600/50 group-hover:text-emerald-800" :
                mode === 'strategist' ? "text-indigo-400/50 group-hover:text-indigo-600" :
                    "text-blue-400/50 group-hover:text-blue-600"
        )} />}
    </a>
);

export const ResumeBento = ({ mode = 'executive' }: { mode?: 'executive' | 'strategist' | 'engineer' }) => {
    const [resumeUrl, setResumeUrl] = useState<string>("/christopher-melson-cv.pdf");

    useEffect(() => {
        setResumeUrl(`/christopher-melson-cv.pdf?v=${Date.now()}`);
    }, []);

    const handlePrint = (e: React.MouseEvent) => {
        e.preventDefault();
        const pdfUrl = "/chris-melson.pdf";

        // Create hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
            // small delay to ensure rendering
            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                // cleanup after interaction (though print blocks, so safe to leave for a bit or cleanup on next print)
            }, 500);
        };
    };

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

            <div className="relative z-10 space-y-1">
                <h3 className={cn(
                    "font-display font-black text-xl leading-none tracking-tight",
                    mode === 'engineer' ? "text-emerald-900" :
                        mode === 'strategist' ? "text-[#3f2e1a]" :
                            "text-slate-900"
                )}>
                    RESUME
                </h3>
            </div>



            <div className="relative z-10 space-y-1.5 mt-3">
                <ResumeLink
                    href={resumeUrl}
                    icon={FileText}
                    label="View CV"
                    subLabel="Visual"
                    external
                    mode={mode}
                />
                <ResumeLink
                    href="/chris-melson.pdf"
                    icon={Printer}
                    label="Print CV"
                    subLabel="A4 / Letter"
                    mode={mode}
                    onClick={handlePrint}
                />
                <ResumeLink
                    href="/cv.json"
                    icon={FileJson}
                    label="JSON CV"
                    subLabel="Schema"
                    external
                    mode={mode}
                />
            </div>
        </motion.div >
    );
};
