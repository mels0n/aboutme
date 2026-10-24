import type { Metadata } from "next";

/** Suffix the root layout's title template appends to every page title. */
export const TITLE_SUFFIX = " | Christopher Melson";

/** Titles past this length are cut off in search results. */
const MAX_TITLE = 65;

const SITE_NAME = "Christopher Melson";
const DEFAULT_IMAGE = { url: "/opengraph-image", width: 1200, height: 630 };

type PageMetadataInput = {
    title: string;
    description: string;
    /** Site-relative path; it is the canonical URL and og:url. */
    path: string;
    type?: "website" | "article" | "profile";
    image?: { url: string; width: number; height: number };
    publishedTime?: string;
    modifiedTime?: string;
};

/**
 * Metadata for one page: title, description, canonical, Open Graph and
 * Twitter card, all describing this page. A page that sets openGraph replaces
 * the layout's whole openGraph object, so every field is set here rather than
 * inherited; otherwise shares show the home page's title and URL.
 *
 * The layout template adds the name suffix when the result still fits in a
 * search result; a long title is used as is.
 */
export function pageMetadata({
    title, description, path, type = "website", image = DEFAULT_IMAGE, publishedTime, modifiedTime,
}: PageMetadataInput): Metadata {
    const fitsWithSuffix = title.length + TITLE_SUFFIX.length <= MAX_TITLE;
    const images = [{ ...image, alt: title }];
    return {
        title: fitsWithSuffix ? title : { absolute: title },
        description,
        alternates: { canonical: path },
        openGraph: {
            title,
            description,
            url: path,
            type,
            siteName: SITE_NAME,
            locale: "en_US",
            images,
            ...(type === "article" && publishedTime ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: images.map((i) => i.url),
        },
    };
}
