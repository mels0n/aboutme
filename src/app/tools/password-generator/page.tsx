import Link from "next/link";
import { SECRET_GENERATOR_FAQ, SecretGenerator } from "@/features/secret-generator";
import { officeBlogPosts } from "@/shared/data/published_blog_posts";
import { pageMetadata } from "@/shared/lib/seo/metadata";
import { toolGraph } from "@/shared/lib/structured-data";
import { JsonLdScript } from "@/shared/ui/JsonLdScript";

const PATH = "/tools/password-generator";
const TITLE = "Free Secure Password Generator: Private, No Sign-Up";
const H1 = "Free, Private Password Generator";
const DESCRIPTION =
    "Free, private password, passphrase and username generator. Made in your browser with the Web Crypto API. No sign-up, nothing sent, stored or logged.";

export const metadata = pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    image: { url: `/api/og?title=${encodeURIComponent(H1)}`, width: 1200, height: 630 },
});

const FEATURES = [
    "Random passwords from 5 to 128 characters with uppercase, lowercase, numbers and special characters",
    "Passphrases of 3 to 20 words from the EFF large wordlist with a custom separator",
    "Random-word, plus-addressed email and catch-all email usernames",
    "Exact entropy and number of possible outputs shown for every result",
    "Generated in the browser with the Web Crypto API, never sent, stored or logged",
    "No sign-up, no account, no usage limits and no ads",
    "Source published on GitHub to read, audit and test",
];

const SELLING_POINTS = [
    { title: "Free", text: "No sign-up, no account, no limits and no ads." },
    { title: "Private", text: "Made in your browser. It saves nothing and sends nothing." },
    { title: "Secure", text: "Cryptographic randomness, unbiased selection and exact entropy for every result." },
    { title: "Published source", text: "Every line is on GitHub to read, audit and test." },
];

const SOURCE_URL = "https://github.com/mels0n/aboutme/tree/main/src/features/secret-generator";
const TESTS_URL = `${SOURCE_URL}/model`;

/*
 * Blog posts this page links to. The site builds only the posts that are
 * published at build time, so a link renders only once its post exists and can
 * never point at a 404.
 */
const publishedSlugs = new Set(officeBlogPosts.map((post) => post.slug));
const postHref = (slug: string) => `/guide/operational-architecture/blog/${slug}`;
const GENERATOR_POST = "password-generator-passphrases-entropy";
const HOMELAB_POST = "unifi-firewall-enough-homelab-security";

const link =
    "underline decoration-highlight underline-offset-2 hover:text-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight";

function External({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
            {children}
        </a>
    );
}

const h2 = "font-display text-2xl font-bold text-foreground";
const h3 = "font-bold text-foreground";
const section = "space-y-4 text-foreground/80";

export default function PasswordGeneratorPage() {
    return (
        <main className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6 sm:py-24">
            <JsonLdScript
                graph={toolGraph({ name: H1, description: DESCRIPTION }, PATH, {
                    featureList: FEATURES,
                    faq: [...SECRET_GENERATOR_FAQ],
                    source: { repository: "https://github.com/mels0n/aboutme", url: SOURCE_URL },
                })}
            />

            <nav>
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
                >
                    &larr; Return to Main Interface
                </Link>
            </nav>

            <header className="space-y-4">
                <h1 className="font-display text-4xl font-bold text-foreground">{H1}</h1>
                <p className="font-serif text-lg text-foreground/80">
                    Make a strong password, passphrase or username in one click. It runs in your browser, and the
                    values it makes are never sent, stored or logged.
                </p>
            </header>

            <SecretGenerator />

            <ul className="grid gap-4 sm:grid-cols-2">
                {SELLING_POINTS.map(({ title, text }) => (
                    <li key={title} className="rounded-lg border border-border bg-surface/50 p-4">
                        <p className={h3}>{title}</p>
                        <p className="text-sm text-foreground/80">{text}</p>
                    </li>
                ))}
            </ul>

            {publishedSlugs.has(GENERATOR_POST) && (
                <p className="text-foreground/80">
                    <Link href={postHref(GENERATOR_POST)} className={link}>
                        Read how this generator works
                    </Link>
                </p>
            )}

            <section className={section}>
                <h2 className={h2}>Why this password generator is private</h2>
                <ul className="list-disc space-y-2 pl-5">
                    <li>Every value is made in your browser with the Web Crypto API, after the page loads. It is never in the HTML the server sends.</li>
                    <li><strong>It saves nothing.</strong> The generator writes nothing to browser storage or cookies, keeps nothing between visits and sends nothing. Closing or refreshing the page erases the value.</li>
                    <li>It does not put a value in the web address or log it. Your settings are not saved either.</li>
                    <li>The output box has spell-check turned off, so browser spell-check services never see it.</li>
                    <li>Once the page has loaded, generating needs no internet connection. The word list loads with the page.</li>
                    <li>This site uses Google Analytics, which records an ordinary page view. The generated values are never part of it.</li>
                </ul>
                <p>
                    Copying puts the value on your clipboard, and clipboard managers such as Windows clipboard
                    history (Win+V) can keep copies. Clear the entry after you paste it. A web page cannot reliably
                    clear your clipboard for you.
                </p>
            </section>

            <section className={section}>
                <h2 className={h2}>How the randomness works</h2>
                <p>
                    Each character and each word is picked from your browser&apos;s cryptographically secure random
                    number generator (<code>crypto.getRandomValues</code>). To keep every choice equally likely, the
                    generator uses rejection sampling: it discards the few random numbers that would favour some
                    choices over others, then draws again. Passwords are shuffled with a Fisher-Yates shuffle so
                    required characters do not sit in predictable places.
                </p>
                <p>
                    Passphrases use the EFF large wordlist of 7,776 words, so each word adds about 12.9 bits.
                    Entropy counts how many different results the generator could have produced, written in bits.
                    Each extra bit doubles that count, and an attacker who knows your settings would have to try
                    that many possibilities in the worst case. The exact figure is shown beside every result.
                </p>
                <p>
                    NIST SP 800-63B Rev 4 favours length over composition rules, so a long random passphrase is a
                    sound default. Read the guidance at{" "}
                    <External href="https://pages.nist.gov/800-63-4/sp800-63b.html">pages.nist.gov</External>. The
                    strength labels beside each result are this site&apos;s own rule of thumb, not a standard.
                </p>
            </section>

            <section className={section}>
                <h2 className={h2}>Passwords, passphrases or usernames: which to use</h2>
                <ul className="list-disc space-y-2 pl-5">
                    <li><strong>Password:</strong> for accounts your password manager fills in. Random characters pack the most entropy into the fewest keystrokes.</li>
                    <li><strong>Passphrase:</strong> for secrets you type or remember, such as a manager master password or a device login. Words are easier to recall than symbols.</li>
                    <li><strong>Username:</strong> a random word name, or a plus-addressed or catch-all email, so each site gets a different sign-up identity.</li>
                </ul>
            </section>

            <section className={section}>
                <h2 className={h2}>Options</h2>
                <ul className="list-disc space-y-2 pl-5">
                    <li><strong>Password:</strong> 5 to 128 characters (20 by default), uppercase, lowercase, numbers and special characters, a minimum count of numbers and special characters, and an option to avoid look-alike characters.</li>
                    <li><strong>Passphrase:</strong> 3 to 20 words (6 by default, about 77.5 bits), a separator of up to 3 characters (a hyphen by default), optional capitalization and an optional number.</li>
                    <li><strong>Username:</strong> a random word with optional capitalization and a 4-digit number, a plus-addressed email, or a catch-all email.</li>
                </ul>
            </section>

            <section className={section}>
                <h2 className={h2}>Frequently asked questions</h2>
                <div className="space-y-6">
                    {SECRET_GENERATOR_FAQ.map(({ question, answer }) => (
                        <div key={question} className="space-y-1">
                            <h3 className={h3}>{question}</h3>
                            <p>{answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {publishedSlugs.has(HOMELAB_POST) && (
                <section className={section}>
                    <h2 className={h2}>Related reading</h2>
                    <p>
                        A strong password protects one account. For the rest of a home network, read{" "}
                        <Link href={postHref(HOMELAB_POST)} className={link}>
                            Is Your UniFi Firewall Enough for Homelab Security?
                        </Link>
                    </p>
                </section>
            )}

            <section className={section}>
                <h2 className={h2}>Published source</h2>
                <p>
                    The generator&apos;s code is published on GitHub for anyone to read and audit, under the{" "}
                    <External href="https://polyformproject.org/licenses/strict/1.0.0/">PolyForm Strict License 1.0.0</External>.
                    That license allows noncommercial use but not redistribution, modification or reuse in other
                    projects, so the code is there to inspect and test, not to copy. Read the{" "}
                    <External href={SOURCE_URL}>source</External> and the{" "}
                    <External href={TESTS_URL}>tests</External>, which check that every choice is equally likely, that
                    the entropy figures are exact and that the generator saves nothing: a test fails the build if any
                    storage, network or logging code is added. The EFF wordlist inside it is CC BY 4.0, not covered by
                    that license.
                </p>
                <p>
                    You can run the tests yourself, and you can open your browser&apos;s network tab while you
                    generate to confirm that nothing is sent.
                </p>
            </section>

            <section className={section}>
                <h2 className={h2}>Credits</h2>
                <p>
                    The passphrase wordlist is the EFF Large Wordlist by the Electronic Frontier Foundation, used
                    unmodified under the{" "}
                    <External href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0 license</External>{" "}
                    (see <External href="https://www.eff.org/copyright">EFF copyright</External>).
                    More at <External href="https://www.eff.org/dice">eff.org/dice</External>.
                </p>
                <p>
                    The options mirror those of Bitwarden&apos;s generator. This page has no affiliation with
                    Bitwarden.
                </p>
            </section>
        </main>
    );
}
