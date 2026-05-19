import type { Metadata } from 'next';
import { BentoHeader } from "@/widgets/about/ui/BentoHeader";
import { AboutIntro } from "@/widgets/about/ui/AboutIntro";
import { FunctionalSections } from "@/widgets/about/ui/FunctionalSections";

import { aboutContent } from "@/shared/data/about-content";
import Link from 'next/link';

export const metadata: Metadata = {
    title: { absolute: "About Christopher Melson | Executive & Board Advisor" },
    description: "Transformation Executive & Operational Architect with 13 years at LSEG, Refinitiv, and Thomson Reuters. Specializing in M&A integration, DORA compliance, and organizational resilience.",
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: "About Christopher Melson | Executive & Board Advisor",
        description: "Transformation Executive & Operational Architect. M&A integration, DORA compliance, organizational resilience.",
        url: "https://chris.melson.us/about",
        type: "profile",
        images: [{ url: "https://chris.melson.us/opengraph-image", width: 1200, height: 630, alt: "Christopher Melson" }],
    },
    twitter: {
        card: 'summary_large_image',
        title: "About Christopher Melson | Executive & Board Advisor",
        description: "Transformation Executive & Operational Architect. M&A integration, DORA compliance, organizational resilience.",
    },
};

export default function AboutPage() {
    // WebPage node referencing the existing #person entity established on the homepage.
    // The Person data lives in JsonLd.tsx; this page only declares what it is "about".
    const pageSchema = {
        "@context": "https://schema.org",
        "@graph": [{
            "@type": "WebPage",
            "@id": "https://chris.melson.us/about#webpage",
            "url": "https://chris.melson.us/about",
            "name": "About Christopher Melson | Executive & Board Advisor",
            "isPartOf": { "@id": "https://chris.melson.us/#website" },
            "about": { "@id": "https://chris.melson.us/#person" },
            "mainEntity": { "@id": "https://chris.melson.us/#person" },
            "inLanguage": "en-US"
        }]
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-100 selection:text-slate-900 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
            />

            <div className="max-w-7xl mx-auto px-6 py-6 md:py-12">
                {/* Navigation Back */}
                <Link href="/" className="inline-flex items-center text-sm font-sans font-bold uppercase tracking-widest text-foreground/50 hover:text-blue-600 mb-6 transition-colors">
                    <span className="mr-2">←</span> Back to Portfolio
                </Link>

                {/* 1. Header with Bento Box */}
                <div className="mb-4">
                    <BentoHeader />
                </div>

                {/* 2. Split Layout: Intro (Left) | Functions aka Personas (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24 items-start">
                    {/* Left: Introduction (Sticky) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-12 self-start">
                        <AboutIntro />
                    </div>

                    {/* Right: Functional Sections (Bento Stack) */}
                    <div className="lg:col-span-7">
                        <FunctionalSections />
                    </div>
                </div>


            </div>
        </main>
    );
}
