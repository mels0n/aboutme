import { cn } from "@/shared/lib/utils";

interface LiveDotProps {
    /** Tailwind background class for the dot, e.g. `bg-emerald-500`. */
    color?: string;
    className?: string;
}

/**
 * Small pulsing dot marking a value as a live reading rather than a static figure.
 * The ping ring only animates when the visitor has not asked for reduced motion.
 */
export function LiveDot({ color = "bg-emerald-500", className }: LiveDotProps) {
    return (
        <span className={cn("relative inline-flex h-1.5 w-1.5 shrink-0", className)} aria-hidden="true">
            <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping", color)} />
            <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", color)} />
        </span>
    );
}
