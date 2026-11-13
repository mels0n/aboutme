// SPDX-License-Identifier: PolyForm-Strict-1.0.0
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { RIG_GPU_COUNT, crackTimeText, storageMethod } from "./crack-time";
import { passphraseEntropy, passwordEntropy } from "./entropy";
import { DEFAULT_PASSPHRASE_OPTIONS, EFF_WORDLIST_SIZE, MAX_WORDS, MIN_WORDS } from "./passphrase";
import { DEFAULT_PASSWORD_OPTIONS, MAX_LENGTH, MIN_LENGTH } from "./password";

/*
 * The page and its FAQ state numbers in prose. This reads both as text and
 * checks that those numbers still match the constants the generator uses.
 */
const here = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(join(here, "..", "..", "..", "app", "tools", "password-generator", "page.tsx"), "utf8");
const faq = readFileSync(join(here, "faq.ts"), "utf8");
const copy = `${page}\n${faq}`;

const passwordBits = passwordEntropy(DEFAULT_PASSWORD_OPTIONS).bits.toFixed(1);
const passphraseBits = passphraseEntropy(DEFAULT_PASSPHRASE_OPTIONS).bits.toFixed(1);

describe("the stated numbers match the constants", () => {
    it("states the character range", () => {
        expect(page).toContain(`${MIN_LENGTH} to ${MAX_LENGTH} characters`);
        for (const [, from, to] of copy.matchAll(/(\d+) to (\d+) characters/g)) {
            expect([Number(from), Number(to)]).toEqual([MIN_LENGTH, MAX_LENGTH]);
        }
    });

    it("states the word range", () => {
        expect(page).toContain(`${MIN_WORDS} to ${MAX_WORDS} words`);
        for (const [, from, to] of copy.matchAll(/(\d+) to (\d+) words/g)) {
            expect([Number(from), Number(to)]).toEqual([MIN_WORDS, MAX_WORDS]);
        }
    });

    it("states the default password length and word count", () => {
        expect(DEFAULT_PASSWORD_OPTIONS.length).toBe(20);
        expect(DEFAULT_PASSPHRASE_OPTIONS.numWords).toBe(6);
        expect(page).toContain(`(${DEFAULT_PASSWORD_OPTIONS.length} by default)`);
        expect(page).toContain(`(${DEFAULT_PASSPHRASE_OPTIONS.numWords} by default,`);
        expect(faq).toContain(`defaults to ${DEFAULT_PASSWORD_OPTIONS.length} characters`);
        expect(faq).toContain("default of six random words");
    });

    it("states the default entropy and the per-word figure", () => {
        expect(passphraseBits).toBe("77.5");
        expect(passwordBits).toBe("122.4");
        expect(page).toContain(`about ${passphraseBits} bits`);
        expect(faq).toContain(`about ${passphraseBits} bits`);
        expect((Math.log2(EFF_WORDLIST_SIZE)).toFixed(1)).toBe("12.9");
        expect(page).toContain("each word adds about 12.9 bits");
        expect(page).toContain("7,776 words");
        for (const [, bits] of copy.matchAll(/about (\d+\.\d) bits/g)) {
            expect([passphraseBits, passwordBits, "12.9"]).toContain(bits);
        }
    });
});

describe("the FAQ crack-time answer matches the model", () => {
    const passphrase = passphraseEntropy(DEFAULT_PASSPHRASE_OPTIONS);
    const password = passwordEntropy(DEFAULT_PASSWORD_OPTIONS);
    const answer = faq.slice(faq.indexOf("How long would it take to crack a generated password?"));

    it("states the rig size", () => {
        expect(RIG_GPU_COUNT).toBe(12);
        expect(answer).toContain(`${RIG_GPU_COUNT} RTX 5090 graphics cards`);
    });

    it("states the default passphrase times", () => {
        expect(answer).toContain(`${crackTimeText(passphrase, storageMethod("md5"))} against MD5`);
        expect(answer).toContain(`${crackTimeText(passphrase, storageMethod("pbkdf2"))} against PBKDF2-SHA256 with 600,000 iterations`);
        expect(answer).toContain(`${crackTimeText(passphrase, storageMethod("bcrypt"))} against bcrypt at cost 10`);
    });

    it("states the default password time, which is the same for all three", () => {
        const times = ["md5", "pbkdf2", "bcrypt"].map((id) => crackTimeText(password, storageMethod(id)));
        expect(new Set(times).size).toBe(1);
        expect(answer).toContain(`The default 20-character password takes ${times[0]} against all three.`);
    });
});
