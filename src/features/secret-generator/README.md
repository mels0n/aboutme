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

## Privacy: it saves nothing

- No browser storage, cookies, service workers or caches. Settings are not remembered and nothing is kept between visits.
- Apart from loading its own word list from this site, the generator makes no network requests. It does no logging and keeps no state in the URL.
- Values are generated only after the page mounts, so they are never in the server-rendered HTML.
- The output field has spellcheck turned off.
- Closing or refreshing the page erases the value.

`model/no-persistence.test.ts` reads every non-test TypeScript file in this folder and in the tool's page and fails if any of a listed set of storage, network, logging, web-address and non-cryptographic-random APIs appear. The list is a blocklist, not proof that no other route exists. A GitHub Actions workflow runs the tests and the type check on every pull request and every push to main. You can also watch the browser's network tab while generating to confirm the generator sends nothing.

The site this lives in loads Google Analytics globally, which records page views and basic usage and sets its own cookies. Generated values are never part of it, but the generator does not control it.

## Layout

- `model/` is pure TypeScript with no React and no DOM: `random.ts` (unbiased draws and shuffle), `password.ts`, `passphrase.ts`, `username.ts`, `entropy.ts`, `strength.ts`, `faq.ts` and the wordlist. The generation modules (random, password, passphrase, username, entropy, strength) have tests next to them (distribution chi-square tests, scripted-source tests, constraint tests, entropy tests).
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
