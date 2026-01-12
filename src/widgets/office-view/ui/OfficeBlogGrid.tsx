"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogPost, officeBlogPosts } from "@/shared/data/office_blog_posts";
import { OfficeBlogModal } from "./OfficeBlogModal";
import { TrustBadge } from "@/shared/ui/TrustBadge";
import { usePersonaStore } from "@/shared/lib/store";
import { cn } from "@/shared/lib/utils";

interface OfficeBlogGridProps {
    mode?: 'executive' | 'strategist' | 'engineer';
}

export const OfficeBlogGrid = ({ mode: propMode }: OfficeBlogGridProps) => {
    const { mode: storeMode } = usePersonaStore();
    const mode = propMode || storeMode;

    const searchParams = useSearchParams();
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    // Deep Link Handler
    useEffect(() => {
        const blogSlug = searchParams.get('blog');
        if (blogSlug) {
            const post = officeBlogPosts.find(p => p.slug === blogSlug);
            if (post) {
                setSelectedPost(post);
            }
        }
    }, [searchParams]);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
            >
                {/* Section Header */}
                <div className="flex items-center gap-4">
                    <div className="h-px bg-foreground/20 flex-grow max-w-[100px]" />
                    <h2 className="text-sm font-bold tracking-[0.2em] uppercase opacity-70">
                        Operational Insights
                    </h2>
                    <div className="h-px bg-foreground/20 flex-grow" />
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-foreground/10 hover:scrollbar-thumb-foreground/20">
                    {officeBlogPosts.map((post) => (
                        <motion.div
                            key={post.id}
                            whileHover={{ y: -5 }}
                            className={cn(
                                "group cursor-pointer relative overflow-hidden rounded-lg border bg-surface/50 backdrop-blur-sm p-6 transition-colors duration-300",
                                "w-[85vw] md:w-[350px] snap-center flex-shrink-0",
                                mode === 'engineer' ? "border-green-800/20 hover:border-green-500/50 hover:bg-green-50/10" :
                                    mode === 'strategist' ? "border-indigo-800/20 hover:border-indigo-500/50 hover:bg-indigo-50/10" :
                                        "border-blue-900/20 hover:border-blue-700/50 hover:bg-blue-50/10"
                            )}
                            onClick={() => setSelectedPost(post)}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start mb-4 text-xs font-mono uppercase tracking-widest opacity-50">
                                    <span>{post.date}</span>
                                    <div className="flex items-center gap-2">
                                        <TrustBadge label={
                                            mode === 'engineer' ? "SYS: REF-2026" :
                                                mode === 'strategist' ? "STR: DAT-2026" :
                                                    "REF: OA-2026"
                                        } />
                                    </div>
                                </div>

                                <h3 className={cn(
                                    "text-xl font-bold font-display leading-tight",
                                    mode === 'engineer' ? "group-hover:text-green-600" :
                                        mode === 'strategist' ? "group-hover:text-indigo-600" : "group-hover:text-blue-700"
                                )}>
                                    {post.title}
                                </h3>

                                <p className={cn(
                                    "text-sm leading-relaxed font-serif line-clamp-3 transition-colors duration-300",
                                    mode === 'engineer' ? "text-green-900/80" :
                                        mode === 'strategist' ? "text-indigo-900/80" : "text-slate-700"
                                )}>
                                    {post.polymorphicSummary[mode]}
                                </p>

                                <div className={cn(
                                    "flex items-center gap-2 text-xs font-bold uppercase tracking-wider pt-4 transition-colors",
                                    mode === 'engineer' ? "text-green-700" :
                                        mode === 'strategist' ? "text-indigo-700" : "text-blue-800"
                                )}>
                                    Read Analysis <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <OfficeBlogModal
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
            />
        </section>
    );
};
