import { serializeGraph, type JsonLdGraph } from "../lib/structured-data";

/**
 * Renders a page's structured data as an inline JSON-LD block. Server
 * component: the markup is in the HTML the crawler first receives. The block
 * is data, not script, so the site's script-src policy does not apply to it.
 */
export function JsonLdScript({ graph }: { graph: JsonLdGraph }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeGraph(graph) }}
        />
    );
}
