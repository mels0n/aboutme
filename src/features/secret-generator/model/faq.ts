// SPDX-License-Identifier: PolyForm-Strict-1.0.0
/**
 * The questions answered on the generator page. One list feeds both the
 * visible FAQ and the page's FAQPage structured data, so the two cannot drift.
 * Answers avoid full example email addresses and long digit runs, which the
 * structured-data checker rejects as possible personal data.
 */
export type FaqEntry = { question: string; answer: string };

export const SECRET_GENERATOR_FAQ: readonly FaqEntry[] = [
    {
        question: "Is this password generator free?",
        answer:
            "Yes. There is no sign-up, no account, no usage limit and no ads. Make as many passwords, passphrases and usernames as you like.",
    },
    {
        question: "Is it safe to use an online password generator?",
        answer:
            "It can be, if the generator runs in your browser and never sends what it makes. This one creates every value on your device with the Web Crypto API, so the value never travels to a server. You can confirm it by watching your browser's network tab while you generate. The method is explained on this page so you can judge it for yourself.",
    },
    {
        question: "Does it save, store or send my passwords?",
        answer:
            "No. It saves nothing. Each value is made in your browser after the page loads and lives in memory until you refresh, change a setting or leave. The generator does not put it in the web address, save it to browser storage, log it or send it anywhere. The site uses Google Analytics, which records an ordinary page view, but the generated values are never part of it.",
    },
    {
        question: "Does it work offline?",
        answer:
            "Once the page has loaded, generating needs no internet connection. The code and the 7,776-word list are part of the page, and the generator makes no network requests of its own. There is no installable offline mode, so open the page while you are online first.",
    },
    {
        question: "How long should a password be?",
        answer:
            "NIST SP 800-63B Rev 4 sets a minimum of 15 characters when a password is the only authentication factor, and 8 when it is used with another factor. It also advises against forced composition rules. This generator defaults to 20 characters, and longer is fine for anything a password manager fills in for you.",
    },
    {
        question: "Is a passphrase better than a password?",
        answer:
            "A passphrase is easier to remember and type at a similar strength, so it suits a password manager master password or a device login. The default of six random words from the EFF list is about 77.5 bits of entropy. For accounts your manager fills in, a long random password works just as well.",
    },
    {
        question: "What is a plus-addressed or catch-all email username?",
        answer:
            "A plus-addressed email adds a plus sign and a random tag before the @ sign of your own address, so mail still reaches your inbox but each site gets a different address. A catch-all email is a random name at a domain you own, where your mail provider delivers every address to one inbox. Not every site accepts a plus sign.",
    },
    {
        question: "Can I see the code?",
        answer:
            "Yes. The generator's source and its tests are published on GitHub for anyone to read and audit, under the PolyForm Strict License 1.0.0. That license allows noncommercial use but not redistribution, modification or reuse in other projects. Run the tests yourself, and watch your browser's network tab to confirm nothing is sent.",
    },
    {
        question: "How is this different from Bitwarden's generator?",
        answer:
            "The password, passphrase and username types and most settings follow Bitwarden's generator, and this page has no affiliation with Bitwarden. It is only a generator: there is no vault, no autofill and nothing to sign in to. Generate here, then save the result in your own password manager.",
    },
];
