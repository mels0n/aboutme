import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePersonaStore } from "@/shared/lib/store";
import { BlogPost } from "@/shared/data/office_blog_posts";
import { BlueprintGrid } from "./branding/BlueprintGrid";
import { ExecutiveAbstract } from "./branding/ExecutiveAbstract";
import { TechMatrix } from "./branding/TechMatrix";
import { cn } from "@/shared/lib/utils";

interface OfficeBlogModalProps {
    post: BlogPost | null;
    onClose: () => void;
}

export const OfficeBlogModal = ({ post, onClose }: OfficeBlogModalProps) => {
    const { mode, cycleMode } = usePersonaStore();
    const [copied, setCopied] = useState(false);

    const MODE_SLUGS = {
        executive: 'strategic-design',
        strategist: 'resilient-operations',
        engineer: 'technical-execution'
    };

    const handleShare = () => {
        if (!post) return;
        const slug = MODE_SLUGS[mode];
        const url = `${window.location.origin}/mode/${slug}?blog=${post.slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (post) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [post, onClose]);

    return (
        <AnimatePresence>
            {post && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center px-4 pt-28 pb-4 sm:px-6 md:py-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        layoutId={`blog-card-${post.id}`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-4xl max-h-[85dvh] md:max-h-[90vh] overflow-hidden bg-surface border border-border shadow-2xl relative z-10 flex flex-col rounded-lg touch-pan-y"
                        onPanEnd={(e, info) => {
                            // Fix: Disable swipe on desktop or if using mouse
                            if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
                            if ((e as PointerEvent).pointerType === 'mouse') return;

                            if (info.offset.x > 50) cycleMode('prev');
                            if (info.offset.x < -50) cycleMode('next');
                        }}
                    >
                        {/* Polymorphic Background */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            {mode === 'strategist' && <BlueprintGrid />}
                            {mode === 'executive' && <ExecutiveAbstract />}
                            {mode === 'engineer' && <TechMatrix />}
                        </div>

                        {/* Header */}
                        <div className="relative z-10 flex justify-between items-start p-6 md:p-8 border-b border-border bg-surface/90 backdrop-blur-sm">
                            <div className="pr-8 flex-1">
                                <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest mb-3">
                                    <span className="flex items-center gap-1 opacity-50">
                                        <Calendar className="w-3 h-3" />
                                        {post.date}
                                    </span>
                                    <span className="opacity-50">•</span>
                                    <span className="opacity-50">{Math.ceil(post.content.split(/\s+/).length / 225)} min read</span>
                                    <span className="opacity-50">•</span>
                                    <span className={cn(
                                        "font-bold",
                                        mode === 'engineer' ? "text-green-600" :
                                            mode === 'strategist' ? "text-indigo-600" : "text-blue-600"
                                    )}>
                                        {post.role}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight">
                                    {post.title}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border border-border hover:bg-foreground/5 transition-colors"
                                >
                                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                    {copied ? "Copied" : "Share View"}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors flex-shrink-0"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="relative z-10 overflow-y-auto p-6 md:p-10 touch-pan-y">
                            {(() => {
                                const separatorRegex = /### Works Cited.*/;
                                const match = post.content.match(separatorRegex);
                                const hasWorksCited = match && match.index !== undefined;

                                const bodyContent = hasWorksCited
                                    ? post.content.substring(0, match.index)
                                    : post.content;

                                const worksCitedHeader = hasWorksCited ? match[0].replace('### ', '') : null;
                                const worksCitedContent = hasWorksCited
                                    ? post.content.substring(match.index! + match[0].length)
                                    : null;

                                return (
                                    <>
                                        <div className={cn(
                                            "prose prose-lg prose-slate max-w-none text-foreground/80 leading-relaxed font-serif",
                                            // Custom styling for tables
                                            "prose-table:border-collapse prose-table:w-full prose-table:text-sm prose-table:my-8",
                                            "prose-th:border prose-th:border-border prose-th:bg-surface/50 prose-th:p-3 prose-th:text-left prose-th:font-mono prose-th:text-xs prose-th:uppercase prose-th:tracking-wider",
                                            "prose-td:border prose-td:border-border prose-td:p-3 prose-td:align-top",
                                            // Custom styling for headers
                                            "prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground",
                                            "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
                                            // Mode-specific styles
                                            mode === 'engineer' ? "prose-headings:text-green-800 prose-a:text-green-700 prose-strong:text-green-900" :
                                                mode === 'strategist' ? "prose-headings:text-indigo-800 prose-a:text-indigo-700 prose-strong:text-indigo-900" :
                                                    "prose-headings:text-blue-800 prose-a:text-blue-700 prose-strong:text-blue-900"
                                        )}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    // Custom link component to ensure external links open in new tab
                                                    a: ({ node, ...props }) => (
                                                        <a target="_blank" rel="noopener noreferrer" {...props} />
                                                    ),
                                                    // Custom blockquote styling
                                                    blockquote: ({ node, ...props }) => (
                                                        <blockquote className={cn(
                                                            "border-l-4 pl-4 italic bg-surface/30 p-4 rounded-r-lg my-6",
                                                            mode === 'engineer' ? "border-green-500/50" :
                                                                mode === 'strategist' ? "border-indigo-500/50" : "border-blue-500/50"
                                                        )} {...props} />
                                                    )
                                                }}
                                            >
                                                {bodyContent}
                                            </ReactMarkdown>
                                        </div>

                                        {hasWorksCited && (
                                            <div className="mt-12 pt-8 border-t border-border">
                                                <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 font-mono">
                                                    {worksCitedHeader}
                                                </h3>
                                                <div className="text-xs opacity-60 space-y-2 font-mono">
                                                    <ReactMarkdown
                                                        components={{
                                                            a: ({ node, ...props }) => (
                                                                <a
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="hover:underline hover:opacity-100 transition-opacity text-foreground hover:text-foreground/80"
                                                                    {...props}
                                                                />
                                                            ),
                                                            ul: ({ node, ...props }) => (
                                                                <ul className="list-none space-y-2 pl-0" {...props} />
                                                            ),
                                                            li: ({ node, ...props }) => (
                                                                <li className="pl-0" {...props} />
                                                            ),
                                                            p: ({ node, ...props }) => (
                                                                <div className="inline" {...props} />
                                                            )
                                                        }}
                                                    >
                                                        {worksCitedContent!}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {/* Footer CTA */}
                            <div className="mt-12 pt-8 border-t border-border flex justify-center">
                                <a
                                    href={`/guide/operational-architecture/blog/${post.slug}`}
                                    className="text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                                >
                                    View Indexable Source →
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
