import { siteConfig } from "@/shared/config/site-config";
import { Github, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <footer role="contentinfo" className="w-full py-12 mt-20 border-t border-border bg-surface/50 text-foreground">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* 1. Identity Verification (Trust Signal) */}
                <div className="flex flex-col items-center md:items-start gap-1">
                    <span className="text-sm font-bold font-display uppercase tracking-wider">
                        Christopher Melson
                    </span>
                    <span className="text-xs text-foreground/60 font-mono">
                        Operational Architect | v{siteConfig.version}
                    </span>
                </div>

                {/* 2. Semantic Social Links (rel="me" is Key for GEO) */}
                <nav aria-label="Social Links" className="flex items-center gap-6">
                    <a
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label="LinkedIn Profile"
                        className="text-foreground/60 hover:text-blue-600 transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noopener noreferrer me"
                        aria-label="GitHub Profile"
                        className="text-foreground/60 hover:text-foreground transition-colors"
                    >
                        <Github className="w-5 h-5" />
                    </a>
                </nav>

                {/* 3. Copyright */}
                <div className="text-xs text-foreground/40 font-serif italic">
                    &copy; {new Date().getFullYear()} All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};
