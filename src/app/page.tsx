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
    // Providing a robust default description that is guaranteed to be non-empty
    let title = "Christopher Melson";
    let summary = "Christopher Melson is an operations executive and architect specializing in stabilizing distressed environments.";
    let role = "Operational Architect";
    let date = "";

    if (blogSlug) {
        const post = officeBlogPosts.find(p => p.slug === blogSlug);
        if (post) {
            title = post.title;
            // Use the polymorphic summary if available for the mode, else fallback
            const polySummary = post.polymorphicSummary?.[mode];
            summary = polySummary || post.summary || summary; // Fallback to default summary if post summary is empty
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
        ogUrl.searchParams.set('summary', summary); // Ensure this is not too long for URL params if possible, but browsers handle it.
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

import { ServerSideResume } from "@/shared/ui/ServerSideResume";
import resume from "@/shared/data/resume.json";
import { ResumeData } from "@/shared/types/resume";

export default function Page() {
    return (
        <>
            <ServerSideResume data={resume as unknown as ResumeData} />
            <HomeClient />
        </>
    );
}
