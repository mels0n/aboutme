export const BlueprintGrid = ({ className }: { className?: string }) => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Grid Pattern */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        </svg>
        {/* Nodes and Flow Lines */}
        <svg className="absolute top-0 right-0 w-1/2 h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="20" cy="20" r="1" fill="currentColor" />
            <circle cx="80" cy="80" r="1" fill="currentColor" />
            <path d="M20 20 C 50 20, 50 80, 80 80" stroke="currentColor" strokeWidth="0.2" fill="none" strokeDasharray="1 1" />
        </svg>
    </div>
);
