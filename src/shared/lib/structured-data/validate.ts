import { graphSchema, type JsonLdGraph, type JsonLdNode } from "./schema";

/** Properties whose string values are URLs and must be absolute. */
const URL_KEYS = new Set([
    "url", "item", "image", "contentUrl", "sameAs", "codeRepository", "@id",
]);

const PII_PATTERNS: [string, RegExp][] = [
    ["email address", /[^\s@"]+@[^\s@"]+\.[a-z]{2,}/i],
    ["phone number", /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/],
];

function isReference(value: unknown): value is { "@id": string } {
    return typeof value === "object" && value !== null && !Array.isArray(value)
        && Object.keys(value).length === 1 && "@id" in value;
}

function walk(value: unknown, path: string, visit: (value: unknown, key: string, path: string) => void, key = "") {
    visit(value, key, path);
    if (Array.isArray(value)) {
        value.forEach((v, i) => walk(v, `${path}[${i}]`, visit, key));
    } else if (typeof value === "object" && value !== null) {
        for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`, visit, k);
    }
}

/** Every problem found in a finished graph; empty when it is sound. */
export function graphProblems(graph: JsonLdGraph): string[] {
    const problems: string[] = [];
    const defined = new Map<string, JsonLdNode>();

    for (const node of graph["@graph"]) {
        const id = node["@id"];
        if (!id) continue;
        if (defined.has(id)) problems.push(`duplicate node id ${id}`);
        defined.set(id, node);
    }

    walk(graph["@graph"], "@graph", (value, key, path) => {
        if (isReference(value) && !defined.has(value["@id"])) {
            problems.push(`${path}: reference to ${value["@id"]} is not defined in this graph`);
        }
        if (typeof value === "string") {
            if (URL_KEYS.has(key) && !/^https:\/\//.test(value)) {
                problems.push(`${path}: ${key} is not an absolute https URL (${value})`);
            }
            for (const [label, pattern] of PII_PATTERNS) {
                if (pattern.test(value)) problems.push(`${path}: contains a ${label}`);
            }
        }
    });

    return problems;
}

/**
 * Builds a page graph. Parsing and checking happen here, at the boundary to
 * the HTML, so a bad node fails the build rather than reaching Google.
 */
export function finalizeGraph(nodes: JsonLdNode[]): JsonLdGraph {
    const graph = graphSchema.parse({ "@context": "https://schema.org", "@graph": nodes });
    const problems = graphProblems(graph);
    if (problems.length > 0) {
        throw new Error(`Invalid structured data:\n- ${problems.join("\n- ")}`);
    }
    return graph;
}
