import { ArrowRight, RotateCw, ChevronRight, CornerRightUp } from "lucide-react";

/**
 * A bold, linear right arrow icon designed to evoke the style of classic presentation software.
 * 
 * @param className - Optional CSS classes for styling (e.g., color, size).
 */
export const PowerPointArrow = ({ className }: { className?: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 12H18M18 12L14 8M18 12L14 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * A circular "refresh" style arrow icon representing a magic tap or cycle action.
 * Consists of an arc and an arrow head.
 * 
 * @param className - Optional CSS classes for styling.
 */
export const MagicTapArrow = ({ className }: { className?: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* The Arc - Draws a partial circle starting from right, going counter-clockwise */}
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* The Arrow Head - Points to the end of the arc flow */}
        <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * A recursive text-based arrow representation used for terminal/command-line aesthetics.
 * Renders as a standard prompt symbol `>_`.
 * 
 * @param className - Optional CSS classes (font size, color). Usually mixed with font-mono.
 */
export const LinuxPromptArrow = ({ className }: { className?: string }) => (
    <span className={`font-mono font-bold text-lg ${className}`}>&gt;_</span>
);
