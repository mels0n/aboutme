import { describe, expect, it } from "vitest";
import { EFF_LARGE_WORDLIST } from "./eff-large-wordlist";
import { GeneratorError } from "./errors";
import { generateCatchAllEmail, generatePlusAddressedEmail, generateRandomWordUsername } from "./username";

const wordSet = new Set(EFF_LARGE_WORDLIST);

describe("random word username", () => {
    it("is one list word by default", () => {
        for (let i = 0; i < 100; i++) {
            expect(wordSet.has(generateRandomWordUsername({ capitalize: false, includeNumber: false }, EFF_LARGE_WORDLIST))).toBe(true);
        }
    });

    it("capitalizes the first letter", () => {
        const u = generateRandomWordUsername({ capitalize: true, includeNumber: false }, EFF_LARGE_WORDLIST);
        expect(u[0]).toBe(u[0].toUpperCase());
        expect(wordSet.has(u[0].toLowerCase() + u.slice(1))).toBe(true);
    });

    it("appends four random digits", () => {
        const u = generateRandomWordUsername({ capitalize: false, includeNumber: true }, EFF_LARGE_WORDLIST);
        expect(u).toMatch(/^[a-z-]+\d{4}$/);
        expect(wordSet.has(u.slice(0, -4))).toBe(true);
    });

    it("rejects an empty wordlist", () => {
        expect(() => generateRandomWordUsername({ capitalize: false, includeNumber: false }, [])).toThrow(GeneratorError);
    });
});

describe("plus-addressed email", () => {
    it("adds +<8 lowercase alphanumerics> to the local part", () => {
        const out = generatePlusAddressedEmail("chris@example.com");
        expect(out).toMatch(/^chris\+[a-z0-9]{8}@example\.com$/);
    });

    it("trims surrounding whitespace", () => {
        expect(generatePlusAddressedEmail("  a@b.co ")).toMatch(/^a\+[a-z0-9]{8}@b\.co$/);
    });

    it("gives a different tag each time", () => {
        const tags = new Set(Array.from({ length: 50 }, () => generatePlusAddressedEmail("a@b.co")));
        expect(tags.size).toBe(50);
    });

    it.each(["", "nobody", "@example.com", "user@", "a@b@c.com", "a b@example.com", "user@nodot", "user@-bad.com", "user@exa mple.com"])(
        "rejects %j",
        (input) => {
            expect(() => generatePlusAddressedEmail(input)).toThrow(GeneratorError);
        },
    );

    it("reports an invalid-email code for a bad address", () => {
        expect(() => generatePlusAddressedEmail("nope")).toThrow(expect.objectContaining({ code: "invalid-email" }));
    });
});

describe("catch-all email", () => {
    it("builds <8 lowercase alphanumerics>@domain", () => {
        expect(generateCatchAllEmail("example.com")).toMatch(/^[a-z0-9]{8}@example\.com$/);
        expect(generateCatchAllEmail(" Mail.Example.co.uk ")).toMatch(/^[a-z0-9]{8}@mail\.example\.co\.uk$/);
    });

    it.each(["", "localhost", "no spaces.com", "a..com", ".com", "example.c", "ex_ample.com", "user@example.com", "-a.com", "a-.com"])(
        "rejects %j",
        (input) => {
            expect(() => generateCatchAllEmail(input)).toThrow(expect.objectContaining({ code: "invalid-domain" }));
        },
    );
});
