// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { z } from "zod";
import { parseOrThrow } from "./errors";
import { cryptoSource, pick, shuffle, type RandomSource } from "./random";

/*
 * Options and algorithm mirror Bitwarden's password generator (no affiliation):
 * the same character sets, the same ambiguous-character list, the same 5..128
 * length range and 0..9 minimums, and the same "reserve, fill, shuffle" method.
 */

export const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export const SPECIAL = "!@#$%^&*";

/** Characters that look alike in many fonts. Specials are never filtered. */
const AMBIGUOUS = new Set("IOl01");

export const MIN_LENGTH = 5;
export const MAX_LENGTH = 128;
export const MAX_MINIMUM = 9;

export interface PasswordOptions {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
    /** Fewest digits to include. Applies only while numbers are on. */
    minNumbers: number;
    /** Fewest special characters to include. Applies only while special is on. */
    minSpecial: number;
    avoidAmbiguous: boolean;
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
    minNumbers: 1,
    minSpecial: 1,
    avoidAmbiguous: false,
};

const passwordSchema = z
    .object({
        length: z
            .number({ error: `Length must be a whole number from ${MIN_LENGTH} to ${MAX_LENGTH}.` })
            .int(`Length must be a whole number from ${MIN_LENGTH} to ${MAX_LENGTH}.`)
            .min(MIN_LENGTH, `Length must be at least ${MIN_LENGTH}.`)
            .max(MAX_LENGTH, `Length must be at most ${MAX_LENGTH}.`),
        uppercase: z.boolean(),
        lowercase: z.boolean(),
        numbers: z.boolean(),
        special: z.boolean(),
        minNumbers: z
            .number({ error: `Minimum numbers must be a whole number from 0 to ${MAX_MINIMUM}.` })
            .int(`Minimum numbers must be a whole number from 0 to ${MAX_MINIMUM}.`)
            .min(0, `Minimum numbers must be a whole number from 0 to ${MAX_MINIMUM}.`)
            .max(MAX_MINIMUM, `Minimum numbers must be a whole number from 0 to ${MAX_MINIMUM}.`),
        minSpecial: z
            .number({ error: `Minimum special must be a whole number from 0 to ${MAX_MINIMUM}.` })
            .int(`Minimum special must be a whole number from 0 to ${MAX_MINIMUM}.`)
            .min(0, `Minimum special must be a whole number from 0 to ${MAX_MINIMUM}.`)
            .max(MAX_MINIMUM, `Minimum special must be a whole number from 0 to ${MAX_MINIMUM}.`),
        avoidAmbiguous: z.boolean(),
    })
    .superRefine((o, ctx) => {
        if (!o.uppercase && !o.lowercase && !o.numbers && !o.special) {
            ctx.addIssue({ code: "custom", message: "Turn on at least one character set." });
            return;
        }
        const reserved = reservedSlots(o);
        if (reserved > o.length) {
            ctx.addIssue({
                code: "custom",
                message: `The enabled sets reserve ${reserved} characters, which is more than the length of ${o.length}.`,
            });
        }
    });

/** Slots each enabled set must fill: 1 for letters, max(minimum, 1) for numbers and special. */
function reservedSlots(o: PasswordOptions): number {
    return (o.uppercase ? 1 : 0) + (o.lowercase ? 1 : 0)
        + (o.numbers ? Math.max(o.minNumbers, 1) : 0) + (o.special ? Math.max(o.minSpecial, 1) : 0);
}

export interface PasswordSet {
    chars: string;
    /** Fewest characters from this set a valid password holds. */
    min: number;
}

/** The enabled sets with their required counts, after the ambiguous filter. Validates the options. */
export function passwordSets(input: PasswordOptions): PasswordSet[] {
    const o = parseOrThrow(passwordSchema, input, "invalid-options");
    const keep = (chars: string) => (o.avoidAmbiguous ? [...chars].filter((c) => !AMBIGUOUS.has(c)).join("") : chars);
    const sets: PasswordSet[] = [];
    if (o.uppercase) sets.push({ chars: keep(UPPERCASE), min: 1 });
    if (o.lowercase) sets.push({ chars: keep(LOWERCASE), min: 1 });
    if (o.numbers) sets.push({ chars: keep(NUMBERS), min: Math.max(o.minNumbers, 1) });
    if (o.special) sets.push({ chars: SPECIAL, min: Math.max(o.minSpecial, 1) });
    return sets;
}

/** Reserve each set's required characters, fill the rest from every enabled set, then shuffle. */
export function generatePassword(options: PasswordOptions, source: RandomSource = cryptoSource): string {
    const sets = passwordSets(options);
    const pool = [...sets.map((s) => s.chars).join("")];
    const chars: string[] = [];
    for (const set of sets) {
        const symbols = [...set.chars];
        for (let i = 0; i < set.min; i++) chars.push(pick(symbols, source));
    }
    while (chars.length < options.length) chars.push(pick(pool, source));
    return shuffle(chars, source).join("");
}
