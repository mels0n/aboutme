"use client";

import { aboutContent } from "@/shared/data/about-content";
import { ExternalLink, Github, Linkedin, FileText, ArrowDownToLine } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

export const BentoSidebar = () => {
    const { links } = aboutContent;

    return (
        <aside className="space-y-4 md:sticky md:top-24 w-full md:w-64 shrink-0">
            {/* CV Download Block */}
            <a
                href={links.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 bg-slate-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
                <div className="flex items-center justify-between mb-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <ArrowDownToLine className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="font-bold text-sm">Download CV</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">PDF Format</div>
            </a>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-3">
                <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-surface border border-border rounded-xl hover:border-foreground/20 transition-colors group"
                >
                    <Github className="w-5 h-5 mb-2 text-foreground/70 group-hover:text-foreground" />
                    <div className="text-xs font-bold text-foreground">GitHub</div>
                    <div className="text-[10px] text-foreground/50">@mels0n</div>
                </a>

                <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:border-blue-200 transition-colors group"
                >
                    <Linkedin className="w-5 h-5 mb-2 text-blue-700" />
                    <div className="text-xs font-bold text-blue-900">LinkedIn</div>
                    <div className="text-[10px] text-blue-700/60">Connect ↗</div>
                </a>
            </div>


        </aside>
    );
};
