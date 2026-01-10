import { ReactNode } from 'react';

export interface PersonaContent {
    bioParagraphs: string[];
    stats: { label: string; value: string }[];
}

export const aboutContent: Record<'executive' | 'strategist' | 'engineer', PersonaContent> = {
    executive: {
        bioParagraphs: [
            "I bring engineering truth to the boardroom table.",
            "Standard governance often fails because it looks at P&L but ignores the 'black box' of technology that drives it. I don't just advise on strategy; I stress-test it against operational reality.",
            "Whether acting as a Board Advisor or Operating Partner, I am the bridge between the Investment Committee and the Server Room. I use my Computer Science background to de-risk capital deployment, ensuring that your governance structure is built on actual data, not just management optimism."
        ],
        stats: [
            { label: "The Synthesis", value: "Strategy backed by Forensic Execution." },
            { label: "The Outcome", value: "Investment theses that actually survive deployment." }
        ]
    },
    strategist: {
        bioParagraphs: [
            "I apply a Computer Science mindset to Organizational Design.",
            "Most COOs manage people. I engineer the machine that the people operate. I believe that operational incoherence is not a personnel issue; it is a systems failure.",
            "As a Leader, I don't just 'run' operations. I dismantle functional silos and rebuild them as efficient Value Streams. I combine the commercial focus of an MBA with the architectural rigor of an engineer to design a Target Operating Model (TOM) that scales non-linearly."
        ],
        stats: [
            { label: "The Synthesis", value: "Leadership backed by Systems Engineering." },
            { label: "The Outcome", value: "Growth decoupled from Headcount." }
        ]
    },
    engineer: {
        bioParagraphs: [
            "I connect the Repository to the Revenue.",
            "Technical debt isn't just a code issue; it's a balance sheet liability. I am the executive who can walk into the engine room, read the documentation, and translate it directly into business risk.",
            "Whether leading a Due Diligence audit or fixing a stalled transformation, I ensure that 'Compliance' (EU DORA, HIPAA, GDPR) becomes an enabler of speed, not a blocker. I help engineering teams speak the language of the Board, turning technical constraints into commercial assets."
        ],
        stats: [
            { label: "The Synthesis", value: "Code backed by Capital Strategy." },
            { label: "The Outcome", value: "Velocity without Velocity Drop." }
        ]
    }
};
