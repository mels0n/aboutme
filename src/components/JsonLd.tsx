export function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Chris Melson",
        "jobTitle": ["Executive", "Strategist", "Engineer"],
        "url": "https://chris.melson.us",
        "knowsAbout": ["Software Engineering", "Strategy", "Portfolio Management", "Next.js", "System Architecture"],
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
