// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { z } from "zod";
import { GeneratorError, parseOrThrow } from "./errors";
import { cryptoSource, pick, randomInt, type RandomSource } from "./random";

/** Words in the EFF large list. Entropy depends on this, so the list is checked against it in tests. */
export const EFF_WORDLIST_SIZE = 7776;

export const MIN_WORDS = 3;
export const MAX_WORDS = 20;
export const MAX_SEPARATOR_LENGTH = 3;

export interface PassphraseOptions {
    numWords: number;
    /** Up to 3 characters, may be empty. */
    separator: string;
    /** Upper-case the first letter of every word. */
    capitalize: boolean;
    /** Append one random digit to one randomly chosen word. */
    includeNumber: boolean;
}

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
    numWords: 6,
    separator: "-",
    capitalize: false,
    includeNumber: false,
};

const wordsMessage = `Number of words must be a whole number from ${MIN_WORDS} to ${MAX_WORDS}.`;
const passphraseSchema = z.object({
    numWords: z.number({ error: wordsMessage }).int(wordsMessage).min(MIN_WORDS, wordsMessage).max(MAX_WORDS, wordsMessage),
    separator: z
        .string({ error: "Separator must be text." })
        .refine((s) => [...s].length <= MAX_SEPARATOR_LENGTH, `Separator can be at most ${MAX_SEPARATOR_LENGTH} characters.`),
    capitalize: z.boolean(),
    includeNumber: z.boolean(),
});

/** Upper-cases the first character. */
export function capitalizeWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function requireWords(words: readonly string[]): void {
    if (words.length === 0) throw new GeneratorError("empty-wordlist", "The word list is empty.");
}

/** Words come in as an argument so the UI can load the 7,776-word list only when it is needed. */
export function generatePassphrase(
    input: PassphraseOptions,
    words: readonly string[],
    source: RandomSource = cryptoSource,
): string {
    const options = parseOrThrow(passphraseSchema, input, "invalid-options");
    requireWords(words);
    const chosen = Array.from({ length: options.numWords }, () => pick(words, source));
    const cased = options.capitalize ? chosen.map(capitalizeWord) : chosen;
    if (options.includeNumber) {
        const at = randomInt(cased.length, source);
        cased[at] += String(randomInt(10, source));
    }
    return cased.join(options.separator);
}
