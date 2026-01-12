"use client";

import resume from "@/shared/data/resume.json";
import { ResumeItem } from "@/shared/types/resume";
import { ArrowDownCircle } from "lucide-react";

export const OfficeExperience = () => {
    return (
        <section className="w-full max-w-4xl mx-auto pt-16 border-t border-border">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/70">
                    Operational History
                </h2>
                <a
                    href="/christopher-melson-cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground hover:opacity-70 transition-opacity"
                >
                    <ArrowDownCircle className="w-4 h-4" />
                    Download Full CV
                </a>
            </div>

            <div className="relative border-l border-border ml-3 space-y-12">
                {resume.sections.experience.items.slice(0, 3).map((job: ResumeItem) => (
                    <div key={job.id} className="relative pl-8 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-background border border-foreground/30 rounded-full group-hover:border-foreground group-hover:bg-foreground transition-colors" />

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-3">
                            <h3 className="text-xl font-bold font-display text-foreground">
                                {job.company}
                            </h3>
                            <span className="text-sm font-mono text-foreground/70">
                                {job.date}
                            </span>
                        </div>

                        <div className="text-sm font-medium text-foreground/70 mb-4 font-serif italic">
                            {job.position}
                        </div>

                        <div
                            className="prose prose-sm max-w-none text-foreground/80 leading-relaxed [&_ul]:list-none [&_ul]:pl-0 [&_li]:mb-2 [&_li]:pl-4 [&_li]:border-l-2 [&_li]:border-transparent hover:[&_li]:border-foreground/20 hover:[&_li]:pl-4 transition-all"
                            dangerouslySetInnerHTML={{ __html: job.summary }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
