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
            "disambiguatingDescription": "Executive strategist and engineer, distinct from the health policy researcher, the transportation engineer, and the football coach.",
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
            "worksFor": resume.sections.experience.items.map((item: any) => {
                const monthMap: { [key: string]: string } = {
                    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
                    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
                };

                const parseDate = (dateStr: string) => {
                    const match = dateStr.match(/([A-Z][a-z]+) (\d{4})/);
                    if (match) {
                        return `${match[2]}-${monthMap[match[1]]}-01`;
                    }
                    return dateStr;
                };

                const [startStr, endStr] = item.date.split(' - ');
                const startDate = parseDate(startStr);
                const endDate = (endStr && endStr.toLowerCase() !== 'present') ? parseDate(endStr) : undefined;

                return {
                    "@type": "EmployeeRole",
                    "roleName": item.position,
                    "startDate": startDate,
                    ...(endDate ? { "endDate": endDate } : {}),
                    "worksFor": {
                        "@type": "Organization",
                        "name": item.company,
                        ...(item.url?.href ? { "sameAs": item.url.href } : {})
                    }
                };
            }),
            "alumniOf": resume.sections.education.items
                .filter((item: any, index: number, self: any[]) =>
                    index === self.findIndex((t: any) => t.institution === item.institution)
                )
                .map((item: any) => ({
                    "@type": "CollegeOrUniversity",
                    "name": item.institution,
                    ...(item.url?.href ? { "sameAs": item.url.href } : {})
                })),
            "hasCredential": resume.sections.education.items.map((item: any) => ({
                "@type": "EducationalOccupationalCredential",
                "credentialCategory": "degree",
                "educationalLevel": item.area,
                "about": {
                    "@type": "DefinedTerm",
                    "name": item.studyType
                },
                "recognizedBy": {
                    "@type": "CollegeOrUniversity",
                    "name": item.institution
                }
            })),

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

