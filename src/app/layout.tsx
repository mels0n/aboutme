import type { Metadata, Viewport } from "next";
import { Inter, Young_Serif, Merriweather, JetBrains_Mono, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ThemeMetadata } from "@/shared/ui/ThemeMetadata";
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

// Body serif font for Strategist (Game Table feel)
const robotoSlab = Roboto_Slab({
    variable: "--font-roboto-slab",
    subsets: ["latin"],
});

// Monospace font for code and terminal UI (Engineer mode)
const jetbrains = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://chris.melson.us"),
    title: {
        default: "Christopher Melson | Operational Architect for the Agentic Age",
        template: "%s | Christopher Melson"
    },
    // Full substantive description required for Lighthouse SEO audit — must be
    // >= 160 chars and match the page-level generateMetadata description exactly
    // so crawlers receive a consistent signal regardless of SSR evaluation order.
    description: "Christopher Melson is an operations executive specializing in stabilizing distressed environments, M&A integration gaps, and building resilient teams. Executive, Strategist, Engineer.",
    keywords: ["Christopher Melson", "Portfolio", "Executive", "Strategist", "Engineer", "Leader", "Ops", "Risk", "Resilient", "Culture", "M&A Integration Gap", "Architect", "Agentic Age", "Strategic Design", "Resilient Operations", "Technical Execution"],
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
            <head>
                {/* Preconnect to Google Fonts origins to eliminate DNS + TLS handshake
                    latency from the render-blocking font requests Lighthouse reports. */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body
                className={`${inter.variable} ${youngSerif.variable} ${merriweather.variable} ${jetbrains.variable} ${robotoSlab.variable} antialiased`}
            >
                <GoogleAnalytics />
                <ThemeMetadata />
                {children}
            </body>
        </html>
    );
}
