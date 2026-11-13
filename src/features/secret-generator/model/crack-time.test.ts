// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
    NO_BENCHMARK_TEXT, NO_CRACKING_TEXT, PBKDF2_ITERATIONS, RIG_GPU_COUNT, STORAGE_METHODS,
    averageCrackSeconds, crackTimeText, formatCrackTime, storageMethod,
} from "./crack-time";
import { passphraseEntropy, passwordEntropy, type Entropy } from "./entropy";
import { DEFAULT_PASSPHRASE_OPTIONS } from "./passphrase";
import { DEFAULT_PASSWORD_OPTIONS } from "./password";

const words = (numWords: number) => passphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, numWords });
const text = (entropy: Entropy, id: string) => crackTimeText(entropy, storageMethod(id));

const MIN = 60;
const HOUR = 3600;
const DAY = 86_400;
const YEAR = 365.25 * DAY;

describe("storage methods", () => {
    it("lists the methods weakest first", () => {
        expect(STORAGE_METHODS.map((m) => m.id)).toEqual(["plaintext", "md5", "sha1", "bcrypt", "pbkdf2", "argon2id"]);
    });

    it("uses the hashcat RTX 5090 benchmark rates, scaled for bcrypt and PBKDF2", () => {
        expect(storageMethod("md5").perGpuRate).toBe(220.6e9);
        expect(storageMethod("sha1").perGpuRate).toBe(70_245.1e6);
        // 304.8 kH/s at cost 5, 32 times slower at cost 10.
        expect(storageMethod("bcrypt").perGpuRate).toBeCloseTo(9525, 6);
        // 11,157.2 kH/s at 999 iterations, scaled to 600,000.
        expect(PBKDF2_ITERATIONS).toBe(600_000);
        expect(storageMethod("pbkdf2").perGpuRate).toBeCloseTo(18_576.74, 2);
    });

    it("gives no rate to plain text or Argon2id", () => {
        expect(storageMethod("plaintext").perGpuRate).toBeNull();
        expect(storageMethod("argon2id").perGpuRate).toBeNull();
        expect(text(words(6), "plaintext")).toBe(NO_CRACKING_TEXT);
        expect(text(words(6), "argon2id")).toBe(NO_BENCHMARK_TEXT);
        expect(NO_BENCHMARK_TEXT).not.toMatch(/\d/);
    });

    it("throws on an unknown id", () => {
        expect(() => storageMethod("nope")).toThrow(RangeError);
    });
});

describe("averageCrackSeconds", () => {
    it("is half the outputs over the rig rate", () => {
        const entropy = { bits: 20, outputs: BigInt(2) ** BigInt(20) };
        expect(averageCrackSeconds(entropy, 1000, 1)).toBeCloseTo(2 ** 19 / 1000, 6);
        expect(averageCrackSeconds(entropy, 1000)).toBeCloseTo(2 ** 19 / (1000 * RIG_GPU_COUNT), 6);
    });

    it("does not overflow on a huge output count", () => {
        const huge = { bits: 800, outputs: BigInt(2) ** BigInt(800) };
        expect(averageCrackSeconds(huge, 220.6e9)).toBeGreaterThan(1e200);
        const beyondFloat = { bits: 2000, outputs: BigInt(2) ** BigInt(2000) };
        expect(averageCrackSeconds(beyondFloat, 1)).toBe(Infinity);
        expect(formatCrackTime(Infinity)).toBe("more than a trillion years");
    });
});

describe("formatCrackTime", () => {
    it("says under a second below one second", () => {
        expect(formatCrackTime(0)).toBe("under a second");
        expect(formatCrackTime(0.99)).toBe("under a second");
    });

    it("uses singular and plural correctly", () => {
        expect(formatCrackTime(1)).toBe("about 1 second");
        expect(formatCrackTime(2)).toBe("about 2 seconds");
        expect(formatCrackTime(MIN)).toBe("about 1 minute");
        expect(formatCrackTime(5 * MIN)).toBe("about 5 minutes");
        expect(formatCrackTime(HOUR)).toBe("about 1 hour");
        expect(formatCrackTime(3 * HOUR)).toBe("about 3 hours");
        expect(formatCrackTime(DAY)).toBe("about 1 day");
        expect(formatCrackTime(10 * DAY)).toBe("about 10 days");
        expect(formatCrackTime(2 * (YEAR / 12))).toBe("about 2 months");
        expect(formatCrackTime(YEAR)).toBe("about 1 year");
        expect(formatCrackTime(5 * YEAR)).toBe("about 5 years");
    });

    it("rolls a rounded count up into the next unit", () => {
        expect(formatCrackTime(59.6)).toBe("about 1 minute");
        expect(formatCrackTime(59.6 * MIN)).toBe("about 1 hour");
        expect(formatCrackTime(23.6 * HOUR)).toBe("about 1 day");
        expect(formatCrackTime(11.7 * (YEAR / 12))).toBe("about 1 year");
    });

    it("groups thousands and keeps two significant figures for large year counts", () => {
        expect(formatCrackTime(1325 * YEAR)).toBe("about 1,300 years");
        expect(formatCrackTime(99.4 * YEAR)).toBe("about 99 years");
        expect(formatCrackTime(510_400 * YEAR)).toBe("about 510,000 years");
    });

    it("switches to millions, billions and a trillion", () => {
        expect(formatCrackTime(999_600 * YEAR)).toBe("about 1 million years");
        expect(formatCrackTime(2.04e6 * YEAR)).toBe("about 2 million years");
        expect(formatCrackTime(3.86e6 * YEAR)).toBe("about 3.9 million years");
        expect(formatCrackTime(31.2e9 * YEAR)).toBe("about 31 billion years");
        expect(formatCrackTime(999.6e9 * YEAR)).toBe("more than a trillion years");
        expect(formatCrackTime(1e12 * YEAR)).toBe("more than a trillion years");
        expect(formatCrackTime(Number.NaN)).toBe("more than a trillion years");
    });
});

describe("sanity points", () => {
    it("matches hand arithmetic for the EFF word lists", () => {
        expect(text(words(6), "md5")).toBe("about 1,300 years");
        expect(text(words(5), "md5")).toBe("about 2 months");
        expect(text(words(5), "pbkdf2")).toBe("about 2 million years");
        expect(text(words(6), "bcrypt")).toBe("about 31 billion years");
    });

    it("orders the methods by speed on this rig", () => {
        const entropy = words(5);
        const seconds = ["md5", "sha1", "pbkdf2", "bcrypt"].map((id) =>
            averageCrackSeconds(entropy, storageMethod(id).perGpuRate as number),
        );
        // On this rig PBKDF2 at 600,000 iterations falls between SHA-1 and bcrypt at cost 10.
        expect(seconds).toEqual([...seconds].sort((a, b) => a - b));
    });
});

/*
 * The blog post prints a table of these figures. Rebuild it from the model and
 * check the post still carries every cell, so the two cannot drift. The post
 * is read as text, not imported (it may be scheduled and so unpublished).
 */
const here = dirname(fileURLToPath(import.meta.url));
const post = readFileSync(
    // eslint-disable-next-line no-restricted-syntax -- reads the file as text; nothing is imported
    join(here, "..", "..", "..", "shared", "data", "blog-posts", "password-generator-passphrases-entropy.ts"),
    "utf8",
);

const BLOG_COLUMNS = ["md5", "sha1", "bcrypt", "pbkdf2"] as const;
const BLOG_ROWS: ReadonlyArray<{ label: string; entropy: Entropy }> = [
    ...[4, 5, 6, 7].map((n) => ({ label: `${n} EFF words`, entropy: words(n) })),
    { label: "14-character password", entropy: passwordEntropy({ ...DEFAULT_PASSWORD_OPTIONS, length: 14 }) },
    { label: "20-character password", entropy: passwordEntropy(DEFAULT_PASSWORD_OPTIONS) },
];

describe("the blog post table", () => {
    it("has one row per entry, with the model's figure in every cell", () => {
        for (const { label, entropy } of BLOG_ROWS) {
            const line = post.split("\n").find((l) => l.startsWith("|") && l.includes(`| ${label} |`));
            expect(line, `row for ${label}`).toBeDefined();
            const cells = (line as string).split("|").map((c) => c.trim()).filter(Boolean);
            expect(cells.slice(1)).toEqual(BLOG_COLUMNS.map((id) => text(entropy, id)));
        }
    });

    it("states the 12 x RTX 5090 rig and the 2025 Hive table", () => {
        expect(post).toContain("12 RTX 5090");
        expect(post).toContain("are-your-passwords-in-the-green-2025");
    });
});
