import resume from '../../shared/data/resume.json';

import { siteConfig } from '../../shared/config/site-config';



export function JsonLd() {
    // Base URL for ID references
    const domain = "https://chris.melson.us";

    // 1. WebSite Node (The Container)
    const websiteSchema = {
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        "url": domain,
        "name": "Christopher Melson | Polymorphic Portfolio",
        "description": "Executive. Strategist. Engineer.",
        "publisher": {
            "@id": `${domain}/#person`
        },
        "inLanguage": "en-US"
    };

    // 2. Person Node (The Entity - Central Authority)
    const personSchema = {
        "@type": "Person",
        "@id": `${domain}/#person`,
        "image": {
            "@id": `${domain}/#primaryimage`
        },
        "name": "Christopher Melson",
        "alternateName": [
            "Chris Melson",
            "Christopher M. Melson",
            "Chris M. Melson"
        ],
        "givenName": "Christopher",
        "familyName": "Melson",
        "url": domain,
        "description": "Christopher Melson is an operations executive and architect specializing in stabilizing distressed environments.",
        "disambiguatingDescription": "Executive strategist and engineer, distinct from the Research Civil Engineer at LSU/FHWA.",
        "jobTitle": ["Operational Architect", "Executive", "Board Advisor", "Strategist", "Engineer"],
        "sameAs": [
            "https://github.com/mels0n",
            "https://www.linkedin.com/in/chris-melson-45a88244/"
        ],
        "knowsAbout": [
            "Engineering",
            "Strategy",
            "Target Operating Models (TOM)",
            "Regulatory Compliance",
            "Salesforce",
            "DevOps",
            "M&A Integration",
            "M&A Integration Gap"
        ],
        "worksFor": resume.sections.experience.items.map((item: any) => {
            const monthMap: { [key: string]: string } = {
                Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
                Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
            };
            const parseDate = (dateStr: string) => {
                const match = dateStr.match(/([A-Z][a-z]+) (\d{4})/);
                return match ? `${match[2]}-${monthMap[match[1]]}-01` : dateStr;
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
        "alumniOf": resume.sections.education.items.map((item: any) => ({
            "@type": "CollegeOrUniversity",
            "name": item.institution,
            ...(item.url?.href ? { "sameAs": item.url.href } : {})
        }))
    };

    // 3. Application Node (The Product)
    const appSchema = {
        "@type": "SoftwareApplication",
        "@id": `${domain}/#app`,
        "name": siteConfig.name,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "softwareVersion": siteConfig.version,
        "author": {
            "@id": `${domain}/#person`
        },
        "featureList": [
            "Strategic Design",
            "Resilient Operations",
            "Technical Execution",
            "Tri-Modal Navigation"
        ],
        "offer": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    // 5. Explicit WebPage Node
    const webPageSchema = {
        "@type": "ProfilePage",
        "@id": `${domain}/#webpage`,
        "url": domain,
        "name": "Christopher Melson | Polymorphic Portfolio",
        "isPartOf": {
            "@id": `${domain}/#website`
        },
        "about": {
            "@id": `${domain}/#person`
        },
        "primaryImageOfPage": {
            "@id": `${domain}/#primaryimage`
        },
        "inLanguage": "en-US"
    };

    // 4. Image Node (Primary Image)
    const imageSchema = {
        "@type": "ImageObject",
        "@id": `${domain}/#primaryimage`,
        "url": `${domain}/opengraph-image`,
        "contentUrl": `${domain}/opengraph-image`,
        "caption": "Christopher Melson - Operational Architect"
    };

    const graph = {
        "@context": "https://schema.org",
        "@graph": [
            personSchema,
            websiteSchema,
            webPageSchema,
            appSchema,
            imageSchema
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
    );
}

