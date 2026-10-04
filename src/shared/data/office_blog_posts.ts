// Raw post registry: every post, published or not, with no date filtering.
// Only scripts/generate-published-posts.ts may import this module; the site
// reads src/shared/data/published_blog_posts.ts, which holds the posts that
// are live as of the build. ESLint enforces the restriction.
import type { BlogPost } from "./blog-post-type";
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
import { tabletopTime } from "./blog-posts/tabletop-time";
import { jellyfinLiveTvDispatcharr } from "./blog-posts/jellyfin-live-tv-dispatcharr";
import { youthSoccerVideoPipelineTraceGotsportJellyfin } from "./blog-posts/youth-soccer-video-pipeline-trace-gotsport-jellyfin";
import { governingAiAgentsApprovalGateModel } from "./blog-posts/governing-ai-agents-approval-gate-model";
import { gerrymanderingSimpleUnbiasedFixShortestSplitline } from "./blog-posts/gerrymandering-simple-unbiased-fix-shortest-splitline";

export type { BlogPost } from "./blog-post-type";

export const allOfficeBlogPosts: BlogPost[] = [
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
    lifxVlanIotDiscovery,
    tabletopTime,
    jellyfinLiveTvDispatcharr,
    youthSoccerVideoPipelineTraceGotsportJellyfin,
    governingAiAgentsApprovalGateModel,
    gerrymanderingSimpleUnbiasedFixShortestSplitline
];
