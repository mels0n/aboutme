import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeClient } from "@/app/HomeClient";
import { OFFICE_MODES, OfficeSlug } from "@/shared/config/seo-routes";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug as OfficeSlug;
    const mode = OFFICE_MODES[slug];

    if (!mode) {
        return {};
    }

    const title = "Christopher Melson";
    const description = "How can I help your firm?";
    const url = "https://chris.melson.us";
    const images = [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: title }];

    return {
        title,
        description,
        alternates: {
            canonical: `/`, // Force canonical to root for "Single Page App" behavior
        },
        openGraph: {
            title,
            description,
            url, // Force URL back to root
            images,
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images,
        }
    };
}

export default async function ModePage(props: Props) {
    const params = await props.params;
    const slug = params.slug as OfficeSlug;
    const mode = OFFICE_MODES[slug];

    if (!mode) {
        notFound();
    }

    return (
        <HomeClient initialMode={mode} initialView="OFFICE" />
    );
}
