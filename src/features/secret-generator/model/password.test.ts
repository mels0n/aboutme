// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { describe, expect, it } from "vitest";
import { GeneratorError } from "./errors";
import {
    DEFAULT_PASSWORD_OPTIONS, LOWERCASE, NUMBERS, SPECIAL, UPPERCASE,
    generatePassword, type PasswordOptions,
} from "./password";

const opts = (o: Partial<PasswordOptions> = {}): PasswordOptions => ({ ...DEFAULT_PASSWORD_OPTIONS, ...o });
const count = (s: string, set: string) => [...s].filter((c) => set.includes(c)).length;

describe("defaults", () => {
    it("are safer than Bitwarden's: 20 characters, all sets, one number, one special", () => {
        expect(DEFAULT_PASSWORD_OPTIONS).toEqual({
            length: 20, uppercase: true, lowercase: true, numbers: true, special: true,
            minNumbers: 1, minSpecial: 1, avoidAmbiguous: false,
        });
    });
});

describe("generatePassword", () => {
    it("returns exactly the requested length, from the enabled sets only", () => {
        for (const length of [5, 6, 20, 64, 128]) {
            const p = generatePassword(opts({ length }));
            expect(p).toHaveLength(length);
            expect(p).toMatch(/^[A-Za-z0-9!@#$%^&*]+$/);
        }
    });

    it("uses only lowercase when only lowercase is on", () => {
        for (let i = 0; i < 200; i++) {
            expect(generatePassword(opts({ uppercase: false, numbers: false, special: false }))).toMatch(/^[a-z]{20}$/);
        }
    });

    it("always holds at least one of every enabled set, even with zero minimums", () => {
        for (let i = 0; i < 2000; i++) {
            const p = generatePassword(opts({ length: 5, minNumbers: 0, minSpecial: 0, special: true }));
            expect(count(p, UPPERCASE)).toBeGreaterThanOrEqual(1);
            expect(count(p, LOWERCASE)).toBeGreaterThanOrEqual(1);
            expect(count(p, NUMBERS)).toBeGreaterThanOrEqual(1);
            expect(count(p, SPECIAL)).toBeGreaterThanOrEqual(1);
        }
    });

    it("honours minNumbers and minSpecial over many runs", () => {
        for (let i = 0; i < 2000; i++) {
            const p = generatePassword(opts({ length: 16, minNumbers: 4, minSpecial: 3 }));
            expect(count(p, NUMBERS)).toBeGreaterThanOrEqual(4);
            expect(count(p, SPECIAL)).toBeGreaterThanOrEqual(3);
        }
    });

    it("ignores minimums for a set that is turned off", () => {
        for (let i = 0; i < 300; i++) {
            const p = generatePassword(opts({ numbers: false, minNumbers: 9, length: 8 }));
            expect(count(p, NUMBERS)).toBe(0);
        }
    });

    it("never produces I, O, l, 0 or 1 with avoidAmbiguous", () => {
        for (let i = 0; i < 2000; i++) {
            expect(generatePassword(opts({ avoidAmbiguous: true, length: 64 }))).not.toMatch(/[IOl01]/);
        }
    });

    it("does not filter the special characters with avoidAmbiguous", () => {
        const seen = new Set<string>();
        for (let i = 0; i < 500; i++) {
            for (const c of generatePassword(opts({ avoidAmbiguous: true, length: 64 }))) seen.add(c);
        }
        for (const c of SPECIAL) expect(seen.has(c)).toBe(true);
    });

    it("can fill the length exactly with the reserved characters", () => {
        const p = generatePassword(opts({ length: 9, minNumbers: 3, minSpecial: 4 }));
        expect(p).toHaveLength(9);
        expect(count(p, NUMBERS)).toBe(3);
        expect(count(p, SPECIAL)).toBe(4);
    });
});

describe("validation", () => {
    it("ignores a nonsense minimum while its set is off", () => {
        expect(generatePassword(opts({ numbers: false, minNumbers: Number.NaN }))).toHaveLength(20);
        expect(generatePassword(opts({ special: false, minSpecial: -3 }))).toHaveLength(20);
    });

    it("still rejects a nonsense minimum while its set is on", () => {
        expect(() => generatePassword(opts({ minNumbers: Number.NaN }))).toThrow(GeneratorError);
        expect(() => generatePassword(opts({ minSpecial: 10 }))).toThrow(GeneratorError);
    });

    it.each([4, 129, 0, 20.5, Number.NaN])("rejects length %s", (length) => {
        expect(() => generatePassword(opts({ length }))).toThrow(GeneratorError);
    });

    it.each([5, 128])("accepts the length bound %s", (length) => {
        expect(generatePassword(opts({ length }))).toHaveLength(length);
    });

    it("rejects minimums outside 0..9", () => {
        expect(() => generatePassword(opts({ minNumbers: 10 }))).toThrow(GeneratorError);
        expect(() => generatePassword(opts({ minSpecial: -1 }))).toThrow(GeneratorError);
    });

    it("rejects no character set at all", () => {
        expect(() =>
            generatePassword(opts({ uppercase: false, lowercase: false, numbers: false, special: false })),
        ).toThrow(/at least one/i);
    });

    it("rejects reserved slots greater than the length", () => {
        // 1 + 1 + 5 + 4 = 11 reserved
        expect(() => generatePassword(opts({ length: 10, minNumbers: 5, minSpecial: 4 }))).toThrow(
            expect.objectContaining({ code: "invalid-options", message: expect.stringMatching(/reserve/i) }),
        );
    });

    it("rejects input that is not an object of the right shape", () => {
        expect(() => generatePassword({ length: "20" } as unknown as PasswordOptions)).toThrow(GeneratorError);
    });
});
