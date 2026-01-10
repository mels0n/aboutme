export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQSection {
    title: string;
    items: FAQItem[];
}

export const faqContent: FAQSection[] = [
    {
        title: "Defining the Role",
        items: [
            {
                question: "What is the difference between an Operational Architect and a Head of Operations?",
                answer: "A Head of Operations 'runs' the machine; an Operational Architect 'designs' it. While a traditional operations leader focuses on maintaining status quo stability (Mode 1), I focus on the Target Operating Model (TOM) - the structural design of your People, Processes, and Technology. I bridge the gap between your board's strategic intent and the operational reality, preventing the execution failures that plague scaling businesses."
            },
            {
                question: "Why do I need an Operational Architect for my Merger or Acquisition?",
                answer: "Financial engineering does not create operational coherence. Most M&A deals fail due to execution failure - specifically, the inability to integrate disparate tech stacks and cultures. I act as the 'Universal Translator' between the deal thesis and Day 1 execution, conducting Technical Due Diligence (TDD) to uncover hidden liabilities and designing 'Interim Operating Models' to prevent post-close attrition."
            },
            {
                question: "What is 'Tri-Modal Leadership'?",
                answer: "It is the ability to navigate three operational states simultaneously: Stability (keeping the lights on), Agility (driving transformation), and Strategy (aligning with the P&L). Most generalists fail because they treat every problem as a maintenance task. I apply the right operational posture to the right challenge."
            }
        ]
    },
    {
        title: "Engagement & Industries",
        items: [
            {
                question: "How do you engage with organizations?",
                answer: "I engage exclusively in high-impact leadership capacities where I can own the outcome, not just advise on it.\n\n1. **Interim Executive:** I parachute in as a dedicated leader (Interim COO/CTO/CIO) for a finite period (6-18 months) to stabilize distressed operations, lead a critical Post-Merger Integration, or bridge a gap while you search for a permanent hire.\n2. **Fractional Executive:** For organizations that need high-level architectural guidance but not a full-time headcount, I serve as a long-term strategic partner. I provide ongoing oversight of your Target Operating Model and technical roadmap, typically on a retainer basis.\n3. **Board Directorships:** I serve on Corporate, Non-Profit, and Private Boards. My specific value add is chairing 'Technical Risk Committees' - providing the governance oversight needed to ensure a board's strategic decisions are technically viable.\n4. **Permanent Leadership:** For the right mission, I am available for permanent roles. While I often sit in the C-Suite, I thrive in cross-functional roles (e.g., SVP of Operational Strategy, Head of Transformation) that report into a matrix of the CEO, COO, and CTO to 'architect the firm' across silos."
            },
            {
                question: "Why appoint an Operational Architect to a Board of Directors?",
                answer: "Most Boards have an Audit Committee for finance but lack a 'Technical Risk Committee' for operations. I fill that void. I translate 'Tech Debt' and 'Velocity Drop' into P&L risk, ensuring the Board understands the true operational viability of their strategic decisions before they are executed."
            }
        ]
    },
    {
        title: "Technical & Compliance",
        items: [
            {
                question: "How does your Technical Due Diligence (TDD) differ from a standard audit?",
                answer: "I oversee the TDD process for M&A. I don't just look for bugs; I assess the 'Organizational Scalability' - validating if the target company's culture and processes can survive the acquisition without value destruction."
            },
            {
                question: "How do you handle regulatory compliance (DORA, HIPAA)?",
                answer: "I practice 'Compliance by Design.' Instead of treating regulations as a checklist, I encode them into the infrastructure. For example, creating automated accountability frameworks that enforce DORA's resilience mandates or HIPAA's privacy rules, ensuring compliance generates efficiency rather than administrative drag."
            }
        ]
    },
    {
        title: "Logistics",
        items: [
            {
                question: "Where are you located and do you travel?",
                answer: "Based in St. Louis (Central Time), I am available for global travel. I prioritize on-site immersion during critical transformation phases (First 30 Days, Deal Close, Crisis Management) to establish cultural alignment, followed by a hybrid execution model."
            },
            {
                question: "What is your tech stack preference?",
                answer: "I am tool-agnostic but philosophy-specific. I have deep experience integrating ServiceNow, Salesforce, JIRA, and custom SQL/Python environments. My goal is not to rip and replace your current stack, but to ensure your existing tools are actually talking to each other."
            }
        ]
    }
];

export const faqData: FAQItem[] = [
    {
        question: "What is the 'Strategic Crisis of the Generalist'?",
        answer: "It occurs when a leadership team composed of smart Generalists (MBAs, Strategy Directors) owns a complex technical product but lacks the forensic capability to audit the underlying 'Machine'. They become reliant on 'Green-Shifted' status reports because they cannot verify technical truth. The result is a 'Black Box' operation where capital is burned on features while the foundation rots."
    },
    {
        question: "Why 'Operational Architect'? (The Integration Gap)",
        answer: "The research indicates a specific gap in the market known as the **Integration Gap**:\n\n* **Consultants (McKinsey/Bain)** design strategies but often fail to implement them due to a lack of technical grit.\n* **Engineers** build code but often lack an understanding of P&L or regulatory risk.\n* **Managers** run the day-to-day but often struggle to redesign the system while running it.\n\nBy claiming **Operational Architect**, I occupy the empty middle ground. I am not just 'running' the bank, I am **building** the bank. This positioning shifts the value from Operational Expenditure (OpEx-paying for labor) to Capital Expenditure (CapEx-building an asset)."
    },
    {
        question: "What are the specific triggers for hiring an OA?",
        answer: "1. **Stalled Post-Merger Integration (PMI):** You acquired a company 6 months ago, but the platforms (and cultures) are still operating in silos.\n2. **Regulatory Failure:** You failed an EU DORA, SOC2, or internal audit because 'Shadow IT' and 'Super Users' bypassed governance to get the job done.\n3. **The '100M Kill Switch' Scenario:** You suspect a flagship project is failing but cannot prove it against the 'Sunk Cost Fallacy'."
    },
    {
        question: "Why can't I just deploy AI to fix my operations?",
        answer: "AI amplifies existing processes. If you deploy Agentic AI onto a chaotic, undocumented, or non-compliant workflow, you simply automate the chaos. An Operational Architect performs the 'Process Forensics' to map, clean, and structure the territory *before* you deploy the Agents."
    }
];
