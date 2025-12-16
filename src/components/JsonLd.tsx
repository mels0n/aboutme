export function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Christopher Melson",
        "alternateName": ["Chris Melson", "Christopher M. Melson", "Chris M. Melson"],
        "givenName": "Christopher",
        "familyName": "Melson",
        "jobTitle": ["Executive", "Strategist", "Engineer"],
        "url": "https://chris.melson.us",
        "knowsAbout": ["Software Engineering", "Strategy", "Portfolio Management", "System Architecture", "PowerBi", "Salesforce", "Service Cloud", "DevOps", "Support", "Operations", "P&L", "NPS", "Glint", "M365", "ITIL", "CSAT", "M&A", "BCP"],
        "sameAs": [
            "https://github.com/mels0n"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
