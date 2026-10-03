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
    summary: "Every US redistricting safeguard patches the same flaw: human discretion. A three-step rule using only population and geography draws all 435 districts.",
    polymorphicSummary: {
        executive: "Christopher Melson, who built the Fair House Maps tool, argues that gerrymandering is a risk no safeguard has retired, because every safeguard leaves human discretion in place. One person one vote, the Voting Rights Act, preclearance, limits on racial gerrymanders and independent commissions all try to legislate fairness around mapmakers who know party, race and incumbent data. Louisiana v. Callais, decided April 29, 2026, narrowed Section 2 to a strong inference of intentional discrimination. Maps keep being drawn, struck, redrawn and reinstated in Louisiana, Alabama, North Carolina, Ohio and Utah. Commissions cost real money, about $14.1 million in California and about $8 million in Arizona, and still deadlock or get sued. The decision is whether to keep paying for supervision or remove the discretion. Roughly 7 in 10 Democrats, Independents and Republicans say states should not draw districts that favor a party, and a published rule using only population and geography draws all 435 districts with a widest population gap of 31 people.",
        strategist: "Christopher Melson treats redistricting reform as an operating-model problem. The current model adds controls downstream of a discretionary step. Courts review maps after they are drawn, preclearance reviewed them before, and commissions change who draws them, and each control creates a new party with a reason to contest it. The result is a cycle of reversals rather than a settled process. The alternative model deletes the discretionary step. Sequencing is straightforward: fix the inputs first, population and geography only, then fix the procedure, then publish the output and its fingerprint so that verification belongs to the public. The governing principle is that the simplest design with the fewest inputs is best, because every extra input, including a communities-of-interest allowance, is a place where judgment and therefore bias can enter. The trade-offs are stated openly in the project: county and city splits, and no communities-of-interest allowance. The Callais decision, which narrowed Section 2, shows how little a supervision-based model can be relied on once courts change course. The claim is a neutral process, not a guaranteed outcome.",
        engineer: "This is Christopher Melson's mechanism-level description of Fair House Maps, which draws congressional districts from 2020 Census data. The only inputs are block population, block polygon, a block internal point used to order blocks across a guide line, and the apportioned seat count. Party, election results, incumbent addresses and race are never read. The cut step tests 1,800 straight guide lines at 0.1 degree intervals in a gnomonic projection, assigns blocks by distance from the line until the low side reaches its seat share, requires both sides to be single connected pieces, and keeps the line with the shortest real border. A state with N seats takes exactly N minus 1 cuts. Blocks are never split. A greedy balance then moves one border block at a time to a neighbor when it strictly narrows the gap and preserves contiguity, so it always terminates. There are no knobs, no random numbers and no seeds, ties break in fixed order, trigonometry uses fdlibm routines checked by golden IEEE 754 tests, and each state publishes SHA-256 fingerprints. Core logic is about 780 lines of TypeScript."
    },
    geoHighlights: [
        { label: "Core Argument", value: "Every US redistricting safeguard is a patch over one flaw, a human who knows party, race and incumbents holding the pen. Remove the human and give the tool only population and geography, because a rule cannot use what it never receives." },
        { label: "Target Audience", value: "Voters, civic-tech builders, journalists and policy staff asking how to end gerrymandering without trusting either party's mapmakers." },
        { label: "Key Insight", value: "Louisiana v. Callais (April 29, 2026) narrowed Section 2 to a strong inference of intentional discrimination, leaving the main federal safeguard to police intent alone. Fair House Maps draws all 435 districts in three fixed steps and about 780 lines of core code." }
    ],
    content: `The way to end gerrymandering is to remove the person who draws the lines. Every safeguard the United States has built is a patch over the same flaw, a human holding the pen, and a patch cannot fix a flaw it leaves in place. I built a tool that removes the human: [Fair House Maps](https://fairmaps.melson.us) draws all 435 House districts from population and geography alone, in three fixed steps.

My work as an operational architect is mostly about finding the point where a process depends on someone's discretion and asking whether that point needs to exist (see [what an operational architect does](/guide/operational-architecture/blog/operational-architect-definitive-guide)). Redistricting is the clearest case I know. This is not a partisan argument, and both parties appear in the evidence below.

> **Key Takeaways**
> - One person one vote, the Voting Rights Act, preclearance, limits on racial gerrymanders and commissions are all workarounds. None removes the human who knows party, race and incumbents.
> - Louisiana v. Callais (April 29, 2026) did not strike down Section 2, but it narrowed it to a strong inference of intentional discrimination. A rule that never receives race or party data cannot have intent.
> - Leaving humans in the loop produces endless reversal: maps drawn, struck, redrawn and reinstated in state after state.
> - About 7 in 10 Democrats, Independents and Republicans say states should not draw districts that favor a party.
> - Simplest is best: population plus geography, three fixed steps, no knobs, no seeds, about 780 lines of core code, and a SHA-256 fingerprint anyone can rerun and match.

---

## What does gerrymandering cost voters?

Gerrymandering lets the people holding power choose their voters, which breaks the link between votes and seats. Both parties do it. Mapmakers pack one side's voters into a few lopsided districts and crack the rest across many where they lose narrowly.

In Wisconsin in 2012, Republicans won [60 of 99 Assembly seats with 48.6 percent of the statewide Assembly vote](https://www.law.cornell.edu/supct/cert/16-1161). The plaintiffs in Gill v. Whitford argued, per the [Brennan Center](https://www.brennancenter.org/blog/faceoff-starts-wisconsin-partisan-gerrymandering-case), that this was a 13 percent efficiency gap, a claim made in litigation rather than a verdict. In North Carolina in 2016, Republicans won [10 of 13 congressional seats](https://www.law.cornell.edu/supremecourt/text/18-422) after the legislator running the process said he proposed drawing the maps to elect 10 Republicans and three Democrats. Democrats are not exempt: Rucho was decided alongside Lamone v. Benisek, [a challenge to a map drawn by Maryland Democrats](https://www.law.cornell.edu/supremecourt/text/18-422). In New York in 2022, the state's highest court [struck the legislature's congressional map as a partisan gerrymander](https://redistricting.lls.edu/state/new-york/).

The result is fewer real contests. FairVote reports that [84 percent of 2024 House seats were decided by 10 points or more or went uncontested, and it projected 352 of 435 seats as already safe for 2026](https://fairvote.org/press/house-elections-broken-release-2025/). FairVote is an advocacy group, but the counts are checkable. When a seat is safe, the primary is the only contest, and a member answers to the narrow slice of voters who decide it.

## Why every safeguard fails the same way

Every safeguard regulates the human instead of removing the human. A person drawing a map knows where voters live, how they vote, what race they are and where the incumbents sleep. That knowledge is what makes bias possible, however good the intentions. Each fix leaves the knowledge and the discretion in place and tries to legislate fairness around them.

### The patches, 1964 to 1993

In 1964, [Wesberry v. Sanders](https://www.law.cornell.edu/supremecourt/text/376/1) required congressional districts to give one person's vote, as nearly as practicable, as much weight as another's, and [Reynolds v. Sims](https://www.law.cornell.edu/supremecourt/text/377/533) applied the rule to state legislatures. The [Voting Rights Act](https://www.archives.gov/milestone-documents/voting-rights-act) of 1965 added Section 5 preclearance, which made covered jurisdictions get federal approval before changing election rules. [Thornburg v. Gingles](https://www.law.cornell.edu/supremecourt/text/478/30) (1986) set three preconditions for a vote-dilution claim without requiring proof of intent. [Shaw v. Reno](https://www.law.cornell.edu/supremecourt/text/509/630) (1993) pushed the other way: districts so irregular they can only be explained by race face strict scrutiny.

Read the list as an operator would. Equal population is satisfied by a map that is still gerrymandered. Preclearance asks a reviewer to inspect the mapmaker's work. Gingles and Shaw pull in opposite directions, one demanding race-conscious districts and the other restricting them, which is what you get when law tries to tell a human how to use information the human is allowed to see.

### The rollbacks

In June 2013, [Shelby County v. Holder](https://www.justice.gov/crt/shelby-county-decision) struck down the Section 4(b) coverage formula, so covered jurisdictions no longer needed preclearance absent a separate court order. In 2019, [Rucho v. Common Cause](https://www.law.cornell.edu/supremecourt/text/18-422) held 5-4 that partisan gerrymandering claims are political questions beyond the reach of federal courts, while noting that states and Congress can act. Safeguards built on supervision can be withdrawn by the supervisors.

## What did Louisiana v. Callais actually decide?

Callais did not strike down Section 2 and did not overrule Gingles. On April 29, 2026, a 6-3 Court, in an opinion by Justice Alito, held that Section 2 [imposes liability only on a "strong inference" of intentional discrimination](https://www.supremecourt.gov/opinions/25pdf/24-109_21o3.pdf). Plaintiffs must now offer a race-blind alternative map that still meets all of the state's districting goals, including political ones, prove racially polarized voting with controls for party, and show present-day intent (same opinion). Justice Kagan's dissent says the decision [renders Section 2 "all but a dead letter."](https://www.supremecourt.gov/opinions/25pdf/24-109_21o3.pdf) The opinion also says Section 2 does not stop states from drawing districts on nonracial grounds, including partisan advantage.

The argument turns on intent. The main remaining federal safeguard polices intent. A rule that never receives race or party data cannot have discriminatory intent, because intent requires an intender. A human mapmaker can always be accused of intent and must always defend against it. A published procedure handed only population and geography has nothing to accuse.

### The aftermath

Human-drawn maps moved fast once the constraint loosened, and the Louisiana and Alabama sequences in the record below show how. The Court also [vacated and remanded](https://campaignlegal.org/press-releases/supreme-court-sends-voting-rights-case-back-eighth-circuit) the North Dakota Turtle Mountain case on May 18, 2026. Per a [secondary tracker](https://en.wikipedia.org/wiki/2025%E2%80%932026_United_States_redistricting), Florida passed a new map May 4 and Tennessee passed one May 7 that splits Memphis's majority-Black district.

## The ping-pong record

Leaving humans in the loop produces endless reversal. Maps are drawn, struck, redrawn and reinstated, and each settlement lasts only until the next majority or the next court arrives. The dates below come from the Loyola Law School tracker and the linked sources. First, maps drawn by legislatures and politician-led commissions.

- **Louisiana.** In 2022 a federal judge in Robinson found the legislature's map, with one majority-Black district of six, [likely violated Section 2](https://redistricting.lls.edu/state/louisiana/). In January 2024 the legislature passed SB8 with a second majority-Black district. A three-judge court held SB8 an unconstitutional racial gerrymander, the Supreme Court agreed in Callais on April 29, 2026, and SB 121 [removed the district](https://www.opb.org/article/2026/05/29/louisiana-s-new-voting-map-drops-a-majority-black-district/) a month later.
- **Alabama.** After Milligan (June 2023), the legislature [passed a new map](https://redistricting.lls.edu/state/alabama/) that a federal court rejected in September 2023, and the court adopted a special master's map on October 5. In 2025 the trial court found the 2023 map violated Section 2 and was enacted with discriminatory intent. On May 11, 2026, the Supreme Court [vacated and remanded](https://www.scotusblog.com/cases/allen-v-milligan-2/) in light of Callais. The trial court again found intentional discrimination on May 26, and on June 2 the Court [stayed that ruling](https://www.aclu.org/press-releases/supreme-court-reinstates-racially-discriminatory-map-for-alabamas-2026-congressional-elections), letting Alabama use its 2023 map.
- **North Carolina.** By my count from the [tracker](https://redistricting.lls.edu/state/north-carolina/), the state used at least six congressional maps across 2012 to 2026. The state supreme court struck the 2021 map in Harper v. Hall on February 4, 2022, and reversed Harper on April 28, 2023, holding partisan-gerrymandering claims beyond state courts' reach. The legislature revised the map again mid-decade in October 2025.
- **Ohio.** Voters approved a commission process in 2018. In 2022 the Ohio Supreme Court [struck the legislative maps five times](https://redistricting.lls.edu/state/ohio/), yet maps it had rejected were used anyway because of federal court intervention and implementation deadlines. The commission adopted a new congressional map on October 31, 2025.

Now the commission and court cases.

- **New York.** In 2021 the commission deadlocked and submitted two competing plans, and the legislature rejected both. The state's highest court [invalidated the legislature's maps](https://redistricting.lls.edu/state/new-york/) on April 27, 2022, and a court-ordered map was used. In February 2024 the legislature rejected the commission's submission and passed its own plan the same day.
- **Virginia.** The 2021 commission [deadlocked](https://redistricting.lls.edu/state/virginia/) and the state supreme court adopted maps on December 28, 2021. Voters approved a mid-decade referendum on April 21, 2026, and the court [struck it down 4-3](https://cardinalnews.org/2026/05/08/supreme-court-of-virginia-voids-redistricting-election-as-unconstitutional/) on May 8.
- **Utah.** Voters passed a commission in 2018, and the legislature made it advisory in 2020. In August 2025 a court [voided that change and struck the 2021 map](https://redistricting.lls.edu/state/utah/). The legislature passed two replacements on October 6, and the court enjoined both on November 10 and imposed the plaintiffs' map.

Every settlement is provisional because a human drew it and another human, with different incentives, can redraw it. Courts can stop a map. They cannot stop the next one.

## Voters across parties oppose it

On the principle, this is not a partisan issue. In an April 2026 Economist/YouGov poll, [71 percent said states should not be allowed to draw congressional districts that intentionally favor one party](https://yougov.com/en-us/articles/54644-most-americans-say-partisan-gerrymandering-should-not-be-allowed-april-24-27-2026-economist-yougov-poll), and only 7 percent said they should. By party, Democrats were at 74 percent, Independents at 70 and Republicans at 69. That is roughly 7 in 10 of every group, and no group was above 11 percent in favor, per the [poll's crosstabs](https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_Ty7ikPd.pdf). About a fifth were unsure.

**Voters should pick their politicians. Not the other way around.**

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

The three bars are nearly the same length: opposition does not depend on party, until the question becomes whose map it is.

Support narrows when the question is a specific map: [66 percent of Republicans approved of the Texas plan and 6 percent of Democrats](https://yougov.com/en-us/articles/52756-few-americans-support-texas-republicans-redistricting-plan-gerrymandering-opinions-split-democratic-lawmakers-move-stop-it-poll). Claassen, Ensley and Ryan ran two survey experiments on election-administration tactics (not gerrymandering) and found that [about 80 percent of respondents condemned the other party's misconduct, while large majorities of partisans failed to see a problem with their own party's](https://link.springer.com/article/10.1007/s11109-024-09990-2). Everyone hates it when the other side does it. A map drawn by a person is always read as the work of that person's side. Only a process neither side can steer can be accepted by both.

## Independent commissions are still a human patch

Commissions move the pen to different hands. They do not remove it. A commissioner still knows party, race and where voters live, so a commission is another rule introduced to work around the problem, and it brings its own costs.

### Time and money

California's commission spent about $14.1 million: [$10.97 million through the adopted maps and $3.13 million afterward](https://wedrawthelines.ca.gov/wp-content/uploads/sites/64/2023/05/mh-2023-05-12-DraftReportToLeg.pdf) (my sum of the two official totals), over about 16 months from a fully formed commission to certified maps. Arizona's spent [$8.07 million through June 2024](https://azjlbc.gov/25AR/irc.pdf). Michigan's legislature [added $2.2 million for the commission's legal costs](https://www.legislature.mi.gov/documents/2021-2022/billanalysis/House/pdf/2021-HLA-5797-8CD1B53A.pdf), and the Agee case ended with [about $1.71 million in fees owed to the plaintiffs' side](https://www.legalnews.com/Home/Articles?DataId=1546733) plus $100,000 for the Senate remedial phase.

### Who decides whether members are truly independent?

Nobody can settle that in advance. CalMatters found [public commenters in California who testified as a "small business owner" and a "labor organizer"](https://calmatters.org/politics/2021/09/california-congressional-districts-hidden-partisanship/) were, respectively, a Republican congressional candidate and the chair of the Orange County Democratic Party, and commission rules do not require disclosing party. In Arizona the governor [removed the commission's chair](https://www.swlaw.com/publication/legal-alert-arizona-supreme-court-reinstates-independent-redistricting-commission-chair/) on November 1, 2011, and the state supreme court ordered her reinstated on November 17. In New York and Virginia the commissions deadlocked and others drew the maps. In Michigan, a three-judge federal court in Agee v. Benson [held on December 21, 2023](https://caselaw.findlaw.com/court/us-dis-crt-w-d-mic-sou-div/115708815.html) that the commission drew 13 Detroit-area legislative districts, seven House and six Senate, predominantly by race. A [New America review](https://www.newamerica.org/political-reform/reports/what-we-know-about-redistricting-and-redistricting-reform/can-commissions-make-districting-fairer/) finds commissions deliver modest, not transformative, gains.

Even rule-bound bodies keep discretion. The [Boundary Commission for England](https://boundarycommissionforengland.independent.gov.uk/2023-review/guide-to-the-2023-review-of-parliamentary-constituencies/page/3/) keeps constituencies within 5 percent of an electoral quota of 73,393, and [Canada uses ten provincial commissions](https://www.elections.ca/content.aspx?section=res&dir=cir%2Fred%2Ffaq&document=index&lang=e) of three members each, chaired by a judge. Both still weigh local ties, so judgment remains.

## The simple fix: Fair House Maps and shortest splitline

The principle is that the simplest design with the fewest inputs is best. Every input is a place where bias can enter, so the rule takes two things, population and geography, and runs three fixed steps. Warren D. Smith [published the shortest splitline method on RangeVoting.org](https://rangevoting.org/Splitlining.html), and Fair House Maps builds on it for all 50 states and 435 seats.

### What goes in, and what never does

For each 2020 Census block: its population count, its polygon, and an internal point used only to order blocks across a guide line. Plus the number of House seats each state received in the 2020 apportionment. That is all.

It never reads party registration, election results, incumbent addresses, race or ethnicity data, or county and city boundaries. Counties are counted afterward, for reporting only, and the 119th Congress lines appear in the viewer for comparison and are never an input. The tool cannot use what it never receives.

### The three steps in plain language

1. **Cut.** A state needing seven seats splits them into three and four. The rule tests 1,800 straight guide lines, one every 0.1 degree across 180 degrees. For each line, blocks are placed by distance from it and population accumulates until one side holds its share of seats. Among lines that leave each side as one connected piece, the one with the shortest real border wins. Then it repeats on each side until every piece has one seat. A state with N seats takes exactly N minus 1 cuts.
2. **Keep blocks whole.** Census blocks are never split. Stray isolated groups join the surrounding side, and any line that strands a piece is rejected so the next shortest is tried.
3. **Balance.** The rule finds the district furthest from the ideal population, then moves one border block to a neighbor if that strictly narrows the gap and keeps the source district connected. It repeats until no move helps, so it always stops.

### Simplicity you can audit

There are no knobs, no random numbers and no seeds. Every tie is broken by a fixed order. The core logic is about 780 lines of TypeScript, roughly 690 for the cut and 88 for the balance, plus about 500 lines of deterministic math. JavaScript engines compute trigonometry slightly differently, so the project uses fdlibm routines instead, and golden IEEE 754 bit-pattern tests lock the results.

Every state publishes a SHA-256 fingerprint of its final block assignment and a SHA-256 of the Census input file, plus its full cut sequence and a ledger of every block moved in balancing. Anyone can rerun a state and match the fingerprint. To reproduce one, clone the [public repository](https://github.com/mels0n/str-redistricting) and run \`npm install && npm run explore -- --states CO\`.

### The numbers

The run covers 50 of 50 states, 435 seats and 8,126,956 census blocks. After balancing, the widest population range is New York at 31 people across 26 seats. Florida is 29, Texas 20, California 12 and Colorado 3, and every other state falls between 0 and 13. Colorado shows the balancing step at work: a range of 361 people before balancing, 3 after, in 20 moves, with all eight districts contiguous. The [viewer](https://fairmaps.melson.us) lets you look up your district by address and replay every cut.

## What this approach gives up

Four trade-offs, and the project states them.

### County and city splits

Colorado splits 21 of its 64 counties and Texas splits 108 of 254.

### No communities-of-interest allowance

A communities-of-interest allowance is another human-judgment input. Someone has to decide what counts as a community, who belongs to it and which one wins when two conflict. That decision is the door bias walks through, so the rule leaves it shut.

### Greedy balancing

The balance step moves single blocks and is not globally optimal.

### A fixed angle step

The 0.1 degree step is part of the recipe. A different step would draw a different, equally rule-bound map.

Humans still choose the rule. The difference is that they choose it once, in public, before anyone can aim it at a particular district, and anyone can rerun it and see what it does.

### The Voting Rights Act

The standard critique is that race-blind maps can reduce minority representation, and a rule that ignores race can produce fewer majority-minority districts than one that targets them. The answer is in the Callais section above: the surviving protection polices intent, and a rule that never receives race has none to police. Race-conscious remedies were always one human adjusting for race to repair another's adjustment.

### Geography

Urban clustering can skew results under any neutral rule: Chen and Rodden's [research on unintentional gerrymandering](https://web.stanford.edu/~jrodden/wp/florida.pdf) found that concentrated Democratic voters can expect under half the seats at half the votes in many states. The difference is that nobody chose it.

## Where do you go from here?

Look up your own district at [Fair House Maps](https://fairmaps.melson.us), compare it with your current one, and read the "How it works" page. Then pick a state, rerun it from the [GitHub repository](https://github.com/mels0n/str-redistricting) and check that your fingerprint matches the published one.

It is the same principle as the [approval-gate model for AI agents](/guide/operational-architecture/blog/governing-ai-agents-approval-gate-model): bound discretion and make every decision auditable. A rule nobody can tune beats discretion everyone suspects.

## Frequently Asked Questions

### How do you end gerrymandering?

You remove the human from the drawing step. Every safeguard so far, from one person one vote to commissions, supervises a mapmaker who knows party, race and incumbents. A published procedure that receives only population and geography cannot favor anyone, and anyone can rerun it and match its SHA-256 fingerprint.

### What is the shortest splitline algorithm?

It is a method for drawing equal-population districts by repeatedly cutting a region with the shortest straight split that divides its population in the right ratio. Warren D. Smith published the idea on RangeVoting.org. Fair House Maps builds on it with 2020 Census blocks, a fixed balancing step and a published fingerprint for each state.

### Is gerrymandering legal in the United States?

Partisan gerrymandering is not reviewable in federal court after Rucho v. Common Cause (2019), though states and Congress can act. Federal racial-discrimination claims survive after Louisiana v. Callais (2026), but only on a strong inference of intentional discrimination. The legal picture varies by state.

### Do independent redistricting commissions work better than legislatures?

Commissions change who draws but still leave a human who knows party, race and incumbents, so they are another workaround rather than a removal of the problem. They cost time and money, about $14.1 million in California and about $8 million in Arizona, and they deadlock, get sued and face questions about who is truly independent. Research finds modest gains, not transformation.

### Can a race-blind rule draw fair districts after the Voting Rights Act changed?

Yes, and Louisiana v. Callais strengthens the case. Section 2 now reaches only a strong inference of intentional discrimination, and a rule that never receives race or party data cannot have intent, because intent requires an intender. Critics note race-blind maps can produce fewer majority-minority districts, but the protection that once justified race-conscious drawing has been narrowed to a test only a human mapmaker can fail.

### How can I check the Fair House Maps map for my district?

Open fairmaps.melson.us, pick your state, and look up your district by address, then compare it with your current district side by side. To verify the map itself, clone the public repository and rerun the state with npm run explore. The output should match the published SHA-256 fingerprint exactly.

---

### Works Cited

- [1] YouGov. "Most Americans say partisan gerrymandering should not be allowed (April 24-27, 2026 Economist/YouGov poll)." YouGov, 2026. [yougov.com](https://yougov.com/en-us/articles/54644-most-americans-say-partisan-gerrymandering-should-not-be-allowed-april-24-27-2026-economist-yougov-poll)
- [2] Economist/YouGov. "Poll crosstabs, April 24-27, 2026." YouGov, 2026. [cloudfront.net](https://d3nkl3psvxxpe9.cloudfront.net/documents/econTabReport_Ty7ikPd.pdf)
- [3] YouGov. "Few Americans support Texas Republicans' redistricting plan." YouGov, 2025. [yougov.com](https://yougov.com/en-us/articles/52756-few-americans-support-texas-republicans-redistricting-plan-gerrymandering-opinions-split-democratic-lawmakers-move-stop-it-poll)
- [4] Claassen, Ensley, and Ryan. "Do Fans Make Poor Referees? Exploring Citizens' Reactions to Partisan Gamesmanship." Political Behavior, Springer, 2024. [springer.com](https://link.springer.com/article/10.1007/s11109-024-09990-2)
- [5] Legal Information Institute. "Gill v. Whitford, No. 16-1161." Cornell Law School, 2018. [law.cornell.edu](https://www.law.cornell.edu/supct/cert/16-1161)
- [6] Brennan Center for Justice. "Faceoff Starts in Wisconsin Partisan Gerrymandering Case." Brennan Center, 2017. [brennancenter.org](https://www.brennancenter.org/blog/faceoff-starts-wisconsin-partisan-gerrymandering-case)
- [7] FairVote. "House Elections Are Broken." FairVote, 2025. [fairvote.org](https://fairvote.org/press/house-elections-broken-release-2025/)
- [8] Legal Information Institute. "Wesberry v. Sanders, 376 U.S. 1 (1964)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/376/1)
- [9] Legal Information Institute. "Reynolds v. Sims, 377 U.S. 533 (1964)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/377/533)
- [10] National Archives. "Voting Rights Act (1965)." U.S. National Archives, 1965. [archives.gov](https://www.archives.gov/milestone-documents/voting-rights-act)
- [11] Legal Information Institute. "Thornburg v. Gingles, 478 U.S. 30 (1986)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/478/30)
- [12] Legal Information Institute. "Shaw v. Reno, 509 U.S. 630 (1993)." Cornell Law School. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/509/630)
- [13] U.S. Department of Justice. "Shelby County Decision." Civil Rights Division, 2013. [justice.gov](https://www.justice.gov/crt/shelby-county-decision)
- [14] Legal Information Institute. "Rucho v. Common Cause, No. 18-422." Cornell Law School, 2019. [law.cornell.edu](https://www.law.cornell.edu/supremecourt/text/18-422)
- [15] Supreme Court of the United States. "Louisiana v. Callais, Nos. 24-109 and 24-110, slip opinion." Supreme Court, 2026. [supremecourt.gov](https://www.supremecourt.gov/opinions/25pdf/24-109_21o3.pdf)
- [16] Loyola Law School. "All About Redistricting: Louisiana." Loyola Law School. [redistricting.lls.edu](https://redistricting.lls.edu/state/louisiana/)
- [17] OPB. "Louisiana's new voting map drops a majority-Black district." OPB, 2026. [opb.org](https://www.opb.org/article/2026/05/29/louisiana-s-new-voting-map-drops-a-majority-black-district/)
- [18] Loyola Law School. "All About Redistricting: Alabama." Loyola Law School. [redistricting.lls.edu](https://redistricting.lls.edu/state/alabama/)
- [19] SCOTUSblog. "Allen v. Milligan (No. 25-274)." SCOTUSblog, 2026. [scotusblog.com](https://www.scotusblog.com/cases/allen-v-milligan-2/)
- [20] ACLU. "Supreme Court reinstates racially discriminatory map for Alabama's 2026 congressional elections." ACLU, 2026. [aclu.org](https://www.aclu.org/press-releases/supreme-court-reinstates-racially-discriminatory-map-for-alabamas-2026-congressional-elections)
- [21] Campaign Legal Center. "Supreme Court sends voting rights case back to the Eighth Circuit." Campaign Legal Center, 2026. [campaignlegal.org](https://campaignlegal.org/press-releases/supreme-court-sends-voting-rights-case-back-eighth-circuit)
- [22] Wikipedia. "2025-2026 United States redistricting." Wikimedia Foundation, 2026. [wikipedia.org](https://en.wikipedia.org/wiki/2025%E2%80%932026_United_States_redistricting)
- [23] Loyola Law School. "All About Redistricting: North Carolina." Loyola Law School. [redistricting.lls.edu](https://redistricting.lls.edu/state/north-carolina/)
- [24] Loyola Law School. "All About Redistricting: Ohio." Loyola Law School. [redistricting.lls.edu](https://redistricting.lls.edu/state/ohio/)
- [25] Loyola Law School. "All About Redistricting: New York." Loyola Law School. [redistricting.lls.edu](https://redistricting.lls.edu/state/new-york/)
- [26] Loyola Law School. "All About Redistricting: Virginia." Loyola Law School. [redistricting.lls.edu](https://redistricting.lls.edu/state/virginia/)
- [27] Cardinal News. "Supreme Court of Virginia voids redistricting election as unconstitutional." Cardinal News, 2026. [cardinalnews.org](https://cardinalnews.org/2026/05/08/supreme-court-of-virginia-voids-redistricting-election-as-unconstitutional/)
- [28] Snell & Wilmer. "Arizona Supreme Court reinstates Independent Redistricting Commission chair." Snell & Wilmer, 2011. [swlaw.com](https://www.swlaw.com/publication/legal-alert-arizona-supreme-court-reinstates-independent-redistricting-commission-chair/)
- [29] FindLaw. "Agee v. Benson (W.D. Mich.)." FindLaw. [findlaw.com](https://caselaw.findlaw.com/court/us-dis-crt-w-d-mic-sou-div/115708815.html)
- [30] Loyola Law School. "All About Redistricting: Utah." Loyola Law School. [redistricting.lls.edu](https://redistricting.lls.edu/state/utah/)
- [31] California Citizens Redistricting Commission. "Costs for Redrawing Districts, FY 2020/21 to 2022/23 (draft report to the Legislature)." State of California, 2023. [wedrawthelines.ca.gov](https://wedrawthelines.ca.gov/wp-content/uploads/sites/64/2023/05/mh-2023-05-12-DraftReportToLeg.pdf)
- [32] Arizona Joint Legislative Budget Committee. "FY 2025 Appropriations Report: Independent Redistricting Commission." Arizona Legislature, 2024. [azjlbc.gov](https://azjlbc.gov/25AR/irc.pdf)
- [33] Michigan House Fiscal Agency. "Bill analysis, 2021-HLA-5797." Michigan Legislature, 2022. [legislature.mi.gov](https://www.legislature.mi.gov/documents/2021-2022/billanalysis/House/pdf/2021-HLA-5797-8CD1B53A.pdf)
- [34] Legal News. "Agee v. Benson attorney fee settlement." Legal News. [legalnews.com](https://www.legalnews.com/Home/Articles?DataId=1546733)
- [35] CalMatters. "Hidden partisanship in California's congressional district process." CalMatters, 2021. [calmatters.org](https://calmatters.org/politics/2021/09/california-congressional-districts-hidden-partisanship/)
- [36] New America. "Can Commissions Make Districting Fairer?" New America. [newamerica.org](https://www.newamerica.org/political-reform/reports/what-we-know-about-redistricting-and-redistricting-reform/can-commissions-make-districting-fairer/)
- [37] Boundary Commission for England. "Guide to the 2023 Review of Parliamentary Constituencies." Boundary Commission for England, 2023. [boundarycommissionforengland.independent.gov.uk](https://boundarycommissionforengland.independent.gov.uk/2023-review/guide-to-the-2023-review-of-parliamentary-constituencies/page/3/)
- [38] Elections Canada. "Electoral Boundaries Readjustment FAQ." Elections Canada. [elections.ca](https://www.elections.ca/content.aspx?section=res&dir=cir%2Fred%2Ffaq&document=index&lang=e)
- [39] Smith, Warren D. "Splitlining." RangeVoting.org. [rangevoting.org](https://rangevoting.org/Splitlining.html)
- [40] Chen, Jowei; Rodden, Jonathan. "Unintentional Gerrymandering: Political Geography and Electoral Bias in Legislatures." Quarterly Journal of Political Science, 2013. [stanford.edu](https://web.stanford.edu/~jrodden/wp/florida.pdf)
- [41] Melson, Christopher. "str-redistricting (Fair House Maps and Splitline Generator)." GitHub, 2026. [github.com](https://github.com/mels0n/str-redistricting)
`
};
