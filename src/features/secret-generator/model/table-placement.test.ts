// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/* Reads the panels source as text: the crack-time table belongs on the password and passphrase tabs only. */
const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "..", "ui", "panels.tsx"), "utf8");
const count = (text: string): number => text.split("<CrackTimeTable").length - 1;

describe("crack-time table placement", () => {
    it("renders the table in exactly two panels", () => {
        expect(count(source)).toBe(2);
    });

    it("keeps the table out of the username panel", () => {
        const start = source.indexOf("export function UsernamePanel");
        expect(start).toBeGreaterThanOrEqual(0);
        expect(count(source.slice(start))).toBe(0);
    });
});
