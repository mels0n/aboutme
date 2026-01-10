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

    const titles = {
        executive: "Strategic Design | Operational Architecture",
        strategist: "Resilient Operations | Systems Thinking",
        engineer: "Technical Execution | Zero Trust Security"
    };

    const descriptions = {
        executive: "Boardroom-ready strategic design and operational P&L risk management.",
        strategist: "Architecting resilient forms of operations through systems thinking and game theory.",
        engineer: "Deep-dive technical execution, zero trust security, and scalable infrastructure."
    };

    return {
        title: titles[mode],
        description: descriptions[mode],
        alternates: {
            canonical: `/mode/${slug}`,
        },
        openGraph: {
            title: titles[mode],
            description: descriptions[mode],
            url: `https://chris.melson.us/mode/${slug}`,
            type: "profile",
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
