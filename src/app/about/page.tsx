import type { Metadata } from 'next';
import { aboutContent } from "@/shared/data/about-content";
import Image from "next/image";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "About Christopher Melson | Operational Architect",
    description: "Biography of Christopher Melson: Executive, Strategist, and Engineer. A comprehensive look at the three operating modes of an Operational Architect.",
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-24 font-serif text-slate-800">
            <header className="mb-16 border-b border-slate-200 pb-8">
                <Link href="/" className="text-sm font-sans font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 mb-4 block">
                    ← Back to Portfolio
                </Link>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0">
                        <Image
                            src="/chris-melson-headshot.jpg"
                            alt="Christopher Melson"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About Christopher Melson</h1>
                        <p className="text-xl text-slate-600 font-light leading-relaxed">
                            Operational Architect. Executive. Board Advisor.
                        </p>
                    </div>
                </div>
            </header>

            <article className="space-y-16">
                {/* Executive Section */}
                <section aria-labelledby="executive-bio">
                    <h2 id="executive-bio" className="text-2xl font-sans font-bold text-blue-900 mb-6 uppercase tracking-wider flex items-center gap-3">
                        <span className="w-8 h-1 bg-blue-600 block"></span>
                        As an Executive
                    </h2>
                    <div className="prose prose-lg prose-slate max-w-none">
                        {aboutContent.executive.bioParagraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                    <dl className="mt-8 grid md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                        {aboutContent.executive.stats.map((stat, i) => (
                            <div key={i}>
                                <dt className="text-xs font-bold uppercase tracking-widest text-blue-900/60 mb-2">{stat.label}</dt>
                                <dd className="font-display font-bold text-lg text-blue-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Strategist Section */}
                <section aria-labelledby="strategist-bio">
                    <h2 id="strategist-bio" className="text-2xl font-sans font-bold text-indigo-900 mb-6 uppercase tracking-wider flex items-center gap-3">
                        <span className="w-8 h-1 bg-indigo-600 block"></span>
                        As a Strategist
                    </h2>
                    <div className="prose prose-lg prose-slate max-w-none">
                        {aboutContent.strategist.bioParagraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                    <dl className="mt-8 grid md:grid-cols-2 gap-6 bg-indigo-50/50 p-6 rounded-lg border border-indigo-100">
                        {aboutContent.strategist.stats.map((stat, i) => (
                            <div key={i}>
                                <dt className="text-xs font-bold uppercase tracking-widest text-indigo-900/60 mb-2">{stat.label}</dt>
                                <dd className="font-display font-bold text-lg text-indigo-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Engineer Section */}
                <section aria-labelledby="engineer-bio">
                    <h2 id="engineer-bio" className="text-2xl font-sans font-bold text-emerald-900 mb-6 uppercase tracking-wider flex items-center gap-3">
                        <span className="w-8 h-1 bg-emerald-600 block"></span>
                        As an Engineer
                    </h2>
                    <div className="prose prose-lg prose-slate max-w-none">
                        {aboutContent.engineer.bioParagraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                    <dl className="mt-8 grid md:grid-cols-2 gap-6 bg-emerald-50/50 p-6 rounded-lg border border-emerald-100">
                        {aboutContent.engineer.stats.map((stat, i) => (
                            <div key={i}>
                                <dt className="text-xs font-bold uppercase tracking-widest text-emerald-900/60 mb-2">{stat.label}</dt>
                                <dd className="font-display font-bold text-lg text-emerald-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </article>
        </main>
    );
}
