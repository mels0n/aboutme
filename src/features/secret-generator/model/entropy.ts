// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { EFF_WORDLIST_SIZE, type PassphraseOptions } from "./passphrase";
import { passwordSets, type PasswordOptions } from "./password";
import { EMAIL_TAG_ALPHABET, EMAIL_TAG_LENGTH, USERNAME_DIGITS, type RandomWordOptions } from "./username";

/*
 * Entropy here is log2 of the number of outputs the generator can produce.
 * Counts are exact (BigInt); `bits` is their log2.
 */

export interface Entropy {
    /** log2(outputs). */
    bits: number;
    /** How many distinct outputs are possible. */
    outputs: bigint;
}

const ZERO = BigInt(0);
const ONE = BigInt(1);

/** log2 of a positive BigInt: bit length plus the log2 of the top 53 bits. */
export function log2BigInt(n: bigint): number {
    if (n <= ZERO) throw new RangeError("log2 needs a positive number");
    const length = n.toString(2).length;
    if (length <= 53) return Math.log2(Number(n));
    const shift = length - 53;
    return Math.log2(Number(n >> BigInt(shift))) + shift;
}

const toEntropy = (outputs: bigint): Entropy => ({ outputs, bits: log2BigInt(outputs) });

/* ---------------------------------------------------------------- counting */

const binomialRows: bigint[][] = [[ONE]];
function binomial(n: number, k: number): bigint {
    if (k < 0 || k > n) return ZERO;
    while (binomialRows.length <= n) {
        const prev = binomialRows[binomialRows.length - 1];
        const row = [ONE];
        for (let i = 1; i < prev.length; i++) row.push(prev[i - 1] + prev[i]);
        row.push(ONE);
        binomialRows.push(row);
    }
    return binomialRows[n][k];
}

export interface CountedSet {
    /** Symbols in this set. Sets are disjoint. */
    size: number;
    /** Fewest symbols from this set a valid string holds. 0 means unconstrained. */
    min: number;
}

/**
 * Strings of `length` over the union of the sets that hold at least `min`
 * symbols from each set. Inclusion-exclusion over which sets fall short: for a
 * chosen group of sets, count strings with at most min-1 symbols from each,
 * placing those symbols by binomial choice and filling the remaining positions
 * from the symbols outside the group.
 */
export function countConstrainedStrings(length: number, sets: CountedSet[]): bigint {
    const total = sets.reduce((sum, s) => sum + s.size, 0);
    const constrained = sets.filter((s) => s.min > 0);

    const atMostCount = (group: CountedSet[], rest: number): bigint => {
        const place = (i: number, remaining: number): bigint => {
            if (i === group.length) return BigInt(rest) ** BigInt(remaining);
            let acc = ZERO;
            for (let c = 0; c < group[i].min && c <= remaining; c++) {
                acc += binomial(remaining, c) * BigInt(group[i].size) ** BigInt(c) * place(i + 1, remaining - c);
            }
            return acc;
        };
        return place(0, length);
    };

    let result = ZERO;
    for (let mask = 0; mask < 1 << constrained.length; mask++) {
        const group = constrained.filter((_, i) => mask & (1 << i));
        const groupSize = group.reduce((sum, s) => sum + s.size, 0);
        const term = atMostCount(group, total - groupSize);
        result += group.length % 2 === 0 ? term : -term;
    }
    return result;
}

/* ---------------------------------------------------------------- generators */

/**
 * Passwords: the number of valid strings, meaning strings of the chosen length
 * over the enabled characters with at least the required count from each set.
 *
 * Reserve-fill-shuffle (the method Bitwarden uses, and this generator too)
 * reaches every valid string but is not exactly uniform over them, because a
 * string with more than the minimum of some set can be built in more than one
 * way. The figure is therefore an upper bound on the true entropy, and in
 * practice very close to it. `bits` is that bound.
 */
export function passwordEntropy(options: PasswordOptions): Entropy {
    const sets = passwordSets(options).map((s) => ({ size: s.chars.length, min: s.min }));
    return toEntropy(countConstrainedStrings(options.length, sets));
}

/** Passphrase: each word is one of 7,776; the number adds one of 10 digits on one of numWords words. Capitalization is fixed, so adds nothing. */
export function passphraseEntropy(options: PassphraseOptions): Entropy {
    let outputs = BigInt(EFF_WORDLIST_SIZE) ** BigInt(options.numWords);
    if (options.includeNumber) outputs *= BigInt(10 * options.numWords);
    return toEntropy(outputs);
}

export function randomWordEntropy(options: RandomWordOptions): Entropy {
    let outputs = BigInt(EFF_WORDLIST_SIZE);
    if (options.includeNumber) outputs *= BigInt(10) ** BigInt(USERNAME_DIGITS);
    return toEntropy(outputs);
}

/** The random part of a generated email address: 8 characters from 36. The rest is chosen by the user. */
export function emailTagEntropy(): Entropy {
    return toEntropy(BigInt(EMAIL_TAG_ALPHABET.length) ** BigInt(EMAIL_TAG_LENGTH));
}

/* ---------------------------------------------------------------- display */

/** An output count as mantissa x 10^exponent, mantissa to one decimal. Used for "about 2.8 x 10^19". */
export function formatScientific(count: bigint): { mantissa: number; exponent: number } {
    const digits = count.toString();
    let exponent = digits.length - 1;
    let mantissa = Math.round(Number(`${digits[0]}.${digits.slice(1, 4).padEnd(3, "0")}`) * 10) / 10;
    if (mantissa >= 10) {
        mantissa = 1;
        exponent += 1;
    }
    return { mantissa, exponent };
}
