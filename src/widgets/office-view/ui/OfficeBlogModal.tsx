import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Copy, Check } from "lucide-react";
import { useState } from "react";
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

    const handleShare = () => {
        if (!post) return;
        const url = `${window.location.origin}/?mode=${mode}&blog=${post.slug}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {post && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
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
                        className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-surface border border-border shadow-2xl relative z-10 flex flex-col rounded-lg touch-pan-y"
                        onPanEnd={(e, info) => {
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
                        <div className="relative z-10 overflow-y-auto p-6 md:p-10">
                            <div className="prose prose-lg prose-slate max-w-none text-foreground/80 leading-relaxed font-serif">
                                {post.content.split('\n').map((line, i) => {
                                    if (line.startsWith('### ')) {
                                        return (
                                            <h3 key={i} className={cn(
                                                "text-xl font-bold font-display mt-8 mb-4",
                                                mode === 'engineer' ? "text-green-700" :
                                                    mode === 'strategist' ? "text-indigo-700" : "text-blue-900"
                                            )}>
                                                {line.substring(4)}
                                            </h3>
                                        );
                                    }
                                    if (line.startsWith('#### ')) {
                                        return (
                                            <h4 key={i} className="text-lg font-bold font-display mt-6 mb-3 opacity-90">
                                                {line.substring(5)}
                                            </h4>
                                        );
                                    }
                                    if (line.startsWith('* ')) {
                                        return (
                                            <div key={i} className={cn(
                                                "flex gap-3 mb-4 pl-4 border-l-2 py-1",
                                                mode === 'engineer' ? "border-green-500/30 text-green-800 bg-green-50/20" :
                                                    mode === 'strategist' ? "border-indigo-500/30 text-indigo-800 bg-indigo-50/20" : "border-blue-500/30 text-blue-900 bg-blue-50/20"
                                            )}>
                                                <span className="font-bold pl-2">•</span>
                                                <div className="pr-2"><span dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>
                                            </div>
                                        );
                                    }

                                    // Numbered Lists
                                    if (/^\d+\.\s/.test(line)) {
                                        return (
                                            <div key={i} className="flex gap-3 mb-3 pl-4">
                                                <span className={cn(
                                                    "font-mono font-bold",
                                                    mode === 'engineer' ? "text-green-700" :
                                                        mode === 'strategist' ? "text-indigo-700" : "text-blue-800"
                                                )}>
                                                    {line.split('.')[0]}.
                                                </span>
                                                <span className="text-foreground/90 font-medium">
                                                    <span dangerouslySetInnerHTML={{ __html: line.substring(line.indexOf(' ') + 1).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                </span>
                                            </div>
                                        );
                                    }

                                    // Separators
                                    if (line.trim() === '---') {
                                        return <hr key={i} className="my-8 border-border/50" />;
                                    }

                                    // Works Cited Header
                                    if (line.trim() === 'Works Cited & Notes') {
                                        return (
                                            <h4 key={i} className="text-xs font-bold font-sans mt-8 mb-3 uppercase tracking-widest opacity-60">
                                                {line}
                                            </h4>
                                        );
                                    }

                                    // Citations
                                    if (/^\[\d+\]/.test(line)) {
                                        return (
                                            <p key={i} className="mb-1 text-[10px] md:text-xs text-foreground/50 leading-relaxed font-mono">
                                                {line}
                                            </p>
                                        );
                                    }

                                    // Empty lines
                                    if (line.trim() === '') return null;

                                    return (
                                        <p key={i} className="mb-4 text-foreground/80">
                                            <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        </p>
                                    );
                                })}
                            </div>

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
