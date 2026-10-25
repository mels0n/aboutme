import Link from "next/link";
import { siteConfig } from "@/shared/config/site-config";
import { UntapBadge } from "@/shared/ui/UntapBadge";
import { Github, Linkedin } from "lucide-react";

// Visible links to every section, on every page. The home page's content is
// an interactive app, so this is how readers and crawlers reach the rest of
// the site from it.
const SITE_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/guide/operational-architecture", label: "Operational Architecture" },
    { href: "/guide/operational-architecture/case-studies", label: "Case Studies" },
    { href: "/guide/operational-architecture/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/guide/office", label: "The Office" },
    { href: "/guide/lab", label: "The Lab" },
    { href: siteConfig.links.cvPdf, label: "Resume (PDF)" },
];

export const Footer = () => {
    return (
        <footer role="contentinfo" className="relative z-10 w-full py-12 border-t border-border bg-surface/50 text-foreground">
            <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">

                <nav aria-label="Site">
                    <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm font-sans">
                        {SITE_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-foreground/75 hover:text-foreground underline-offset-4 hover:underline transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* 1. Identity Verification (Trust Signal) */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="text-sm font-bold font-display uppercase tracking-wider">
                            Christopher Melson
                        </span>
                        <span className="text-xs text-foreground/70 font-mono">
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
                            className="text-foreground/70 hover:text-blue-600 transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noopener noreferrer me"
                            aria-label="GitHub Profile"
                            className="text-foreground/70 hover:text-foreground transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    </nav>

                    {/* 3. Copyright */}
                    <div className="flex flex-col items-center md:items-end gap-1">
                        <div className="text-xs text-foreground/70 font-serif italic">
                            &copy; {new Date().getFullYear()} All Rights Reserved.
                        </div>
                        <div className="text-xs text-foreground/70">
                            <UntapBadge type="Built" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
