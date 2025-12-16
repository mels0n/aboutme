import type { Metadata } from "next";
import { Inter, Young_Serif, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

import GoogleAnalytics from "@/components/GoogleAnalytics";

/*
 * Font Configuration
 * Pre-loading and configuring variable fonts for optimal performance and CLS prevention.
 */

// Sans-serif font for UI elements (Executive mode mostly)
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

// Display serif font for headings
const youngSerif = Young_Serif({
    weight: "400",
    variable: "--font-young-serif",
    subsets: ["latin"],
});

// Body serif font for long-form text
const merriweather = Merriweather({
    weight: ["300", "400", "700", "900"],
    variable: "--font-merriweather",
    subsets: ["latin"],
});

// Monospace font for code and terminal UI (Engineer mode)
const jetbrains = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://chris.melson.us"),
    alternates: {
        canonical: "/",
    },
    title: {
        default: "Christopher Melson | Polymorphic Portfolio",
        template: "%s | Christopher Melson"
    },
    description: "Executive. Strategist. Engineer. A polymorphic portfolio showcasing the intersection of leadership, strategy, and engineering.",
    keywords: ["Christopher Melson", "Portfolio", "Executive", "Strategist", "Engineer", "Leader", "Ops", "Risk", "Resilient", "Culture"],
    authors: [{ name: "Christopher Melson" }],
    creator: "Christopher Melson",
    openGraph: {
        title: "Christopher Melson | Polymorphic Portfolio",
        description: "Executive. Strategist. Engineer. A polymorphic portfolio showcasing the intersection of leadership, strategy, and engineering.",
        url: "https://chris.melson.us",
        siteName: "Christopher Melson Portfolio",
        locale: "en_US",
        type: "profile",
    },
    twitter: {
        card: "summary_large_image",
        title: "Chris Melson | Polymorphic Portfolio",
        description: "Executive. Strategist. Engineer.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

/**
 * Root Layout Component
 * 
 * Establishes the global HTML structure and injects font variables into the body.
 * This layout wraps all pages in the application.
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <GoogleAnalytics />
            <body
                className={`${inter.variable} ${youngSerif.variable} ${merriweather.variable} ${jetbrains.variable} antialiased`}
            >
                <JsonLd />
                {children}
            </body>
        </html>
    );
}
