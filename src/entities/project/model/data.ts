export interface ProjectData {
    title: string;
    description: string;
    link: string;
    image: string;
    kpis: { label: string; value: string }[];
    liveStats?: {
        url: string;
        mapping: Record<string, string>;
    };
    manaCost: string;
    typeLine: string;
    flavorText: string;
    tags: string[];
}

export const projects: ProjectData[] = [
    {
        title: "HA Circadian Lights",
        description: "Automated adaptive lighting engine for Home Assistant. Dynamically adjusts Kelvin {{Color Temp}} and brightness {{Brightness}} based on solar position. These are the live values from my home.",
        link: "github.com/mels0n/HA_circadian_lights",
        image: "/circadian_lights.png",
        kpis: [{ label: "Brightness", value: "-" }, { label: "Color Temp", value: "-" }],
        liveStats: {
            url: "/api/circadian",
            mapping: {
                "sensor.circadian_brightness": "Brightness",
                "sensor.circadian_color_temp": "Color Temp"
            }
        },
        manaCost: "{1}{U}{R}",
        typeLine: "Artifact Creature - Robot",
        flavorText: "The sun sets, but the light remains.",
        tags: ["home-assistant", "yaml", "automation"]
    },
    {
        title: "Polymorphic Portfolio",
        description: "This very website. A trimodal interactive portfolio powered by Next.js 14, Tailwind, and Framer Motion. Features hot-swappable persona modes.",
        link: "github.com/mels0n/aboutme",
        image: "/aboutme_portfolio.png",
        kpis: [{ label: "Lighthouse", value: "100" }, { label: "Mode", value: "Trimodal" }],
        manaCost: "{5}{U}",
        typeLine: "Artifact Creature - Turtle Warrior",
        flavorText: "It changes as you observe it.",
        tags: ["nextjs", "tailwind", "framer"]
    },
    {
        title: "Distributed Media Swarm",
        description: "Distributed transcoding construct using Docker Swarm. Parallelizes media processing across nodes for high-efficiency throughput.",
        link: "github.com/mels0n/jellyfin-rffmpeg-swarm",
        image: "/distributed_swarm.png",
        kpis: [{ label: "Efficiency", value: "+400%" }, { label: "Nodes", value: "5 Active" }],
        manaCost: "{1}{U}",
        typeLine: "Legendary Artifact Creature - Equipment Jellyfish",
        flavorText: "The swarm consumes the queue.",
        tags: ["docker", "ffmpeg", "cluster"]
    },
    {
        title: "Tabletop Scheduler",
        description: "Automated conflict resolution protocol for social coordination. Features a novel magic link system with no login requirements.",
        link: "github.com/mels0n/tabletop_scheduler",
        image: "/tabletop_scheduler.png",
        kpis: [{ label: "Conflicts", value: "0 Detected" }, { label: "Uptime", value: "99.9%" }],
        manaCost: "{0}",
        typeLine: "Legendary Artifact",
        flavorText: "Time is but a resource to be managed.",
        tags: ["typescript", "logic-solver", "calendar"]
    },
    {
        title: "Retirement Tax Planner",
        description: "Strategic forecasting engine for long-term capital preservation and tax liability minimization.",
        link: "github.com/mels0n/retirement_tax_plan",
        image: "/retirement.png",
        kpis: [{ label: "ROI", value: "Maximized" }, { label: "Risk", value: "Mitigated" }],
        manaCost: "{1}",
        typeLine: "Legendary Artifact - Equipment",
        flavorText: "Death and taxes. One can be delayed.",
        tags: ["finance", "algorithm", "python"]
    },
    {
        title: "Stop Gerrymandering",
        description: "Geospatial analysis tool correcting grid logic errors to ensure fair representation borders.",
        link: "github.com/mels0n/stopgerrymandering",
        image: "/gerrymandering.png",
        kpis: [{ label: "Fairness", value: "Optimized" }, { label: "Bias", value: "-100%" }],
        manaCost: "",
        typeLine: "Artifact Land",
        flavorText: "Draw the lines before they draw you.",
        tags: ["gis", "data-viz", "civic-tech"]
    },
    {
        title: "Device Mapping Manager",
        description: "Orchestrates device mapping into Docker Swarm containers. Enforces cgroup v1/v2 compatibility for hardware passthrough.",
        link: "github.com/mels0n/device-mapping-manager",
        image: "/device_mapping.png",
        kpis: [{ label: "Compatibility", value: "Linux" }, { label: "Target", value: "Swarm" }],
        manaCost: "{1}",
        typeLine: "Artifact Creature - Insect",
        flavorText: "The hive mind grows specific.",
        tags: ["docker", "swarm", "linux"]
    },
    {
        title: "Financial Independence Flow Chart",
        description: "A visual guide to the stages of financial independence.",
        link: "github.com/mels0n/Financial-Independence-Flow-Chart",
        image: "/financial_flowchart.png",
        kpis: [{ label: "Steps", value: "Infinite" }, { label: "Goal", value: "FIRE" }],
        manaCost: "{1}{R}",
        typeLine: "Artifact - Equipment",
        flavorText: "The path to freedom is paved with compounding.",
        tags: ["finance", "flowchart", "guide"]
    }
];
