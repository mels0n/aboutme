import type { Metadata, Viewport } from "next";
import { Inter, Young_Serif, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeMetadata } from "@/shared/ui/ThemeMetadata";
import { JsonLd } from "@/shared/ui/JsonLd";
import GoogleAnalytics from "@/shared/ui/GoogleAnalytics";

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
    description: "Christopher Melson is an operations executive and architect specializing in stabilizing distressed environments.",
    keywords: ["Christopher Melson", "Portfolio", "Executive", "Strategist", "Engineer", "Leader", "Ops", "Risk", "Resilient", "Culture", "M&A Integration Gap"],
    authors: [{ name: "Christopher Melson" }],
    creator: "Christopher Melson",
    openGraph: {
        title: "Christopher Melson | Polymorphic Portfolio",
        description: "Operational Architect for the Agentic Age. Tri-Modal Leadership combining Strategic Design, Resilient Operations, and Technical Execution.",
        url: "https://chris.melson.us",
        siteName: "Christopher Melson Portfolio",
        locale: "en_US",
        type: "profile",
    },
    twitter: {
        card: "summary_large_image",
        title: "Chris Melson | Polymorphic Portfolio",
        description: "Executive. Strategist. Engineer.",
        images: ["/opengraph-image"],
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

export const viewport: Viewport = {
    themeColor: "#ffffff",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
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
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${youngSerif.variable} ${merriweather.variable} ${jetbrains.variable} antialiased`}
            >
                <GoogleAnalytics />
                <ThemeMetadata />
                <JsonLd />
                {children}
            </body>
        </html>
    );
}
