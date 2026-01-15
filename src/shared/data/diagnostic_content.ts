
export interface DiagnosticValue {
    title: string;
    description: string;
}

export interface ComparisonRow {
    role: string;
    steward: {
        focus: string;
        method: string;
        mindset: string;
    };
    engineer: {
        focus: string;
        method: string;
        mindset: string;
    };
    advantage: {
        label: string;
        text: string;
    }[];
    valuesHeader: {
        title: string;
        intro: string;
    };
}

export interface DiagnosticTrigger {
    title: string;
    subtitle: string;
    description: string[];
}

export const diagnosticContent = {
    header: {
        title: "What is an Operational Architect?",
        definition: {
            part1: "The era of the \"Generalist Operations Executive\" who simply keeps the lights on is over.",
            part2: "An Operational Architect does not merely run the machine; they design the underlying systems that create resilience.",
            part3: "Operational Architect is a flexible and high-impact capability rather than a static job title."
        }
    },
    valuesHeader: {
        title: "Core Competencies",
        intro: "The Operational Architect drives resilient growth through six key dimensions of execution:"
    },
    values: [
        {
            title: "1. Financial Translation",
            description: "Translating technical debt into P&L risk and EBITDA impact to align engineering reality with board expectations."
        },
        {
            title: "2. Technical Due Diligence",
            description: "Conducting forensic TDD to expose \"spaghetti code\" and security vulnerabilities before they destroy value."
        },
        {
            title: "3. Value Orchestration",
            description: "Orchestrating value streams to ensure stability and continuity during high-stakes transformation."
        },
        {
            title: "4. Regulatory Safeguarding",
            description: "Embedding rigid compliance standards (EU DORA, GDPR) into workflows to immunize the organization against regulatory risk."
        },
        {
            title: "5. Intelligence Unification",
            description: "Eliminating \"Data Blind Spots\" by migrating fragmented communication into a centralized Enterprise Stack."
        },
        {
            title: "6. Cultural Restoration",
            description: "Diagnosing and dismantling toxic \"Shadow Cultures\" to reverse high attrition and rebuild leadership density."
        }
    ] as DiagnosticValue[],
    diagnosis: {
        title: "Do You Need One?",
        subtitle: "Strategy is cheap. Execution is expensive. You need an Operational Architect when your vision outpaces your operational reality.",
        triggers: [
            {
                title: "1. You are Post-Merger (The Integration Trap)",
                subtitle: "You acquired a competitor for their market share, but you inherited their debt.",
                description: [
                    "The Tech Mismatch: Their \"proprietary tech\" is actually a siloed spaghetti of legacy code that refuses to talk to your centralized Enterprise Stack.",
                    "The Culture Clash: The \"One Company\" memo went out, but the reality is \"Us vs. Them.\" Attrition is spiking because high-performers are fleeing a toxic, unmanaged environment.",
                    "The Data Blackout: You cannot see the fire through the smoke. You are relying on localized spreadsheets rather than a unified dashboard to make P&L decisions."
                ]
            },
            {
                title: "2. You are Scaling (The Growth Paradox)",
                subtitle: "You are investing millions in \"Digital Transformation,\" but your velocity is slowing down.",
                description: [
                    "Bureaucracy as a Service: Your rigid operating model now requires 14 signatures to deploy a single line of code, paralyzing your engineers.",
                    "Process Fracture: Workflows that worked for 50 people are breaking at 500. You are throwing bodies at problems that require automation.",
                    "The \"Shadow Ops\" Risk: Your teams are bypassing IT to get things done using personal WhatsApps or unsecured tools to handle sensitive client data because the official tools are too slow."
                ]
            },
            {
                title: "3. You are Flying Blind (The Strategic Disconnect)",
                subtitle: "You lack a Target Operating Model (TOM) and rely on functional silos rather than cross-functional value streams.",
                description: [
                    "The \"Feelings\" Metric: Your decisions are based on loud opinions and anecdotes rather than forensic data. You measure \"activity\" (emails sent) rather than \"outcomes\" (resolution time).",
                    "Siloed Intelligence: Sales is selling a vision that Operations cannot deliver, and Support is fixing products that Engineering thinks are perfect.",
                    "Regulatory Exposure: You are scaling into regulated markets (DORA, GDPR) but your compliance strategy is a checkbox, not an architectural safeguard."
                ]
            }
        ] as DiagnosticTrigger[],
        closing: "\"Operational incoherence isn't just a people problem it is a design flaw. I fix the blueprint.\""
    },
    comparison: [
        {
            role: "COO",
            steward: {
                focus: "People & Process Management",
                method: "Weekly syncs, manual reporting, hiring to scale",
                mindset: "\"Keep the trains running on time.\""
            },
            engineer: {
                focus: "System Design & Automation",
                method: "Automated workflows, real-time dashboards, scaling via AI agents",
                mindset: "\"Upgrade the trains to self-driving.\""
            },
            advantage: [
                { label: "Revenue", text: "Scales output without linear headcount growth (margin expansion)." },
                { label: "AI", text: "Deploys AI to replace repetitive human loops, not just assist them." }
            ]
        },
        {
            role: "CTO",
            steward: {
                focus: "Technology Stack & Code Quality",
                method: "Agile ceremonies, vendor management, roadmap adherence",
                mindset: "\"Build it right.\""
            },
            engineer: {
                focus: "Techno-Economic Architecture",
                method: "FinOps (cost-to-value), GovOps (automated compliance), LoopScripts",
                mindset: "\"Build the right thing for the P&L.\""
            },
            advantage: [
                { label: "Compliance", text: "Embeds regulatory rules directly into the CI/CD pipeline (Policy as Code)." },
                { label: "AI", text: "Architects the \"Agentic Interface\" between human intent and machine execution." }
            ]
        },
        {
            role: "Board Member",
            steward: {
                focus: "Governance & Historical Review",
                method: "Quarterly board decks, audit committees, risk registers",
                mindset: "\"What happened last quarter?\""
            },
            engineer: {
                focus: "Real-Time Observability & Systemic Risk",
                method: "Direct access to \"The ACE Dashboard,\" predictive analytics, algorithmic auditing",
                mindset: "\"What is the system predicting for next quarter?\""
            },
            advantage: [
                { label: "Compliance", text: "Moves from \"Sample-based Auditing\" to \"Continuous 100% Verification\" via data logs." },
                { label: "Revenue", text: "Identifies systemic bottlenecks in the revenue engine instantly." }
            ]
        },
        {
            role: "Board Advisor",
            steward: {
                focus: "Mentorship & Networking",
                method: "High-level advice, introductions, sounding board",
                mindset: "\"Let me share my experience.\""
            },
            engineer: {
                focus: "Pattern Matching & Blueprinting",
                method: "diagnostic audits, architectural refactoring plans, specific toolchain selection",
                mindset: "\"Let me install this proven operating system.\""
            },
            advantage: [
                { label: "AI", text: "Provides specific blueprints for integrating AI into the company DNA, rather than vague \"AI Strategy\" advice." }
            ]
        },
        {
            role: "Head of Operations",
            steward: {
                focus: "Efficiency & Utilization",
                method: "Gantt charts, resource allocation, minimizing downtime",
                mindset: "\"Maximize billable hours.\""
            },
            engineer: {
                focus: "Flow & Throughput",
                method: "Theory of Constraints, removing friction, asynchronous handoffs",
                mindset: "\"Maximize finished value delivered.\""
            },
            advantage: [
                { label: "Revenue", text: "Faster time-to-value directly increases cash flow velocity." },
                { label: "Compliance", text: "Automated trails mean operations are \"audit-ready\" by default, reducing legal overhead." }
            ]
        },
        {
            role: "Head of Engineering",
            steward: {
                focus: "Velocity & Bug Rates",
                method: "Sprint points, stand-ups, QA teams",
                mindset: "\"Ship faster.\""
            },
            engineer: {
                focus: "Reliability & Developer Experience (DevEx)",
                method: "Platform engineering, self-serve infrastructure, automated guardrails",
                mindset: "\"Ship safely with less friction.\""
            },
            advantage: [
                { label: "AI", text: "Uses \"Test Agents\" and \"Build Agents\" to handle the 80% commodity code, freeing humans for innovation." },
                { label: "Compliance", text: "Security is not a gate; it is a built-in paved road." }
            ]
        },
        {
            role: "IC (Reporting to C-Suite)",
            steward: {
                focus: "Execution of Specific Tasks",
                method: "Completing assigned projects, managing a specific vertical",
                mindset: "\"I will deliver this project.\""
            },
            engineer: {
                focus: "Force Multiplication",
                method: "Building tools that the rest of the C-Suite uses to make decisions",
                mindset: "\"I will build the dashboard that runs the company.\""
            },
            advantage: [
                { label: "AI", text: "Acts as the \"Translator,\" turning C-Suite intent directly into prompt-engineered workflows for the organization." }
            ]
        }
    ] as ComparisonRow[]
};
