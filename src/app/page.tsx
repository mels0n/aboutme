import { Metadata, ResolvingMetadata } from "next";
import { HomeClient } from "./HomeClient";
import { officeBlogPosts } from "@/shared/data/office_blog_posts";
import { siteConfig } from "@/shared/config/site-config";

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

    // Default details for Global Site OpenGraph
    let title = "Christopher Melson";
    let summary = "Christopher Melson is an operations executive and architect specializing in stabilizing distressed environments.";
    let role = "Operational Architect";
    let date = "";

    if (blogSlug) {
        const post = officeBlogPosts.find(p => p.slug === blogSlug);
        if (post) {
            title = post.title;
            // Priority: Mode-specific Summary -> Post Summary -> Global Default
            const polySummary = post.polymorphicSummary?.[mode];
            summary = polySummary || post.summary || summary;
            role = "Operational Architect";
            date = post.date;
        }
    }

    // Absolute URL construction required for OpenGraph
    const baseUrl = process.env.NEXT_PUBLIC_URL || siteConfig.url;

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
import { JsonLd } from "@/shared/ui/JsonLd";
import resume from "@/shared/data/resume.json";
import { ResumeData } from "@/shared/types/resume";

export default function Page() {
    return (
        <>
            <ServerSideResume data={resume as unknown as ResumeData} />
            <JsonLd />
            <HomeClient />
        </>
    );
}
