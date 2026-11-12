import { describe, expect, it } from "vitest";
import { EFF_LARGE_WORDLIST } from "./eff-large-wordlist";
import { GeneratorError } from "./errors";
import { DEFAULT_PASSPHRASE_OPTIONS, EFF_WORDLIST_SIZE, generatePassphrase, type PassphraseOptions } from "./passphrase";

const words = EFF_LARGE_WORDLIST;
const opts = (o: Partial<PassphraseOptions> = {}): PassphraseOptions => ({ ...DEFAULT_PASSPHRASE_OPTIONS, ...o });
const wordSet = new Set(words);

describe("EFF large wordlist", () => {
    it("has 7,776 unique words", () => {
        expect(words).toHaveLength(7776);
        expect(EFF_WORDLIST_SIZE).toBe(7776);
        expect(new Set(words).size).toBe(7776);
    });

    it("starts and ends as the published list does", () => {
        expect(words[0]).toBe("abacus");
        expect(words[7775]).toBe("zoom");
    });
});

describe("defaults", () => {
    it("are 6 words (Bitwarden apps default), dash separator, no capitals, no number", () => {
        expect(DEFAULT_PASSPHRASE_OPTIONS).toEqual({ numWords: 6, separator: "-", capitalize: false, includeNumber: false });
    });
});

describe("generatePassphrase", () => {
    it("joins the requested number of list words with the separator", () => {
        // Use a separator no list word contains, so the split is exact.
        const parts = generatePassphrase(opts({ numWords: 7, separator: " " }), words).split(" ");
        expect(parts).toHaveLength(7);
        for (const p of parts) expect(wordSet.has(p)).toBe(true);
    });

    it("supports an empty separator and a 3-character one", () => {
        expect(generatePassphrase(opts({ separator: "" }), words)).toMatch(/^[a-z-]+$/);
        expect(generatePassphrase(opts({ separator: "<->", numWords: 3 }), words).split("<->")).toHaveLength(3);
    });

    it("capitalizes the first letter of every word and nothing else", () => {
        const parts = generatePassphrase(opts({ capitalize: true, separator: " " }), words).split(" ");
        for (const p of parts) {
            expect(p[0]).toBe(p[0].toUpperCase());
            expect(wordSet.has(p[0].toLowerCase() + p.slice(1))).toBe(true);
        }
    });

    it("appends exactly one digit to exactly one word when includeNumber is on", () => {
        for (let i = 0; i < 300; i++) {
            const parts = generatePassphrase(opts({ includeNumber: true, separator: " " }), words).split(" ");
            const withDigit = parts.filter((p) => /\d/.test(p));
            expect(withDigit).toHaveLength(1);
            expect(withDigit[0]).toMatch(/^[a-z-]+\d$/);
            expect(wordSet.has(withDigit[0].slice(0, -1))).toBe(true);
        }
    });

    it("puts the digit on every word position over many runs", () => {
        const positions = new Set<number>();
        for (let i = 0; i < 300; i++) {
            const parts = generatePassphrase(opts({ includeNumber: true, separator: " ", numWords: 3 }), words).split(" ");
            positions.add(parts.findIndex((p) => /\d/.test(p)));
        }
        expect(positions).toEqual(new Set([0, 1, 2]));
    });
});

describe("validation", () => {
    it.each([2, 21, 3.5, Number.NaN])("rejects numWords %s", (numWords) => {
        expect(() => generatePassphrase(opts({ numWords }), words)).toThrow(GeneratorError);
    });

    it.each([3, 20])("accepts numWords %s", (numWords) => {
        expect(generatePassphrase(opts({ numWords }), words).length).toBeGreaterThan(0);
    });

    it("rejects a separator over 3 characters", () => {
        expect(() => generatePassphrase(opts({ separator: "abcd" }), words)).toThrow(/3 characters/);
    });

    it("rejects an empty wordlist", () => {
        expect(() => generatePassphrase(opts(), [])).toThrow(expect.objectContaining({ code: "empty-wordlist" }));
    });
});
