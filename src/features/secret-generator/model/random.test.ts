// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { describe, expect, it } from "vitest";
import { GeneratorError } from "./errors";
import { randomInt, shuffle, type RandomSource } from "./random";

/** A source that replays the given words, then throws if asked for more. */
function scripted(words: number[]): { source: RandomSource; calls: () => number } {
    let i = 0;
    return {
        source: (buffer) => {
            if (i >= words.length) throw new Error("script exhausted");
            buffer[0] = words[i++];
        },
        calls: () => i,
    };
}

describe("randomInt", () => {
    it("rejects words at or above the largest multiple of n", () => {
        // n = 3: limit = floor(2^32 / 3) * 3 = 4294967295. Only 4294967295 is rejected.
        const { source, calls } = scripted([4294967295, 4294967294]);
        expect(randomInt(3, source)).toBe(4294967294 % 3);
        expect(calls()).toBe(2);
    });

    it("rejects the whole biased tail for a large n", () => {
        // n = 2^31 + 1: limit = 2^31 + 1, so every word >= that is rejected.
        const n = 2147483649;
        const { source, calls } = scripted([4000000000, 2147483649, 2147483648]);
        expect(randomInt(n, source)).toBe(2147483648);
        expect(calls()).toBe(3);
    });

    it("never rejects when n divides 2^32", () => {
        const { source, calls } = scripted([4294967295]);
        expect(randomInt(256, source)).toBe(255);
        expect(calls()).toBe(1);
    });

    it("accepts n = 1 and n = 2^32", () => {
        expect(randomInt(1)).toBe(0);
        const { source } = scripted([4294967295]);
        expect(randomInt(4294967296, source)).toBe(4294967295);
    });

    it.each([0, -1, 1.5, Number.NaN, 4294967297])("throws on n = %s", (n) => {
        expect(() => randomInt(n)).toThrow(GeneratorError);
    });

    it("stays inside the range with the real source", () => {
        for (let i = 0; i < 2000; i++) {
            const v = randomInt(7);
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(7);
        }
    });
});

describe("shuffle", () => {
    it("keeps every element exactly once", () => {
        const input = Array.from({ length: 50 }, (_, i) => i);
        const out = shuffle([...input]);
        expect([...out].sort((a, b) => a - b)).toEqual(input);
    });

    it("returns the same array it was given", () => {
        const arr = [1, 2, 3];
        expect(shuffle(arr)).toBe(arr);
    });

    it("handles empty and single-element arrays", () => {
        expect(shuffle([])).toEqual([]);
        expect(shuffle([9])).toEqual([9]);
    });
});
