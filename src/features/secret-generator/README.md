# Secret generator

A password, passphrase and username generator that runs entirely in the browser. Its options mirror Bitwarden's generator (password length and character sets, passphrase word count and separator, random-word and plus-addressed or catch-all email usernames). It has no affiliation with Bitwarden.

Live tool: https://chris.melson.us/tools/password-generator

The source is published here so you can read it, audit it and run its tests. Reuse is not permitted: see [Licensing](#licensing).

## Security design

- **Randomness.** Every choice comes from `crypto.getRandomValues`. `Math.random` is never used, and a test fails if it appears in the generator's source.
- **No modulo bias.** Picking an index from a set of size `n` uses rejection sampling: random 32-bit words at or above the largest multiple of `n` are discarded and redrawn, so every item is equally likely.
- **Shuffle.** Required characters (minimum numbers and specials, at least one of each enabled set) are reserved first, the remaining slots are filled from the full pool, and the result is shuffled with Fisher-Yates using the same unbiased index draw.
- **Entropy is counted, not estimated.** The figure shown is log2 of the number of valid outputs for the current settings, found by inclusion-exclusion over the minimum rules. Reserve-then-shuffle weights that space very slightly unevenly, so the figure is a tight upper bound on true entropy rather than an exact measurement.
- **Passphrases** use the EFF Large Wordlist (7,776 words, about 12.9 bits per word).

## Crack-time estimates

For password and passphrase output the tool shows the average time to crack by storage method (`model/crack-time.ts`). It models an offline attack: a site's password database was stolen and the attacker tests guesses on their own hardware, with no lockouts or two-factor codes. Online guessing is not modeled.

- **Formula.** Average time = (possible outputs / 2) / (guesses per second x 16). The attacker is assumed to know how the value was generated, and on average finds it after trying half of the possible outputs. The output count is the exact count from `model/entropy.ts`.
- **Rig.** 16 x NVIDIA RTX 5090, the rig size used by the [Hive Systems 2026 password table](https://www.hivesystems.com/blog/are-your-passwords-in-the-green). Only the rig size is borrowed; the per-hash rates are not Hive's.
- **Rates.** Per-GPU figures from the [hashcat v6.2.6 RTX 5090 benchmark](https://gist.github.com/Chick3nman/09bac0775e6393468c2925c1e1363d5c): MD5 220.6 GH/s and SHA-1 70,245.1 MH/s, used as published.
- **bcrypt cost 10.** The benchmark runs bcrypt at cost 5 (32 iterations): 304.8 kH/s. Each cost step doubles the work, so cost 10 is 2^5 = 32 times slower: 304,800 / 32 = 9,525 H/s per GPU.
- **PBKDF2-HMAC-SHA256, 600,000 iterations.** The benchmark runs 999 iterations: 11,157.2 kH/s. Work scales with iterations, so the rate is 11,157,200 x 999 / 600,000, about 18,577 H/s per GPU.
- **Argon2id.** There is no verified GPU benchmark, so the tool gives no number. It is designed to resist GPUs (it needs a lot of memory per guess), but how well depends on its memory and iteration settings. Bitwarden's defaults are 32 MiB, 6 iterations and 4 threads; OWASP's minimum is 19 MiB, 2 iterations and 1 thread.
- **Plain text and reversible encryption.** Nothing to crack for plain text. Encrypted passwords can be read directly if the key is also taken.

These are estimates from published benchmarks, scaled as above, not measurements of any real site. Real sites differ in salting, settings and hardware.

## Privacy: it saves nothing

- No browser storage, cookies, service workers or caches. Settings are not remembered and nothing is kept between visits.
- Apart from loading its own word list from this site, the generator makes no network requests. It does no logging and keeps no state in the URL.
- Values are generated only after the page mounts, so they are never in the server-rendered HTML.
- The output field has spellcheck turned off.
- Closing or refreshing the page erases the value.

`model/no-persistence.test.ts` reads every non-test TypeScript file in this folder and in the tool's page and fails if any of a listed set of storage, network, logging, web-address and non-cryptographic-random APIs appear. The list is a blocklist, not proof that no other route exists. A GitHub Actions workflow runs the tests and the type check on every pull request and every push to main. You can also watch the browser's network tab while generating to confirm the generator sends nothing.

The site this lives in loads Google Analytics globally, which records page views and basic usage and sets its own cookies. Generated values are never part of it, but the generator does not control it.

## Layout

- `model/` is pure TypeScript with no React and no DOM: `random.ts` (unbiased draws and shuffle), `password.ts`, `passphrase.ts`, `username.ts`, `entropy.ts`, `strength.ts`, `crack-time.ts`, `faq.ts` and the wordlist. The generation modules (random, password, passphrase, username, entropy, strength, crack-time) have tests next to them (distribution chi-square tests, scripted-source tests, constraint tests, entropy tests).
- `ui/` holds the React client components.
- `index.ts` is the slice's public API.

## Running the tests

From the repository root:

```
npm test
```

or only this folder:

```
npx vitest run src/features/secret-generator
```

## Licensing

- The code in this folder is published under the [PolyForm Strict License 1.0.0](https://polyformproject.org/licenses/strict/1.0.0/) (see `LICENSE`). It allows noncommercial use but not redistribution, modification or reuse in other projects. Reading, auditing and running the tests are what it is published for.
- `model/eff-large-wordlist.ts` is not covered by that license. It is the EFF Large Wordlist by the Electronic Frontier Foundation, used unmodified under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See https://www.eff.org/copyright and https://www.eff.org/dice.
