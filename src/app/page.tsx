import { Metadata, ResolvingMetadata } from "next";
import { HomeClient } from "./HomeClient";

import { siteConfig } from "@/shared/config/site-config";

const PAGE = {
    name: "Christopher Melson | Operational Architect for the Agentic Age",
    description: "Operations executive closing M&A integration gaps, stabilizing distressed environments, and building resilient teams. Executive, Strategist, Engineer.",
};

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.searchParams;

    // OpenGraph and meta description — substantive description required for
    // Lighthouse SEO audit ("Document does not have a meta description").
    const title = PAGE.name;
    const summary = PAGE.description;

    // Absolute URL construction required for OpenGraph
    const baseUrl = process.env.NEXT_PUBLIC_URL || siteConfig.url;
    const ogUrlString = `${baseUrl}/opengraph-image`;

    return {
        title: title,
        description: summary,
        alternates: {
            canonical: '/',
        },
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
import { SemanticNavGraph } from "@/shared/ui/SemanticNavGraph";
import { JsonLdScript } from "@/shared/ui/JsonLdScript";
import { homeGraph } from "@/shared/lib/structured-data";
import { projectInputs } from "@/entities/project/model/structured-data";
import resume from "@/shared/data/resume.json";
import { ResumeData } from "@/shared/types/resume";

export default function Page() {
    return (
        <>
            <ServerSideResume data={resume as unknown as ResumeData} />
            <SemanticNavGraph />
            <JsonLdScript graph={homeGraph(PAGE, projectInputs.filter((project) => project.website))} />
            <HomeClient />
        </>
    );
}
