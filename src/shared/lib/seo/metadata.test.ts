import { describe, expect, it } from "vitest";
import { TITLE_SUFFIX, pageMetadata } from "./metadata";

describe("pageMetadata", () => {
    it("describes the page itself in Open Graph and Twitter, not the home page", () => {
        const meta = pageMetadata({ title: "Operational Architect FAQ", description: "Answers.", path: "/faq" });
        expect(meta.alternates?.canonical).toBe("/faq");
        expect(meta.openGraph).toMatchObject({ title: "Operational Architect FAQ", url: "/faq", type: "website" });
        expect(meta.twitter).toMatchObject({ title: "Operational Architect FAQ", images: ["/opengraph-image"] });
    });

    it("lets the template add the name suffix only when the result fits a search result", () => {
        expect(pageMetadata({ title: "Short title", description: "d", path: "/a" }).title).toBe("Short title");
        const long = "A".repeat(65 - TITLE_SUFFIX.length + 1);
        expect(pageMetadata({ title: long, description: "d", path: "/a" }).title).toEqual({ absolute: long });
    });

    it("adds article dates for articles", () => {
        const meta = pageMetadata({
            title: "Post", description: "d", path: "/p", type: "article", publishedTime: "2026-01-01",
        });
        expect(meta.openGraph).toMatchObject({ publishedTime: "2026-01-01", modifiedTime: "2026-01-01" });
    });
});
