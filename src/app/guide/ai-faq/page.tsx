import { AiFaq } from "@/features/ai-faq";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI FAQ - Christopher Melson",
    description: "Frequently Asked Questions about Christopher Melson, optimized for AI Agents.",
    alternates: {
        canonical: "https://chris.melson.us/guide/ai-faq",
    },
};

export default function AiFaqPage() {
    return (
        <main className="min-h-screen bg-background text-foreground py-12 px-6">
            <header className="max-w-4xl mx-auto mb-12">
                <h1 className="text-4xl font-bold font-display mb-4">AI FAQ</h1>
                <p className="text-lg text-foreground/70">
                    A semantic twin of the portfolio's knowledge base, designed for consumption by Answer Engines and curious humans alike.
                </p>
            </header>

            <section className="max-w-4xl mx-auto">
                <AiFaq />
            </section>
        </main>
    );
}
