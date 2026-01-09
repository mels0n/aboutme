import { Metadata, ResolvingMetadata } from "next";
import { HomeClient } from "./HomeClient";
import { officeBlogPosts } from "@/shared/data/office_blog_posts";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.searchParams;

    // 1. Determine Details
    const mode = (params?.mode as 'executive' | 'strategist' | 'engineer') || 'executive';
    const blogSlug = params?.blog as string;

    // Contact Card Defaults (Global Site OG)
    let title = "Christopher Melson";
    let summary = "A polymorphic portfolio exploring the three personas of Christopher Melson: Executive, Strategist, and Engineer. This interactive experience re-renders the same professional history through different accessible lenses, demonstrating the intersection of leadership, strategy, and code.";
    let role = "Operational Architect";
    let date = "";

    if (blogSlug) {
        const post = officeBlogPosts.find(p => p.slug === blogSlug);
        if (post) {
            title = post.title;
            // Use the polymorphic summary if available for the mode, else fallback
            const polySummary = post.polymorphicSummary?.[mode];
            summary = polySummary || post.summary;
            role = "Operational Architect";
            date = post.date;
        }
    }

    // 2. Construct OG Image URL
    // We use absolute URL for production, but locally it might fail if we don't have base.
    // Ideally use process.env.NEXT_PUBLIC_URL or hardcode for this portfolio.
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://chris.melson.us';

    // Safety check for URL construction
    let ogUrlString = "";
    try {
        const ogUrl = new URL(`${baseUrl}/api/og`);
        ogUrl.searchParams.set('title', title);
        ogUrl.searchParams.set('summary', summary);
        ogUrl.searchParams.set('mode', mode);
        ogUrl.searchParams.set('role', role);
        if (date) ogUrl.searchParams.set('date', date);
        ogUrlString = ogUrl.toString();
    } catch (e) {
        // Fallback for malformed URLs
        ogUrlString = `${baseUrl}/opengraph-image`;
    }

    return {
        title: title,
        description: summary,
        openGraph: {
            title: title,
            description: summary,
            images: [
                {
                    url: ogUrlString,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: "profile",
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: summary,
            images: [ogUrlString],
        },
    };
}

export default function Page() {
    return (
        <HomeClient />
    );
}
