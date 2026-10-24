import { pageMetadata } from "@/shared/lib/seo/metadata";
import { HomeClient } from "./HomeClient";

const PAGE = {
    name: "Christopher Melson | Operational Architect for the Agentic Age",
    description: "Operations executive closing M&A integration gaps, stabilizing distressed environments, and building resilient teams. Executive, Strategist, Engineer.",
};

export const metadata = pageMetadata({ ...PAGE, title: PAGE.name, path: "/", type: "profile" });

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
