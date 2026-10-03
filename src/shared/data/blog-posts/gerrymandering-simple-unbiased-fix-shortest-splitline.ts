import { BlogPost } from "../office_blog_posts";

export const gerrymanderingSimpleUnbiasedFixShortestSplitline: BlogPost = {
    id: "gerrymandering-simple-unbiased-fix-shortest-splitline",
    slug: "gerrymandering-simple-unbiased-fix-shortest-splitline",
    title: "How to End Gerrymandering: Let a Simple Rule Draw the Map",
    author: "Christopher Melson",
    role: "Builder, Fair House Maps · Operational Architect",
    date: "2026-11-05",
    lastUpdated: "2026-11-05",
    ogImage: "/images/blog/gerrymandering-simple-unbiased-fix-shortest-splitline-og.jpg",
    summary: "Gerrymandering persists because people draw the lines. Here is a three-step rule with no knobs that draws all 435 House districts, and how to verify it.",
    polymorphicSummary: {
        executive: "Christopher Melson, who built the Fair House Maps tool, frames gerrymandering as an institutional risk with a recurring cost. Discretionary map drawing produces litigation, mid-decade map churn and public distrust, and about 71 percent of Americans say states should not be allowed to draw districts that intentionally favor one party. The corrective regime built since 1962 relies on judges, commissions and federal oversight behaving well, and recent decisions such as Shelby County, Rucho and Louisiana v. Callais show how quickly that supervision can be withdrawn. The decision on the table is whether a state keeps betting on people to be neutral or adopts a published procedure that cannot see party, race or incumbents. Fair House Maps shows the second option is feasible today: all 50 states, 435 seats, and the widest population gap between districts is 31 people. A rule does not guarantee outcomes, so legal review for narrow constraints such as Voting Rights Act Section 2 still has a place, but the drawing step itself no longer needs to be trusted.",
        strategist: "Christopher Melson uses Fair House Maps to argue for a different operating model for redistricting: rule first, review second. Today the sequence runs backward. A legislature or commission drafts a map with wide discretion, then courts and advocates try to detect bias afterward. The alternative is a published default that every state can generate identically, with human judgment confined to a small set of explicit legal overlays. Sequencing matters. Commissions are a sensible interim step because they cut partisan control, but they still choose among countless possible maps. Ensemble analysis is a useful audit layer, not a substitute. The trade-offs are real and stated openly in the project: county and city splits, no allowance for communities of interest, and a Voting Rights Act Section 2 question the code does not answer. Process neutrality is the claim, not outcome neutrality, and geography alone can skew results under any neutral rule. Ownership of verification should sit with the public, since anyone can rerun a state and compare fingerprints.",
        engineer: "This is Christopher Melson's mechanism-level description of Fair House Maps, which draws congressional districts from 2020 Census data. Inputs are limited to block population, block polygon, a block internal point used only to order blocks across a guide line, and apportioned seat counts. The cut step tests 1,800 straight guide lines at 0.1 degree intervals in a gnomonic projection, assigns blocks by distance from the line until the low side hits its seat share, requires both sides to be single connected pieces, and keeps the line with the shortest real border built from block edges. A state with N seats takes exactly N minus 1 cuts. Blocks are never split. A greedy balance then moves one border block at a time to a neighbor when it strictly narrows the gap and preserves contiguity, so it always terminates. There are no random numbers or seeds, tie-breaks are fixed, trigonometry uses fdlibm routines checked by golden IEEE 754 bit-pattern tests, and each state publishes SHA-256 fingerprints. Core logic is roughly 780 lines of TypeScript."
    },
    geoHighlights: [
        { label: "Core Argument", value: "Decades of corrective law tried to supervise biased line-drawers and has been rolled back in part. A published, deterministic rule that never reads party, race or incumbents removes the discretion point instead of policing it." },
        { label: "Target Audience", value: "Voters, civic-tech builders, journalists and policy staff asking how to end gerrymandering without trusting either party's mapmakers." },
        { label: "Key Insight", value: "Fair House Maps draws all 435 House districts in 50 states with three fixed steps and roughly 780 lines of core logic. The widest population gap between districts is 31 people, and anyone can rerun a state and match its SHA-256 fingerprint." }
    ],
    content: `The way to end gerrymandering is to remove the person who draws the lines. A fixed, published procedure that never reads party, race or incumbent data cannot favor anyone, and anyone can rerun it to check. I built one, [Fair House Maps](https://fairmaps.melson.us), which draws all 435 House districts in three steps.

My work as an operational architect is mostly about finding the point where a process depends on someone's discretion and asking whether that point needs to exist (see [what an operational architect does](/guide/operational-architecture/blog/operational-architect-definitive-guide)). Redistricting is the clearest case I know. We built decades of courts, statutes and commissions to supervise mapmakers we could not trust to be neutral, and then watched parts of that machinery get rolled back. This post covers the harms, the history of the fixes, what voters think, and a working alternative you can inspect.

> **Key Takeaways**
> - Gerrymandering costs voters competitive elections, accountability and equal representation, and both parties do it.
> - Every major corrective measure since 1962 supervised human mapmakers, so each depended on judges and officials behaving well, and several have been rolled back.
> - About 7 in 10 Americans oppose intentional partisan map drawing, yet support softens when it is their own side's map.
> - Fair House Maps draws all 50 states with three fixed steps, no random numbers and no tuning knobs, and publishes a SHA-256 fingerprint anyone can reproduce.
> - A neutral process does not guarantee any particular outcome, and Voting Rights Act Section 2 compliance remains a legal question the code does not answer.

---

## What does gerrymandering actually cost voters?

Gerrymandering lets the people holding power choose their voters, which breaks the link between votes and seats. It produces lopsided seat counts, safe districts where the primary decides everything, diluted minority votes and years of litigation. Both parties have done it, and the evidence below includes examples from each.

### Packing, cracking and the seat-vote gap

Mapmakers use two tools. Packing concentrates one side's voters into a few districts that side wins by huge margins. Cracking spreads them across many districts where they lose narrowly. Either way votes are wasted, and the efficiency gap measures the difference in wasted votes between the parties.

In Wisconsin in 2012, Republicans won [60 of 99 Assembly seats with 48.6 percent of the statewide Assembly vote](https://www.law.cornell.edu/supct/cert/16-1161). The plaintiffs in Gill v. Whitford argued, per the [Brennan Center](https://www.brennancenter.org/blog/faceoff-starts-wisconsin-partisan-gerrymandering-case), that Republicans won 13 percent more seats in 2012 than they would have under a neutral map (a 13 percent efficiency gap). That is a claim made in litigation, not a verdict. In North Carolina in 2016, Republicans won [10 of 13 congressional seats](https://en.wikipedia.org/wiki/Rucho_v._Common_Cause), after the legislator running the process said openly that he proposed drawing the maps to advantage 10 Republicans and three Democrats. Democrats are not exempt. Rucho was decided alongside Lamone v. Benisek, [a challenge to a map drawn by Maryland Democrats](https://en.wikipedia.org/wiki/Rucho_v._Common_Cause).

### Safe seats, primaries and accountability

FairVote reports that [84 percent of 2024 House seats were decided by 10 points or more or went uncontested, and it projected 352 of 435 seats as already safe for 2026](https://fairvote.org/press/house-elections-broken-release-2025/). FairVote is an electoral-reform advocacy group, so weigh the framing, but the counts are checkable. When a seat is safe, the primary is the only contest that matters, and a member answers to the narrow slice of voters who decide it. I will not claim that districting alone causes polarization, because the research on that question is mixed. The narrower claim holds up: it reduces competition and weakens accountability.

### Racial vote dilution, litigation and map churn

Packing or cracking a minority community dilutes its votes, which is the harm the Voting Rights Act was written to address. The other cost is churn. Texas signed a new map on August 29, 2025. A three-judge panel blocked it on November 18, the Supreme Court stayed that order on December 4, and on April 27, 2026 the Court reversed 6-3, per [one tracker of the Texas redraw](https://en.wikipedia.org/wiki/2025_Texas_redistricting). Voters, candidates and election officials spent a year not knowing which lines would apply.

## How did the US try to fix it, and why did every fix depend on trusting humans?

The country built corrective measures in layers: one person one vote, the Voting Rights Act, limits on racial line-drawing and independent commissions. Each exists because line-drawers could not be assumed neutral. Each still depends on judges, commissioners or legislators behaving well, which is why courts could roll parts of them back.

### Courts and statute, 1962 to 1993

In 1962, [Baker v. Carr](https://www.law.cornell.edu/supremecourt/text/369/186) made apportionment claims justiciable. In 1964, [Wesberry v. Sanders](https://www.law.cornell.edu/supremecourt/text/376/1) required congressional districts to give one person's vote, as nearly as practicable, as much weight as another's, and [Reynolds v. Sims](https://www.law.cornell.edu/supremecourt/text/377/533) applied the same rule to both houses of state legislatures. The [Voting Rights Act](https://www.archives.gov/milestone-documents/voting-rights-act), signed August 6, 1965, added Section 5 preclearance, which made covered jurisdictions get approval from a federal court in Washington or the Attorney General before changing election rules. Congress strengthened Section 2 in 1982, and [Thornburg v. Gingles](https://www.law.cornell.edu/supremecourt/text/478/30) (1986) set three preconditions for a vote-dilution claim without requiring proof of intent. [Shaw v. Reno](https://www.law.cornell.edu/supremecourt/text/509/630) (1993) pushed the other way: districts so irregular they can only be explained by race face strict scrutiny.

Read that list as an operator would. Every item is a rule for supervising mapmakers, either after the fact or by pre-approval. None changes who holds the pen.

### Commissions: moving the pen

Arizona voters created a five-member commission in 2000 with [about 56 percent of the vote on Proposition 106](https://ballotpedia.org/Arizona_Creation_of_a_Redistricting_Commission,_Proposition_106_(2000)). California followed in 2008 and 2010, and Colorado and Michigan in 2018, [according to a survey of commission laws](https://en.wikipedia.org/wiki/Redistricting_commission). In [Arizona State Legislature v. AIRC](https://www.law.cornell.edu/supremecourt/text/13-1314) (2015), a 5-4 Court held that a citizen-initiated commission may draw congressional lines.

Commissions help, but they still choose among a huge number of possible maps through criteria, appointments and negotiation. Other countries use rule-bound independent bodies too. The [Boundary Commission for England](https://boundarycommissionforengland.independent.gov.uk/2023-review/guide-to-the-2023-review-of-parliamentary-constituencies/page/3/) keeps constituencies within 5 percent of an electoral quota of 73,393 and states that voting patterns and the fortunes of parties do not enter its considerations. [Canada uses ten provincial commissions](https://www.elections.ca/content.aspx?section=res&dir=cir%2Fred%2Ffaq&document=index&lang=e) of three members each, chaired by a judge. Both still weigh local ties, so discretion remains.

### The rollbacks

In June 2013, [Shelby County v. Holder](https://www.justice.gov/crt/shelby-county-decision) struck down the Section 4(b) coverage formula, so covered jurisdictions no longer needed preclearance absent a separate court order. In 2019, [Rucho v. Common Cause](https://www.law.cornell.edu/supremecourt/text/18-422) held 5-4 that partisan gerrymandering claims are political questions beyond the reach of federal courts, while noting that states and Congress can act.

The Court has not moved in a single direction on race. [Allen v. Milligan](https://www.law.cornell.edu/supremecourt/text/21-1086) (2023) found Alabama's map likely violated Section 2. [Alexander v. South Carolina NAACP](https://www.law.cornell.edu/supremecourt/text/22-807) (2024) reversed a racial-gerrymander finding, noting how closely race and party correlate. Then, on April 29, 2026, [Louisiana v. Callais](https://www.scotusblog.com/cases/louisiana-v-callais-2/) held 6-3 that the Voting Rights Act did not require Louisiana to create an additional majority-minority district, so its map was an unconstitutional racial gerrymander. The broader retreat from race-conscious remedies, including [SFFA v. Harvard](https://www.supremecourt.gov/opinions/22pdf/20-1199_hgdj.pdf) in admissions, is a separate legal field, but the direction is similar.

### The 2025 to 2026 redraw war

With federal courts out of partisan claims, both parties escalated. Per a [secondary tracker](https://en.wikipedia.org/wiki/2025%E2%80%932026_United_States_redistricting), Texas Republicans aimed their new map at five Democratic-held seats. California Democrats answered with Proposition 50, which [passed with 64.42 percent](https://en.wikipedia.org/wiki/2025_California_Proposition_50), and the tracker credits it with up to five Democratic seats. North Carolina and Ohio redrew toward Republicans, Florida followed in May 2026, and Virginia voters approved a Democratic-leaning referendum in April 2026 before the state supreme court struck it down 4-3 in May. The Indiana Senate rejected a redraw in December 2025. In Missouri, a referendum petition against the new map [reached the ballot and the 2022 map governs November](https://www.votebeat.org/national/2026/09/11/missouri-congressional-map-election-officials-supreme-court-2026-denny-hoskins/). I have left out seat totals, because sources disagree.

## What do voters think about gerrymandering?

Americans oppose partisan gerrymandering overwhelmingly and across party lines. In an April 2026 Economist/YouGov poll, [71 percent said states should not be allowed to draw districts that intentionally favor one party](https://yougov.com/en-us/articles/54644-most-americans-say-partisan-gerrymandering-should-not-be-allowed-april-24-27-2026-economist-yougov-poll), and only 7 percent said they should. Support softens when it is your side's map.

<figure role="img" aria-label="In an April 2026 Economist/YouGov poll, about 7 in 10 Democrats (74%), Independents (70%) and Republicans (69%) each said states should not be allowed to draw districts that favor one party." style="margin:1.5rem 0;padding:0;">
<div style="display:grid;grid-template-columns:7rem 1fr 3rem;gap:0.5rem 0.75rem;align-items:center;">
<div>Democrats</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:74%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">74%</div>
<div>Independents</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:70%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">70%</div>
<div>Republicans</div>
<div style="background:rgba(128,128,128,0.15);border-radius:4px;height:1.5rem;"><div style="width:69%;height:100%;background:rgba(59,130,246,0.75);border-radius:4px;"></div></div>
<div style="text-align:right;">69%</div>
</div>
<figcaption style="margin-top:0.75rem;font-size:0.875rem;opacity:0.8;">Share saying states should not be allowed to intentionally favor one party when drawing districts, by party. Source: Economist/YouGov poll, April 24-27, 2026.</figcaption>
</figure>

The three bars are nearly the same height: opposition does not depend on party, until the question becomes whose map it is.

An earlier [YouGov poll from August 2025](https://yougov.com/en-us/articles/52740-large-majorities-americans-say-gerrymandering-major-problem-unfair-should-be-illegal-redistricting-texas-california-poll) found 75 percent call gerrymandering a major problem and 69 percent say it should be illegal (Democrats 80, Independents 69, Republicans 57). An [NBC News Decision Desk poll](https://www.nbcnews.com/politics/politics-news/poll-americans-oppose-political-parties-drawing-election-lines-rcna229257) found 82 percent prefer independent commissions to partisan control, including 66 percent of Texas Republicans. A [Brennan Center summary](https://www.brennancenter.org/our-work/research-reports/americans-are-united-against-partisan-gerrymandering) of Campaign Legal Center polling found over 70 percent of voters of all parties wanted the Supreme Court to limit it.

The softening shows up in the same data. In the April 2026 poll, Democrats and Republicans were [about three times likelier to say districts favor the other party than their own](https://yougov.com/en-us/articles/54644-most-americans-say-partisan-gerrymandering-should-not-be-allowed-april-24-27-2026-economist-yougov-poll). When the question is a specific map, the split opens: [66 percent of Republicans approved of the Texas plan and 6 percent of Democrats](https://yougov.com/en-us/articles/52756-few-americans-support-texas-republicans-redistricting-plan-gerrymandering-opinions-split-democratic-lawmakers-move-stop-it-poll). I would not call tolerance universal, though. In the August 2025 poll, only 24 percent backed a Democratic-favoring map to counter Texas and 19 percent a Republican-favoring map to counter California.

Related research points the same way. Claassen, Ensley and Ryan ran two survey experiments on election-administration tactics (not gerrymandering) and found that [about 80 percent of respondents condemned the other party's misconduct, while large majorities of partisans failed to see a problem with their own party's](https://link.springer.com/article/10.1007/s11109-024-09990-2). Everyone hates it when the other side does it. That is the argument for a process neither side can steer.

## Why not just use independent commissions or ensemble analysis?

Commissions move the pen to different hands but keep discretion. Ensemble analysis detects bias after a map exists. A fixed, deterministic rule prescribes the map and leaves no choices to exploit. These approaches complement each other, but only the rule removes the discretion point.

The idea behind my approach is not new. Warren D. Smith [published the shortest splitline method on RangeVoting.org](https://rangevoting.org/Splitlining.html): recursively cut a region along the shortest line that divides its population in the right ratio. My implementation builds on his idea. On the detection side, Jonathan Mattingly's group generated [over 24,000 redistricting plans](https://sites.duke.edu/quantifyinggerrymandering/category/common-cause-v-rucho/) to show that North Carolina's 2012 and 2016 plans were statistical outliers. That analysis is valuable, but its baseline depends on what the analyst chooses to sample. A fixed rule has no sampling choices.

## What is the simple fix? How does Fair House Maps use shortest splitline?

Fair House Maps, built on the shortest splitline method, draws every district with three fixed steps: cut the state with the shortest straight line, keep census blocks whole, then balance population by moving single blocks. It covers all 50 states and 435 seats, and the widest population range between districts within one state is 31 people.

### What goes in, and what never does

The inputs are short enough to list completely. For each 2020 Census block: its population count, its polygon, and an internal point used only to order blocks across a guide line. Plus the number of House seats each state received in the 2020 apportionment. That is all.

It never reads party registration, election results, incumbent addresses, race or ethnicity data, or county and city boundaries. Counties are counted afterward, for reporting only. The 119th Congress lines appear in the viewer for comparison and are never an input. This is what I mean by unbiased by construction. The rule cannot favor anyone because it does not know who anyone is.

### The three steps in plain language

1. **Cut.** A state needing seven seats splits them into three and four. The rule tests 1,800 straight guide lines, one every 0.1 degree across 180 degrees. For each line, blocks are placed by distance from it and population accumulates until one side holds its share of seats. Among lines that leave each side as one connected piece, the one with the shortest real border wins. Then it repeats on each side until every piece has one seat. A state with N seats takes exactly N minus 1 cuts.
2. **Keep blocks whole.** Census blocks are never split. Stray isolated groups join the surrounding side, and any line that strands a piece is rejected so the next shortest is tried.
3. **Balance.** The rule finds the district furthest from the ideal population, then moves one border block to a neighbor if that strictly narrows the gap and keeps the source district connected. It repeats until no move helps. Every move strictly improves the result, so it always stops. It is greedy, not globally optimal, and I say so in the project.

### Simplicity you can audit

There are no random numbers, no seeds and no per-state tuning knobs. Every tie is broken by a fixed order: block ID order first, then, between equal borders, the line closest to north-south, then the smaller angle, then fewer seats on the low side. The core logic is roughly 780 lines of TypeScript (about 690 for the cut and 88 for the balance), plus about 300 lines of deterministic math. JavaScript engines compute trigonometry slightly differently, so the project uses fdlibm routines instead, and a test fails if the built-in functions appear. Golden IEEE 754 bit-pattern tests lock the results.

That is the same design instinct I applied in [another small tool I built](/guide/operational-architecture/blog/tabletop-time-no-login-scheduler-open-api): keep the mechanism small enough that a stranger can understand it and open enough that they can check it.

### Verify it yourself

Every state publishes a SHA-256 fingerprint of its final block assignment and a SHA-256 of the Census input file. Rerun the state and you get the identical map and the identical fingerprint. The thread count never changes the map. Each state also publishes its full cut sequence, a ledger of every block moved in balancing, population range before and after, and contiguity. To reproduce one, clone the [public repository](https://github.com/mels0n/str-redistricting) and run \`npm install && npm run explore -- --states CO\`.

### The numbers

Across 2020 Census data, the run covers 50 of 50 states, 435 seats and 8,126,956 census blocks. After balancing, the widest population range is New York at 31 people across 26 seats. Florida is 29, Texas 20, California 12 and Colorado 3. Single-seat states are 0, and every other state falls between 0 and 13. Colorado shows the balancing step at work: a range of 361 people before balancing, 3 after, in 20 moves, with all eight districts contiguous. Texas, the largest case, went from 851 to 20 in 262 moves and takes about eight minutes to run.

### What you can do on the site

The viewer at [fairmaps.melson.us](https://fairmaps.melson.us) covers all 50 states. Hover or tap a district for its population, deviation and the counties it touches. Look up your district by address (the address goes to the Census Bureau geocoder, and the site shows a notice). Replay every cut in order, replay every balancing move block by block, toggle before and after balancing, and compare side by side with the 119th Congress. Each state has a summary with its fingerprint and Census checksum, links are shareable, and the site targets WCAG 2.2 AA.

One claim discipline matters. This is process neutrality, not outcome neutrality. The rule cannot know who benefits, but that does not guarantee any party a particular result.

## What does this approach get wrong?

It splits counties, ignores communities of interest and says nothing about the Voting Rights Act. Those are real costs, and the project states them. The honest question is whether they outweigh the cost of letting interested parties draw the lines, and I think they do not.

### Counties, cities and communities of interest

Colorado splits 21 of its 64 counties and Texas splits 108 of 254. The rule makes no allowance for communities of interest, balancing is greedy single-block moves, and the 0.1 degree angle step is part of the recipe. A different step would give a different, equally rule-bound map.

### The Voting Rights Act

The rule reads no race data, so Section 2 compliance is a legal question outside the algorithm. A race-blind rule can dilute minority voting strength by accident as easily as a human can by design. After Callais, the federal test leans toward intent, which sharpens the tension rather than resolving it. The answer is a policy choice, a rule-first default plus separate legal review, not something code can settle. I do not claim this replaces the Act.

### Geography

Urban clustering alone can skew results under any neutral rule. Chen and Rodden's [research on unintentional gerrymandering](https://web.stanford.edu/~jrodden/wp/florida.pdf) found that concentrated Democratic voters can expect under half the seats at half the votes in many states. A neutral process may still produce lopsided outcomes. The point is that nobody chose them.

## Where do you go from here?

Look up your own district at [Fair House Maps](https://fairmaps.melson.us), compare it with your current one, and read the "How it works" page to see the rule in plain language. Then pick a state, rerun it from the [GitHub repository](https://github.com/mels0n/str-redistricting) and check that your fingerprint matches the published one.

I think of this as the same principle as the [approval-gate model for AI agents](/guide/operational-architecture/blog/governing-ai-agents-approval-gate-model): bound discretion and make every decision auditable. A rule nobody can tune beats discretion everyone suspects.

## Frequently Asked Questions

### How do you end gerrymandering?

You remove human discretion from the drawing step. A published, deterministic procedure that ignores party, race and incumbents cannot favor anyone, and anyone can rerun it to check the result. Independent commissions reduce partisan control but still choose among many possible maps, while a fixed rule prescribes one.

### What is the shortest splitline algorithm?

It is a method for drawing equal-population districts by repeatedly cutting a region with the shortest straight-line split that divides its population in the right ratio. Warren D. Smith published the idea on RangeVoting.org. Fair House Maps builds on it with 2020 Census blocks, a fixed balancing step and a published SHA-256 fingerprint for each state.

### Is gerrymandering legal in the United States?

Partisan gerrymandering is not reviewable in federal court after Rucho v. Common Cause (2019), though Congress and states can act and some state courts and laws still limit it. Racial gerrymandering and intentional discrimination claims remain justiciable. The legal picture varies by state.

### Do independent redistricting commissions work better than legislatures?

They reduce direct partisan control, and polling shows broad public support for them. They still make discretionary choices among many possible maps, so bias can enter through criteria, appointments and negotiation. A commission that must adopt a published rule's map would remove most of that discretion.

### Can an algorithm draw fair congressional districts without breaking the Voting Rights Act?

Fair House Maps reads no race data, so Section 2 compliance is a legal question outside the algorithm. A race-blind rule can dilute minority voting strength by accident as easily as a human can by design. The sensible design is a rule-first default plus a separate, narrow legal review.

### How can I check the Fair House Maps map for my district?

Open fairmaps.melson.us, pick your state, and look up your district by address, then compare it with your current district side by side. To verify the map itself, clone the public repository and rerun the state with npm run explore. The output should match the published SHA-256 fingerprint exactly.

---

### Works Cited

- [1] YouGov. "Most Americans say partisan gerrymandering should not be allowed (April 24-27, 2026 Economist/YouGov poll)." YouGov, 2026. [yougov.com](https://yougov.com/en-us/articles/54644-most-americans-say-partisan-gerrymandering-should-not-be-allowed-april-24-27-2026-economist-yougov-poll)
- [2] YouGov. "Large majorities of Americans say gerrymandering is a major problem, unfair, should be illegal." YouGov, 2025. [yougov.com](https://yougov.com/en-us/articles/52740-large-majorities-americans-say-gerrymandering-major-problem-unfair-should-be-illegal-redistricting-texas-california-poll)
- [3] YouGov. "Few Americans support Texas Republicans' redistricting plan." YouGov, 2025. [yougov.com](https://yougov.com/en-us/articles/52756-few-americans-support-texas-republicans-redistricting-plan-gerrymandering-opinions-split-democratic-lawmakers-move-stop-it-poll)
- [4] NBC News. "Poll: Americans oppose political parties drawing election lines." NBC News Decision Desk/SurveyMonkey, 2025. [nbcnews.com](https://www.nbcnews.com/politics/politics-news/poll-americans-oppose-political-parties-drawing-election-lines-rcna229257)
- [5] Brennan Center for Justice. "Americans Are United Against Partisan Gerrymandering." Brennan Center, 2019. [brennancenter.org](https://www.brennancenter.org/our-work/research-reports/americans-are-united-against-partisan-gerrymandering)
- [6] Legal Information Institute. "Gill v. Whitford, No. 16-1161." Cornell Law School, 2018. [law.cornell.edu](https://www.law.cornell.edu/supct/cert/16-1161)
- [7] Brennan Center for Justice. "Faceoff Starts in Wisconsin Partisan Gerrymandering Case." Brennan Center, 2017. [brennancenter.org](https://www.brennancenter.org/blog/faceoff-starts-wisconsin-partisan-gerrymandering-case)
- [8] Wikipedia. "Rucho v. Common Cause." Wikimedia Foundation, 2026. [wikipedia.org](https://en.wikipedia.org/wiki/Rucho_v._Common_Cause)
- [9] FairVote. "House Elections Are Broken." FairVote, 2025. [fairvote.org](https://fairvote.org/press/house-elections-broken-release-2025/)
- [10] Wikipedia. "2025 Texas redistricting." Wikimedia Foundation, 2026. [wikipedia.org](https://en.wikipedia.org/wiki/2025_Texas_redistricting)
- [11] Wikipedia. "2025-2026 United States redistricting." Wikimedia Foundation, 2026. [wikipedia.org](https://en.wikipedia.org/wiki/2025%E2%80%932026_United_States_redistricting)
- [12] Legal Information Institute. "Baker v. Carr, 369 U.S. 186 (1962)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/369/186)
- [13] Legal Information Institute. "Wesberry v. Sanders, 376 U.S. 1 (1964)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/376/1)
- [14] Legal Information Institute. "Reynolds v. Sims, 377 U.S. 533 (1964)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/377/533)
- [15] National Archives. "Voting Rights Act (1965)." U.S. National Archives, 1965. [archives.gov](https://www.archives.gov/milestone-documents/voting-rights-act)
- [16] Legal Information Institute. "Thornburg v. Gingles, 478 U.S. 30 (1986)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/478/30)
- [17] Legal Information Institute. "Shaw v. Reno, 509 U.S. 630 (1993)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/509/630)
- [18] Ballotpedia. "Arizona Creation of a Redistricting Commission, Proposition 106 (2000)." Ballotpedia, 2000. [ballotpedia.org](https://ballotpedia.org/Arizona_Creation_of_a_Redistricting_Commission,_Proposition_106_(2000))
- [19] Wikipedia. "Redistricting commission." Wikimedia Foundation, 2026. [wikipedia.org](https://en.wikipedia.org/wiki/Redistricting_commission)
- [20] Legal Information Institute. "Arizona State Legislature v. Arizona Independent Redistricting Commission, No. 13-1314." Cornell Law School, 2015. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/13-1314)
- [21] Boundary Commission for England. "Guide to the 2023 Review of Parliamentary Constituencies." Boundary Commission for England, 2023. [boundarycommissionforengland.independent.gov.uk](https://boundarycommissionforengland.independent.gov.uk/2023-review/guide-to-the-2023-review-of-parliamentary-constituencies/page/3/)
- [22] Elections Canada. "Electoral Boundaries Readjustment FAQ." Elections Canada. [elections.ca](https://www.elections.ca/content.aspx?section=res&dir=cir%2Fred%2Ffaq&document=index&lang=e)
- [23] U.S. Department of Justice. "Shelby County Decision." Civil Rights Division, 2013. [justice.gov](https://www.justice.gov/crt/shelby-county-decision)
- [24] Legal Information Institute. "Rucho v. Common Cause, No. 18-422." Cornell Law School, 2019. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/18-422)
- [25] Legal Information Institute. "Allen v. Milligan, No. 21-1086." Cornell Law School, 2023. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/21-1086)
- [26] Legal Information Institute. "Alexander v. South Carolina State Conference of the NAACP, No. 22-807." Cornell Law School, 2024. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/22-807)
- [27] SCOTUSblog. "Louisiana v. Callais." SCOTUSblog, 2026. [scotusblog.com](https://www.scotusblog.com/cases/louisiana-v-callais-2/)
- [28] Supreme Court of the United States. "Students for Fair Admissions v. President and Fellows of Harvard College, No. 20-1199." Supreme Court, 2023. [supremecourt.gov](https://www.supremecourt.gov/opinions/22pdf/20-1199_hgdj.pdf)
- [29] Wikipedia. "2025 California Proposition 50." Wikimedia Foundation, 2026. [wikipedia.org](https://en.wikipedia.org/wiki/2025_California_Proposition_50)
- [30] Votebeat. "Missouri congressional map, election officials and the Supreme Court." Votebeat, 2026. [votebeat.org](https://www.votebeat.org/national/2026/09/11/missouri-congressional-map-election-officials-supreme-court-2026-denny-hoskins/)
- [31] Claassen, Ensley, and Ryan. "Do Fans Make Poor Referees? Exploring Citizens' Reactions to Partisan Gamesmanship." Political Behavior, Springer, 2024. [springer.com](https://link.springer.com/article/10.1007/s11109-024-09990-2)
- [32] Smith, Warren D. "Splitlining." RangeVoting.org. [rangevoting.org](https://rangevoting.org/Splitlining.html)
- [33] Duke University. "Common Cause v. Rucho." Quantifying Gerrymandering, Duke, 2019. [duke.edu](https://sites.duke.edu/quantifyinggerrymandering/category/common-cause-v-rucho/)
- [34] Chen, Jowei; Rodden, Jonathan. "Unintentional Gerrymandering: Political Geography and Electoral Bias in Legislatures." Quarterly Journal of Political Science, 2013. [stanford.edu](https://web.stanford.edu/~jrodden/wp/florida.pdf)
- [35] Melson, Christopher. "str-redistricting (Fair House Maps and Splitline Generator)." GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting)
`
};
