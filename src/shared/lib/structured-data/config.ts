import { siteConfig } from "../../config/site-config";

export const SITE_URL = siteConfig.url;

/** Stable node identifiers. A node is defined once per page graph and referenced by these ids. */
export const ids = {
    person: `${SITE_URL}/#person`,
    website: `${SITE_URL}/#website`,
    headshot: `${SITE_URL}/#headshot`,
    ogImage: `${SITE_URL}/#og-image`,
    cv: `${SITE_URL}/#cv`,
    untapWeb: `${SITE_URL}/#untap-web`,
    blog: `${SITE_URL}/guide/operational-architecture/blog#blog`,
} as const;

export const LANGUAGE = "en-US";

/** Resolves a site-relative path against the canonical origin; absolute URLs pass through. */
export function abs(pathOrUrl: string): string {
    if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
    return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Page anchors share one convention so the graph builders and tests agree. */
export const pageId = (url: string, anchor: string) => `${url}#${anchor}`;
