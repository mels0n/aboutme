import { agenticShift } from "./blog-posts/agentic-shift";
import { triModalTranslation } from "./blog-posts/tri-modal-translation";
import { integrationGap } from "./blog-posts/integration-gap";
import { scalabilityEngineering } from "./blog-posts/scalability-engineering";
import { generativeToAgentic } from "./blog-posts/generative-to-agentic";
import { itilProblemManagement } from "./blog-posts/itil-problem-management";
import { networkObservabilityPlatforms } from "./blog-posts/network-observability-platforms";
import { operationalArchitectGuide } from "./blog-posts/operational-architect-definitive-guide";
import { udmFirewallVsPfSense } from "./blog-posts/udm-firewall-vs-pfsense-homelab-security";
import { fractionalCtoRole } from "./blog-posts/fractional-cto-role";
import { fractionalExecutiveFramework } from "./blog-posts/fractional-executive-framework";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    author: string;
    role: string;
    date: string;
    lastUpdated?: string;
    summary: string;
    polymorphicSummary: {
        executive: string;
        strategist: string;
        engineer: string;
    };
    content: string;
    ogImage?: string;
    geoHighlights: {
        label: string;
        value: string;
    }[];
}

export const officeBlogPosts: BlogPost[] = [
    operationalArchitectGuide,
    agenticShift,
    triModalTranslation,
    integrationGap,
    scalabilityEngineering,
    generativeToAgentic,
    itilProblemManagement,
    networkObservabilityPlatforms,
    udmFirewallVsPfSense,
    fractionalCtoRole,
    fractionalExecutiveFramework
];
