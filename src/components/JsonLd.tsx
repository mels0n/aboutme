import resume from '../data/resume.json';



export function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",

            "name": "Christopher Melson",
            "alternateName": [
                "Chris Melson",
                "Christopher M. Melson",
                "Chris M. Melson"
            ],
            "givenName": "Christopher",
            "familyName": "Melson",
            "description": "Christopher Melson is an operations executive specializing in stabilizing distressed, regulated environments and designing target operating models that enable sustainable growth at global scale.",
            "jobTitle": ["Executive", "Strategist", "Engineer"],
            "url": "https://chris.melson.us",
            "knowsAbout": [
                "Engineering",
                "Strategy",
                "Portfolio Management",
                "System Architecture",
                "Business Intelligence (BI)",
                "Salesforce",
                "Service Cloud",
                "DevOps",
                "Support",
                "Employee Engagement",
                "Operations",
                "Profit and Loss (P&L)",
                "Net Promoter Score (NPS)",
                "Glint",
                "Microsoft 365 (M365)",
                "Information Technology Infrastructure Library (ITIL)",
                "Customer Satisfaction Score (CSAT)",
                "Mergers and Acquisitions (M&A)",
                "Business Continuity Planning (BCP)",
                "Target Operating Models (TOM)",
                "Risk Posture",
                "Regulatory Compliance",
                "Culture"
            ],
            "hasOccupation": {
                "@type": "Occupation",
                "name": "Executive Operations Leader",
                "occupationLocation": "Global",
                "skills": resume.sections.skills.items.flatMap((item: any) => item.keywords)
            },

            "sameAs": [
                "https://github.com/mels0n",
                "https://www.linkedin.com/in/chris-melson-45a88244/"
            ]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

