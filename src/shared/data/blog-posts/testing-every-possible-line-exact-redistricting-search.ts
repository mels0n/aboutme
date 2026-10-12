import { BlogPost } from "../office_blog_posts";

export const testingEveryPossibleLineExactRedistrictingSearch: BlogPost = {
    id: "testing-every-possible-line-exact-redistricting-search",
    slug: "testing-every-possible-line-exact-redistricting-search",
    title: "Shortest Splitline Exact Search: POC to Full Scale",
    author: "Christopher Melson",
    role: "Builder, Fair Maps · Operational Architect",
    date: "2026-10-16",
    lastUpdated: "2026-10-16",
    ogImage: "/images/blog/testing-every-possible-line-exact-redistricting-search-og.jpg",
    summary: "How a 1,800-direction proof of concept became a full shortest splitline exact search, and how profiling cut California from 72 to 9 minutes.",
    polymorphicSummary: {
        executive: "Christopher Melson built Fair Maps, a redistricting tool whose headline method claims the shortest border, in two deliberate stages. Stage one was a proof of concept that sampled 1,800 directions, one every 0.1 degrees, and proved the whole pipeline on all 50 states quickly, California in about 2.6 minutes. Stage two was always the target: the exact search of every straight line that the rule calls for. Completing it measured what full fidelity buys. The exact first cut was 0.65% shorter in Rhode Island and 0.35% shorter in California, and at the sweep stage about 11% of Americans landed in a different district. The full search cost far more, 71.9 minutes for the first exact California run, so it was scaled up with performance in mind: measure first, profile, optimize in steps, and hold every speed-up to one condition, that switching it off leaves the map identical. For a leader the lesson is sequencing. Prove the pipeline cheaply, measure what full fidelity buys, then pay for it deliberately, correctness first and speed second. The same engine now runs a 7,210-district legislative release.",
        strategist: "Christopher Melson treats the move from proof of concept to exact search in Fair Maps as an operating model for performance work. The 1,800-direction proof of concept validated the pipeline end to end at low cost. The exact search then followed a fixed sequence. First establish correctness against a brute-force reference, even though it used about 525 times the grid's CPU on Rhode Island. Second, profile, and attack only the largest slice the profiler reports, one change per step. Third, gate every change on an identical-output test so speed can never quietly become a rule. The trade-offs were explicit. Exact search is slower than sampling, and the shipped engine with every tie rule still needs 15.3 minutes for California. Parallel gains stop where single-threaded loading and writing begin. A tempting bounding idea was rejected because nothing could certify it. Total border length even rose in four states, because the method takes the shortest cut one at a time rather than minimizing the sum. The generalizable pattern is to measure what an approximation costs in fidelity, then replace it with arithmetic that cannot disagree with itself.",
        engineer: "Christopher Melson's exact shortest-splitline search scales up a 1,800-direction proof of concept and relies on one structural fact. A line's two sides change only when it becomes parallel to the segment between two blocks' internal points, so the half turn splits into ranges, roughly one per block, and each range is evaluated once. Sign decisions use a float filter with a BigInt fallback, and lengths are sums of whole-micrometer edges so addition order is irrelevant. Profiling drove the speed work: re-settling strays took 80% of CPU, which incremental trackers removed because 94% of neighboring ranges keep the same strays. Building each pass from scratch then took 83%, so passes are derived from the previous one. Larger chunks removed quadratic start-up cost. A worker pool claims directions from an atomic counter and writes into per-direction slots, so scheduling cannot change output. Every step is verified by a whole-state fingerprint and from-scratch self-checks, and the final profile shows roughly 69% of time in tracker events, which is the search itself."
    },
    geoHighlights: [
        { label: "Core Argument", value: "A 1,800-direction proof of concept proved the pipeline, and the full exact search showed what fidelity buys: first cuts 0.65% shorter in Rhode Island and 0.35% in California, so a method counts as shortest when every straight line is checked." },
        { label: "Target Audience", value: "Engineers, technical leaders and civic-tech builders deciding when a sampled proof of concept should become an exact search, and how to make that exact search affordable." },
        { label: "Key Insight", value: "Profiling-driven changes cut California's exact run from 71.9 to 8.8 minutes, and every speed-up had to leave the map bit-for-bit identical, verified by a fingerprint." }
    ],
    content: `[Fair Maps](https://fairmaps.melson.us) was built in two stages. Stage one was a proof of concept: it looked for the shortest cutting line among 1,800 directions, one every 0.1 degrees, which proved the whole pipeline end to end on all 50 states quickly. Stage two was always the target, a shortest splitline exact search that tests every possible straight line, and I scaled it up deliberately with performance in mind. Completing it measured what the full search buys: in both states I compared, the exact first cut was shorter than the best sampled one.

The rule itself is in the first post, on [why a simple rule beats a commission](/guide/operational-architecture/blog/gerrymandering-simple-unbiased-fix-shortest-splitline). [The design rules and release gates behind the engine](/guide/operational-architecture/blog/redistricting-without-bias-operational-architect-ai-code-gates) are in the second. This post is the third story: how the proof of concept became an exact search of every possible line, what that full search bought, and the performance engineering that made it affordable.

> **Key Takeaways**
> - A 1,800-direction proof of concept proved the pipeline on all 50 states quickly. The exact search was always the next stage.
> - What the full search bought: first cuts 0.65% shorter in Rhode Island and 0.35% shorter in California than the best sampled line.
> - A sampled search has a step size, and if changing the step size can change the map, the step size is part of the method. The exact search removes it.
> - Checking every line first took California from 2.6 minutes to 71.9. Profiling, one slice at a time, brought the prototype to 8.8 minutes.
> - Every speed-up had to pass one test: switch it off and the map is bit-for-bit identical.
> - Prove the pipeline cheaply, measure what full fidelity buys, then pay for it deliberately: correctness first, then speed. The exact engine still draws all 7,210 districts in the legislative release.

## What did the shortest splitline exact search buy over the 1,800-direction proof of concept?

A measurable gain. In my own prototype measurements, the exact winner for Rhode Island's first cut was 405 meters (0.65%) shorter than the best sampled line, and California's was 1,872 meters (0.35%) shorter. In both states the true winner sat in a range of directions that the proof of concept's samples did not touch.

### Why start with a proof of concept

The first cut step tried 1,800 directions, one every 0.1 degrees, and ranked the candidate lines by border length rounded to the centimeter. That was the right first stage: 0.1 degree is a fine step, 1,800 candidates is a cheap search, and it let me prove the pipeline end to end on all 50 states quickly, with California in about 2.6 minutes. The public history shows the handover to stage two: a commit that [compared lengths exactly instead of rounding them](https://github.com/mels0n/str-redistricting/commit/61264a8), and the one that followed, which states [the cut search no longer samples 1,800 directions](https://github.com/mels0n/str-redistricting/commit/544a5b8).

The remaining question was how much the 0.1 degree step mattered. The way to measure it was to stop sampling.

### How shortest splitline exact search works

As a cutting line turns, the two sides it creates only change at particular angles: the ones where the line runs parallel to the segment between two blocks' center points. Between two such angles, every direction gives the same split, the same strays and the same border. So the half turn falls into ranges, and checking each range once covers every straight line.

The project's own method notes put it plainly: [the generator does not sample directions, and a state's first cut has roughly one range per block](https://github.com/mels0n/str-redistricting/blob/main/docs/explanation/how-districts-are-drawn.md). "Every line" feels infinite, yet it is about as many candidates as there are blocks.

### What the numbers said

Here are my prototype measurements of the first cut, grid against exact:

- **Rhode Island:** the grid's winner was at 69.4 degrees with a 61,953 m border. The exact winner was at 88.472 to 88.488 degrees with a 61,548 m border. That is 405 m, or 0.65%, shorter. The winning range is only 0.016 degrees wide, sitting between grid lines that measured 62,122 m and 63,749 m, so it is easy to pass over when sampling.
- **California:** the grid's winner was at 44.3 degrees with a 537,096 m border. The exact winner was at 15.9193 to 15.9202 degrees with a 535,224 m border. That is 1,872 m, or 0.35%, shorter. This is a lower bound, because in the prototype I only evaluated windows around the best grid directions.

For reference, the published engine today records [California's first cut at 15.9197 degrees and 535,224 m](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/CA/cuts.json) and [Rhode Island's at 88.48 degrees and 61,544 m](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/RI/cuts.json). Rhode Island is 4 meters off its prototype figure, probably because later rule changes touched how strays settle.

### What it did to real maps

I then compared the old grid maps against the first exact maps for the whole country. This is a sweep-stage comparison, before later tie-rule changes and the 1.0.0 redraw, so read it as a measure of what the full search bought, not of the final published maps.

- About 36,316,290 of 330,759,736 people, roughly 11%, sat in a different district.
- Total cut length across all states fell about 0.57%, from roughly 81,800 to 81,340 km.
- Seven states were identical: the six one-district states plus Maine.
- Four states got longer in total (Virginia, Texas, Tennessee and Maryland). The method takes the shortest cut one at a time. It does not minimize the sum, so a different first cut can leave pieces whose best cuts add up longer.

## Why does a rule that claims the shortest border call for an exact search?

Because a rule that claims the shortest border makes a claim about every line, and a sample only proves the best sampled line. Once the result depends on the step size, the step is an extra rule that nobody voted on and nobody documented. A proof of concept can carry it; the finished method should not.

A finer grid does not escape this. A 0.01 degree step is about 18,000 lines, set against roughly half a million ranges: [California's first cut has 527,534 candidate ranges](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/CA/stats.json) in the published engine, and [Rhode Island's has 26,908](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/RI/stats.json). Even that finer grid touches a few percent of them at best.

The test I apply is simple. Change the knob and ask whether the map changes. A 0.1 degree step fails that test, so it belongs to a proof of concept and not to the final method. That distinction comes back in the section on speed-ups.

## What does checking every line cost?

Far more than the proof of concept. In Rhode Island, brute force over every range took 840 CPU-seconds against 1.6 for the grid, about 525 times the CPU. California was never run in full; my estimate was 8 to 14 hours, not a measurement. Correct, and not yet affordable, which set the performance work ahead.

Measuring first paid off, because brute force became the reference answer. Every faster version had to agree with it, and without that reference I would have had nothing to hold the optimizations against.

## How did California go from 71.9 minutes to 8.8?

By profiling, then removing the largest slice each time, three times. The first exact version took 71.9 minutes on 15 threads. Reusing each range's work cut that to 14.0, building each pass from the previous one to 10.4, and fewer, larger chunks to 8.8. The grid had taken about 2.6 minutes.

### Stop recounting

Neighboring ranges differ by one block crossing the line. When one more ballot arrives, you add it to the running tally instead of recounting the box. My first exact version recounted. The profile of that version was blunt: re-settling stray pieces took 80% of CPU. And 94% of neighboring ranges keep exactly the same strays, so almost all of that work reproduced answers I already had.

The first attempt stopped at about 45 minutes with the first cut only 70% done, and the completed run of that first exact version took 71.9. In that first exact version, full redos, where the quick local check could not prove nothing had changed, were needed for 16.4% of 8.1 million changes, against an early guess of 6%. Measuring beat estimating. Reusing each range's work then brought the run to 14.0 minutes, and re-settling fell to 1.4% of CPU.

### Build each pass from the last one

With re-settling fixed, the profile moved. Now 83% of CPU went on building each pass from scratch, 269,518 times. The analogy is a warehouse stocktake: photocopy yesterday's count sheet and adjust the few lines today's delivery changed, instead of recounting every shelf. Deriving each pass from the previous one brought the run to 10.4 minutes.

### Fewer, larger chunks

The next step gave less than I had estimated, and profiling again explained why: start-up cost per chunk grew with the square of the piece size. One chunk per 400 blocks became one per 2,500, with at least four per thread. That took the run from 10.4 minutes to 8.8. The final profile showed about 69% of time in tracker events and loop overhead, which is what a search does when it is finally mostly searching.

<figure role="img" aria-label="Bar chart of California full-state runtime in minutes by version: old grid 2.6, first exact version 71.9, reuse each range's work 14.0, build passes from the last one 10.4, fewer larger chunks 8.8. The first exact version took about 28 times the grid's runtime; profiling cut it to about 3.4 times. Source: author's measured runs of the exact-sweep prototype, California, October 2026." style="margin:1.5rem 0;padding:0;">
<div style="font-weight:600;margin-bottom:0.75rem;">California full-state runtime by version, minutes (lower is better)</div>
<div style="display:grid;grid-template-columns:minmax(120px,32%) 1fr 56px;gap:0.5rem 0.75rem;align-items:center;font-size:0.9rem;">
<div>Old 0.1 degree grid</div>
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
<figcaption style="font-size:0.8rem;opacity:0.75;margin-top:0.75rem;">Source: author's measured runs of the exact-sweep prototype, California, 51 cuts, 15 threads, October 2026.</figcaption>
</figure>

The first exact version took about 28 times the grid's runtime, and profiling-driven changes brought it to about 3.4 times, with the map unchanged at every step.

One caveat. Those figures are from the prototype. The shipped engine, with every tie rule added since, takes [California's U.S. House map 15.3 minutes in the published metrics](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/CA/stats.json), against about 157 seconds in the grid era. Exactness made the maps slower, and I would make the trade again. You can see the maps it produces at [Fair Maps](https://fairmaps.melson.us).

## What else did profiling find?

Three smaller wins, each found the same way: measure, find the dominant cost, fix only that. Parallel cut search cut Colorado, California and Texas runs by roughly three to five times. Nevada's tie stretches were serial work hiding on the main thread. The balancer's connectivity check was searching far more than it needed to.

### Parallel cut search

Running the cut search on a worker pool, each state alone on 14 threads against the old single-thread baseline, gave these timings (my own measurements): Colorado 35.1 to 11.2 seconds, California 357.1 to 67.9 seconds, Texas 475.1 to 87.5 seconds. Loading, topology, balancing and writing stay single-threaded, which caps the gain.

[Workers claim directions from an atomic counter and write each candidate into its own slot of a shared result buffer](https://github.com/mels0n/str-redistricting/commit/d9a5d0f), so results never depend on scheduling. Thread count can change how long a run takes. It cannot change a map.

### Nevada's tie stretches

A later profile showed about 70% of Nevada's runtime at 8 threads was serial work: re-sweeping tie stretches on the main thread. [Making each stretch one pool task took Nevada at 8 threads from 53.3 to 23.7 seconds](https://github.com/mels0n/str-redistricting/commit/7205bb9), and the commit records the output as byte-identical for Connecticut, Nevada, Rhode Island and Vermont at 1 and 4 threads.

### Balancer connectivity

The balancer checked that a district stayed connected by searching the whole district. Removing a block can only cut paths through that block, so the check now searches only around it. [Balancing California takes 1.1 seconds instead of 1.9, with the same moves and maps](https://github.com/mels0n/str-redistricting/commit/8b989bf).

## What ideas did I reject, and why?

I rejected anything that traded correctness for speed: skipping stretches of directions, rounding coordinates, a finer grid, a coarse-then-fine search and a search cap. Each looked reasonable and each would have reintroduced a rule that the data could not justify. The reasons are the useful part.

### Skipping stretches that cannot win

The tempting idea: if a range's first-pass border is longer than the best line so far, skip it. It fails because strays change everything. Settling strays can remove up to 64 km of border in one Rhode Island range, about half its first-pass border, and 92 km in California. The final border is below the first-split border in 89% of Rhode Island sub-ranges and 99.3% of California ones. "Longer than the guide line, so skip it" is true before strays and false after.

A fixed fraction fails too. Picture a dumbbell: the guide line runs the long way, one half-blob becomes a stray, and the final border crosses the neck. What was missing was a valid certificate, a proof that a stretch cannot win. Building one is the incremental evaluation itself.

### Rounding coordinates

Exact arithmetic is awkward, and rounding coordinates to whole numbers (about 6 millimeters) would simplify it. But it moves every point, so a map could change for reasons unrelated to the sweep. I chose exact sign tests on the coordinates as stored instead.

The need is easy to see on a four-digit calculator. 1.234 times 5.678 is 7.006652, and 2.345 times 2.988 is 7.006860. Both round to 7.007, so the difference reads as zero, a false tie. Keep each product's leftover and the exact difference is minus 0.000208. [The engine computes the quick answer first and falls back to exact integers only at real near-ties](https://github.com/mels0n/str-redistricting/blob/main/docs/explanation/how-districts-are-drawn.md), with no tolerance.

Comparing directions works the same way, without angles. Which ramp is steeper, 3 over 10 or 2 over 7? Compare 3 times 7 with 2 times 10: 21 beats 20, so 3 over 10. Every "which comes first" question in the sweep is a multiply-and-subtract like that.

### A finer grid, coarse-then-fine, and a cap

A finer grid is still sampling, so the map still depends on the step. Coarse-then-fine fails because the best line can be far from the coarse winner. And an early local connectivity search had a 4,000-block cap with a full redo past it. Both paths gave the same answer, but a cap looks like a decision. I replaced it with a search that needs none.

## How do you speed something up without changing the answer?

Give every optimization one test: switch it off and the map must be bit-for-bit identical, verified by a fingerprint of the whole assignment. If it fails, it is a rule, not a speed-up. If it passes, it is just faster math. Every change to the search here passed or was reverted.

The evidence was layered. California's fingerprint, 1208afea3c4f in my prototype runs, was unchanged through the first exact version, the reuse step and both later speed-ups, with all 39,538,223 people in the same district. Rhode Island's, 55301f72dccf, held through every phase. These are prototype-era hashes. The published ones differ because later rule changes legitimately redrew some labels and moves, so the claim holds for the speed-up stage only.

Fingerprints are the coarse net. The fine net was self-checks that rebuilt every pass from scratch and compared every block (8,204 of 8,204 in the first phase, 13,674 of 13,674 in the second), plus brute force over every Rhode Island range (41,443 of 41,443).

They caught a swap-order bug, and once the checker itself was wrong rather than the engine. A reused tracker could also be handed more free blocks than its arrays were sized for, and in Hawaii that hung a run. [The fix sizes a tracker's heaps for every block](https://github.com/mels0n/str-redistricting/commit/ac19828), with a timeout test so a corrupt tracker fails fast instead of looping.

For tie rules, versioning and release gates, [the post on design rules and release gates](/guide/operational-architecture/blog/redistricting-without-bias-operational-architect-ai-code-gates) covers the rest.

## What does this teach an operational architect?

Prove the pipeline cheaply, measure what full fidelity buys, then pay for it deliberately. Correctness first, then speed, and never let speed redefine correctness. The proof of concept earned its place by validating every state quickly, and the comparison with the exact search then put a number on what completing stage two was worth: measure before you trust an approximation.

The order mattered. Brute force gave me a reference, profiling told me where the time went, and the identical-output rule meant each gain was real. It is the same discipline as [measuring before you scale](/guide/operational-architecture/blog/scalability-is-an-engineering-problem): find the actual bottleneck, not the one you assume.

The payoff of building it in stages, correctness first, is that the engine has not needed rewriting. The state legislative release, [7,210 districts across three chambers](https://fairmaps.melson.us), still runs on the same exact engine with the drawing code unchanged. If you want to check my work, rerun a state from the [public repository](https://github.com/mels0n/str-redistricting) and compare fingerprints, or explore the maps at [Fair Maps](https://fairmaps.melson.us). It is the same habit I describe in [what an operational architect actually does](/guide/operational-architecture/blog/operational-architect-definitive-guide), applied to my own code first.

## Frequently Asked Questions

### What is a shortest splitline exact search?

It is a search that evaluates every possible straight cutting line, not a sample of them, and picks the one with the shortest real border. It is possible because a line's two sides only change at certain angles, so the half turn falls into ranges and each range needs checking once. Fair Maps documents this in its public method notes.

### Why move from 1,800 sampled directions to an exact shortest splitline search?

A rule that claims the shortest border makes a claim about every line, and a sample only proves the best sampled line. The 1,800-direction proof of concept was the right way to prove the pipeline quickly, and the exact search removes the step size from the method. In both states I compared, the true winner sat in a range no sampled line touched.

### How much shorter was the exact cut than the best sampled cut?

In Rhode Island the exact first cut was 405 meters, or 0.65%, shorter than the best sampled one. In California it was 1,872 meters, or 0.35%, shorter, and that figure is a lower bound because only windows near the best sampled directions were checked. Those are my own prototype measurements.

### How do you make an exact redistricting search fast enough to use?

Profile first, then remove the largest cost one change at a time. Here that meant reusing each range's work instead of recounting, building each pass from the previous one, using fewer and larger chunks, and running the search on a worker pool. That took California's first exact version from 71.9 minutes to 8.8 minutes in the prototype.

### How do you know a speed-up did not change the map?

Every speed-up had to pass one test: switch it off and the map is bit-for-bit identical. I verified that with a whole-state fingerprint, with self-checks that rebuild every pass from scratch and compare every block, and with brute force over every Rhode Island range.

### How long does Fair Maps take to draw California now?

The published metrics record 15.3 minutes for California's U.S. House map with every tie rule in the shipped engine, against about 157 seconds in the sampled-grid era. Exactness costs run time, a trade I chose deliberately. The prototype's 8.8 minutes was an earlier, simpler version of the engine.

### What did the exact search change in the maps?

It moved district lines for real people. In my sweep-stage comparison of the old grid maps against the first exact maps, about 36.3 million of 330.8 million people, roughly 11%, ended up in a different district. Maps were redrawn at the 1.0.0 release, so treat that figure as describing what the full search bought at the sweep stage, not the final published maps.

---

### Works Cited

- [1] mels0n. "How districts are drawn." Fair Maps method documentation, GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting/blob/main/docs/explanation/how-districts-are-drawn.md)
- [2] mels0n. "Commit 61264a8: feat(splitline): compare candidate borders by exact length, summed in block order." str-redistricting, GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting/commit/61264a8)
- [3] mels0n. "Commit 544a5b8: feat(engine)!: cut along the shortest of every straight line, by an exact rotational sweep." str-redistricting, GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting/commit/544a5b8)
- [4] mels0n. "Commit d9a5d0f: perf(generator): search cut directions on a worker-thread pool." str-redistricting, GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting/commit/d9a5d0f)
- [5] mels0n. "Commit 7205bb9: perf(engine): sweep tie stretches in the worker pool and report the scan counters." str-redistricting, GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting/commit/7205bb9)
- [6] mels0n. "Commit 8b989bf: perf(balance): check a district stays connected by searching only around the block." str-redistricting, GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting/commit/8b989bf)
- [7] mels0n. "Commit ac19828: fix(engine): size a tracker's heaps for every block, since a reused tracker can take more free blocks than it started with." str-redistricting, GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting/commit/ac19828)
- [8] mels0n. "California published statistics (stats.json)." Fair Maps data, GitHub, 2026. [raw.githubusercontent.com](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/CA/stats.json)
- [9] mels0n. "Rhode Island published statistics (stats.json)." Fair Maps data, GitHub, 2026. [raw.githubusercontent.com](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/RI/stats.json)
- [10] mels0n. "California published cuts (cuts.json)." Fair Maps data, GitHub, 2026. [raw.githubusercontent.com](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/CA/cuts.json)
- [11] mels0n. "Rhode Island published cuts (cuts.json)." Fair Maps data, GitHub, 2026. [raw.githubusercontent.com](https://raw.githubusercontent.com/mels0n/str-redistricting/main/public/data/RI/cuts.json)
- [12] Melson, Christopher. "Fair Maps." Fair Maps, 2026. [fairmaps.melson.us](https://fairmaps.melson.us)
`
};
