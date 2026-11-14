// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
    ARGON2ID_SPECOPS_GPUS, ARGON2ID_SPECOPS_RATE, NO_CRACKING_TEXT, PBKDF2_ITERATIONS, RIG_GPU_COUNT, STORAGE_METHODS,
    averageCrackSeconds, crackTimeText, formatCrackTime, storageMethod,
} from "./crack-time";
import { passphraseEntropy, passwordEntropy, type Entropy } from "./entropy";
import { DEFAULT_PASSPHRASE_OPTIONS } from "./passphrase";
import { DEFAULT_PASSWORD_OPTIONS, LOWERCASE, NUMBERS, SPECIAL, UPPERCASE } from "./password";

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

    it("gives no rate to plain text", () => {
        expect(storageMethod("plaintext").perGpuRate).toBeNull();
        expect(text(words(6), "plaintext")).toBe(NO_CRACKING_TEXT);
    });

    it("derives the Argon2id rate from the Specops figure: 490 H/s over 8 cards", () => {
        expect(ARGON2ID_SPECOPS_RATE).toBe(490);
        expect(ARGON2ID_SPECOPS_GPUS).toBe(8);
        expect(storageMethod("argon2id").perGpuRate).toBe(61.25);
    });

    it("gives every benchmarked method a finite positive rate", () => {
        for (const m of STORAGE_METHODS.filter((x) => x.kind !== "plaintext")) {
            expect(Number.isFinite(m.perGpuRate), m.id).toBe(true);
            expect(m.perGpuRate, m.id).toBeGreaterThan(0);
        }
    });

    it("states the Argon2id source and that its settings are not stated", () => {
        const example = storageMethod("argon2id").example;
        expect(example).toContain("Specops");
        expect(example).toContain("not stated");
        expect(example).toContain("lighter settings crack faster");
        expect(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "faq.ts"), "utf8")).toContain("Specops");
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
        expect(text(words(6), "md5")).toBe("about 990 years");
        expect(text(words(5), "md5")).toBe("about 2 months");
        expect(text(words(5), "pbkdf2")).toBe("about 1.5 million years");
        expect(text(words(6), "bcrypt")).toBe("about 23 billion years");
        expect(text(words(6), "argon2id")).toBe("more than a trillion years");
        expect(text(words(4), "argon2id")).toBe("about 59,000 years");
        expect(text(words(5), "argon2id")).toBe("about 460 million years");
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

const BLOG_COLUMNS = ["md5", "sha1", "bcrypt", "pbkdf2", "argon2id"] as const;
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

    it("has the header line built from the expected labels", () => {
        const header = `| Secret | ${["MD5", "SHA-1", "bcrypt (cost 10)", `PBKDF2-SHA256 (${PBKDF2_ITERATIONS.toLocaleString("en-US")})`, "Argon2id (Specops)"].join(" | ")} |`;
        expect(post.split("\n").map((l) => l.trimEnd())).toContain(header);
    });

    it("states the rig size and the 2026 Hive table", () => {
        expect(post).toContain(`${RIG_GPU_COUNT} RTX 5090`);
        expect(post).toContain("hivesystems.com/blog/are-your-passwords-in-the-green)");
        expect(post).not.toContain("are-your-passwords-in-the-green-2025");
        expect(post).not.toMatch(/12 RTX|12-GPU/);
    });

    it("keeps its prose figures equal to the model", () => {
        const five = words(5);
        const six = words(6);
        // Key takeaway bullet.
        expect(post).toContain(
            `Five EFF words last ${text(five, "pbkdf2")} against PBKDF2 at 600,000 iterations on a ${RIG_GPU_COUNT}-GPU rig, but only ${text(five, "md5")} against MD5.`,
        );
        // "Read the table by column" paragraph.
        expect(post).toContain(
            `A five-word passphrase falls in ${text(five, "md5")} if the site used MD5, and lasts ${text(five, "pbkdf2")} if it used PBKDF2 at 600,000 iterations. Six words, my default, still takes ${text(six, "md5")} against MD5`,
        );
        // Blog FAQ.
        expect(post).toContain(
            `five words (${five.bits.toFixed(1)} bits) would take a ${RIG_GPU_COUNT}-GPU rig ${text(five, "pbkdf2")} on average`,
        );
        expect(post).toContain(`the same five words fall in ${text(five, "md5")}`);
    });

    it("keeps the rig paragraph rates equal to the model", () => {
        const billions = (id: string) => ((storageMethod(id).perGpuRate as number) / 1e9).toFixed(1);
        const perCard = (id: string) => Math.round(storageMethod(id).perGpuRate as number).toLocaleString("en-US");
        expect(post).toContain(`${billions("md5")} billion guesses per second for MD5 and ${billions("sha1")} billion for SHA-1`);
        expect(post).toContain(`(about ${perCard("bcrypt")} guesses per second per card)`);
        expect(post).toContain(`(about ${perCard("pbkdf2")} per card)`);
        expect(post).toContain(`${ARGON2ID_SPECOPS_RATE} Argon2id hashes per second on a system of ${ARGON2ID_SPECOPS_GPUS} RTX 5090 cards`);
        expect(post).toContain(`(about ${storageMethod("argon2id").perGpuRate} per card)`);
        expect(post).toContain("cost 10 is 32 times slower");
        expect(2 ** (10 - 5)).toBe(32);
        expect(post).toContain("600,000 iterations is about 600 times slower");
        expect(Math.round(PBKDF2_ITERATIONS / 999 / 10) * 10).toBe(600);
    });

    it("keeps the symbol count in the table caption equal to the default character sets", () => {
        const o = DEFAULT_PASSWORD_OPTIONS;
        expect(o.avoidAmbiguous).toBe(false);
        const symbols = [o.uppercase && UPPERCASE, o.lowercase && LOWERCASE, o.numbers && NUMBERS, o.special && SPECIAL]
            .filter(Boolean)
            .join("").length;
        expect(post).toContain(`(${symbols} symbols, with at least one number and one special character)`);
    });

    it("keeps the SHA-1 four-word claim true", () => {
        expect(post).toContain("a four-word passphrase falls in under an hour");
        expect(averageCrackSeconds(words(4), storageMethod("sha1").perGpuRate as number)).toBeLessThan(HOUR);
    });

    it("keeps lastUpdated equal to date", () => {
        const date = /\n\s+date: "(\d{4}-\d{2}-\d{2})"/.exec(post)?.[1];
        const updated = /\n\s+lastUpdated: "(\d{4}-\d{2}-\d{2})"/.exec(post)?.[1];
        expect(updated).toBe(date);
    });
});
