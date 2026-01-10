import { ChevronRight, Compass, Server, Users } from "lucide-react";

export const GatekeeperSkeleton = () => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 md:px-6 opacity-100">
            {/* Glassmorphism Backdrop */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">

                <div className="max-w-4xl text-center space-y-12 p-8 md:p-12 rounded-2xl bg-surface/30 border border-white/10 shadow-2xl backdrop-blur-md">
                    {/* Headline */}
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight max-w-3xl mx-auto">
                            This Portfolio is Polymorphic.
                        </h1>
                        <p className="text-base md:text-lg text-foreground/80 font-serif leading-relaxed max-w-3xl mx-auto">
                            Just as I translate between <span className="font-bold text-foreground">Boardroom Ambition</span> and <span className="font-bold text-foreground">Server Room Reality</span>, this site adapts to your language.
                        </p>
                    </div>

                    {/* Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left opacity-80">
                        {/* We render the visual cards but static */}
                        {/* The Boardroom */}
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Users className="w-5 h-5 text-foreground/70" />
                                <strong className="text-xs font-sans font-bold tracking-widest uppercase text-foreground/70">The Boardroom</strong>
                            </div>
                            <p className="text-xs text-foreground/60 leading-relaxed font-medium">Translates Technical Debt into P&L Risk & EBITDA.</p>
                        </div>

                        {/* The Architect */}
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Compass className="w-5 h-5 text-indigo-400" />
                                <strong className="text-xs font-sans font-bold tracking-widest uppercase text-indigo-400/70">The Architect</strong>
                            </div>
                            <p className="text-xs text-foreground/60 leading-relaxed font-medium">Translates Vision into Target Operating Models & Value Streams.</p>
                        </div>

                        {/* The Engine Room */}
                        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Server className="w-5 h-5 text-emerald-400" />
                                <strong className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400/70">The Engine Room</strong>
                            </div>
                            <p className="text-xs text-foreground/60 leading-relaxed font-medium">Translates Business Logic into Resilient Code & Zero Trust Security.</p>
                        </div>
                    </div>

                    {/* Button Placeholder */}
                    <div className="pt-4">
                        <span className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-foreground/60">
                            Loading...
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
