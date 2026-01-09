export const TechMatrix = ({ className }: { className?: string }) => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="tech-matrix" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" fillOpacity="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tech-matrix)" />

            {/* Random "Glitch" or Active Nodes */}
            <circle cx="10%" cy="20%" r="2" fill="currentColor" className="animate-pulse" />
            <circle cx="80%" cy="50%" r="2" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <circle cx="40%" cy="80%" r="2" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        </svg>
    </div>
);
