import { BlogPost } from "../office_blog_posts";

export const redistrictingWithoutBiasOperationalArchitectAiCodeGates: BlogPost = {
    id: "redistricting-without-bias-operational-architect-ai-code-gates",
    slug: "redistricting-without-bias-operational-architect-ai-code-gates",
    title: "Unbiased Redistricting Algorithm, Built With AI on a Leash",
    author: "Christopher Melson",
    role: "Builder, Fair Maps · Operational Architect",
    date: "2026-11-19",
    lastUpdated: "2026-11-19",
    ogImage: "/images/blog/redistricting-without-bias-operational-architect-ai-code-gates-og.jpg",
    summary: "How I designed an unbiased redistricting algorithm with no discretion in it, then governed an AI coding assistant with specs, review and CI gates.",
    polymorphicSummary: {
        executive: "Christopher Melson built Fair Maps, an unbiased redistricting algorithm, and governed the AI coding assistant that helped write it. The business risk is specific. When public trust is the product, one unrecorded tie-break, one untested change or one unreviewed AI edit can quietly tilt a map and end the credibility of the whole project. His decision was to pay for mechanical enforcement instead of relying on reviewer vigilance. Every change starts as a written spec and a plan, gets an independent review, and then faces continuous integration checks that fail the build instead of warning. A publish step refuses to replace any map that changed without a version bump. The costs are real: setup time, long runs, and no freedom to tune results. The evidence is concrete. Version 1.0.0 was cut on 2026-10-11, and the legislative release then added State House and State Senate maps, 7,210 districts in all, on a drawing engine whose code did not change. Leaders weighing AI-written code where neutrality matters can copy the pattern: make the rules checkable by anyone, then make the checks impossible to skip.",
        strategist: "Christopher Melson's Fair Maps build is an operating-model case with a clear sequence. First, fix the rules before any map exists, so that every place a person or machine could choose something becomes a written rule or is deleted. Second, put the AI assistant inside a delivery path with a spec, a plan and independent review before anything merges. Third, put versions and a publish gate in place before the first release, so an unversioned change cannot ship. Fourth, let new capability arrive only through new gates. The state legislative release followed that order, adding a fixture, a district-count rule and a parity test around an engine that stayed untouched. The trade-offs are honest. The exact method is slow, ties are settled by the data and never by preference, and the team gives up every tuning knob a client or a politician might ask for. What it buys is a claim that survives challenge. The same logic applies to governing AI agents in finance: bound the discretion, record every decision, and make the control structural rather than cultural.",
        engineer: "Christopher Melson's unbiased redistricting algorithm is deterministic by construction, and the mechanisms are checkable. Exact border ties are settled by shorter border, then the sides nearer their fair shares of people, then GEOID, and direction never breaks a tie. Border lengths are whole micrometres, so sums do not depend on addition order. A test scans every server file and fails on any Math member outside a list of 13, and on the exponent operator. Trigonometry is an fdlibm port checked against 64 golden bit patterns across sin, cos, atan, asin and atan2. Sweep decisions use a float filter first, then exact BigInt integers when the float result is not safely above its error bound. Each state records a SHA-256 of its assignment file, and 154 Census input files are pinned by hash. CI redraws five fixtures and compares fingerprints with the base branch, never the pull request's own copy. The publish step refuses a changed map under an unchanged engine major and Census input. The 1.1.0 diff against engine-v1.0.0 over the drawing directories is empty.",
    },
    geoHighlights: [
        { label: "Core Argument", value: "An output nobody can steer comes from deleting choices (ties, caps, rounding, seeds, engine math), not from supervising them. The same logic governs an AI coding assistant: nothing merges without gates a human designed." },
        { label: "Target Audience", value: "Operators, engineering leaders and civic-tech builders deciding how to govern AI-written code where public trust is the product." },
        { label: "Key Insight", value: "After the legislative release the unchanged 1.0 engine drew 7,210 districts, and fixtures, a publish gate and SHA-256 fingerprints made that claim checkable by anyone." },
    ],
    content: `I am Christopher Melson, and on Fair Maps I built an unbiased redistricting algorithm, then stopped an AI coding assistant, and myself, from steering it. Design removes every choice a person or machine could make. Governance means nothing merges without gates I designed. The [civic argument for a rule nobody can tune](/guide/operational-architecture/blog/gerrymandering-simple-unbiased-fix-shortest-splitline) is a separate post. This one is the build, live at [fairmaps.melson.us](https://fairmaps.melson.us).

> **Key Takeaways**
> - An output nobody can steer comes from deleting choices (ties, caps, rounding, seeds, engine math), not from supervising them.
> - Reproducibility is the trust mechanism: the same inputs give the same map, bit for bit, on any computer.
> - AI-written code is governed by gates a human designed: spec, plan, independent review, failing CI checks and a publish gate.
> - The legislative release drew [7,210 districts](https://github.com/mels0n/str-redistricting) on an engine whose drawing code did not change, and fingerprints made that checkable.

## What does it take to build an unbiased redistricting algorithm?

**It takes removing every choice, not policing the people who make them.** The algorithm may read only population and geography, and every remaining decision point (ties, limits, rounding, random numbers, arithmetic, speed-ups) must be fixed by a written rule or deleted. Then the output must be reproducible so that anyone can check the claim.

That is operational architecture applied to a map. What an [operational architect does](/guide/operational-architecture/blog/operational-architect-definitive-guide) is design the system so that the right outcome is the only outcome the system can produce, instead of hiring more reviewers to catch the wrong one. The method itself is short: cut a state with the shortest straight line that splits its people evenly, keep census blocks whole, then balance by moving single border blocks. It is all in the [plain-language explanation](https://github.com/mels0n/str-redistricting) in the public repository.

## Where do the hidden choices live?

Discretion hides in places that do not look like decisions. A map drawer can hide seven: the inputs, the tie-breaks, the caps, the rounding, the seeds, the arithmetic and the speed-ups. Each one can tilt a map without anyone ever choosing a district line.

Inputs are the obvious one, and the rule is simple: no party data, election results, incumbent addresses or race data, ever. The other six are quieter. A tie-break that prefers one direction is a choice. So is a cap that says a stray piece may hold at most some share of people. Rounding coordinates is a choice, a random seed is a choice, and floating-point math that differs by engine is a choice nobody made on purpose. A faster search that changes the answer is a choice too. The next three sections take them in turn.

## How do you settle ties without picking a side?

In this system a tie means two different cuts whose borders are exactly equal in length. Settling one by a written order, with no preference for any direction, removes the last place a tie could lean. The order is shorter border, then people nearer fair shares, then GEOID.

### The rule

The engine changelog states it in one sentence: ties go to the shorter border, then to the sides nearer their fair shares of people, then to the GEOID. Balancing has its own tie rules (shorter total border, then GEOID, never the district number), and districts are numbered from the side holding the lowest GEOID.

### Direction never breaks a tie

Borders are compared exactly, not rounded, so only borders that are exactly equal ever reach the tie rules. When they do, direction plays no part. A preference for the nearer north-south line, for an earlier direction, or for fewer seats on one side would be a rule about direction with no basis in the data. It would favor one orientation of the map over another for a reason no census block could explain. The method documentation says it in plain words: no direction is preferred over another.

### Every line is checked from both ends

A line read top-down and the same line read bottom-up are both candidates, so an exact tie is seen from either side. On an exact tie, the walk that fills the first side can stop in two places, and the version from the other end is checked too. Only the stretches that contain a tie are swept again, on the piece turned half way round, so the cost is nowhere near twice the work.

### The four-block strip

Why do people come before GEOID in the order? A four-block strip with populations 3, 1, 1, 1 shows it. A sliver of directions splits off two of the six people, with a border exactly as long as the three-and-three split. GEOID alone would take the two-and-four cut. The people rule takes three and three, which is what the method is trying to do anyway. The case is pinned in a public test, so the order cannot drift. A later post covers how the proof of concept grew into an exact search of every possible line.

## Why no caps, no rounding, no seeds?

Because each of them is a number or a coin flip somebody could later defend as reasonable and nobody could defend as neutral. A cap looks like a decision even when it is harmless. So the rule is no limit on strays, no rounding of coordinates, no random numbers, and no seed.

There is no limit on how many people a stray piece holds. A line that strands a large region still has to win on border length like every other line. Coordinates are never rounded to make the arithmetic easy: rounding to about six millimetres would move every point, and then maps could change for reasons that have nothing to do with the rule. Inside the search there is no internal cap either, only a search that needs none. A cap can give the same answer as no cap, but it looks like a chosen number, and the design allows no chosen number anywhere.

There are no random numbers and no seeds, because every map would depend on the seed and someone would ask why that one.

## How do you make the math identical on every computer?

You stop trusting the platform. The JavaScript language lets an engine approximate most Math functions, so Fair Maps ships its own trigonometry, forbids the engine's, does the sweep's sign decisions in exact integers when floats cannot be sure, and keeps lengths in whole numbers.

### Own trig and an allow-list test

A test scans every server file and fails the build on any Math member outside a list of 13 (floor, ceil, round, trunc, abs, min, max, sqrt, sign, imul, clz32, fround and PI) and on the exponent operator. The file's stated reason is that the generator must give the same map on any engine. It is an allow-list rather than a block-list of known offenders, so a function added to the language later is refused by default.

The trigonometry is a port of the fdlibm algorithms for sin, cos, atan, atan2 and asin. A second test holds 64 golden bit patterns across those five functions, so any engine running the suite checks that it reproduces the generator's arithmetic bit for bit. When I swapped the math in, twelve states were republished and every fingerprint came out identical, so replacing the math changed no map.

### Exact arithmetic with no tolerance

Every sweep decision is the sign of (a minus b)(c minus d) minus (e minus f)(g minus h), computed on the coordinates as stored. The code first computes it in ordinary floats and accepts the answer only when it is larger than the worst-case rounding error. Otherwise it recomputes in exact integers. On a four-digit calculator, 1.234 times 5.678 and 2.345 times 2.988 both round to 7.007, a false tie. Keep each product's leftover and the true difference is minus 0.000208. There is no tolerance, because a tolerance is a number someone picked. The exact module is 53 lines in the public repository.

### Whole micrometres

Border lengths are stored as whole micrometres, so a sum comes out the same in any order and two equal borders reached by different routes get exactly equal totals. This is bookkeeping, not a precision claim. Census outlines are given to about 11 centimetres, and the documentation says the unit exists only so that adding lengths always gives the same total.

### The speed-up rule

Exact search is expensive, so speed-ups are held to one rule: switch the speed-up off, and the map must be bit-for-bit identical. A speed-up that can change the answer is not allowed, so the search checks every possible straight line.

## How can anyone verify a map?

Each state publishes a SHA-256 fingerprint of its final assignment file, and every Census input is pinned by hash. Run the same code on the same inputs and the fingerprint matches on any computer and any thread count. A mismatch is evidence, not an opinion.

The public repository pins 154 Census input hashes: 50 state block files, 49 State House files, 50 State Senate files and 5 display files. They are checked on download and again on every cache reuse, and if a file is ever reissued the manifest changes only by a deliberate, visible edit. Each finished state also records a run stamp (the pinned input hash, the engine version, a fingerprint of the code that ran and the hash of every file written), and publishing refuses a state whose stamp does not match. On [fairmaps.melson.us](https://fairmaps.melson.us), each state page shows its fingerprint and a reproduce command that clones the tag that drew the map.

## How do you govern an AI coding assistant?

Treat the assistant like any fast contributor whose work cannot be trusted by inspection alone: nothing merges unless it passes gates a human designed. For this build that meant a written spec, a plan, an independent review, and CI checks that fail instead of warn.

### Spec, plan, independent review

Each change started as a written spec, became a plan of small tasks, was built, and then went to an independent review before it could merge. Review can raise questions an author missed, but it cannot prove anything.

### CI gates that fail

The Code Standards workflow runs layer-direction rules, typecheck, the test suite (over 1,400 passing tests in my last local run), the build and a version check. Its header says the point plainly: "a rule nobody has seen fail is a rule nobody knows is wired up." A second job redraws five fixture states (CT, NV, RI, VT and the Vermont State Senate) and compares their fingerprints with the base branch's file, never the pull request's own copy. A pull request cannot grade its own homework. There is also a guard that TypeScript is installed, because the dependency checker otherwise cruises zero modules and passes on a completely broken graph.

### Versions and the publish gate

Six components are versioned separately: engine, input, maps, schema, web and docs. With enforcement on, a change to a component without a version move fails the check. The publish step refuses to replace a published map that changed under the same engine major and the same Census input, and its error says to bump the engine major. A changed district count is the one allowed exception, because the old assignment cannot survive a different number of districts. Version 1.0.0 was cut on 2026-10-11.

<figure role="img" aria-label="Fair Maps uses seven layers of checks, from 13 allowed math functions to 154 pinned Census hashes, so no map change can ship unrecorded." style="margin:1.5rem 0;">
<div style="display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:stretch;font-size:0.9rem;line-height:1.35;">
<div style="background:rgba(128,128,128,0.15);padding:8px 12px;border-radius:6px;"><strong>1. Math allow-list</strong><br>Refuses any engine Math function outside the list, and the exponent operator</div>
<div style="background:rgba(59,130,246,0.75);padding:8px 12px;border-radius:6px;text-align:center;min-width:8.5rem;"><strong>13</strong> allowed members</div>
<div style="background:rgba(128,128,128,0.15);padding:8px 12px;border-radius:6px;"><strong>2. Golden bit patterns</strong><br>Refuses trig output that differs from the generator by one bit</div>
<div style="background:rgba(59,130,246,0.75);padding:8px 12px;border-radius:6px;text-align:center;min-width:8.5rem;"><strong>64</strong> patterns, 5 functions</div>
<div style="background:rgba(128,128,128,0.15);padding:8px 12px;border-radius:6px;"><strong>3. Test suite</strong><br>Refuses broken behavior</div>
<div style="background:rgba(59,130,246,0.75);padding:8px 12px;border-radius:6px;text-align:center;min-width:8.5rem;"><strong>1,400+</strong> passing tests</div>
<div style="background:rgba(128,128,128,0.15);padding:8px 12px;border-radius:6px;"><strong>4. Fixture fingerprints</strong><br>Refuses any fixture map change without a new engine major</div>
<div style="background:rgba(59,130,246,0.75);padding:8px 12px;border-radius:6px;text-align:center;min-width:8.5rem;"><strong>5</strong> fixtures</div>
<div style="background:rgba(128,128,128,0.15);padding:8px 12px;border-radius:6px;"><strong>5. Publish gate</strong><br>Refuses to replace a map that changed under the same engine major and Census input</div>
<div style="background:rgba(59,130,246,0.75);padding:8px 12px;border-radius:6px;text-align:center;min-width:8.5rem;"><strong>7,210</strong> districts guarded</div>
<div style="background:rgba(128,128,128,0.15);padding:8px 12px;border-radius:6px;"><strong>6. Pinned Census inputs</strong><br>Refuses a reissued or corrupted input file</div>
<div style="background:rgba(59,130,246,0.75);padding:8px 12px;border-radius:6px;text-align:center;min-width:8.5rem;"><strong>154</strong> SHA-256 hashes</div>
<div style="background:rgba(128,128,128,0.15);padding:8px 12px;border-radius:6px;"><strong>7. Versioned components</strong><br>Refuses an unversioned change to engine, input, maps, schema, web or docs</div>
<div style="background:rgba(59,130,246,0.75);padding:8px 12px;border-radius:6px;text-align:center;min-width:8.5rem;"><strong>6</strong> components</div>
</div>
<figcaption style="font-size:0.8rem;margin-top:8px;opacity:0.8;">Source: Fair Maps public repository (tests/, config/, .github/workflows/), as of 2026-10-12. Count badges are not bar lengths; the units differ.</figcaption>
</figure>

Each of the seven Fair Maps layers refuses something a person or a machine could otherwise change quietly.

### Same principle, other domain

I made the same argument for finance in the [approval-gate model for AI agents](/guide/operational-architecture/blog/governing-ai-agents-approval-gate-model): bound the discretion, record every decision, and make the control structural.

## What did the gates actually catch?

They caught mistakes in the code, whoever wrote it, and none was found by trust. Self-checks that rebuild every result from scratch and compare it, plus review and CI, found a swap-order bug, a tracker direction bug, a wrong checker, an infinite loop in Hawaii and problems in the release machinery.

- **Swap order.** The same pair of blocks can swap places in two passes at the same direction. A self-check failed, and every tracker with an event at that exact direction now moves before any re-settle.
- **Tracker direction.** A reused tracker must take the current direction before it is updated. On a Rhode Island sweep the range counts changed even though results matched, and setting the direction first brought the count back.
- **The checker was wrong.** The from-scratch reference used by the self-checks built too few passes at the start. Lengths and sides agreed but pass counts did not, and the reference was the thing at fault.
- **The Hawaii infinite loop.** A reused tracker could be handed more free blocks than its arrays held. JavaScript silently drops out-of-range typed-array writes, so the heaps held duplicates and the search could loop forever. The arrays are now sized for every block in the piece, and a public test runs the case with a 10-second timeout. All 50 states were then run again from scratch.
- **Release machinery.** Before 1.0.0, the publish gate would have refused the very regeneration the release needed, no 1.0 tags existed so every reproduce command pointed at nothing, and a state that failed mid-run could have its old plan republished under the new stamp. All were fixed before the cut.

## What happened when the legislative maps shipped on the same engine?

The Fair Maps gates held. Its legislative release added State House and State Senate maps, 435 plus 4,833 plus 1,942, or 7,210 districts, and a diff of the drawing code against the 1.0.0 tag is empty. California's published fingerprint is identical before and after.

The directories for cutting, balancing, the custom math, the exact arithmetic and the geometry did not change between \`engine-v1.0.0\` and the 1.1.0 release. The engine minor bump covers new capability around it: a chamber option, per-chamber seat counts, and pinning and counting of the Census legislative files. New gates came with it. A \`VT:state-senate\` fixture joined the other four, and the fixture and publish gates now treat a changed district count as an input change. A CI check keeps the district counts honest, and a parity test keeps chamber naming consistent across generator, viewer and share pages.

New capability on an engine that is provably the same engine is the cleanest evidence I have that the gates work. You can see it at [fairmaps.melson.us](https://fairmaps.melson.us), where the version footer names the engine, the Census revision and the maps release behind every page.

## What would I tell an operator building this?

Four rules transfer, and so do some honest limits. Delete choices instead of supervising them. Make every claim checkable by a stranger. Give the gate, not the author, the last word. Add new capability only through new gates, never around them.

1. **Delete before you govern.** Every rule you add is one more thing to defend. A tie rule you can remove is better than one you can justify.
2. **Publish the check, not just the claim.** A fingerprint and a reproduce command turn "trust us" into "run it."
3. **Compare against the base, never the branch itself.** A gate that reads the change's own copy of the answer is no gate.
4. **A failing gate beats an advisory one.** If nobody has watched a check fail, you do not know it is wired up.

The limits are stated in the documentation: border lengths are measured on a sphere rather than an ellipsoid, exactness is relative to the projected double-precision coordinates, and ranges joined across a chunk edge are identified by length plus a 64-bit fingerprint, not block by block. The maps are not the districts in use. Equality is as close as whole blocks allow.

The [code and tests](https://github.com/mels0n/str-redistricting) are public. A later post covers how the proof of concept grew into an exact search of every possible line.

## Frequently Asked Questions

### How do you build an unbiased redistricting algorithm?

You remove every choice a person or a machine could use to tilt a map. That means fixing the inputs (population and geography only), writing a rule for every tie, refusing caps, rounding and seeds, and making the arithmetic identical on every computer. Then you publish a fingerprint of each map so anyone can rerun it and compare.

### Is deterministic redistricting really reproducible across computers?

It can be, if the code never relies on anything an engine may compute differently. Fair Maps uses its own trigonometry, checked against 64 golden bit patterns, and a test fails the build if any engine math function outside a 13-member list appears. Border lengths are whole micrometres, so sums do not depend on addition order.

### How do you break ties in a redistricting algorithm without bias?

A tie here means two cuts with exactly equal border length. Fair Maps picks the cut whose sides are nearer their fair shares of people, then the lowest GEOID. Direction never breaks a tie, because preferring north-south over east-west favors one orientation of the map for no reason the data can explain.

### Can you trust AI-written code in a system that has to be neutral?

Not on trust. You trust the gates around it. Every change needs a written spec, a plan and an independent review, and then CI tests, fixture fingerprints and a publish gate fail on any map change that is not versioned. The gates work the same whether a person or an assistant wrote the code.

### What are code gates in AI-assisted software development?

A code gate is an automated check that fails the build or refuses a release when a rule is broken, instead of leaving it to a reviewer to notice. Examples here are layer-direction rules, typecheck, tests, a version check, fixture fingerprints compared with the base branch, and a publish step that refuses unversioned map changes.

### How can I verify a Fair Maps map myself?

Each state page shows the SHA-256 fingerprint of its assignment file and a reproduce command that clones the tagged release that drew it. Run it against the pinned Census inputs and your fingerprint should match exactly, on any computer and any thread count.

---

### Works Cited

- [1] Melson, Christopher. "Fair Maps." 2026. [fairmaps.melson.us](https://fairmaps.melson.us)
- [2] Melson, Christopher. "str-redistricting (Fair Maps source code)." GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting)
`,
};
