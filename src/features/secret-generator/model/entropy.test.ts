// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { describe, expect, it } from "vitest";
import {
    countConstrainedStrings, emailTagEntropy, formatScientific, log2BigInt,
    passphraseEntropy, passwordEntropy, randomWordEntropy,
} from "./entropy";
import { DEFAULT_PASSPHRASE_OPTIONS } from "./passphrase";
import { DEFAULT_PASSWORD_OPTIONS, passwordSets, type PasswordOptions } from "./password";

const big = (n: number | string) => BigInt(n);
const opts = (o: Partial<PasswordOptions> = {}): PasswordOptions => ({ ...DEFAULT_PASSWORD_OPTIONS, ...o });

describe("log2BigInt", () => {
    it("is exact for powers of two", () => {
        expect(log2BigInt(big(1))).toBe(0);
        expect(log2BigInt(big(2) ** big(200))).toBeCloseTo(200, 10);
    });

    it("matches Math.log2 for values a double can hold", () => {
        expect(log2BigInt(big(1000))).toBeCloseTo(Math.log2(1000), 12);
        expect(log2BigInt(big(2) ** big(52) + big(1))).toBeCloseTo(52, 10);
    });

    it("handles values far beyond a double", () => {
        expect(log2BigInt(big(3) ** big(1000))).toBeCloseTo(1000 * Math.log2(3), 8);
        expect(log2BigInt(big(10) ** big(500))).toBeCloseTo(500 * Math.log2(10), 8);
    });

    it("rejects zero and negatives", () => {
        expect(() => log2BigInt(big(0))).toThrow();
        expect(() => log2BigInt(big(-5))).toThrow();
    });
});

/** Enumerate every string over sets laid out as consecutive symbol ranges and count the valid ones. */
function bruteForce(length: number, sets: { size: number; min: number }[]): bigint {
    const total = sets.reduce((a, s) => a + s.size, 0);
    const owner: number[] = sets.flatMap((s, i) => Array<number>(s.size).fill(i));
    let valid = 0;
    const digits = new Array<number>(length).fill(0);
    for (;;) {
        const counts = new Array<number>(sets.length).fill(0);
        for (const d of digits) counts[owner[d]]++;
        if (sets.every((s, i) => counts[i] >= s.min)) valid++;
        let k = 0;
        while (k < length && ++digits[k] === total) digits[k++] = 0;
        if (k === length) break;
    }
    return big(valid);
}

describe("countConstrainedStrings", () => {
    it("length 2, digits and special, one of each: 2 * 10 * 8 = 160", () => {
        expect(countConstrainedStrings(2, [{ size: 10, min: 1 }, { size: 8, min: 1 }])).toBe(big(160));
    });

    const cases: [number, { size: number; min: number }[]][] = [
        [2, [{ size: 10, min: 1 }, { size: 8, min: 1 }]],
        [3, [{ size: 4, min: 1 }, { size: 3, min: 1 }, { size: 2, min: 1 }]],
        [4, [{ size: 3, min: 2 }, { size: 4, min: 1 }]],
        [5, [{ size: 2, min: 2 }, { size: 3, min: 1 }, { size: 2, min: 1 }]],
        [4, [{ size: 5, min: 4 }]],
        [3, [{ size: 5, min: 1 }, { size: 3, min: 0 }]],
        [4, [{ size: 2, min: 1 }, { size: 2, min: 1 }, { size: 2, min: 1 }, { size: 2, min: 1 }]],
    ];
    it.each(cases)("matches brute-force enumeration (length %i, %j)", (length, sets) => {
        expect(countConstrainedStrings(length, sets)).toBe(bruteForce(length, sets));
    });

    it("is zero when the minimums cannot fit", () => {
        expect(countConstrainedStrings(2, [{ size: 5, min: 2 }, { size: 5, min: 1 }])).toBe(big(0));
    });

    it("is N^L when the only minimum is trivially met", () => {
        expect(countConstrainedStrings(6, [{ size: 26, min: 1 }])).toBe(big(26) ** big(6));
    });
});

/** Independent check: dynamic programming over positions, tracking each set's count capped at its minimum. */
function dpCount(length: number, sets: { size: number; min: number }[]): bigint {
    let states = new Map<string, bigint>([[sets.map(() => 0).join(","), big(1)]]);
    for (let pos = 0; pos < length; pos++) {
        const next = new Map<string, bigint>();
        for (const [key, ways] of states) {
            const counts = key.split(",").map(Number);
            sets.forEach((s, i) => {
                const c = counts.slice();
                c[i] = Math.min(c[i] + 1, s.min);
                const k = c.join(",");
                next.set(k, (next.get(k) ?? big(0)) + ways * big(s.size));
            });
        }
        states = next;
    }
    return states.get(sets.map((s) => s.min).join(",")) ?? big(0);
}

describe("passwordEntropy", () => {
    it("lowercase only, length 20: 20 * log2(26) = 94.009 bits", () => {
        const e = passwordEntropy(opts({ uppercase: false, numbers: false, special: false }));
        expect(e.bits).toBeCloseTo(20 * Math.log2(26), 9);
        expect(e.bits).toBeCloseTo(94.009, 3);
        expect(e.outputs).toBe(big(26) ** big(20));
    });

    it("all four sets, length 20: a hair under 20 * log2(70)", () => {
        const e = passwordEntropy(opts());
        const ceiling = 20 * Math.log2(70);
        expect(ceiling).toBeCloseTo(122.59, 2);
        expect(e.bits).toBeLessThan(ceiling);
        expect(e.bits).toBeGreaterThan(ceiling - 0.5);
    });

    it("agrees with an independent DP for the defaults and for demanding minimums", () => {
        for (const o of [
            opts(),
            opts({ length: 12, minNumbers: 4, minSpecial: 3 }),
            opts({ length: 16, avoidAmbiguous: true, minNumbers: 2 }),
            opts({ length: 9, minNumbers: 3, minSpecial: 4 }),
            opts({ length: 40, uppercase: false, minSpecial: 9, minNumbers: 9 }),
        ]) {
            expect(passwordEntropy(o).outputs).toBe(dpCount(o.length, passwordSets(o).map((s) => ({ size: s.chars.length, min: s.min }))));
        }
    });

    it("avoidAmbiguous leaves 24 + 25 + 8 + 8 symbols", () => {
        const sets = passwordSets(opts({ avoidAmbiguous: true }));
        expect(sets.map((s) => s.chars.length)).toEqual([24, 25, 8, 8]);
    });

    it("a bigger minimum lowers the count", () => {
        const loose = passwordEntropy(opts({ length: 10, minNumbers: 1, minSpecial: 1 })).bits;
        const tight = passwordEntropy(opts({ length: 10, minNumbers: 4, minSpecial: 3 })).bits;
        expect(tight).toBeLessThan(loose);
    });

    it("works at the maximum length of 128", () => {
        const e = passwordEntropy(opts({ length: 128 }));
        expect(e.bits).toBeGreaterThan(128 * Math.log2(70) - 0.01);
        expect(e.bits).toBeLessThan(128 * Math.log2(70));
    });
});

describe("passphraseEntropy", () => {
    it("default is 6 words = 77.55 bits", () => {
        expect(passphraseEntropy(DEFAULT_PASSPHRASE_OPTIONS).bits).toBeCloseTo(77.55, 2);
    });

    it("5 words = 5 * log2(7776) = 64.62 bits", () => {
        const e = passphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, numWords: 5 });
        expect(e.bits).toBeCloseTo(64.62, 2);
        expect(e.outputs).toBe(big(7776) ** big(5));
    });

    it("adds log2(10) + log2(numWords) for the number", () => {
        const e = passphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, numWords: 5, includeNumber: true });
        expect(e.bits).toBeCloseTo(5 * Math.log2(7776) + Math.log2(10) + Math.log2(5), 9);
        expect(e.bits).toBeCloseTo(70.27, 2);
    });

    it("capitalization and separator add nothing", () => {
        const plain = passphraseEntropy(DEFAULT_PASSPHRASE_OPTIONS).bits;
        expect(passphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, capitalize: true, separator: "<>!" }).bits).toBe(plain);
    });

    it("3 words = 38.77 bits and 20 words = 258.5 bits", () => {
        expect(passphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, numWords: 3 }).bits).toBeCloseTo(38.77, 2);
        expect(passphraseEntropy({ ...DEFAULT_PASSPHRASE_OPTIONS, numWords: 20 }).bits).toBeCloseTo(258.5, 1);
    });
});

describe("username entropy", () => {
    it("random word: log2(7776) = 12.92 bits, plus log2(10^4) = 13.29 with a number", () => {
        expect(randomWordEntropy({ capitalize: false, includeNumber: false }).bits).toBeCloseTo(12.92, 2);
        expect(randomWordEntropy({ capitalize: true, includeNumber: true }).bits).toBeCloseTo(12.92 + 13.29, 2);
    });

    it("email tag: 8 * log2(36) = 41.36 bits", () => {
        expect(emailTagEntropy().bits).toBeCloseTo(41.36, 2);
    });
});

describe("formatScientific", () => {
    it("gives a mantissa and a power of ten", () => {
        expect(formatScientific(big(7776) ** big(5))).toEqual({ mantissa: 2.8, exponent: 19 });
        expect(formatScientific(big(10) ** big(30))).toEqual({ mantissa: 1, exponent: 30 });
        expect(formatScientific(big(999999))).toEqual({ mantissa: 1, exponent: 6 });
        expect(formatScientific(big(1234567))).toEqual({ mantissa: 1.2, exponent: 6 });
    });
});
