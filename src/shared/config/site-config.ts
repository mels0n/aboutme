export const siteConfig = {
    name: "Christopher Melson | Polymorphic Portfolio",
    description: "Executive. Strategist. Engineer. Architect. Leader. Designer. Builder. Innovator. Operator.",
    url: "https://chris.melson.us",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "2.1.0", // Auto-incremented via package.json
    author: {
        name: "Christopher Melson",
        url: "https://chris.melson.us",
    },
    links: {
        github: "https://github.com/mels0n",
        linkedin: "https://www.linkedin.com/in/chris-melson/",
        untapWeb: "https://untapweb.com",
        cvPdf: "/christopher-melson-cv.pdf",
    },
    // Facts the Person entity in the structured data states. Every value here
    // is also shown on the site; the Fair Maps site describes the same entity
    // with the same name, alternate name and title.
    person: {
        name: "Chris Melson",
        alternateNames: ["Christopher Melson", "Christopher M. Melson", "Chris M. Melson"],
        givenName: "Christopher",
        familyName: "Melson",
        jobTitle: "Transformation Executive & Operational Architect",
        description: "Operational Architect for the Agentic Age",
        disambiguatingDescription: "Operations Executive & Architect. Distinct from the Civil Engineer (LSU) and the Football Coach.",
        location: { city: "Saint Louis", region: "MO", country: "US" },
        headshot: "/chris-melson-headshot.jpg",
    },
};
