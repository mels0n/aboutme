import type { ProjectInput } from "@/shared/lib/structured-data";
import { projects, type ProjectData } from "./data";

/**
 * Card copy carries live-value placeholders such as {{Plan}}. They read as
 * garbage in structured data, so any sentence that holds one is dropped.
 */
export function plainDescription(text: string): string {
    return text
        .split(/(?<=[.!?])\s+/)
        .filter((sentence) => !sentence.includes("{{"))
        .join(" ")
        .trim();
}

export function toProjectInput(project: ProjectData): ProjectInput {
    return {
        slug: project.link.split("/").pop()!.toLowerCase().replace(/_/g, "-"),
        name: project.title,
        description: plainDescription(project.description),
        repository: `https://${project.link}`,
        website: project.website,
        image: project.image,
        keywords: project.tags,
    };
}

export const projectInputs: ProjectInput[] = projects.map(toProjectInput);
