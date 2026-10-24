import { Metadata } from "next";
import { pageMetadata } from "@/shared/lib/seo/metadata";
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

    const label = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

    // Same content as the home page in another persona. Canonical points
    // home and the page stays out of the index; links on it are followed.
    return {
        ...pageMetadata({
            title: label,
            description: "Operations executive closing M&A integration gaps, stabilizing distressed environments, and building resilient teams.",
            path: "/",
            type: "profile",
        }),
        robots: { index: false, follow: true },
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
