// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { log2BigInt, type Entropy } from "./entropy";

/*
 * Average time to crack a generated secret that a site stored with a given
 * method, after the site's database was stolen (an offline attack: the
 * attacker tests guesses on their own hardware, with no lockouts).
 *
 * Rig: 16 x NVIDIA RTX 5090, the rig size used by the Hive Systems 2026
 * password table (https://www.hivesystems.com/blog/are-your-passwords-in-the-green).
 * Only the rig size is borrowed; the per-hash rates below are not Hive's.
 *
 * Per-GPU rates come from the hashcat v6.2.6 RTX 5090 benchmark
 * (https://gist.github.com/Chick3nman/09bac0775e6393468c2925c1e1363d5c).
 * Hashcat benchmarks bcrypt and PBKDF2 at settings other than the ones sites
 * use, so those two are scaled, as follows.
 *
 * bcrypt cost 10: the benchmark is 304.8 kH/s at cost 5 (32 iterations).
 * Each cost step doubles the work, so cost 10 is 2^5 = 32 times slower:
 * 304,800 / 32 = 9,525 H/s per GPU.
 *
 * PBKDF2-HMAC-SHA256 at 600,000 iterations: the benchmark is 11,157.2 kH/s at
 * 999 iterations. Work is proportional to iterations, so the rate scales by
 * 999 / 600,000: 11,157,200 x 999 / 600,000 = about 18,577 H/s per GPU.
 *
 * Argon2id: Specops measured 490 Argon2id hashes per second on one eight-GPU
 * RTX 5090 system, as reported by CyberInsider
 * (https://cyberinsider.com/argon2-algorithm-dramatically-slows-password-cracking-by-high-end-gpus/).
 * Specops did not publish the Argon2 parameters. The per-card rate assumes the
 * total splits evenly over the 8 cards: 490 / 8 = 61.25 H/s per GPU.
 *
 * Average time = (outputs / 2) / (rate x GPUs): on average an attacker finds
 * the secret after trying half the possible outputs. This assumes the
 * attacker knows how the secret was generated (every output equally likely).
 */

export const RIG_GPU_COUNT = 16;
export const RIG_LABEL = "16 x RTX 5090";

export type CrackMethodKind = "plaintext" | "benchmarked";

export interface StorageMethod {
    id: string;
    label: string;
    /** Who uses this, in a few words. */
    example: string;
    /** Guesses per second for one GPU, or null for plain text, which has nothing to guess. */
    perGpuRate: number | null;
    kind: CrackMethodKind;
}

const BCRYPT_COST_5_RATE = 304.8e3;
const BCRYPT_COST_10_RATE = BCRYPT_COST_5_RATE / 2 ** (10 - 5);

export const ARGON2ID_SPECOPS_RATE = 490;
export const ARGON2ID_SPECOPS_GPUS = 8;
const ARGON2ID_RATE = ARGON2ID_SPECOPS_RATE / ARGON2ID_SPECOPS_GPUS;

const PBKDF2_BENCHMARK_RATE = 11_157.2e3;
const PBKDF2_BENCHMARK_ITERATIONS = 999;
export const PBKDF2_ITERATIONS = 600_000;
const PBKDF2_RATE = (PBKDF2_BENCHMARK_RATE * PBKDF2_BENCHMARK_ITERATIONS) / PBKDF2_ITERATIONS;

/** Weakest first. */
export const STORAGE_METHODS: readonly StorageMethod[] = [
    {
        id: "plaintext",
        label: "Plain text or reversible encryption",
        example: "RockYou 2009 (plain text); Adobe 2013 (encrypted)",
        perGpuRate: null,
        kind: "plaintext",
    },
    { id: "md5", label: "MD5", example: "Old, unsalted site databases", perGpuRate: 220.6e9, kind: "benchmarked" },
    { id: "sha1", label: "SHA-1", example: "LinkedIn, 2012 breach", perGpuRate: 70_245.1e6, kind: "benchmarked" },
    {
        id: "bcrypt",
        label: "bcrypt, cost 10",
        example: "A common framework default; OWASP minimum is cost 10",
        perGpuRate: BCRYPT_COST_10_RATE,
        kind: "benchmarked",
    },
    {
        id: "pbkdf2",
        label: "PBKDF2-SHA256, 600,000 iterations",
        example: "Bitwarden default, OWASP recommendation",
        perGpuRate: PBKDF2_RATE,
        kind: "benchmarked",
    },
    {
        id: "argon2id",
        label: "Argon2id",
        example: "Bitwarden option; OWASP first choice. Rate measured by Specops, settings not published",
        perGpuRate: ARGON2ID_RATE,
        kind: "benchmarked",
    },
];

export const NO_CRACKING_TEXT = "No cracking needed if the key is also taken: the password can be read directly";

/** The storage method with this id. Throws on an unknown id (a programming error). */
export function storageMethod(id: string): StorageMethod {
    const method = STORAGE_METHODS.find((m) => m.id === id);
    if (!method) throw new RangeError(`unknown storage method: ${id}`);
    return method;
}

/**
 * Seconds for the rig to find a secret with this many possible outputs, on
 * average. Done in log2 so a huge output count cannot overflow before the
 * division; a result too large for a float comes back as Infinity.
 */
export function averageCrackSeconds(entropy: Entropy, perGpuRate: number, gpus: number = RIG_GPU_COUNT): number {
    const log2Seconds = log2BigInt(entropy.outputs) - 1 - Math.log2(perGpuRate * gpus);
    return 2 ** log2Seconds;
}

/* ---------------------------------------------------------------- display */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365.25 * DAY;
const MONTH = YEAR / 12;

/** Smaller units, smallest first. A count that rounds up to the next unit moves there. */
const SHORT_UNITS = [
    { singular: "second", seconds: 1 },
    { singular: "minute", seconds: MINUTE },
    { singular: "hour", seconds: HOUR },
    { singular: "day", seconds: DAY },
    { singular: "month", seconds: MONTH },
    { singular: "year", seconds: YEAR },
] as const;

const twoFigures = (x: number): number => Number(x.toPrecision(2));

const groupThousands = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Plain-words duration, for example "about 1,300 years". Rounds to two significant figures for large values. */
export function formatCrackTime(seconds: number): string {
    if (!(seconds < Infinity)) return "more than a trillion years"; // also catches NaN and Infinity
    if (seconds < 1) return "under a second";

    const years = seconds / YEAR;
    if (years >= 1) {
        const rounded = twoFigures(years);
        if (rounded >= 1e12) return "more than a trillion years";
        if (rounded >= 1e9) return `about ${twoFigures(years / 1e9)} billion years`;
        if (rounded >= 1e6) return `about ${twoFigures(years / 1e6)} million years`;
        const count = years < 100 ? Math.round(years) : rounded;
        return `about ${groupThousands(count)} ${count === 1 ? "year" : "years"}`;
    }

    let index = 0;
    while (index + 1 < SHORT_UNITS.length && seconds >= SHORT_UNITS[index + 1].seconds) index++;
    let count = Math.round(seconds / SHORT_UNITS[index].seconds);
    const next = SHORT_UNITS[index + 1];
    if (next && count * SHORT_UNITS[index].seconds >= next.seconds) {
        index++;
        count = Math.max(1, Math.round(seconds / next.seconds));
    }
    const unit = SHORT_UNITS[index].singular;
    if (unit === "year") return "about 1 year"; // 11.5 months or more rounds to a year
    return `about ${count} ${unit}${count === 1 ? "" : "s"}`;
}

/** The "time" cell for one storage method and one entropy figure. */
export function crackTimeText(entropy: Entropy, method: StorageMethod): string {
    if (method.kind === "plaintext") return NO_CRACKING_TEXT;
    if (method.perGpuRate === null) return NO_CRACKING_TEXT;
    return formatCrackTime(averageCrackSeconds(entropy, method.perGpuRate));
}
