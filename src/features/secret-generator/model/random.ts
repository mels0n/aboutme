import { GeneratorError } from "./errors";

/**
 * A source of random 32-bit words: fills the array it is given. The default is
 * the browser's (or Node's) Web Crypto generator. Tests supply a scripted source
 * to check the rejection logic.
 */
export type RandomSource = (buffer: Uint32Array) => void;

export const cryptoSource: RandomSource = (buffer) => {
    globalThis.crypto.getRandomValues(buffer);
};

const TWO_POW_32 = 4294967296;

/**
 * A uniform integer in [0, n). Draws a 32-bit word and rejects any value at or
 * above the largest multiple of n that fits in 2^32, so no remainder is
 * favoured (a plain modulo would make low values slightly more likely).
 */
export function randomInt(n: number, source: RandomSource = cryptoSource): number {
    if (!Number.isInteger(n) || n < 1 || n > TWO_POW_32) {
        throw new GeneratorError("invalid-range", "Random range must be a whole number from 1 to 4294967296.");
    }
    const limit = Math.floor(TWO_POW_32 / n) * n;
    const buffer = new Uint32Array(1);
    for (;;) {
        source(buffer);
        if (buffer[0] < limit) return buffer[0] % n;
    }
}

/** Fisher-Yates shuffle, in place, using randomInt. Returns the same array. */
export function shuffle<T>(items: T[], source: RandomSource = cryptoSource): T[] {
    for (let i = items.length - 1; i > 0; i--) {
        const j = randomInt(i + 1, source);
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
}

/** One uniformly chosen element. */
export function pick<T>(items: readonly T[], source: RandomSource = cryptoSource): T {
    return items[randomInt(items.length, source)];
}
