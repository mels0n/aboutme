import { BlogPost } from "../office_blog_posts";

export const youthSoccerVideoPipelineTraceGotsportJellyfin: BlogPost = {
    id: "youth-soccer-video-pipeline-trace-gotsport-jellyfin",
    slug: "youth-soccer-video-pipeline-trace-gotsport-jellyfin",
    title: "Youth Soccer Game Film in Jellyfin: A Pipeline Layout",
    author: "Christopher Melson",
    role: "Homelab Architect",
    date: "2026-10-22",
    lastUpdated: "2026-10-22",
    ogImage: "/images/blog/youth-soccer-video-pipeline-trace-gotsport-jellyfin-og.jpg",
    summary: "How a nightly job fetches youth soccer game film, matches it to the schedule, and files it in Jellyfin, with one human step for tournaments.",
    polymorphicSummary: {
        executive: "Christopher Melson's youth soccer game film pipeline addresses a narrow but real risk: recordings that a family pays to create sit inside a vendor app, detached from the schedule, and one lapsed subscription away from being hard to reach. The fix is a small always-on homelab node that copies each recording into the family's own Jellyfin library every night. Incremental cost is close to nothing beyond the existing subscription and hardware already running. The decision worth making is where to place human judgment. Letting the pipeline guess the competition for tournament games would quietly produce wrong labels that nobody notices for months, so those games wait for a person to supply one short label. That single checkpoint is deliberate risk control, not a gap in automation. The result is a complete, correctly labeled archive that a parent never has to maintain, with clear notifications whenever something genuinely needs a human to look.",
        strategist: "Christopher Melson's approach to automating youth soccer game film rests on an operating-model choice: automate the deterministic work and keep a person on the one ambiguous decision. Five stages run in sequence, from discovery through filing, and four of them need no attention. The fifth, classifying a game as league or tournament, is where the data sources differ in reliability, because the tournament schedule pages are bot-protected. The trade-off is explicit. A scraper would remove the human but would add a fragile, adversarial dependency, while a pending queue costs a minute of attention per tournament weekend. Sequencing matters too: build the fetch-and-file path first, then schedule matching, then the queue and notifications last. Each layer is useful alone, and the archive is already valuable before the smart parts exist, so each stage can be tested in isolation. Structure and naming conventions were settled on day one because renaming a whole library later is the expensive mistake to avoid.",
        engineer: "Christopher Melson's pipeline runs from a systemd timer using OnCalendar with Persistent set, so a missed night fires after downtime. Each game arrives as two halves that are fetched, then joined into a single file. The game record supplies opponent, date and score. A match against the schedule by date and nearest kickoff time identifies the competition. League games are filed directly, while tournament games land in a small pending-queue file where a person adds an event label before release. Files go into a TV Shows style library, one folder per team, one small sequential season per soccer season, and episodes named SxxEyy - YYYY-MM-DD - vs Opponent with unique episode numbers so Jellyfin never merges items into versions. Notifications cover a missing half, no schedule match, a rejected token and an aging queue. The writer records every filename it produces in a manifest, so later runs never parse names back. Reruns skip already-filed games, and credentials live outside the repo with overlapping tokens for rotation."
    },
    geoHighlights: [
        { label: "Core Argument", value: "A nightly pipeline can file youth soccer game film into Jellyfin automatically if the one ambiguous step, labeling tournament games, stays with a person." },
        { label: "Target Audience", value: "Technical parents and homelab operators who already pay for a game-recording account and run their own Jellyfin server." },
        { label: "Key Insight", value: "Jellyfin behaves predictably when games are episodes named SxxEyy - date - opponent with small sequential season numbers and unique episode numbers, and when the writer records each filename it produces instead of parsing it later." }
    ],
    content: `A nightly job on a homelab node can copy every recorded youth soccer game from the family's camera account into Jellyfin, match it to the schedule, and file it with the right opponent and date, without anyone touching it. The one step that stays manual is labeling tournament games, and that is a design decision, not a shortcoming.

> **Key Takeaways**
> - Four of the five pipeline stages run unattended; only tournament labeling needs a person, by design.
> - Match each game to the schedule by date and nearest kickoff time to learn which competition it belongs to.
> - Name games \`SxxEyy - YYYY-MM-DD - vs Opponent\`, keep season numbers small and episode numbers unique.
> - Record every filename the writer produces instead of parsing names back later.

## What does the pipeline actually do, start to finish?

Five stages run in order: discover new games, fetch and join the two halves, enrich and match to the schedule, classify as league or tournament, and file into Jellyfin. Four run unattended on a timer. Tournament games pause in a small queue until a person adds one label, then the same run completes them.

This is written as a layout, not a tutorial. I am a Homelab Architect by temperament as much as title, and I run this the way I run the rest of my self-hosted stack: small pieces, explicit contracts between them, and a human only where judgment is actually needed. The problem is ordinary. The camera platform, [Trace](https://www.traceup.com/), records games automatically and keeps the film in its own app. The schedule and competition context live in [GotSport](https://home.gotsport.com/scheduling/), which handles scheduling, live scoring and public pages. The family wants every game in its own Jellyfin library, with correct metadata, without a parent doing it by hand every weekend.

### The five stages at a glance

The stages below show where automation runs and where a person sits. Blue stages never need attention. The amber segment is the only human checkpoint, and it applies only to tournament games.

<figure style="margin:1.5rem 0;padding:0;">
<div role="img" aria-label="Four of five pipeline stages run unattended; only tournament labeling needs a person" style="display:grid;gap:8px;">
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">1</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Discover new games <em>(automated, nightly timer)</em></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">2</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Fetch and join the two halves <em>(automated)</em></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">3</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Enrich and match to the schedule <em>(automated)</em></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">4</span><div style="flex:1;display:flex;gap:6px;"><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Classify: league <em>(automated)</em></div><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(245,158,11,0.75);">Classify: tournament <em>(human label)</em></div></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">5</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">File into Jellyfin <em>(automated)</em></div></div>
</div>
<figcaption style="margin-top:8px;font-size:0.875rem;opacity:0.8;">Source: author's pipeline design, 2026. Blue = automated, amber = human review.</figcaption>
</figure>

Automation covers almost the whole path, and the single amber segment is where I deliberately kept a person in the loop.

## How does a nightly job find and assemble new games?

A systemd timer wakes the job each night, asks the family's camera account for recently processed games, and skips anything already filed. Each new game is fetched as two halves and joined into one file.

### Discovery from the account the family already pays for

The trigger is a systemd timer, not cron and not a long-running daemon. Per the [systemd.timer documentation](https://man7.org/linux/man-pages/man5/systemd.timer.5.html), \`OnCalendar=\` defines wall-clock schedules, and \`Persistent=true\` stores the last trigger time on disk so a run missed during downtime fires when the machine returns. The same page documents \`RandomizedDelaySec=\`, which spreads start times so a job does not hit a remote service at an identical second every night.

Discovery itself is deliberately boring: list what the account says is newly processed, compare against what I have already filed, and work only on the difference. A recording is not available until the platform has finished processing it, so a game played in the afternoon may not show up until a later night.

### Two halves, one file

Each game arrives as two halves. I fetch both and join them into a single file before anything else touches it. The [Jellyfin TV Shows documentation](https://jellyfin.org/docs/general/server/media/shows/) describes multi-part episodes through part-style separators, and I would rather hand the server one unambiguous episode than rely on it stitching parts together. One game, one file, one library item.

If only one half exists, the run does not file a partial game. It marks the game as incomplete, notifies me, and tries again the next night. A half-game in the library is worse than a missing one, because nobody notices it is half until someone goes looking for the second period.

## How is each game matched to a competition?

The game record supplies opponent, date and score. The pipeline then looks up the team's schedule and picks the entry with the same date and the nearest kickoff time. That entry reveals whether the game was a league match or part of a tournament, which decides how the file is handled.

### Enrichment from the game record

The camera platform already knows who the game was against, when it was played and how it ended. I treat that record as the source of truth for opponent, date and score and do not try to improve on it. Everything downstream, from the episode title to the notification text, is built from those fields.

### Matching to the schedule by date and nearest kickoff

Youth schedules are messy. Kickoff times shift, and a team can play twice in a day during a tournament. Matching on date alone would misfire on double-header days, and matching on exact time would miss every game that started ten minutes late. So the rule is two-step: filter the schedule to the game's date, then choose the entry whose kickoff is nearest the recorded start.

When the match is clear, the game inherits its competition and moves on. When it is not, because no entry exists for that date or two entries sit almost equally close, the pipeline does not guess. It routes the game to the human step and says why. A wrong automatic label is more expensive than a short wait, since a mislabeled game sits quietly in the library and looks correct.

## Why do tournament games need a human?

League games resolve cleanly from the schedule, so they file themselves. GotSport's tournament schedule pages are bot-protected, which means the pipeline cannot reliably learn the event automatically. Rather than build around that protection, I park those games in a small queue file where a person adds the event label and releases them.

### League games file themselves

For league games the schedule match is enough. The competition is known, the season is known, and the filing stage takes over with no prompt to me.

### The pending queue: one small file, one label, then release

Tournament games go into a pending queue, a small plain file with one entry per waiting game. Each entry already carries everything the pipeline knows: opponent, date, score, the joined video. The only blank is the event label. I fill it in, mark the entry released, and the next run files the game like any other.

I want to be direct about why this exists. The pages that would answer the question automatically are protected against bots, and I consider that a boundary to respect, not a puzzle to solve. The honest design is to acknowledge the limit and put a person at that one point. The cost is a minute or two after a tournament weekend. The benefit is that the archive never contains a confident wrong answer.

The queue has one more job: it ages. If an entry sits unreleased for too long, I get a notification, so a forgotten tournament does not become a permanent hole.

## How should games be named and filed so Jellyfin behaves?

Use a TV Shows style library: one folder per team, one season per soccer season, and each game an episode named \`SxxEyy - YYYY-MM-DD - vs Opponent\`. Keep season numbers small and sequential, and make every episode number unique. Games then sort chronologically and show opponent and date in the interface.

### One folder per team, one season per soccer season

The [Jellyfin TV Shows documentation](https://jellyfin.org/docs/general/server/media/shows/) asks for season folders named with a number, recommends zero-padding, and describes episodes as \`SxxEyy\`. Each team is a show, each soccer season a season, each game an episode. A parent browsing the library sees a team, opens a season, and scrolls through games in order.

### Why never the year as the season number

It is tempting to use the calendar year as the season number. I would not. The Jellyfin documentation does not describe year-based seasons, and in my own library very large season numbers, in the 200-plus range, were treated as malformed. That is my observation, not documented behavior, so treat it as a caution and not a rule. Small sequential numbers have never given me trouble, and a soccer season that straddles two calendar years makes the year a poor key anyway.

The second trap is versions. Jellyfin supports multiple versions of the same item, and per the [Jellyfin Movies documentation](https://jellyfin.org/docs/general/server/media/movies/), files that share one base name are grouped as versions of a single item. In my own Jellyfin library I saw the same thing happen to episodes that shared an episode number, and to same-date items. A double-header, or two games on one tournament Saturday, is exactly the case that triggers it. The defense is boring: give every game its own episode number within the season, and never let two files share one.

### Episode pattern and why a TV Shows library

The pattern is \`SxxEyy - YYYY-MM-DD - vs Opponent\`. Season and episode come first because that is what the scanner reads. The date and opponent follow as title text, so the interface shows them and the episode number still gives a stable sort. Episode numbers come from order of play within the season, not from any external identifier, which keeps them unique by construction.

I chose a TV Shows library over a flat home-videos layout because the season and episode structure is the feature. It gives grouping by season, chronological order and a clean per-team view with no custom views to maintain.

## What makes the nightly run safe to leave alone?

Four habits: skip anything already filed, record every filename the writer produced rather than parsing names later, keep credentials outside the repo with overlapping tokens for rotation, and make each failure mode visible through a notification. A pipeline you trust is one that tells you when it cannot do its job.

### Idempotency: skip already-filed games

Every run starts by comparing what the account offers against what has been filed and proceeds only with the difference. Idempotency is what lets the timer's catch-up behavior be safe rather than dangerous.

### Derive, never reconstruct: the writer records every filename

The writer records every filename it produces, along with the game it belongs to, in a manifest. When a later step needs to know where a game went, it reads the manifest. It never parses a filename back into opponent, date or episode number.

Reconstructing from convention works right up to the first opponent whose name contains a dash, an apostrophe or a number, and then it fails in a way that is hard to trace.

### Credentials outside the repo, overlapping tokens for rotation

Credentials live outside the repo, and I will not say more than that. The design point worth sharing is overlap: when a token is about to expire, I bring the replacement online while the old one is still valid, so rotation never creates a gap where a nightly run fails. If you have read my notes on [homelab firewall posture](/guide/operational-architecture/blog/unifi-firewall-enough-homelab-security), the principle is the same. Assume credentials change, and design so a change is routine.

### Failure modes and notifications

I track four failures, each with a notification that says what happened and what to do:

- A missing half: one of the two recordings has not appeared yet. The game is held and retried.
- No schedule match: no entry for that date, or an ambiguous one. The game goes to the pending queue.
- An expired or rejected token: the run stops early and tells me, instead of reporting an empty night as success.
- An aging pending queue: a waiting entry has sat unlabeled too long.

The third one matters most. A run that silently finds nothing because it could not authenticate looks identical to a quiet week. Distinguishing "nothing new" from "could not look" is most of what monitoring means here.

## What are the trade-offs of this design?

The design trades a little convenience for trustworthiness. A person handles tournament labels, games can appear a day after they are played, and the layout is tied to a TV Shows library. In return, nothing is mislabeled, nothing is filed twice, and the archive stays correct with almost no maintenance.

The human step is the obvious cost, and I accept it. The less obvious one is that naming is a commitment. Changing the season convention after a few years of games means touching every file and every manifest entry, which is why I fixed the pattern before filing the first game.

The infrastructure side is light. It needs a node that is usually on, enough storage for video and a Jellyfin server. If you are building the serving side from scratch, my [Jellyfin Live TV setup with Dispatcharr](/guide/operational-architecture/blog/jellyfin-live-tv-dispatcharr-antenna-cable-dvr) covers the server end, and my write-up on [macvlan in Docker Swarm](/guide/operational-architecture/blog/macvlan-docker-swarm-networking-deep-dive) explains how I give containerized services their own network identity. Neither is required for this pipeline. The ingest job only needs somewhere to write files that Jellyfin can read.

What I would tell another builder is to start with the two boring stages, fetch and file, and get naming right. Add schedule matching next and the pending queue after that. The archive is useful long before the smart parts exist, and the smart parts are far easier to trust once the boring ones have run for a month without surprises.

## Frequently Asked Questions

### How do I get youth soccer game video into Jellyfin automatically?

Run a scheduled job on a homelab machine that fetches new recordings from the account your family already pays for, joins any split files, and writes them into a Jellyfin TV Shows library with a consistent naming pattern. A systemd timer with catch-up enabled makes the job survive downtime. Add a notification path so failures are visible rather than silent.

### Can Jellyfin show the opponent and date for each game?

Yes, if you treat each game as an episode and put both in the episode title, such as SxxEyy - YYYY-MM-DD - vs Opponent. Jellyfin reads the season and episode numbers from the SxxEyy part and shows the rest as the title. Sorting by episode number then gives you chronological order.

### Why not use the year as the season number for sports in Jellyfin?

Jellyfin's documentation asks for season folders with a number but does not describe year-based seasons. In my own library, very large season numbers (200 and above) were treated as malformed, so I use small sequential numbers, one per soccer season. That observation is mine, not documented Jellyfin behavior.

### Why do some tournament games need manual labeling?

League games can be matched to a schedule automatically, but the pages that describe tournament schedules are bot-protected. Rather than fight that protection, the pipeline parks tournament games in a small queue file where a person types the event label and releases them. It costs seconds per event and avoids guessing.

### How do you keep a nightly video job from filing the same game twice?

The writer records every filename it produces, along with the game it came from, in a manifest. Each run checks the manifest before fetching anything and skips games already filed. Because the manifest is written at filing time, the job never has to reconstruct or parse names back.

### Do I need a Home Videos library for game film?

No. A TV Shows library gives you season and episode structure, which is what makes games sort chronologically and group by season. A Home Videos library is a flatter structure. The TV Shows layout was the better fit for me, though either can work depending on how you browse.

---

### Works Cited

- [1] Jellyfin. "TV Shows." Jellyfin Docs, 2026. [jellyfin.org](https://jellyfin.org/docs/general/server/media/shows/)
- [2] Jellyfin. "Movies" (Multiple Versions naming). Jellyfin Docs, 2026. [jellyfin.org](https://jellyfin.org/docs/general/server/media/movies/)
- [3] systemd. "systemd.timer(5)." Linux man-pages, man7.org, 2026. [man7.org](https://man7.org/linux/man-pages/man5/systemd.timer.5.html)
- [4] Trace. "Trace: automatic game recording." Trace, 2026. [traceup.com](https://www.traceup.com/)
- [5] GotSport. "Scheduling & Game-Day Tools." GotSport, 2026. [home.gotsport.com](https://home.gotsport.com/scheduling/)
`
};
