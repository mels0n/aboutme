export interface ProjectData {
    title: string;
    description: string;
    link: string;
    website?: string;
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
        title: "HVAC Manager",
        description: "Climate engine on top of a Nest thermostat. Plans each day at 5 AM from the forecast, trims the cooling setpoint when indoor air is humid, and sends a Telegram prompt when the outdoor air is good enough to open the windows. Today's plan: {{Plan}}. Humidity trim: {{Humidity Trim}}.",
        link: "github.com/mels0n/HA_hvac_manager",
        image: "/hvac_manager.png",
        kpis: [{ label: "Plan", value: "-" }, { label: "Humidity Trim", value: "-" }],
        liveStats: {
            url: "/api/circadian",
            mapping: {
                "sensor.public_hvac_plan": "Plan",
                "sensor.public_hvac_humidity_trim": "Humidity Trim"
            }
        },
        manaCost: "{2}{G}{U}",
        typeLine: "Legendary Artifact Creature - Construct Advisor",
        flavorText: "Seventy-four degrees is a lie when the air is wet.",
        tags: ["home-assistant", "nest", "telegram"]
    },
    {
        title: "Holiday Porch Lights",
        description: "Nightly porch lighting driven by calendars, not hardcoded dates. Picks a themed scene from the holiday calendar (with lead-up days before the big ones), flies STL CITY SC colors on match days, and falls back to white. Tonight: {{Tonight}}.",
        link: "github.com/mels0n/HA_holiday_porch_lights",
        image: "/holiday_porch.png",
        kpis: [{ label: "Tonight", value: "-" }, { label: "Lead Time", value: "Up to 25d" }],
        liveStats: {
            url: "/api/circadian",
            mapping: { "input_text.porch_theme": "Tonight" }
        },
        manaCost: "{W}{R}",
        typeLine: "Enchantment - Aura",
        flavorText: "On match day, the porch wears the crest.",
        tags: ["home-assistant", "calendar", "lifx"]
    },
    {
        title: "LIFX Adopter",
        description: "Zero-touch recovery for a 60-bulb LIFX fleet. After a bulb is factory reset, a node with an idle WiFi radio finds its setup network, hands it the IoT credentials over the LAN protocol, and confirms success from the bulb's own reply instead of guessing.",
        link: "github.com/mels0n/lifx-adopt",
        image: "/lifx_adopter.png",
        kpis: [{ label: "Fleet", value: "60 Bulbs" }, { label: "Clicks After Reset", value: "0" }],
        manaCost: "{1}{U}{U}",
        typeLine: "Artifact Creature - Shepherd",
        flavorText: "Every lost bulb finds its way home.",
        tags: ["python", "wifi", "linux"]
    },
    {
        title: "Polymorphic Portfolio",
        description: "This very website. A trimodal interactive portfolio powered by Next.js, Tailwind, and Framer Motion. Features hot-swappable persona modes.",
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
        website: "https://www.tabletoptime.us",
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
        website: "https://retirement.melson.us",
        image: "/retirement.png",
        kpis: [{ label: "ROI", value: "Maximized" }, { label: "Risk", value: "Mitigated" }],
        manaCost: "{1}",
        typeLine: "Legendary Artifact - Equipment",
        flavorText: "Death and taxes. One can be delayed.",
        tags: ["finance", "algorithm", "python"]
    },
    {
        title: "Splitline Generator",
        description: "Draws every U.S. House district from 2020 Census block counts in three fixed steps: cut the state along the shortest line that splits its people evenly, keep census blocks whole, then balance single border blocks. No party data, no election results, no incumbent addresses. The math is engine independent, so anyone who runs it gets the identical map.",
        link: "github.com/mels0n/str-redistricting",
        image: "/splitline_generator.png",
        kpis: [{ label: "States", value: "50 of 50" }, { label: "Widest Range", value: "31 people" }],
        manaCost: "{3}{W}{W}",
        typeLine: "Legendary Sorcery",
        flavorText: "The shortest line between two voters is a straight one.",
        tags: ["typescript", "census", "civic-tech"]
    },
    {
        title: "Fair House Maps",
        description: "Public viewer for the generated maps, built on MapLibre. Find your district by address, scrub through every cut, replay each balancing move block by block, and compare against the 119th Congress lines. Every state publishes its population range and the SHA-256 of its block assignment so the numbers can be checked.",
        link: "github.com/mels0n/str-redistricting",
        website: "https://str-redistricting.vercel.app",
        image: "/fair_house_maps.png",
        kpis: [{ label: "House Seats", value: "435" }, { label: "Partisan Inputs", value: "0" }],
        manaCost: "{2}{W}{U}",
        typeLine: "Legendary Enchantment",
        flavorText: "Voters pick their politicians. Not the other way around.",
        tags: ["maplibre", "vite", "civic-tech"]
    },
    {
        title: "Device Mapping Manager",
        description: "Maintained fork that revived an abandoned tool for passing hardware devices into Docker Swarm containers. Added Docker API 1.44 support, fixed a systemd reload bug by listening for DBus signals, and rebuilt packaging and CI on Go 1.24.",
        link: "github.com/mels0n/device-mapping-manager",
        image: "/device_mapping.png",
        kpis: [{ label: "Upstream", value: "Revived" }, { label: "Docker API", value: "1.44" }],
        manaCost: "{1}",
        typeLine: "Artifact Creature - Insect",
        flavorText: "The hive mind grows specific.",
        tags: ["docker", "swarm", "linux"]
    },
    {
        title: "Financial Independence Flow Chart",
        description: "A visual guide to the stages of financial independence.",
        link: "github.com/mels0n/Financial-Independence-Flow-Chart",
        website: "https://financial-independence.melson.us",
        image: "/financial_flowchart.png",
        kpis: [{ label: "Steps", value: "Infinite" }, { label: "Goal", value: "FIRE" }],
        manaCost: "{1}{R}",
        typeLine: "Artifact - Equipment",
        flavorText: "The path to freedom is paved with compounding.",
        tags: ["finance", "flowchart", "guide"]
    }
];
