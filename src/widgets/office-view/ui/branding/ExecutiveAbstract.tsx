export const ExecutiveAbstract = ({ className }: { className?: string }) => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" className="text-slate-900/5 fill-current" />
                </pattern>
            </defs>

            {/* Subtle Dot Grid (Structure) */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Top Corporate Accent Bar */}
            <rect x="0" y="0" width="100%" height="4" className="text-slate-900/10 fill-current" />
        </svg>
    </div>
);
