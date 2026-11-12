// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/*
 * The generator promises to save nothing: no storage, no cookies, no network,
 * no logging and no state in the web address. This test reads the source and
 * fails if any of the listed APIs that could break that promise appears. It
 * is a blocklist, not a proof that no other route exists, and CI runs it on
 * every pull request and every push to main. A token is built from parts
 * below so that this file does not contain the strings it forbids.
 */
const here = dirname(fileURLToPath(import.meta.url));
const sliceDir = join(here, "..");
const repoRoot = join(sliceDir, "..", "..", "..");
const pageFile = join(repoRoot, "src", "app", "tools", "password-generator", "page.tsx");

const FORBIDDEN: readonly string[] = [
    "local" + "Storage",
    "session" + "Storage",
    "indexed" + "DB",
    "document" + ".cookie",
    "caches" + ".",
    "service" + "Worker",
    "navigator" + ".sendBeacon",
    "fetch" + "(",
    "XMLHttp" + "Request",
    "Web" + "Socket",
    "console" + ".log",
    "console" + ".info",
    "console" + ".debug",
    "console" + ".warn",
    "console" + ".error",
    "console" + ".table",
    "g" + "tag",
    "send" + "Event",
    "new " + "Image",
    "window" + ".open",
    "location" + ".href",
    "location" + ".assign",
    "post" + "Message",
    "Event" + "Source",
    "clipboard" + ".readText",
    "history" + ".pushState",
    "history" + ".replaceState",
    "useSearch" + "Params",
    "search" + "Params",
    "Math" + ".random",
];

/** The forbidden tokens found in `text`. */
export function findForbidden(text: string, tokens: readonly string[] = FORBIDDEN): string[] {
    return tokens.filter((token) => text.includes(token));
}

function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) return sourceFiles(full);
        return /\.tsx?$/.test(name) && !/\.test\.ts$/.test(name) ? [full] : [];
    });
}

describe("the matcher", () => {
    it("reports a synthetic string that holds forbidden tokens", () => {
        const sample = "const a = local" + "Storage.getItem('x'); fetch" + "('/y'); console" + ".error(a);";
        expect(findForbidden(sample)).toEqual(["local" + "Storage", "fetch" + "(", "console" + ".error"]);
    });

    it("reports nothing for clean text", () => {
        expect(findForbidden("const a = crypto.getRandomValues(new Uint32Array(1));")).toEqual([]);
    });
});

describe("saves nothing", () => {
    const files = [...sourceFiles(sliceDir), pageFile];

    it("scans the model, the UI and the page", () => {
        expect(files.length).toBeGreaterThan(10);
        expect(files).toContain(pageFile);
    });

    it("uses no storage, network, logging, URL-state or non-cryptographic random API", () => {
        const hits = files.flatMap((file) => {
            const text = readFileSync(file, "utf8");
            return findForbidden(text).map(
                (token) => `${relative(repoRoot, file)} contains "${token}"`,
            );
        });
        expect(hits, hits.join("\n")).toEqual([]);
    });
});
