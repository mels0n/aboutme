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
import { localSeoForSmallBusiness } from "./blog-posts/local-seo-for-small-business";
import { macvlanDockerSwarmNetworking } from "./blog-posts/macvlan-docker-swarm-networking";
import { lifxVlanIotDiscovery } from "./blog-posts/lifx-vlan-iot-discovery";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    author: string;
    role: string;
    date: string;
    lastUpdated?: string;
    /** Never publish regardless of date, e.g. while a post is still being drafted. */
    draft?: boolean;
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

const allOfficeBlogPosts: BlogPost[] = [
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
    fractionalExecutiveFramework,
    localSeoForSmallBusiness,
    macvlanDockerSwarmNetworking,
    lifxVlanIotDiscovery
];

// Posts with a future `date` (or `draft: true`) are excluded until a build
// runs on or after that date — evaluated at both build time (SSG/sitemap)
// and client hydration, so a scheduled post never appears early.
function isPublished(post: BlogPost): boolean {
    if (post.draft) return false;
    const today = new Date().toISOString().slice(0, 10);
    return post.date <= today;
}

export const officeBlogPosts: BlogPost[] = allOfficeBlogPosts.filter(isPublished);
