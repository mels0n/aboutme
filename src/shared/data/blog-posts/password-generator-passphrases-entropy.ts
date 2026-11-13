import { BlogPost } from "../office_blog_posts";

export const passwordGeneratorPassphrasesEntropy: BlogPost = {
    id: "password-generator-passphrases-entropy",
    slug: "password-generator-passphrases-entropy",
    title: "How a Password Generator Works: Passphrases and Entropy",
    author: "Christopher Melson",
    role: "Homelab Architect",
    date: "2026-12-17",
    lastUpdated: "2026-12-17",
    ogImage: "/images/blog/password-generator-passphrases-entropy-og.jpg",
    summary: "How a trustworthy password generator works: CSPRNG, rejection sampling, counted entropy, and how its defaults compare with Bitwarden's apps.",
    polymorphicSummary: {
        executive: "Christopher Melson, a Homelab Architect who self-hosts Vaultwarden, explains why password generator choices are a cheap, high-leverage risk decision. In his view, weak or reused credentials are a basic exposure that costs very little to close: require long, unique, manager-generated secrets and add multi-factor authentication. A vendor's generator defaults belong in that evaluation too. The article gives leaders three questions to ask of any vendor's generator: does it run in the browser, does it use a cryptographic random source, and does it transmit anything. It also grounds policy in NIST SP 800-63B Revision 4, published July 2025, which drops composition rules and forced rotation in favor of length, blocklists and manager support. The practical result, in his judgment, is a defensible standard that favors real strength over ritual. Melson shows that a six-word passphrase carries about 77.5 bits of entropy against 38.8 for the three-word minimum Bitwarden allows, so a single setting, not a new product, is the decision to make.",
        strategist: "Christopher Melson lays out an operating model for credential hygiene built around password generator defaults rather than user training. The sequence he recommends is to put unique, manager-generated passwords on every account first, reserve a memorable passphrase for the few secrets a person must type, such as a vault master password, and add a second factor third. The trade-off is memorability against bits: each extra word from a 7,776-word list adds about 12.9 bits but costs a little typing. He argues defaults matter more than documentation, because in his view defaults decide what most accounts end up with, which is why his own tool starts at six words, matching Bitwarden's apps, and twenty characters with special characters on. The article also weighs a self-hosted vault such as Vaultwarden against a hosted one, noting that self-hosting moves uptime and backup duty onto you. Strength labels in his tool are a rule of thumb for this site, not a standard, so teams should set thresholds deliberately and revisit them as attacker hardware and hashing choices change.",
        engineer: "Christopher Melson documents the mechanism behind a client-side password generator he built. Randomness comes from crypto.getRandomValues in the Web Crypto API. Index selection uses rejection sampling, discarding draws above the largest multiple of the set size, so no symbol is favored by modulo bias. Characters required by minimum-number and minimum-special rules are placed first and the result is then Fisher-Yates shuffled, matching the reserve-then-shuffle approach in Bitwarden's open-source generator crate. Passwords range from 5 to 128 characters over A-Z, a-z, 0-9 and !@#$%^&*, with an option to drop I, O, l, 0 and 1. Passphrases draw from the EFF large list of 7,776 words, 3 to 20 words, defaulting to six. Displayed entropy is log2 of the count of valid outputs via inclusion-exclusion, about 122.4 bits for the default 20-character password against a naive 122.6. Reserve-then-shuffle weights that space very slightly unevenly, so the figure is a tight upper bound. The output field disables spellcheck, the generated value is never stored or sent, and no value appears in URL parameters or server HTML. The source and tests are published on GitHub for audit."
    },
    geoHighlights: [
        { label: "Core Argument", value: "A generator is trustworthy when it draws uniformly from a known set with a browser cryptographic random source, and its strength is the size of the space of possible outputs. Six EFF words give 77.5 bits, matching Bitwarden's app default, against 38.8 bits for the three-word minimum Bitwarden allows." },
        { label: "Target Audience", value: "Self-hosters and Bitwarden or Vaultwarden users, sysadmins, and technical leads who set password policy and want real numbers instead of strength-meter colors." },
        { label: "Key Insight", value: "Strength meters and the length times log2(symbols) shortcut hide the real figure once minimum-character rules apply. Counted entropy and unbiased selection are the properties you can verify." }
    ],
    content: `A trustworthy password generator draws from a browser cryptographic random source, picks symbols without bias, and reports strength as the size of the space of possible outputs. I self-host Vaultwarden and built [my free password generator](/tools/password-generator) to match Bitwarden's options while showing counted bits. Here is how it works and how its defaults compare with Bitwarden's apps.

> **Key Takeaways**
> - Strength is the size of the space of possible outputs, measured in bits. It is not how random the string looks.
> - A trustworthy generator runs in your browser, uses \`crypto.getRandomValues\`, and picks without modulo bias.
> - Six EFF words give 77.5 bits, which is the Bitwarden app default. Three words, the minimum, gives only 38.8.
> - How long a password survives depends on how the site stored it. Five EFF words last about 1.5 million years against PBKDF2 at 600,000 iterations on a 16-GPU rig, but only about 2 months against MD5.
> - NIST SP 800-63B Revision 4 drops composition rules and forced rotation in favor of length and uniqueness.
> - The generator's source is published on GitHub and it saves nothing, so its claims can be checked.

## What does a password generator actually do?

A password generator picks symbols or words uniformly at random from a defined set and joins them. Its strength comes from how many possible outputs exist, not from how chaotic the result looks. A short string that looks like noise can be weaker than a long phrase of ordinary words.

### Entropy as a count of outputs

When every output is equally likely, entropy in bits is log2 of the number of possible outputs. For an unconstrained password of length L drawn from N symbols, that is L times log2(N). A passphrase works the same way, with words as the symbols. The [EFF large list has 7,776 words](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases), so each word contributes about 12.9 bits.

This is why a three-word passphrase (38.8 bits) is far weaker than it feels. Each extra bit doubles the work for an attacker, and each extra word multiplies the number of outputs by 7,776. Going from three words to six is 7,776 cubed, roughly 4.7 × 10^11 times more outputs, or 38.8 extra bits. One caveat: [Bitwarden's generator filters hyphenated entries out of the EFF list](https://github.com/bitwarden/sdk-internal/blob/main/crates/bitwarden-generators/src/passphrase.rs), so its effective list is slightly smaller than 7,776 and the per-word figure is "about" 12.9 bits.

## What makes a generator safe to use

A random password generator is safe to use if it runs entirely in your browser, takes its randomness from \`crypto.getRandomValues\`, and sends, stores and logs nothing. Those three properties are checkable. A generator that builds the password on a server, or uses \`Math.random\`, should not be trusted with a real secret.

The Web Crypto call is the right source. [MDN describes \`crypto.getRandomValues\`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) as filling an array with cryptographically strong random values, and lists \`Math.random\` as non-cryptographic. My generator uses the former only. The generated value is never transmitted or stored, and no option appears in the URL. It also generates only after the page loads, so no secret exists in the server-rendered HTML. That is the same design instinct as the [no-login scheduler I built](/guide/operational-architecture/blog/tabletop-time-no-login-scheduler-open-api): the less the server knows, the less it can leak.

### Where the output can still leak

Randomness is only half the problem. As summarized in [Passbolt's incident record](https://www.passbolt.com/incidents/spell-jacking-chrome-edge), security firm otto-js reported spell-jacking in 2022: Chrome with enhanced spellcheck and Edge with its editor feature sent the contents of form fields, including secrets shown in non-password inputs, to Google and Microsoft. Per that summary, the mitigation is setting \`spellcheck="false"\`. My output field has spellcheck off for that reason. Also remember that the clipboard is a leak path: per [Microsoft's documentation](https://support.microsoft.com/en-us/windows/clipboard-in-windows-c436501e-985d-1c8d-97ea-fe46ddf338c6), Windows clipboard history (Win+V) keeps multiple copied items and can sync them across devices if you enable that.

## Modulo bias and rejection sampling

Modulo bias happens when a generator maps a random number onto a smaller range with the remainder operator, which makes some outcomes slightly more likely than others. The fix is rejection sampling: throw away draws that fall in the uneven tail and draw again. The cost is a retry that happens rarely.

### Rejection sampling in plain terms

Suppose a source gives numbers from 0 to 32,767 and you want a value from 0 to 2. Since 32,768 is not divisible by 3, [Eric Lippert's analysis](https://ericlippert.com/2013/12/16/how-much-bias-is-introduced-by-the-remainder-technique/) shows residues 0 and 1 occur 10,923 times each while residue 2 occurs 10,922 times. The skew is tiny there, but in his 20,000-value example, low values come up twice as often. His remedy is to discard values above the largest multiple of the range and retry.

I do the same with 32-bit draws from \`getRandomValues\`. Compute the largest multiple of the set size that fits, reject anything above it, and take the remainder of what is left. Every symbol then has exactly the same chance. For a 70-symbol set the rejection rate is negligible, so the loop almost never runs twice.

### Minimum-character rules and the shuffle

Rules like "at least one number and one special character" create a second bias trap. If you simply append the required characters at the start, their position is predictable. The correct pattern, which [Bitwarden's open-source generator crate](https://github.com/bitwarden/sdk-internal/blob/main/crates/bitwarden-generators/src/password.rs) also follows, is to reserve the required characters, fill the remaining slots from the full pool, and then shuffle the whole result.

My tool does this with a Fisher-Yates shuffle that uses the same unbiased index draw. A plain \`sort\` with a random comparator is not a substitute: [Wikipedia's Fisher-Yates article](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) notes that sorting with a comparison function that returns random values is very likely to produce highly non-uniform distributions. [Bitwarden's help page](https://bitwarden.com/help/generator/) also advises keeping minimum numbers and minimum specials as low as possible, since every forced character slightly narrows the space.

## Passphrase length: six words, not three

With the EFF large list, count three words for 38.8 bits, five for 64.6 and six for 77.5. Each word adds about 12.9 bits. Use six words for anything that guards a vault, and treat three as a floor, never a target.

### Where Bitwarden's defaults differ

Bitwarden's own apps default to six words. In the \`bitwarden/clients\` repository, [the passphrase defaults](https://github.com/bitwarden/clients/blob/main/libs/tools/generator/core/src/data/default-passphrase-generation-options.ts) are 6 words, a hyphen separator, capitalization off and include-number off. The Bitwarden SDK is different: [its passphrase generator defaults to three words](https://github.com/bitwarden/sdk-internal/blob/main/crates/bitwarden-generators/src/passphrase.rs) and allows 3 to 20. That three-word figure (38.8 bits) is the minimum the SDK accepts, not what app users see by default. My tool uses 6 words with a hyphen, about 77.5 bits, which matches the apps.

Passphrase options are Bitwarden-compatible: 3 to 20 words, a separator you choose, optional capitalization, and an optional number. Those last two are cosmetic. They help sites that demand them, but they add little entropy, which is exactly why the tool shows the number rather than a color.

### Diceware and why the list size is the number that matters

Diceware means rolling dice to pick words from a numbered list. The EFF large list uses five dice per word for [7,776 entries](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases), while its short lists use four dice and 1,296 words, about 10.3 bits each. [The EFF dice page](https://www.eff.org/dice) notes a six-word passphrase is one of roughly 2^77 alternatives. A generator that draws uniformly from the same list matches dice, without the rolling.

## How strong is a 14 or 20 character password?

A 14-character password over 62 symbols, Bitwarden's app default, carries at most about 83.4 bits, and my default of 20 characters over 70 symbols carries about 122.4 bits once its minimum rules are counted. Both are large spaces, and the minimum rules take little away from them.

The two defaults differ on purpose. Per [the Bitwarden clients source](https://github.com/bitwarden/clients/blob/main/libs/tools/generator/core/src/data/default-password-generation-options.ts), the apps ship a length of 14 with uppercase, lowercase and numbers on (minimum one each) and special characters off, so the pool is 62 symbols. My tool is longer and includes specials: 26 lowercase, 26 uppercase, 10 digits and the 8 specials \`!@#$%^&*\` make 70 symbols over 20 characters. The 83.4 figure is an upper bound, since one-of-each minimums trim it to about 83.2.

The defaults side by side, per the [passphrase](https://github.com/bitwarden/clients/blob/main/libs/tools/generator/core/src/data/default-passphrase-generation-options.ts) and [password](https://github.com/bitwarden/clients/blob/main/libs/tools/generator/core/src/data/default-password-generation-options.ts) defaults files in \`bitwarden/clients\`:

| Default | Bitwarden apps | This tool |
| --- | --- | --- |
| Passphrase words | 6 | 6 |
| Separator | \`-\` | \`-\` |
| Password length | 14 | 20 |
| Special characters | Off | On (\`!@#$%^&*\`) |
| Minimums | 1 upper, 1 lower, 1 number | 1 number, 1 special (plus at least one of every enabled set) |

### Counted entropy when minimums apply

The L times log2(N) shortcut assumes every string is allowed. Once you require at least one number and one special character, some strings become invalid, so the honest count subtracts them. By inclusion-exclusion, the valid count is 70^20 minus 60^20 (no digit) minus 62^20 (no special) plus 52^20 (neither). Its log2 is 122.38 bits against 122.59 naive. The code's count also includes the uppercase and lowercase terms, which change the result only in the fourth decimal (122.3820 against 122.3823 for these four terms alone). The UI states this as "Counts every password your settings allow."

One caveat: the figure is log2 of the exact count of valid outputs, the size of the space. Reserve-then-shuffle weights that space very slightly unevenly, so it is a tight upper bound on true entropy rather than a measurement of a perfectly uniform distribution.

The minimum rules cost only a fraction of a bit at 20 characters: 0.20 bits, from 122.59 down to 122.38. On a short password they cost more. At 8 characters with the same two minimums the count falls from 49.03 to 47.79 bits, a loss of about 1.2 bits, because a forced digit and special take a bigger bite out of a small space. Turning on "avoid ambiguous" removes I, O, l, 0 and 1 from the pool and shrinks N, which the tool recomputes.

### Entropy compared: passphrases vs passwords

<figure role="img" aria-label="Entropy in bits: a three-word passphrase, the minimum both Bitwarden's SDK and this tool allow, is 38.8; five words 64.6; six words, the Bitwarden apps and this tool default, 77.5; the Bitwarden apps password default of 14 characters without specials 83.4; and this tool's 20-character default with specials 122.4." style="margin:1.5rem 0;padding:0;">
<div style="display:grid;grid-template-columns:11rem 1fr 3.5rem;gap:0.5rem 0.75rem;align-items:center;">
<div>3 words (minimum both allow)</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:30.3%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">38.8</div>
<div>5 words</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:50.5%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">64.6</div>
<div>6 words (Bitwarden apps and this tool default)</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:60.6%;height:100%;background:rgba(245,158,11,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">77.5</div>
<div>Bitwarden apps password, 14 chars, no specials</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:65.2%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">83.4</div>
<div>This tool password, 20 chars with specials, min 1 number and 1 special</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:95.6%;height:100%;background:rgba(245,158,11,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">122.4</div>
</div>
<figcaption style="margin-top:0.75rem;font-size:0.875rem;opacity:0.8;">Entropy in bits, computed as log2 of the size of the space of possible outputs. Word lists: EFF large list of 7,776 words (EFF, 2016). Defaults per the Bitwarden clients and SDK source and this tool, 2026. The 14-character row is an upper bound (62 symbols, no minimum rules); Bitwarden's one-of-each minimums lower it to about 83.2.</figcaption>
</figure>

Six words sit about 38.8 bits above the three-word minimum, and each extra word adds 12.9 bits.

## How long would it take to crack?

It depends on how the site stored your password, and on whether the attacker is guessing at a login page or has already stolen the database. The two are very different problems.

An online attack means guessing at a live login form. Sites slow that down with lockouts, rate limits and two-factor codes, so an attacker gets a handful of guesses, not billions. An offline attack starts after a breach. The attacker has the stored password data and tests guesses on their own hardware, with no lockouts and no one watching. Only the offline case is a matter of raw speed, and it is the one the table below covers.

I borrow the rig size from [Hive Systems' 2026 table](https://www.hivesystems.com/blog/are-your-passwords-in-the-green): 16 RTX 5090 graphics cards. Hive's per-hash figures are theirs; the rates below are not. Per-card speeds come from the [hashcat v6.2.6 benchmark for the RTX 5090](https://gist.github.com/Chick3nman/09bac0775e6393468c2925c1e1363d5c): 220.6 billion guesses per second for MD5 and 70.2 billion for SHA-1. That benchmark measures bcrypt at cost 5 and PBKDF2 at 999 iterations, so I scale both to the settings sites actually use. Each bcrypt cost step doubles the work, so cost 10 is 32 times slower than the benchmarked cost 5 (about 9,525 guesses per second per card). PBKDF2 work grows with the iteration count, so 600,000 iterations is about 600 times slower than the benchmarked 999 (about 18,577 per card). The average attacker finds a value after trying half of the possible outputs, so each figure below is half the output count divided by the rig's speed.

| Secret | MD5 | SHA-1 | bcrypt (cost 10) | PBKDF2-SHA256 (600,000) |
| --- | --- | --- | --- | --- |
| 4 EFF words | about 9 minutes | about 27 minutes | about 380 years | about 190 years |
| 5 EFF words | about 2 months | about 5 months | about 3 million years | about 1.5 million years |
| 6 EFF words | about 990 years | about 3,100 years | about 23 billion years | about 12 billion years |
| 7 EFF words | about 7.7 million years | about 24 million years | more than a trillion years | more than a trillion years |
| 14-character password | about 220,000 years | about 680,000 years | more than a trillion years | more than a trillion years |
| 20-character password | more than a trillion years | more than a trillion years | more than a trillion years | more than a trillion years |

Average time to crack with 16 RTX 5090 GPUs, offline, after a database theft. The passwords use all four character sets (70 symbols, with at least one number and one special character), as in my tool's defaults. The tool computes these figures live with the same code, and a test checks that this table matches it.

Read the table by column, not by row. A five-word passphrase falls in about 2 months if the site used MD5, and lasts about 1.5 million years if it used PBKDF2 at 600,000 iterations. Six words, my default, still takes about 990 years against MD5, the weakest hash in the table. Four words is not enough for anything you care about.

Argon2id, the newest of the common choices, has no column because I could not find a verified GPU benchmark for it, and I would rather give no number than a made-up one. It is designed to need a lot of memory for every guess, which limits what a graphics card's thousands of small cores can do. How well it protects depends on its memory and iteration settings: Bitwarden's defaults are 32 MiB, 6 iterations and 4 threads, and OWASP's minimum is 19 MiB, 2 iterations and 1 thread.

### Bitwarden's key derivation setting

Your password manager does the same job for your master password. Bitwarden stretches it with a key derivation function (KDF) before using it. [Bitwarden's default is PBKDF2-SHA256 with 600,000 iterations](https://bitwarden.com/help/kdf-algorithms/), which is the PBKDF2 column above. It also offers Argon2id, with defaults of 32 MiB of memory, 6 iterations and 4 parallel threads. [OWASP's password storage cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) lists Argon2id first, with a minimum of 19 MiB of memory, 2 iterations and 1 degree of parallelism, and recommends PBKDF2-HMAC-SHA256 at 600,000 iterations where FIPS-140 compliance is required.

That is why a six-word master password is comfortable behind a slow KDF: the attacker pays the full 600,000-iteration cost for every guess. The same words stored by a site with MD5 would be a much weaker position.

## What do banks and big sites actually use?

Banks do not publish how they store passwords, so I cannot tell you what yours uses. The [PCI Security Standards Council](https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/does-hashing-of-passwords-meet-the-intent-of-pci-dss-requirement-8-3-2) says that PCI DSS requirement 8.3.2 requires authentication factors to be unreadable in storage and in transit, and that hashing a password with strong cryptography meets that intent. It does not name an algorithm, so the requirement tells you passwords must not be readable, not how slow the hash has to be.

Lockouts and two-factor codes are what stop online guessing. Hashing only matters after a breach, and the record of real breaches shows how much the storage method matters:

- **RockYou, 2009.** [The Register reported](https://www.theregister.com/2009/12/17/rockyou_security_snafu/) that 32 million user login credentials were exposed, stored in plain text. Nothing needed cracking.
- **LinkedIn, 2012.** [TechCrunch reported](https://techcrunch.com/2016/05/18/117-million-linkedin-emails-and-passwords-from-a-2012-hack-just-got-posted-online/) that hackers stole about 6.5 million passwords stored as unsalted SHA-1 hashes. In 2016, about 117 million emails and passwords from that breach were posted online. SHA-1 is the column in the table above where a four-word passphrase falls in under an hour.
- **Adobe, 2013.** [Krebs on Security](https://krebsonsecurity.com/2013/10/adobe-breach-impacted-at-least-38-million-users/) reported that Adobe confirmed access to encrypted passwords for approximately 38 million active users, and that a file posted online appeared to hold more than 150 million records. [Bit-tech reported](https://www.bit-tech.net/news/tech/software/adobe-breach-2/1) that Adobe encrypted the passwords with Triple-DES in ECB mode. That is reversible encryption, not a hash.
- **LastPass, 2022.** [Wladimir Palant's analysis](https://palant.info/2022/12/23/lastpass-has-been-breached-what-now/) quotes LastPass saying the attacker copied a backup of customer vault data. LastPass used PBKDF2-SHA256, with a default of 100,100 iterations, about a sixth of Bitwarden's 600,000. Palant notes that some accounts were never upgraded from 5,000 iterations. A stolen vault backup lets an attacker guess master passwords offline, which is why the iteration count matters.

The pattern is the same each time. Plain text gives the attacker everything; reversible encryption does too once the key is taken. Fast hashes such as SHA-1 fall to a short passphrase quickly. A slow, salted hash plus a long random secret is the combination that holds.

## What NIST SP 800-63B Rev 4 requires

NIST SP 800-63B Revision 4 tells services to require at least 15 characters for single-factor passwords and 8 when a password is only part of multi-factor login. It forbids composition rules and periodic rotation, requires a blocklist, and says services must allow password managers.

[NIST published the final document in July 2025](https://csrc.nist.gov/pubs/sp/800/63/b/4/final), superseding the 2020 version. In [section 3.1.1.2](https://pages.nist.gov/800-63-4/sp800-63b.html), verifiers should accept passwords of at least 64 characters and must not require changes without evidence of compromise. These are rules for the service, not advice to users. They still tell you what to demand: length, uniqueness and a manager. I covered the surrounding perimeter in my [UniFi homelab security write-up](/guide/operational-architecture/blog/unifi-firewall-enough-homelab-security), and the lesson holds here too: a firewall cannot protect a guessable credential.

## Why not trust a strength meter?

Most strength meters estimate how a human might have chosen a string, so they misjudge generated output. Random output should be scored by counting possibilities instead. A meter may call a truly random 40-bit string excellent or a long phrase poor, because it was not built to measure either.

[zxcvbn, presented at USENIX Security 2016](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler), was tested on leaked real-world passwords and argues that simple character-class counting is ineffective. That is a tool for judging what people typed. For a generated secret, the size of the space is known, so I show it directly.

My labels are Weak under 40 bits, Fair from 40 to 59, Strong from 60 to 79 and Very strong at 80 or more. Those bands are this site's rule of thumb, not a standard. Crack-time charts have the same caveat. Hive Systems, a security vendor, publishes a [2026 crack-time table](https://www.hivesystems.com/blog/are-your-passwords-in-the-green) that assumes bcrypt at work factor 10 on 16 RTX 5090 GPUs. Its figures depend on that hardware and hash, not on passwords in general, so the crack-time section above uses the same 16-GPU rig size but shows several storage methods side by side.

## How does this tool compare with Bitwarden's generator?

I self-host Vaultwarden, a Bitwarden-compatible server, and use the Bitwarden clients with it. The [generator I built](/tools/password-generator) mirrors Bitwarden's options, so anything you know from the Bitwarden client behaves the same here. It differs in three ways.

- **Defaults:** the passphrase default matches the Bitwarden apps (6 words). The password default is longer and includes specials (20 characters against 14).
- **Displayed entropy:** the tool shows bits with minimum rules counted in the valid-output total, rather than a color.
- **Usernames:** a random word with an optional four-digit number, plus-addressed email, or catch-all email. Forwarding-alias services are left out because they need API keys, and a free tool should not ask for one.

It is a generator, not a vault. A manager still has to store the result.

If you self-host the vault, as I do with Vaultwarden, uptime and backups become your job as well.

For practical settings, let the manager generate a unique 20-character password for every account, use six words for a vault master password, never go as low as three, and turn on multi-factor authentication. Use [the generator](/tools/password-generator) when you want to see the counted bits before you commit.

## Published source, so you can check every claim

You should not have to trust a generator you cannot read, so its code is public. [The generator's source is on GitHub](https://github.com/mels0n/aboutme/tree/main/src/features/secret-generator) for anyone to read and audit, under the [PolyForm Strict License 1.0.0](https://polyformproject.org/licenses/strict/1.0.0/). That license allows noncommercial use but not redistribution, modification or reuse in other projects, so the code is there to read and test, not to copy. The EFF wordlist inside it is CC BY 4.0, with credit to the EFF.

The tests check the claims in this article. The [distribution tests](https://github.com/mels0n/aboutme/blob/main/src/features/secret-generator/model/distribution.test.ts) run a chi-square check that every character and word is equally likely. The [password tests](https://github.com/mels0n/aboutme/blob/main/src/features/secret-generator/model/password.test.ts) cover the minimum-character rules, and the [entropy tests](https://github.com/mels0n/aboutme/blob/main/src/features/secret-generator/model/entropy.test.ts) check the counts above. The [no-persistence test](https://github.com/mels0n/aboutme/blob/main/src/features/secret-generator/model/no-persistence.test.ts) fails if any of the listed storage, cookie, network, logging or web-address APIs appear in the generator's source, and it runs on every pull request and every push to main. The generator saves nothing: closing or refreshing the page erases the value. You can also watch your browser's network tab and see that the generator sends nothing; you will see only the site's own files and Google Analytics. For comparison, Bitwarden's [clients](https://github.com/bitwarden/clients) and [SDK](https://github.com/bitwarden/sdk-internal) are themselves open source.

## Frequently Asked Questions

### How does a password generator work?

A good generator asks the operating system's cryptographic random source for random numbers, then uses them to pick symbols or words uniformly from a fixed set. It uses rejection sampling to avoid modulo bias and a Fisher-Yates shuffle to place required characters unpredictably. The strength is the size of the space of possible outputs, not how random the result looks.

### Is a random password generator safe to use?

It can be, if it runs in your browser, uses crypto.getRandomValues instead of Math.random, and transmits and stores nothing. Check that the page works offline once loaded and that the output field does not leak to spellcheck services. A generator that sends your password to a server to create it is not one to trust.

### How many words should a passphrase have?

With the EFF large list of 7,776 words, each word adds about 12.9 bits. Three words give 38.8 bits, five give 64.6, and six give 77.5. Six is the default in Bitwarden's apps and in this tool. Three is the minimum both allow and is weak, so use six for a vault master password and no fewer than five for anything typed by hand.

### What is a good password entropy?

There is no universal standard number. My tool labels results under 40 bits Weak, 40 to 59 Fair, 60 to 79 Strong and 80 or more Very strong, but those bands are this site's rule of thumb, not a standard. What matters more is that every password is unique and generated, because reuse defeats any amount of entropy.

### What is diceware?

Diceware picks words by rolling dice against a numbered list, so each roll is genuinely random and no software is trusted. The EFF large list uses five dice per word for 7,776 entries, about 12.9 bits per word. A generator that draws uniformly from the same list gives the same strength as physical dice.

### Is a 5-word passphrase enough?

It depends on how the secret is stored. Against a slow key derivation function such as Bitwarden's default of PBKDF2 at 600,000 iterations, five words (64.6 bits) would take a 16-GPU rig about 1.5 million years on average, which is fine for a password manager master password. Against a fast hash such as MD5, which a careless site might use, the same five words fall in about 2 months. Six words is a safer default because you do not control how other sites store things.

### Should I worry about someone guessing my password online?

Less than you should worry about a breach. Sites block online guessing with lockouts, rate limits and two-factor codes, so an attacker gets only a few tries. The risk that makes length matter is an offline attack after a site's database is stolen, where nothing limits the guess rate except how slowly the site's hash runs.

### Does NIST require special characters and password rotation?

No. NIST SP 800-63B Revision 4, published July 2025, says verifiers must not impose composition rules and must not require periodic changes unless there is evidence of compromise. It requires at least 15 characters for single-factor passwords and 8 when the password is used only with multi-factor authentication.

### Can I read the generator's code?

Yes. The source is published on GitHub for anyone to read and audit, under the PolyForm Strict License 1.0.0. It allows noncommercial use but not redistribution, modification or reuse in other projects. The generator saves nothing, and a test fails if any of the listed storage, network, logging or web-address APIs appear in its source, and it runs on every pull request and every push to main.

---

### Works Cited

- [1] Bonneau, Joseph. "EFF's New Wordlists for Random Passphrases." Electronic Frontier Foundation, 2016. [eff.org](https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases)
- [2] Electronic Frontier Foundation. "Dice-Generated Passphrases." EFF, 2026. [eff.org](https://www.eff.org/dice)
- [3] National Institute of Standards and Technology. "SP 800-63B-4, Digital Identity Guidelines: Authentication and Authenticator Management (Final)." NIST CSRC, 2025. [csrc.nist.gov](https://csrc.nist.gov/pubs/sp/800/63/b/4/final)
- [4] National Institute of Standards and Technology. "SP 800-63B-4, Section 3.1.1.2 Passwords." NIST, 2025. [pages.nist.gov](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [5] Bitwarden. "bitwarden-generators: password.rs." sdk-internal repository, 2026. [github.com](https://github.com/bitwarden/sdk-internal/blob/main/crates/bitwarden-generators/src/password.rs)
- [6] Bitwarden. "bitwarden-generators: passphrase.rs." sdk-internal repository, 2026. [github.com](https://github.com/bitwarden/sdk-internal/blob/main/crates/bitwarden-generators/src/passphrase.rs)
- [7] Bitwarden. "Password Generator." Bitwarden Help Center, 2026. [bitwarden.com](https://bitwarden.com/help/generator/)
- [8] MDN Web Docs. "Crypto: getRandomValues() method." Mozilla, 2026. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
- [9] Lippert, Eric. "How much bias is introduced by the remainder technique?" Fabulous Adventures in Coding, 2013. [ericlippert.com](https://ericlippert.com/2013/12/16/how-much-bias-is-introduced-by-the-remainder-technique/)
- [10] Wheeler, Daniel Lowe. "zxcvbn: Low-Budget Password Strength Estimation." USENIX Security Symposium, 2016. [usenix.org](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler)
- [11] Passbolt. "Spell-jacking on Google Chrome and Microsoft Edge" (incident record summarizing an otto-js report). Passbolt, 2022. [passbolt.com](https://www.passbolt.com/incidents/spell-jacking-chrome-edge)
- [12] Hive Systems. "Are Your Passwords in the Green?" (2026 table). Hive Systems, 2026. [hivesystems.com](https://www.hivesystems.com/blog/are-your-passwords-in-the-green)
- [13] Bitwarden. "default-passphrase-generation-options.ts." bitwarden/clients repository, 2026. [github.com](https://github.com/bitwarden/clients/blob/main/libs/tools/generator/core/src/data/default-passphrase-generation-options.ts)
- [14] Bitwarden. "default-password-generation-options.ts." bitwarden/clients repository, 2026. [github.com](https://github.com/bitwarden/clients/blob/main/libs/tools/generator/core/src/data/default-password-generation-options.ts)
- [15] Microsoft. "Clipboard in Windows." Microsoft Support, 2026. [support.microsoft.com](https://support.microsoft.com/en-us/windows/clipboard-in-windows-c436501e-985d-1c8d-97ea-fe46ddf338c6)
- [16] Wikipedia. "Fisher–Yates shuffle." Wikipedia, 2026. [wikipedia.org](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- [17] Melson, Christopher. "secret-generator: source and tests (PolyForm Strict License 1.0.0)." aboutme repository, 2026. [github.com](https://github.com/mels0n/aboutme/tree/main/src/features/secret-generator)
- [18] Chick3nman. "RTX 5090 hashcat v6.2.6 benchmark." GitHub Gist, 2025. [gist.github.com](https://gist.github.com/Chick3nman/09bac0775e6393468c2925c1e1363d5c)
- [19] Bitwarden. "KDF algorithms." Bitwarden Help Center, 2026. [bitwarden.com](https://bitwarden.com/help/kdf-algorithms/)
- [20] OWASP. "Password Storage Cheat Sheet." OWASP Cheat Sheet Series, 2026. [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [21] PCI Security Standards Council. "Does hashing of passwords meet the intent of PCI DSS Requirement 8.3.2?" PCI SSC FAQ, 2026. [pcisecuritystandards.org](https://www.pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/does-hashing-of-passwords-meet-the-intent-of-pci-dss-requirement-8-3-2)
- [22] The Register. "RockYou security snafu exposes 32 million passwords." The Register, 17 December 2009. [theregister.com](https://www.theregister.com/2009/12/17/rockyou_security_snafu/)
- [23] TechCrunch. "117 million LinkedIn emails and passwords from a 2012 hack just got posted online." TechCrunch, 18 May 2016. [techcrunch.com](https://techcrunch.com/2016/05/18/117-million-linkedin-emails-and-passwords-from-a-2012-hack-just-got-posted-online/)
- [24] Krebs, Brian. "Adobe Breach Impacted At Least 38 Million Users." Krebs on Security, 29 October 2013. [krebsonsecurity.com](https://krebsonsecurity.com/2013/10/adobe-breach-impacted-at-least-38-million-users/)
- [25] Bit-tech. "Adobe data breach far worse than first claimed." Bit-tech, 2013. [bit-tech.net](https://www.bit-tech.net/news/tech/software/adobe-breach-2/1)
- [26] Palant, Wladimir. "LastPass has been breached - what now?" palant.info, 23 December 2022. [palant.info](https://palant.info/2022/12/23/lastpass-has-been-breached-what-now/)
`
};
