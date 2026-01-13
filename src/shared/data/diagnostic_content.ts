
export interface DiagnosticValue {
    title: string;
    description: string;
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
            part1: "The era of the \"Generalist Operations Executive\", who simply keeps the lights on, is over.",
            part2: "An Operational Architect does not just run the machine; I design the underlying systems that create resilience."
        }
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
    }
};
