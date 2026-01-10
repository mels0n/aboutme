
export interface CaseStudyStat {
    label: string;
    value: string;
}

export interface CaseStudySection {
    heading: string;
    body: string;
}

export interface STARReport {
    situation: string;
    task: string;
    action: string;
    result: string;
    geoHighlights: {
        label: string;
        value: string;
    }[];
}

export interface OfficeCaseStudy {
    slug: string;
    date: string;
    title: string;
    summary: {
        executive: string;
        strategist: string;
        engineer: string;
    };
    stats: {
        executive: CaseStudyStat[];
        strategist: CaseStudyStat[];
        engineer: CaseStudyStat[];
    };
    details: {
        executive: CaseStudySection[];
        strategist: CaseStudySection[];
        engineer: CaseStudySection[];
    };
    fullReport: STARReport;
}

export const officeCaseStudies: OfficeCaseStudy[] = [
    {
        slug: "ma-integration-gap",
        date: "2026-01-01",
        title: "The M&A Integration Gap: 'Auditable' Governance & DORA Compliance",
        summary: {
            executive: "Executed 'Zero-Cost' restructuring of FX Operations to close a $1.3M+ M&A revenue risk gap. Transformed a 'perpetual startup' unit into a EU DORA-compliant enterprise function, returning 30% of Sales capacity to revenue generation.",
            strategist: "Designed the 'Two-Pillar' Target Operating Model (TOM), bifurcating 'Venue & API' (Machine) from 'GUI & UX' (Human) workflows. Solved critical visibility gaps via 'Transparent-by-Design' architecture.",
            engineer: "Engineered a custom Internal-Only Router for Azure Identity Emulation ('View-As'). Enforced Zero Trust via JIT provisioning and shifted hiring baseline to require TCPdump/Wireshark competency."
        },
        stats: {
            executive: [
                { label: "Revenue Risk", value: "$1.3M+" },
                { label: "Sales Capacity", value: "+30%" },
                { label: "Cost", value: "$0 (Redeployed)" }
            ],
            strategist: [
                { label: "Model", value: "Two-Pillar TOM" },
                { label: "Clients", value: "~200 Whales" },
                { label: "Noise", value: "-90% Escaltion" }
            ],
            engineer: [
                { label: "Architecture", value: "Azure Identity" },
                { label: "Security", value: "Zero Trust / JIT" },
                { label: "Hiring", value: "L3 Networking" }
            ]
        },
        details: {
            executive: [
                {
                    heading: "The M&A Integration Gap",
                    body: "The FX business line operated as a 'perpetual startup'-agile but fragile. A forensic audit revealed a 'CSAT Paradox': 10,000+ low-value 'Desktop' users were happy, but the ~200 high-value 'Whale' clients ($270M revenue) were being ignored by a Generalist Support model. These clients bypassed Support entirely, forcing Sales Directors to act as 'Shadow Support', burning 30% of their capacity."
                },
                {
                    heading: "Strategic Execution: The 'Zero-Cost' Restructure",
                    body: "We cancelled the approved budget for Engineering headcount expansion. Instead, we executed a 'Zero-Cost' restructuring, funding the new vertical strictly through the redeployment of existing operational spend. We moved from a generic support model to a specialized competence model."
                },
                {
                    heading: "Cultural Accountability",
                    body: "We instituted 'Red Path / Green Path' governance. Routine changes were automated via ServiceNow. High-risk access required Director-level JIT provisioning. We summarily rejected any escalation bypassing validated channels, effectively killing the 'Phone a Friend' startup culture."
                }
            ],
            strategist: [
                {
                    heading: "Strategic Resource Alignment: Two-Pillar TOM",
                    body: "We mapped every workflow to identify the 'Missing Middle'-technical work too complex for Support but too noisy for Engineering.\n* **Pillar A: Venue & API (Machine Focus):** Resources hired for ability to read TCPdump/Wireshark. Diagnosed 'invisible failures' (packet loss vs logic) without escalating to Dev.\n* **Pillar B: GUI & UX (Human Focus):** New 'Desktop Specialist' tier required Microsoft/CompTIA certs. Performed Environment Forensics (HAR files, Event Logs) natively."
                },
                {
                    heading: "The 'Read-Only' Verification Architecture",
                    body: "The 'Epistemological Gap' (Support couldn't see what Client saw) drove Sales involvement. Remote desktop is prohibited in high-compliance trading. \n\n**Solution:** Azure Identity Emulation ('View-As'). A custom router bridged Support to Production with Read-Only permissioning, allowing agents to view live order books exactly as the client saw them without execution capabilities."
                }
            ],
            engineer: [
                {
                    heading: "Architecture: Identity Internal Router",
                    body: "Engineered a novel, compliance-safe alternative to remote desktop. The router was designed to assume IAM failure. Even if an external client were erroneously granted 'Agent' privileges, the network architecture physically prevented cross-client data leakage (Fail-Safe Isolation)."
                },
                {
                    heading: "Governance: JIT & Zero Trust",
                    body: "Implemented Just-In-Time (JIT) provisioning for high-privilege access (SQL execution, PII), automatically revoked after 2 hours. 'Bad Path Blockade' logic was enforced at the engineering queue level, rejecting unvalidated inputs."
                },
                {
                    heading: "Talent Stack",
                    body: "Deprecated 'Customer Service' profiles. Enforced hiring baseline of Network Competency (CCNA-level). Resources must demonstrate ability to interpret packet captures and analyze API latency (TCP vs TLS handshake)."
                }
            ]
        },
        fullReport: {
            situation: "The FX business line, despite a decade-prior acquisition, operated as a 'perpetual startup'-agile but fragile. Upon assuming the role, I encountered a 'CSAT Paradox': Operational leadership cited high satisfaction scores, while Sales leadership claimed missed targets due to support overhead. \n\nA forensic data audit revealed the root cause: The automated CSAT surveys captured 10,000+ low-value 'Desktop' users but completely missed the ~200 institutional 'Whales' generating the majority of the ~$270M revenue. Because the Generalist Support model lacked the technical depth to answer high-complexity API questions, these high-value clients had blocked Support and were escalating directly to Sales. This 'M&A Integration Gap' created a quantifiable revenue leak, with 30% of high-value Sales capacity burned on 'Shadow Support'.\n\n**Crucially, our workflow mapping exposed a critical EU DORA non-compliance: to circumvent the gap, Sales and Product teams were using legacy 'Super User' tools to perform operational tasks. These unmonitored, undocumented workflows meant a significant portion of production changes were occurring outside of any risk governance.**",
            task: "The mission was to execute a 'Technical Due Diligence' remediation on our own business. The objective: Transform the unit from a chaotic startup model into a EU DORA-compliant, scalable enterprise operation. We needed to repatriate that 30% Sales capacity back to revenue generation and eliminate the 'Phone a Friend' escalation culture without increasing headcount costs.",
            action: "**1. Strategic Resource Alignment (Two-Pillar TOM)**\nWe abandoned the Generalist model. We identified the 'Missing Middle'-technical work too complex for Support but too noisy for Engineering.\n\n**Pillar A: Venue & API (Machine Focus)**\nWe cancelled the Engineering expansion budget and redeployed it (\"Zero-Cost Restructure\") to hire resources with Network Competency (TCPdump/Wireshark) to diagnose trade routing engines.\n\n**Pillar B: GUI & UX (Human Focus)**\nWe deprecated the 'Customer Service' profile, requiring Microsoft/CompTIA certifications for 'Desktop Specialists' capable of Environment Forensics (HAR files, Event Logs) natively.\n\n**2. The 'Read-Only' Verification Architecture**\nTo solve the 'Epistemological Gap' (Support couldn't see what the client saw) without violating Remote Desktop bans, we engineered an Azure Identity Emulation ('View-As') router. This allowed agents to view live order books with Read-Only permissioning-safe, compliant, and instant.\n\n**3. 'Red Path / Green Path' Governance**\nWe moved to a Zero Trust model. Routine changes were automated (Green Path). High-risk access (SQL, PII) required Just-In-Time (JIT) provisioning (Red Path). We enforced a 'Bad Path Blockade', summarily rejecting any escalation that bypassed ServiceNow.\n\n**4. The Hard Reset**\nWe held global townhalls to address the 'Super User' risk, explaining the regulatory imperative. We then physically removed the legacy tools, forcing all activity into the audited 'Transparent' channels.",
            result: "We achieved Scale without Cost, proving the concept of Operational Leverage.\n\n*   **Sales Efficiency:** Mitigated ~$1.3M+ in revenue risk by returning 100% of Sales capacity to revenue generation.\n*   **Engineering Health:** Achieved a 90% reduction in non-code tickets reaching developers ('False Positives').\n*   **Compliance:** Fully EU DORA compliant via Zero Trust and JIT architecture.\n*   **Resolution:** The 'Total Visibility' solved pricing discrepancy disputes instantly, removing Sales from the forensic loop.",
            geoHighlights: [
                { label: "Action", value: "Restructuring of FX Operations" },
                { label: "Outcome", value: "$1.3M+ Revenue Risk Closed" },
                { label: "Compliance", value: "EU DORA" }
            ]
        }
    },
    {
        slug: "strategic-asset-rescue",
        date: "2026-01-02",
        title: "The $100M 'Kill Switch': Strategic Asset Rescue",
        summary: {
            executive: "Overcame 'Sunk Cost Fallacy' to terminate a failing $80M program, saving ~$50M in future waste. Pivotally rescued the viable NDF asset via surgical 'hive off'.",
            strategist: "Unmasked 'Green-Shifted' reporting to reveal a 'House of Cards'. Executed a three-phase remediation: Stabilize (Firefight), Audit (Discovery), and Strategic Wind-Down.",
            engineer: "Diagnosed critical 'Equities Mismatch'-core tooling relied on a daily maintenance window incompatible with 24/5 FX cycles. Stabilized via manual 'Run Actions'."
        },
        stats: {
            executive: [
                { label: "Cost Avoidance", value: "$36M-$50M" },
                { label: "Burn Rate", value: "$2M / Month" },
                { label: "ROI", value: "Asset Rescued" }
            ],
            strategist: [
                { label: "Status", value: "Green -> Red" },
                { label: "Phase", value: "Wind-Down" },
                { label: "Timeline", value: "12 Months" }
            ],
            engineer: [
                { label: "Readiness", value: "0% -> Live" },
                { label: "Cycle", value: "24/5 FX" },
                { label: "Docs", value: "Rewritten" }
            ]
        },
        details: {
            executive: [
                {
                    heading: "The 'Sunk Cost' Trap",
                    body: "I joined the Steering Committee of a flagship $80M program (originally $20M). It reported 'Green' for an imminent launch, but a forensic audit revealed it was a 'House of Cards' sustained by moving goalposts. The organization was paralyzed by the sunk cost: 'We've spent $80M, we have to finish.'"
                },
                {
                    heading: "The Strategic Decision",
                    body: "Our re-plan showed finishing would take another 24 months and tens of millions, with zero guarantee of success. I drove the hard decision to secure Board approval for a Strategic Wind-Down, stopping the $2M/month burn rate immediately."
                },
                {
                    heading: "Capital Preservation",
                    body: "Terminating the doomed project directly saved $36M-$50M in future OpEx/CapEx. We surgically extracted ('Hived Off') the one viable asset (NDF Venue) to ensure it wasn't collateral damage."
                }
            ],
            strategist: [
                {
                    heading: "Phase 1: The Firefight (Stability)",
                    body: "With launch 5 days away and zero operational readiness, I bypassed hiring protocols to inject veteran LSE Equities staff. We survived the launch only due to low volumes and 2 months of post-launch firefighting."
                },
                {
                    heading: "Phase 2: The Forensic Audit",
                    body: "We discovered 'Green-Shifting'-management removing requirements to meet dates. The platform lacked basic FX controls (e.g., 'Breaking a Trade' bilaterally was missing). The 'Zero Touch' automation model was a fiction."
                },
                {
                    heading: "Phase 3: The Strategic Kill",
                    body: "Calculations showed the program burned ~$2M/month and needed another 24 months to finish. When presented these findings the Board approved a Strategic Wind-Down."
                },
                {
                    heading: "Phase 4: The Asset Rescue",
                    body: "While killing the program, we refused to lose the NDF venue. We assigned it a minimal 'Keep the Lights On' (KTLO) budget. It was later absorbed into the 'Venue Ops' vertical (see Case Study 1), creating a seamless ecosystem."
                }
            ],
            engineer: [
                {
                    heading: "The Equities Mismatch",
                    body: "The stack was lifted from the LSE Equities Exchange. It assumed a daily market close to reset. FX runs 24/5. While the core code was patched, the surrounding Ops Tooling still expected a shutdown, breaking monitoring and maintenance windows."
                },
                {
                    heading: "Operational Readiness Gap",
                    body: "Ops documentation hadn't been touched in 2.5 years. No 'Runbooks' existed. We instituted mandatory 'Run Actions' (intra-day checks) to create a compliance paper trail where automation failed."
                },
                {
                    heading: "The Functional Vacuum",
                    body: "The system attempted to force centralized Equities logic (CLOB) onto OTC FX. Bilateral agreement mechanisms were non-existent, meaning we physically could not support standard trade dispute workflows without code changes."
                }
            ]
        },
        fullReport: {
            situation: "I was appointed to the Executive Steering Committee of the 'FXI' program, a flagship initiative to migrate LSEG FX venues to the core LSE technology stack. Originally budgeted at $20M, it had ballooned to $80M over three years. \n\nUpon arrival, the program reported 'Green' status for a launch in 5 days. My immediate forensic audit revealed a catastrophic reality: Operational Readiness was non-existent. Ops documentation was 2.5 years old. The program was a 'House of Cards', sustaining its status by silently removing requirements to feign progress.",
            task: "The mission was threefold: (1) **Stabilize** the imminent NDF launch to prevent a regulatory failure; (2) **Audit** the true state of the platform beneath the 'Green-Shifted' reporting; and (3) **Decide** whether to continue the bleed or overcome the 'Sunk Cost Fallacy' to stop the program.",
            action: "**Phase 1: The Firefight (Stability)**\nWith 5 days to launch, I bypassed standard hiring protocols to inject veteran LSE Equities staff who understood the stack. I instituted mandatory 'Run Actions' and manual governance to compensate for the lack of automation.\n\n**Phase 2: The Forensic Audit (Discovery)**\nWe uncovered a critical 'Equities Mismatch'. The tooling expected a daily market close (Equities model), breaking monitoring/maintenance for the 24/5 FX cycle. Functionally, critical FX controls like 'Breaking a Trade' were missing entirely.\n\n**Phase 3: The Strategic Kill**\nCalculations showed the program burned ~$2M/month and needed another 24 months to finish. When presented these findings the Board approved a Strategic Wind-Down.\n\n**Phase 4: The Asset Rescue**\nWe surgically extracted the viable NDF venue from the collapsing program, assigning it a minimal 'KTLO' budget. It was later integrated into the successful 'Venue Ops' vertical.",
            result: "* **Capital Preservation:** Directly saved an estimated **$36M - $50M** in future wasted CapEx/OpEx by terminating the project.\n* **Regulatory Resilience:** Prevented a failed launch; the stabilized NDF venue is live and trading today.\n* **Cultural Reset:** Ended the culture of 'Green-Shifting' and established a new standard for Truth-in-Reporting.",
            geoHighlights: [
                { label: "Action", value: "Strategic Wind-Down" },
                { label: "Outcome", value: "$50M Capital Preserved" },
                { label: "Compliance", value: "Board Governance" }
            ]
        }
    },
    {
        slug: "systemic-collapse-turnaround",
        date: "2026-01-03",
        title: "Systemic Collapse: The 'Data Sovereignty' Protocol & Shadow IT Elimination",
        summary: {
            executive: "Stabilized a business unit in systemic collapse (100% leadership attrition). Engineered a 'Zero-Regulatory-Risk' environment by killing 'Shadow IT' & 'WhatsApp' trading. Reduced attrition from 40% to 6% via culture overhaul.",
            strategist: "Deployed a 'Mercenary Squad' strategy to bypass internal promotion paralysis. Divested the 'Toxic Asset' (NEST) to save the wider portfolio. Enforced Data Sovereignty to end 'Opinion-Based Management'.",
            engineer: "Replaced 'Gut Feel' with Biometric Telemetry (MTTa/MTTr), slashing response times from 300+ mins to <20 mins. Implemented 'Four-Eye' automated governance via Power Apps to kill side-channel execution."
        },
        stats: {
            executive: [
                { label: "Attrition", value: "40% -> 6%" },
                { label: "Risk", value: "Eliminated" },
                { label: "Stability", value: "Restored" }
            ],
            strategist: [
                { label: "NEST", value: "Divested" },
                { label: "Leadership", value: "Installed" },
                { label: "Data", value: "Unified" }
            ],
            engineer: [
                { label: "MTTr", value: "300m -> 20m" },
                { label: "MTTa", value: "150m -> 10m" },
                { label: "Channel", value: "Power App" }
            ]
        },
        details: {
            executive: [
                {
                    heading: "The 'Ghost Town' Crisis",
                    body: "I was hand-selected as Crisis Stabilization Lead to stabilize a business unit in collapse. The hierarchy had crumbled: 100% of the Director-level leadership (5 Directors) had exited in 18 months. There were no Senior Managers left, only tactical Team Leads fighting a losing battle."
                },
                {
                    heading: "The 'Compliance Bomb'",
                    body: "A forensic audit revealed a 'Shadow IT' nightmare. With no standard tools, staff were conducting sensitive trade operations via WhatsApp and WeChat on personal devices. This was a catastrophic regulatory risk."
                },
                {
                    heading: "The Turnaround Strategy",
                    body: "I presented a radical 'January 15' Ultimatum: a 60-day sprint to enforce Data Sovereignty. We force-migrated all 5 verticals onto a single Service Cloud framework, promising to move from 'feelings' to 'forensics' within 6 months."
                }
            ],
            strategist: [
                {
                    heading: "Move 1: The 'Loyalist' Injection",
                    body: "To fix the leadership vacuum, I utilized the 'Attrition Budget' to bypass internal promotions. I recruited a 'Mercenary Squad' of trusted operational managers from my personal network. This instantly installed a competent command layer without debate."
                },
                {
                    heading: "Move 2: The 'Toxic Asset' Quarantine",
                    body: "The NEST vertical (Retail Trading App) was culturally necrotic-characterized by abusive behavior and 'pay-to-play' code changes. I advised the C-Suite it was unfixable. We appointed a forensic Director to document the chaos, leading to a Board-approved Strategic Divestiture (Fire Sale)."
                },
                {
                    heading: "Move 3: Data Sovereignty",
                    body: "I declared a moratorium on 'Opinion-Based Management'. If it wasn't in the data, it didn't happen. This forced adoption of the new Service Cloud standard."
                }
            ],
            engineer: [
                {
                    heading: "Metric Engineering (MTTa/MTTr)",
                    body: "Legacy KPIs like 'Average Handle Time' were useless. I engineered a biometric framework: \n* **MTTa (Mean Time to Acknowledge):** Slashed from 150 mins (Black Hole) to <10 mins.\n* **MTTr (Mean Time to Respond):** Slashed from 300 mins to <20 mins. \nWe moved from 'Ghosting' to 'Reliable Responsiveness'."
                },
                {
                    heading: "The 'Four-Eye' Automaton",
                    body: "To kill the 'WhatsApp' culture, we made compliant execution easier than non-compliant. I leveraged Microsoft Power Apps to build an automated 'Four-Eye Check' workflow. High-risk actions (Trade Amends) required a digital handshake, automating the reporting process to the Compliance Board."
                }
            ]
        },
        fullReport: {
            situation: "I was hand-selected by the Chief Customer Operations Officer (CCOO) as Crisis Stabilization Lead to stabilize a business unit in systemic collapse. The operational hierarchy had crumbled: 100% of the Director-level leadership had exited in the prior 18 months. A forensic audit revealed a 'Compliance Bomb'-staff were conducting sensitive trade operations via WhatsApp/WeChat on personal devices ('Shadow IT') due to a lack of standard tooling.",
            task: "The mission was to take command of a fractured 180-FTE organization across 13 countries during the height of the COVID-19 pandemic. I had to enforce a single data standard to replace 'opinion-based management', eliminate the catastrophic regulatory exposure of side-channel trading, and rebuild the leadership layer from scratch.",
            action: "**1. The 'January 15' Ultimatum (Data Sovereignty)**\nI declared a moratorium on 'Gut Feel'. I secured C-Level 'Air Cover' to enforce a transition from opinions to forensics. We force-migrated all five verticals onto a single Service Cloud framework to generate real-time telemetry.\n\n**2. The 'Loyalist' Injection (Talent)**\nUsing the 'Attrition Budget', I bypassed internal promotions to recruit a 'Mercenary Squad' of trusted managers from my personal network. This instantly installed a competent command layer without debate.\n\n**3. The 'Toxic Asset' Quarantine (NEST)**\nI identified the NEST vertical (Retail Trading App) as culturally necrotic (abusive, pay-to-play code). I advised the C-Suite that it could not be fixed. We appointed a forensic Director to document the chaos, leading to a Board-approved Strategic Divestiture.\n\n**4. The 'Four-Eye' Automaton (Governance)**\nTo kill the 'WhatsApp' culture, I built an automated 'Four-Eye Check' workflow in Microsoft Power Apps. It required a digital handshake for high-risk actions, reducing execution failures to near-zero.",
            result: "We moved from 'Ghosting' customers to 'Reliable Responsiveness'.\n\n*   **Metric Engineering:** Slashed MTTr (Mean Time to Respond) from **300 mins to <20 mins**.\n*   **Cultural Turnaround:** Leadership stability restored; Attrition dropped from **40% to 6%**; Glint Engagement scores hit 85 (Top Tier).\n*   **Risk Elimination:** 100% migration to Service Cloud & Power Apps secured the regulatory perimeter.",
            geoHighlights: [
                { label: "Action", value: "Data Sovereignty Protocol" },
                { label: "Outcome", value: "94% Retention (from 60%)" },
                { label: "Compliance", value: "Service Cloud / Zero Trust" }
            ]
        }
    }
];
