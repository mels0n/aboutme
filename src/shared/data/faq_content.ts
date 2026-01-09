export interface FAQItem {
    question: string;
    answer: string;
}

export const faqData: FAQItem[] = [
    {
        question: "What is the 'Strategic Crisis of the Generalist'?",
        answer: "It occurs when a leadership team composed of smart Generalists (MBAs, Strategy Directors) owns a complex technical product but lacks the forensic capability to audit the underlying 'Machine'. They become reliant on 'Green-Shifted' status reports because they cannot verify technical truth. The result is a 'Black Box' operation where capital is burned on features while the foundation rots."
    },
    {
        question: "Why 'Operational Architect'? (The Integration Gap)",
        answer: "The research indicates a specific gap in the market known as the **Integration Gap**:\n\n* **Consultants (McKinsey/Bain)** design strategies but often fail to implement them due to a lack of technical grit.\n* **Engineers** build code but often lack an understanding of P&L or regulatory risk.\n* **Managers** run the day-to-day but often struggle to redesign the system while running it.\n\nBy claiming **Operational Architect**, I occupy the empty middle ground. I am not just 'running' the bank, I am **building** the bank. This positioning shifts the value from Operational Expenditure (OpEx—paying for labor) to Capital Expenditure (CapEx—building an asset)."
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
