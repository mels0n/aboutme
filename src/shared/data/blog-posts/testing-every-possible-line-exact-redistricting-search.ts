import { BlogPost } from "../office_blog_posts";

export const testingEveryPossibleLineExactRedistrictingSearch: BlogPost = {
    id: "testing-every-possible-line-exact-redistricting-search",
    slug: "testing-every-possible-line-exact-redistricting-search",
    title: "Shortest Splitline Exact Search: POC to Full Scale",
    author: "Christopher Melson",
    role: "Builder, Fair Maps · Operational Architect",
    date: "2026-12-03",
    lastUpdated: "2026-12-03",
    ogImage: "/images/blog/testing-every-possible-line-exact-redistricting-search-og.jpg",
    summary: "How Fair Maps kept one splitline rule while its search grew from 1,800 sampled directions to every line, and how profiling cut California from 72 to 9 minutes.",
    polymorphicSummary: {
        executive: "Christopher Melson built Fair Maps, a redistricting tool, in stages, and the rule never changed: cut along the shortest line that splits the people evenly, keep blocks whole, balance. Stage one was a proof of concept that sampled 1,800 directions and proved the pipeline on all 50 states, California in about 2.6 minutes. Stage two changed only the search, from samples to every possible line, which measured what full fidelity buys: first cuts 0.65% shorter in Rhode Island and 0.35% in California, and about 11% of people in a different district at the sweep stage. The full search cost far more, 71.9 minutes for California, so it was scaled up by measuring first and holding every speed-up to one condition: switching it off leaves the map identical. Stage three, a separate later step, made exact ties neutral so no outside choice of direction or rounding can tip one. For a leader the lesson is sequencing. Prove cheaply, measure what fidelity buys, then pay for it deliberately. The same engine drew a 7,210-district legislative release.",
        strategist: "Christopher Melson separates two kinds of change in Fair Maps, and the staging is the lesson. The rule stayed fixed from proof of concept to version 1.0. Stage one sampled 1,800 directions to validate the pipeline cheaply. Stage two changed only the search, to every possible line, and was built in a fixed order: establish correctness against a brute-force reference (about 525 times the grid's CPU on Rhode Island), profile and attack only the largest slice, and gate every change on identical output so speed never becomes a rule. Stage three, later, replaced direction preferences and centimeter rounding with exact comparison, then people, then GEOID, so nothing outside the data can tip a tie. The trade-offs were explicit. Exact search is slower than sampling, and parallel gains stop where single-threaded loading and writing begin. A tempting bounding idea was rejected because nothing could certify it. Total border length even rose in four states, because the method cuts one at a time. The pattern is to measure what an approximation costs, then replace it with arithmetic that cannot disagree with itself.",
        engineer: "Christopher Melson's exact shortest-splitline search replaced a 1,800-direction proof of concept without changing the rule. A line's two sides change only when it becomes parallel to the segment between two blocks' internal points, so the half turn splits into ranges, roughly one per block, each evaluated once. Sign decisions use a float filter with a BigInt fallback, and lengths are sums of whole-micrometer edges so addition order is irrelevant. Profiling drove the speed work: re-settling strays took 80% of CPU, which incremental trackers removed because 94% of neighboring ranges keep the same strays. Building each pass from scratch then took 83%, so passes derive from the previous one. Larger chunks removed quadratic start-up cost, and a worker pool claims directions from an atomic counter into per-direction slots, so scheduling cannot change output. A separate later stage made exact ties neutral: people then GEOID, never direction, with both ends of each line checked. Whole-state fingerprints and from-scratch self-checks verify every speed-up."
    },
    geoHighlights: [
        { label: "Core Argument", value: "The rule never changed between the 1,800-direction proof of concept and version 1.0. Stage two changed only the search, to every straight line, and first cuts came out 0.65% shorter in Rhode Island and 0.35% in California. Stage three, a later and separate step, made exact ties neutral." },
        { label: "Target Audience", value: "Engineers, technical leaders and civic-tech builders deciding when a sampled proof of concept should become an exact search, how to make it affordable, and how to keep tie-breaking free of outside bias." },
        { label: "Key Insight", value: "Stage two's profiling-driven changes cut California's exact run from 71.9 to 8.8 minutes, and every speed-up had to leave the map bit-for-bit identical, verified by a fingerprint." }
    ],
    content: `[Fair Maps](https://fairmaps.melson.us) draws every district with one rule: cut along the shortest straight line that splits the people evenly, keep census blocks whole, and balance. That rule is the same in the proof of concept and in version 1.0. What changed happened in stages, and the stages are different kinds of change. In stage two the search went from 1,800 sampled directions to every possible line. In stage three, a separate and later step, the way exact ties are settled became neutral. This post follows the stages in order and says which stage each number belongs to.

The rule itself is in the first post, on [why a simple rule beats a commission](/guide/operational-architecture/blog/gerrymandering-simple-unbiased-fix-shortest-splitline). [The design rules and release gates behind the engine](/guide/operational-architecture/blog/redistricting-without-bias-operational-architect-ai-code-gates) are in the second. This post is the third story: how a proof of concept became an exact search of every possible line, and what that cost and bought.

> **Key Takeaways**
> - The rule never changed from the proof of concept to version 1.0: cut along the shortest line that splits the people evenly, keep blocks whole, balance.
> - Stage one, the proof of concept, sampled 1,800 directions and proved the pipeline on all 50 states quickly.
> - Stage two changed only the search, from samples to every possible line. First cuts came out 0.65% shorter in Rhode Island and 0.35% shorter in California, and every performance number in this post belongs to this stage.
> - The first exact California run took 71.9 minutes against 2.6 for the proof of concept. Profiling, one slice at a time, brought the prototype to 8.8 minutes.
> - Every speed-up had to pass one test: switch it off and the map is bit-for-bit identical.
> - Stage three, a later step before version 1.0, replaced direction preferences and centimeter rounding with exact comparison, then people, then GEOID, so no outside choice can tip an exact tie.
> - Prove the pipeline cheaply, measure what full fidelity buys, then pay for it deliberately. The same engine drew all 7,210 districts in the legislative release.

## The rule: what never changed

The rule is short. Cut along the shortest straight line that splits the people as evenly as the seats require. Keep census blocks whole. Balance the result so districts hold nearly equal numbers of people. That was the rule in the proof of concept, it was the rule during the exact sweep, and it is the rule in version 1.0.

What changed between the proof of concept and version 1.0 is how thoroughly the search finds the line the rule asks for, and how the remaining exact ties are settled. Those are two separate steps, and they happened one after the other.

| Stage | What changed | Rule |
|---|---|---|
| One: proof of concept | Pipeline proven on all 50 states with 1,800 sampled directions | Same |
| Two: exact sweep | Search went from sampled directions to every possible line, then was made fast | Same |
| Three: neutral tie rules | Exact ties settled by data only, never by direction or rounding | Same |

## Stage one: the proof of concept

The first cut step tried 1,800 directions, one every 0.1 degrees, and picked the shortest line among them. That was the right first stage: 0.1 degree is a fine step, 1,800 candidates is a cheap search, and it let me prove the pipeline end to end on all 50 states quickly, with California in about 2.6 minutes.

The proof of concept also kept the details of tie handling simple, so the pipeline could be proven before any of them was made exact. Border lengths were rounded to the centimeter. Ties that remained went to direction: the line nearer north-south first, then the smaller direction index, then fewer seats on the low side. Each line was read from one end. These were settled in stage three, covered below. In stage two they stayed as they were, because stage two was only about the search.

The public history on GitHub shows the handover to stage two: a change that [compared lengths exactly instead of rounding them](https://github.com/mels0n/str-redistricting), and the one that followed, which states the cut search no longer samples 1,800 directions.

## Stage two: from sampled directions to the exact sweep

Stage two was always the target: a shortest splitline exact search that tests every possible straight line. Every search and performance number in this post belongs to this stage, and each one measures only the change in the search. The rule and the tie handling were the same as in the proof of concept. The question was how much the 0.1 degree step mattered, and the way to answer it was to stop sampling.

### How shortest splitline exact search works

As a cutting line turns, the two sides it creates only change at particular angles: the ones where the line runs parallel to the segment between two blocks' center points. Between two such angles, every direction gives the same split, the same strays and the same border. So the half turn falls into ranges, and checking each range once covers every straight line.

The project's own method notes put it plainly: [the generator does not sample directions, and a state's first cut has roughly one range per block](https://github.com/mels0n/str-redistricting/blob/main/docs/explanation/how-districts-are-drawn.md). "Every line" feels infinite, yet it is about as many candidates as there are blocks.

A finer grid does not reach the same answer. A 0.01 degree step is about 18,000 lines, set against roughly half a million ranges: [California's first cut has 527,534 candidate ranges](https://github.com/mels0n/str-redistricting) in the published engine, and Rhode Island's has 26,908. Even that finer grid touches a few percent of them at best. A rule that asks for the shortest line is a claim about every line, and only checking every line fulfills it.

### What the exact sweep bought: first cuts

A measurable gain, with the rule untouched. In my own prototype measurements, the exact winner for Rhode Island's first cut was 405 meters (0.65%) shorter than the best sampled line, and California's was 1,872 meters (0.35%) shorter. In both states the true winner sat in a range of directions that the proof of concept's samples did not touch.

- **Rhode Island:** the grid's winner was at 69.4 degrees with a 61,953 m border. The exact winner was at 88.472 to 88.488 degrees with a 61,548 m border. That is 405 m, or 0.65%, shorter. The winning range is only 0.016 degrees wide, sitting between grid lines that measured 62,122 m and 63,749 m, so a sample easily steps over it.
- **California:** the grid's winner was at 44.3 degrees with a 537,096 m border. The exact winner was at 15.9193 to 15.9202 degrees with a 535,224 m border. That is 1,872 m, or 0.35%, shorter. This is a lower bound on the gain, because in the prototype I only evaluated windows around the best grid directions.

For reference, the published engine today records [California's first cut at 15.9197 degrees and 535,224 m](https://github.com/mels0n/str-redistricting) and Rhode Island's at 88.48 degrees and 61,544 m. Rhode Island is 4 meters off its prototype figure, probably because the stage-three rules touched how strays settle.

### What the exact sweep did to whole-country maps

I then compared the proof of concept's grid maps against the first exact-sweep maps for the whole country. This comparison sits entirely inside stage two. It was made before the stage-three tie rules existed, so it measures the search change alone, not the final published maps.

- About 36,316,290 of 330,759,736 people, roughly 11%, sat in a different district.
- Total cut length across all states fell about 0.57%, from roughly 81,800 to 81,340 km.
- Seven states were identical: the six one-district states plus Maine.
- Four states got longer in total (Virginia, Texas, Tennessee and Maryland). The method takes the shortest cut one at a time. It does not minimize the sum, so a different first cut can leave pieces whose best cuts add up longer.

### What checking every line costs

Far more than the proof of concept. In Rhode Island, brute force over every range took 840 CPU-seconds against 1.6 for the grid, about 525 times the CPU. California was never run in full; my estimate was 8 to 14 hours, not a measurement. Correct, and not yet affordable, which set the performance work ahead.

Measuring first paid off, because brute force became the reference answer. Every faster version had to agree with it, and without that reference I would have had nothing to hold the optimizations against.

### California from 71.9 minutes to 8.8

By profiling, then removing the largest slice each time, three times. The first exact version took 71.9 minutes on 15 threads. Reusing each range's work cut that to 14.0, building each pass from the previous one to 10.4, and fewer, larger chunks to 8.8. The proof of concept had taken about 2.6 minutes.

#### Stop recounting

Neighboring ranges differ by one block crossing the line. When one more ballot arrives, you add it to the running tally instead of recounting the box. My first exact version recounted. The profile of that version was blunt: re-settling stray pieces took 80% of CPU. And 94% of neighboring ranges keep exactly the same strays, so almost all of that work reproduced answers I already had.

The first attempt stopped at about 45 minutes with the first cut only 70% done, and the completed run of that first exact version took 71.9. In that first exact version, full redos, where the quick local check could not prove nothing had changed, were needed for 16.4% of 8.1 million changes, against an early estimate of 6%. Measuring beat estimating. Reusing each range's work then brought the run to 14.0 minutes, and re-settling fell to 1.4% of CPU.

#### Build each pass from the last one

With re-settling fixed, the profile moved. Now 83% of CPU went on building each pass from scratch, 269,518 times. The analogy is a warehouse stocktake: photocopy yesterday's count sheet and adjust the few lines today's delivery changed, instead of recounting every shelf. Deriving each pass from the previous one brought the run to 10.4 minutes.

#### Fewer, larger chunks

The next step gave less than I had estimated, and profiling again explained why: start-up cost per chunk grew with the square of the piece size. One chunk per 400 blocks became one per 2,500, with at least four per thread. That took the run from 10.4 minutes to 8.8. The final profile showed about 69% of time in tracker events and loop overhead, which is what a search does when it is finally mostly searching.

<figure role="img" aria-label="Bar chart of California full-state runtime in minutes by version: proof of concept (1,800 directions) 2.6, first exact version 71.9, reuse each range's work 14.0, build passes from the last one 10.4, fewer larger chunks 8.8. The first exact version took about 28 times the grid's runtime; profiling cut it to about 3.4 times. This chart measures the search change only: same rule, from sampled directions to every line. Source: author's measured runs of the exact-sweep prototype, California, October 2026." style="margin:1.5rem 0;padding:0;">
<div style="font-weight:600;margin-bottom:0.75rem;">California full-state runtime by version, minutes (lower is better)</div>
<div style="display:grid;grid-template-columns:minmax(120px,32%) 1fr 56px;gap:0.5rem 0.75rem;align-items:center;font-size:0.9rem;">
<div>Proof of concept (1,800 directions)</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:18px;"><div style="width:3.6%;height:100%;background:rgba(128,128,128,0.6);border-radius:4px;"></div></div>
<div style="text-align:right;">2.6</div>
<div>First exact version</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:18px;"><div style="width:100%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">71.9</div>
<div>Reuse each range's work</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:18px;"><div style="width:19.5%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">14.0</div>
<div>Build passes from the last one</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:18px;"><div style="width:14.5%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">10.4</div>
<div>Fewer, larger chunks</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:18px;"><div style="width:12.2%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">8.8</div>
</div>
<figcaption style="font-size:0.8rem;opacity:0.75;margin-top:0.75rem;">Stage two only: this measures the search change, from sampled directions to every line, with the rule unchanged. Source: author's measured runs of the exact-sweep prototype, California, 51 cuts, 15 threads, October 2026.</figcaption>
</figure>

The first exact version took about 28 times the proof of concept's runtime, and profiling-driven changes brought it to about 3.4 times, with the map unchanged at every step.

### What else profiling found

Three smaller wins, each found the same way: measure, find the dominant cost, fix only that. Each is a performance change. None alters what the search decides.

**Parallel cut search.** Running the cut search on a worker pool, each state alone on 14 threads against the old single-thread baseline, gave these timings (my own measurements): Colorado 35.1 to 11.2 seconds, California 357.1 to 67.9 seconds, Texas 475.1 to 87.5 seconds. Loading, topology, balancing and writing stay single-threaded, which caps the gain. [Workers claim directions from an atomic counter and write each candidate into its own slot of a shared result buffer](https://github.com/mels0n/str-redistricting/blob/main/src/server/features/splitline/scan-worker.ts), so results never depend on scheduling. Thread count can change how long a run takes. It cannot change a map.

**Speeding up how ties are swept (Nevada).** This is a performance change to how tie stretches are swept, not a change to any tie rule. A profile showed about 70% of Nevada's runtime at 8 threads was serial work: re-sweeping tie stretches on the main thread. [Making each stretch one pool task](https://github.com/mels0n/str-redistricting/blob/main/src/server/features/splitline/tasks.ts) took Nevada at 8 threads from 53.3 to 23.7 seconds, and the output was byte-identical for Connecticut, Nevada, Rhode Island and Vermont at 1 and 4 threads. What counts as a tie, and how ties are settled, is stage three.

**Balancer connectivity.** The balancer checked that a district stayed connected by searching the whole district. Removing a block can only cut paths through that block, so the check now searches only around it. Balancing California takes 1.1 seconds instead of 1.9, with the same moves and maps ([the connectivity check](https://github.com/mels0n/str-redistricting/blob/main/src/server/entities/census-block/topology.ts)).

### Ideas I rejected, and why

I rejected anything that would trade the exactness of the search for speed: skipping stretches of directions, rounding coordinates, a finer grid, a coarse-then-fine search and a search cap. Each looked reasonable, and each would have left the search checking less than every line. The reasons are the useful part.

**Skipping stretches that cannot win.** The tempting idea: if a range's first-pass border is longer than the best line so far, skip it. It does not hold, because strays change everything. Settling strays can remove up to 64 km of border in one Rhode Island range, about half its first-pass border, and 92 km in California. The final border is below the first-split border in 89% of Rhode Island sub-ranges and 99.3% of California ones. "Longer than the guide line, so skip it" is true before strays and false after. A fixed fraction fails too. Picture a dumbbell: the guide line runs the long way, one half-blob becomes a stray, and the final border crosses the neck. What was missing was a valid certificate, a proof that a stretch cannot win. Building one is the incremental evaluation itself.

**Rounding coordinates.** Exact arithmetic is awkward, and rounding coordinates to whole numbers (about 6 millimeters) would simplify it. But it moves every point, so a map could change for reasons unrelated to the sweep. I chose exact sign tests on the coordinates as stored instead. The need is easy to see on a four-digit calculator. 1.234 times 5.678 is 7.006652, and 2.345 times 2.988 is 7.006860. Both round to 7.007, so the difference reads as zero, a false tie. Keep each product's leftover and the exact difference is minus 0.000208. [The engine computes the quick answer first and falls back to exact integers only at real near-ties](https://github.com/mels0n/str-redistricting/blob/main/src/server/shared/exact/exact.ts), with no tolerance.

Comparing directions works the same way, without angles. Which ramp is steeper, 3 over 10 or 2 over 7? Compare 3 times 7 with 2 times 10: 21 beats 20, so 3 over 10. Every "which comes first" question in the sweep is a multiply-and-subtract like that.

**A finer grid, coarse-then-fine, and a cap.** A finer grid is still sampling. Coarse-then-fine fails because the best line can be far from the coarse winner. And an early local connectivity search had a 4,000-block cap with a full redo past it. Both paths gave the same answer, but a cap looks like a decision, so I replaced it with a search that needs none.

### How to speed something up without changing the answer

Give every speed-up one test: switch it off and the map must be bit-for-bit identical, verified by a fingerprint of the whole assignment. If it passes, it is just faster math, and it does not touch the rule. Every change to the search in this stage passed or was reverted.

The evidence was layered. California's fingerprint, 1208afea3c4f in my prototype runs, was unchanged through the first exact version, the reuse step and both later speed-ups, with all 39,538,223 people in the same district. Rhode Island's, 55301f72dccf, held through every phase. These are sweep-stage hashes. The published ones differ because the 1.0 release applied the stage-three tie rules and district numbering, which change some labels and moves, so the claim holds for the speed-up stage only.

Fingerprints are the coarse net. The fine net was self-checks that rebuilt every pass from scratch and compared every block (8,204 of 8,204 in the first phase, 13,674 of 13,674 in the second), plus brute force over every Rhode Island range (41,443 of 41,443).

They caught a swap-order bug, and once the checker itself was wrong rather than the engine. A reused tracker could also be handed more free blocks than its arrays were sized for, and in Hawaii that hung a run. [The fix sizes a tracker's heaps for every block](https://github.com/mels0n/str-redistricting/blob/main/src/server/features/splitline/tracker.ts), with a timeout test so a corrupt tracker fails fast instead of looping.

## Stage three: neutral tie rules, the step before version 1.0

Stage three came later, as a separate step in the move from the proof of concept to version 1.0. Its purpose was to remove any outside bias from tie-breaking. It is not a correction to the rule, which had not changed. It only decides what happens when two candidate lines have exactly the same border.

- **Exact border comparison.** The proof of concept's centimeter rounding and direction preferences (nearer north-south, earlier direction, fewer low-side seats) were replaced. Border lengths are compared exactly, in whole micrometers, so only borders that are exactly equal reach the tie rules.
- **People, then GEOID.** An exact tie goes to the sides nearer their fair shares of people, then to the lowest GEOID. Direction never decides.
- **Both ends of every line.** An exact tie can be reached from either end of a line, so both versions are candidates. Only the stretches that contain a tie are swept again, on the piece turned half way round, so the cost is nowhere near double.

The purpose is simple: no orientation or rounding choice that comes from outside the data can tip an exact tie. These rules affect only exact ties, never which line is shortest, which is why they are a separate concern from the search and could be settled after it.

A later release, engine 2.0.0, fixed two bugs in how the rules were applied: island links now count toward a cut's border, and balancing now also makes a move that keeps two districts exactly as close while shortening the border. The rule itself did not change.

The full tie rules, with the reasoning behind each, are in [the post on design rules and release gates](/guide/operational-architecture/blog/redistricting-without-bias-operational-architect-ai-code-gates).

## What this teaches an operational architect

Prove the pipeline cheaply, measure what full fidelity buys, then pay for it deliberately. Correctness first, then speed, and never let speed redefine correctness. The proof of concept earned its place by validating every state quickly. The exact sweep then put a number on what completing the search was worth, and stage three removed the last places where something outside the data could decide an exact tie.

The order mattered. Brute force gave me a reference, profiling told me where the time went, and the identical-output test meant each gain was real. It is the same discipline as [measuring before you scale](/guide/operational-architecture/blog/scalability-is-an-engineering-problem): find the actual bottleneck, not the one you assume.

One note on cost. The shipped engine, with the stage-three rules and everything added since the sweep stage, takes longer per state than the proof of concept's roughly 157 seconds for California. Exactness made the maps slower, and I would make the trade again. Later releases kept speeding up drawing, and every speed-up by itself leaves the map bit-for-bit identical.

The payoff of building in stages is that the stage-two search has not needed rewriting. The state legislative release, [7,210 districts across three chambers](https://fairmaps.melson.us), ran on the same exact engine with the drawing code unchanged. If you want to check my work, rerun a state from the [public repository](https://github.com/mels0n/str-redistricting) and compare fingerprints, or explore the maps at [Fair Maps](https://fairmaps.melson.us). It is the same habit I describe in [what an operational architect actually does](/guide/operational-architecture/blog/operational-architect-definitive-guide), applied to my own code first.

## Frequently Asked Questions

### What is a shortest splitline exact search?

It is a search that evaluates every possible straight cutting line, not a sample of them, and picks the one with the shortest real border. It is possible because a line's two sides only change at certain angles, so the half turn falls into ranges and each range needs checking once. Fair Maps documents this in its public method notes.

### Did the splitline rule change between the proof of concept and version 1.0?

No. The rule is the same throughout: cut along the shortest line that splits the people evenly, keep blocks whole, balance. What changed was the search, which went from 1,800 sampled directions to every possible line in stage two, and, as a separate later step in stage three, how exact ties are settled.

### Why move from 1,800 sampled directions to an exact search?

A rule that asks for the shortest border is a claim about every line, and a sample only checks the sampled lines. The 1,800-direction proof of concept was the right way to prove the pipeline quickly, and the exact search checks every line. In both states I compared, the true winner sat in a range no sampled line touched.

### How much shorter was the exact cut than the best sampled cut?

In Rhode Island the exact first cut was 405 meters, or 0.65%, shorter than the best sampled one. In California it was 1,872 meters, or 0.35%, shorter, and that figure is a lower bound because only windows near the best sampled directions were checked. Those are my own stage-two prototype measurements, and they measure the search change alone.

### How do you make an exact redistricting search fast enough to use?

Profile first, then remove the largest cost one change at a time. Here that meant reusing each range's work instead of recounting, building each pass from the previous one, using fewer and larger chunks, and running the search on a worker pool. That took California's first exact version from 71.9 minutes to 8.8 minutes in the prototype.

### How do you know a speed-up did not change the map?

Every speed-up had to pass one test: switch it off and the map is bit-for-bit identical. I verified that with a whole-state fingerprint, with self-checks that rebuild every pass from scratch and compare every block, and with brute force over every Rhode Island range.

### What are the stage-three tie rules, and why are they separate?

They settle exact ties only: borders compared exactly, then the sides nearer their fair shares of people, then GEOID, with both ends of every line checked, and direction never deciding. Their purpose is to remove any outside bias from tie-breaking. They came after the exact sweep because they affect only exact ties, not which line is shortest.

### Why is the shipped engine slower than the proof of concept?

The shipped engine takes longer per state than the proof of concept's roughly 157 seconds for California, because it checks every line and settles every tie. Exactness costs run time, a trade I chose deliberately. The prototype's 8.8 minutes was an earlier version of the engine, and later releases made drawing faster, and the speed-ups alone change no map.

### What did the exact search change in the maps?

It moved district lines for real people. In my stage-two comparison of the proof of concept's grid maps against the first exact-sweep maps, about 36.3 million of 330.8 million people, roughly 11%, ended up in a different district. That comparison predates the stage-three tie rules. The 1.0 release then applied those rules and district numbering, so published fingerprints differ from the sweep-stage ones.

---

### Works Cited

- [1] Melson, Christopher. "Fair Maps." 2026. [fairmaps.melson.us](https://fairmaps.melson.us)
- [2] Melson, Christopher. "str-redistricting (Fair Maps source code)." GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting)
`
};
