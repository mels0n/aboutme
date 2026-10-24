import type { Metadata } from "next";
import Link from "next/link";

// Next adds the noindex robots tag to this response itself.
export const metadata: Metadata = {
    title: "Page not found",
};

export default function NotFound() {
    return (
        <main className="min-h-[70vh] max-w-3xl mx-auto px-6 py-24 font-serif text-foreground">
            <p className="text-sm font-mono uppercase tracking-widest text-foreground/70 mb-4">404</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">This page does not exist.</h1>
            <p className="text-lg text-foreground/75 leading-relaxed mb-8">
                The link may be old or mistyped. These pages are a good place to start:
            </p>
            <ul className="space-y-3 font-sans">
                <li><Link href="/" className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4">Home</Link></li>
                <li><Link href="/guide/operational-architecture" className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4">What is an Operational Architect?</Link></li>
                <li><Link href="/guide/operational-architecture/blog" className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4">Blog</Link></li>
                <li><Link href="/about" className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4">About</Link></li>
            </ul>
        </main>
    );
}
