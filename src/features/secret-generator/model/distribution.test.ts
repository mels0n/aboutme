import { describe, expect, it } from "vitest";
import { EFF_LARGE_WORDLIST } from "./eff-large-wordlist";
import { DEFAULT_PASSPHRASE_OPTIONS, generatePassphrase } from "./passphrase";
import { DEFAULT_PASSWORD_OPTIONS, LOWERCASE, SPECIAL, UPPERCASE, generatePassword } from "./password";
import { randomInt } from "./random";

/**
 * Chi-square critical value for `df` degrees of freedom at one-sided p = 1e-6
 * (z = 4.753), by the Wilson-Hilferty approximation. A fair generator crosses
 * it about once in a million runs, so these tests are not flaky; a modulo-bias
 * or off-by-one bug on these sample sizes lands far beyond it.
 */
function critical(df: number): number {
    const z = 4.753;
    const a = 2 / (9 * df);
    return df * (1 - a + z * Math.sqrt(a)) ** 3;
}

function chiSquare(observed: number[], expectedEach: number): number {
    return observed.reduce((sum, o) => sum + (o - expectedEach) ** 2 / expectedEach, 0);
}

describe("randomInt is uniform", () => {
    it.each([7776, 70, 36])("n = %i passes a chi-square test over 200,000 draws", (n) => {
        const samples = 200_000;
        const counts = new Array<number>(n).fill(0);
        for (let i = 0; i < samples; i++) counts[randomInt(n)]++;
        expect(chiSquare(counts, samples / n)).toBeLessThan(critical(n - 1));
    });
});

describe("generated output is uniform", () => {
    it("every lowercase letter is equally likely in lowercase-only passwords", () => {
        const length = 100;
        const runs = 2000;
        const counts = new Array<number>(26).fill(0);
        for (let i = 0; i < runs; i++) {
            const p = generatePassword({
                ...DEFAULT_PASSWORD_OPTIONS, length, uppercase: false, numbers: false, special: false,
            });
            for (const c of p) counts[LOWERCASE.indexOf(c)]++;
        }
        expect(chiSquare(counts, (length * runs) / 26)).toBeLessThan(critical(25));
    });

    it("every letter is equally likely across the full default set, so the shuffle adds no set bias", () => {
        const letters = UPPERCASE + LOWERCASE;
        const runs = 40_000;
        const counts = new Array<number>(letters.length).fill(0);
        for (let i = 0; i < runs; i++) {
            for (const c of generatePassword(DEFAULT_PASSWORD_OPTIONS)) {
                const at = letters.indexOf(c);
                if (at >= 0) counts[at]++;
            }
        }
        const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
        expect(chiSquare(counts, mean)).toBeLessThan(critical(letters.length - 1));
    });

    it("the first character is a special about as often as the specials share the password", () => {
        const runs = 60_000;
        let hits = 0;
        for (let i = 0; i < runs; i++) if (SPECIAL.includes(generatePassword(DEFAULT_PASSWORD_OPTIONS)[0])) hits++;
        // Expected share of specials per position: (1 reserved + 16 fill * 8/70) / 20 over a 20-char password.
        const p = (1 + 16 * (8 / 70)) / 20;
        const sd = Math.sqrt((runs * p * (1 - p)));
        expect(Math.abs(hits - runs * p)).toBeLessThan(5.5 * sd);
    });

    it("word indexes are uniform over the 7,776-word list", () => {
        const index = new Map(EFF_LARGE_WORDLIST.map((w, i) => [w, i]));
        const runs = 40_000;
        const words = 5;
        const counts = new Array<number>(EFF_LARGE_WORDLIST.length).fill(0);
        for (let i = 0; i < runs; i++) {
            // A space separator is not in any list word, so splitting is exact.
            for (const w of generatePassphrase({ ...DEFAULT_PASSPHRASE_OPTIONS, numWords: words, separator: " " }, EFF_LARGE_WORDLIST).split(" ")) {
                counts[index.get(w)!]++;
            }
        }
        expect(chiSquare(counts, (runs * words) / EFF_LARGE_WORDLIST.length)).toBeLessThan(critical(7775));
    });
});
