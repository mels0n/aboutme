import type { JsonLdGraph } from "./schema";

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * Serializes a graph for an inline <script type="application/ld+json">.
 * JSON.stringify does not escape "<", so a string containing "</script>"
 * would close the tag and let the rest run as markup. Escaping "<" and the
 * two JS line separators keeps the payload inert whatever the data holds.
 */
export function serializeGraph(graph: JsonLdGraph): string {
    return JSON.stringify(graph)
        .replace(/</g, "\\u003c")
        .split(LINE_SEPARATOR).join("\\u2028")
        .split(PARAGRAPH_SEPARATOR).join("\\u2029");
}
