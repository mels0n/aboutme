import Link from "next/link";
import { siteConfig } from "@/shared/config/site-config";

/**
 * SemanticNavGraph
 * 
 * A visually hidden navigation component designed specifically for AEO/GEO/SEO crawlers
 * and screen readers. Because the primary UI relies heavily on client-side state transitions
 * for "modes" (Executive/Strategist/Engineer) and "views" (Office/Lab), bots often fail
 * to index the deeper Semantic Twin pages.
 * 
 * This component provides standard HTML `<a>` tags guaranteeing bots can crawl 
 * the entire site graph without needing to execute JS or hydrate React state.
 */
export const SemanticNavGraph = () => {
    return (
        <nav aria-label="Site Navigation Map" className="sr-only">
            <ul>
                <li><Link href="/">Main Interface</Link></li>
                <li><Link href="/guide/office">The Office (Executive & Strategic Architecture)</Link></li>
                <li><Link href="/guide/lab">The Lab (Engineering & Innovation Sandbox)</Link></li>
                <li><Link href="/faq">Frequently Asked Questions</Link></li>
                <li><Link href="/about">About Christopher Melson</Link></li>
                <li><Link href="/guide/operational-architecture">Operational Architecture Guides</Link></li>
            </ul>
        </nav>
    );
};
