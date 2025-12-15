import type { Metadata } from "next";
import { Inter, Young_Serif, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

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
    title: "Chris Melson | Polymorphic Portfolio",
    description: "Executive. Strategist. Engineer.",
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
            <body
                className={`${inter.variable} ${youngSerif.variable} ${merriweather.variable} ${jetbrains.variable} antialiased`}
            >
                <JsonLd />
                {children}
            </body>
        </html>
    );
}
