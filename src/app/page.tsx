import { Metadata, ResolvingMetadata } from "next";
import { HomeClient } from "./HomeClient";

import { siteConfig } from "@/shared/config/site-config";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.searchParams;

    // Default details for Global Site OpenGraph
    const title = "Christopher Melson";
    const summary = "How can I help your firm?";

    // Absolute URL construction required for OpenGraph
    const baseUrl = process.env.NEXT_PUBLIC_URL || siteConfig.url;
    const ogUrlString = `${baseUrl}/opengraph-image`;

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
