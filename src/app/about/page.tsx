import type { Metadata } from 'next';
import { BentoHeader } from "@/widgets/about/ui/BentoHeader";
import { AboutIntro } from "@/widgets/about/ui/AboutIntro";
import { FunctionalSections } from "@/widgets/about/ui/FunctionalSections";
import { ClosingQuote } from "@/widgets/about/ui/ClosingQuote";
import { aboutContent } from "@/shared/data/about-content";
import Link from 'next/link';

export const metadata: Metadata = {
    title: `About ${aboutContent.header.name} | ${aboutContent.header.titles.join(" | ")}`,
    description: aboutContent.bio.intro[0],
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    // Generate Schema.org Person data
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": aboutContent.header.name,
        "jobTitle": aboutContent.header.titles,
        "description": aboutContent.bio.intro.join(" "),
        "url": "https://chrismelson.com",
        "sameAs": [
            aboutContent.links.github,
            aboutContent.links.linkedin
        ]
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-100 selection:text-slate-900 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
