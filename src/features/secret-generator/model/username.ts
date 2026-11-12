// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { z } from "zod";
import { parseOrThrow } from "./errors";
import { capitalizeWord, requireWords } from "./passphrase";
import { cryptoSource, pick, randomInt, type RandomSource } from "./random";

export interface RandomWordOptions {
    capitalize: boolean;
    /** Append 4 random digits. */
    includeNumber: boolean;
}

/** Characters in the random part of a generated email address. */
export const EMAIL_TAG_LENGTH = 8;
export const EMAIL_TAG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
/** Digits appended by includeNumber. */
export const USERNAME_DIGITS = 4;

export function generateRandomWordUsername(
    options: RandomWordOptions,
    words: readonly string[],
    source: RandomSource = cryptoSource,
): string {
    requireWords(words);
    const word = pick(words, source);
    let out = options.capitalize ? capitalizeWord(word) : word;
    if (options.includeNumber) {
        for (let i = 0; i < USERNAME_DIGITS; i++) out += String(randomInt(10, source));
    }
    return out;
}

function randomTag(source: RandomSource): string {
    return Array.from({ length: EMAIL_TAG_LENGTH }, () => pick([...EMAIL_TAG_ALPHABET], source)).join("");
}

/** Letters, digits and inner hyphens in each label; at least two labels; alphabetic last label of 2+ letters. */
const DOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const TLD = /^[a-z]{2,63}$/;

function isPlausibleDomain(domain: string): boolean {
    if (domain.length > 253) return false;
    const labels = domain.split(".");
    if (labels.length < 2) return false;
    return labels.every((l) => DOMAIN_LABEL.test(l)) && TLD.test(labels[labels.length - 1]);
}

const domainSchema = z
    .string({ error: "Enter a domain such as example.com." })
    .transform((s) => s.trim().toLowerCase())
    .refine(isPlausibleDomain, "Enter a domain such as example.com.");

const emailSchema = z
    .string({ error: "Enter an email address such as name@example.com." })
    .transform((s) => s.trim())
    .refine(
        (s) => {
            const parts = s.split("@");
            if (parts.length !== 2) return false;
            const [local, domain] = parts;
            return local.length > 0 && !/\s/.test(local) && isPlausibleDomain(domain.toLowerCase());
        },
        "Enter an email address such as name@example.com.",
    );

/** user@domain becomes user+<tag>@domain. */
export function generatePlusAddressedEmail(email: string, source: RandomSource = cryptoSource): string {
    const valid = parseOrThrow(emailSchema, email, "invalid-email");
    const at = valid.lastIndexOf("@");
    return `${valid.slice(0, at)}+${randomTag(source)}@${valid.slice(at + 1).toLowerCase()}`;
}

/** domain becomes <tag>@domain, for a catch-all mailbox. */
export function generateCatchAllEmail(domain: string, source: RandomSource = cryptoSource): string {
    const valid = parseOrThrow(domainSchema, domain, "invalid-domain");
    return `${randomTag(source)}@${valid}`;
}

