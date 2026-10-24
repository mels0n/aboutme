import { pageMetadata } from "@/shared/lib/seo/metadata";
import { BentoHeader } from "@/widgets/about/ui/BentoHeader";
import { AboutIntro } from "@/widgets/about/ui/AboutIntro";
import { FunctionalSections } from "@/widgets/about/ui/FunctionalSections";

import { aboutContent } from "@/shared/data/about-content";
import Link from 'next/link';
import { JsonLdScript } from "@/shared/ui/JsonLdScript";
import { aboutGraph } from "@/shared/lib/structured-data";

const ABOUT_TITLE = "About Christopher Melson | Executive & Board Advisor";
const ABOUT_DESCRIPTION = "Transformation Executive & Operational Architect. 13 years at LSEG, Refinitiv and Thomson Reuters leading M&A integration, DORA compliance and resilience.";

export const metadata = pageMetadata({ title: ABOUT_TITLE, description: ABOUT_DESCRIPTION, path: "/about", type: "profile" });

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-blue-100 selection:text-slate-900 overflow-x-hidden">
            <JsonLdScript graph={aboutGraph({ name: ABOUT_TITLE, description: ABOUT_DESCRIPTION })} />

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

                {/* 3. Closing Note */}
                <p className="text-base text-foreground/70 font-serif leading-relaxed text-pretty">
                    When I&apos;m not consulting, I run <a href="https://untapweb.com" className="underline decoration-foreground/30 underline-offset-2 hover:text-blue-600 transition-colors">Untap Web</a>, the studio that designed and maintains this site.
                </p>

            </div>
        </main>
    );
}
