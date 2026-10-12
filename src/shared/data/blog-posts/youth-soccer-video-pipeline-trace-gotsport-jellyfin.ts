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
    summary: "A nightly pipeline that files youth soccer game film into Jellyfin, matched to the team's GotSport history, what broke in production, and why AI builds it but never runs it.",
    polymorphicSummary: {
        executive: "Christopher Melson's youth soccer game film pipeline addresses a narrow but real risk: recordings that a family pays to create sit inside a vendor app, detached from the schedule, and one lapsed subscription away from being hard to reach. The fix is a small always-on homelab node that copies each recording into the family's own Jellyfin library every night. Incremental cost is small: the existing subscription plus a node that is usually on. The decision worth making is where to place human judgment. Letting the pipeline guess the competition would quietly produce wrong labels that nobody notices for months, so it reads the team's public match history on GotSport, which lists league and tournament games alike, and files each game under the right event automatically. Only games missing from that history, such as friendlies, wait for a person to supply one short label. That single checkpoint is deliberate risk control, not a gap in automation. The result is a complete, correctly labeled archive that a parent never has to maintain, with clear notifications whenever something genuinely needs a human to look.",
        strategist: "Christopher Melson's approach to automating youth soccer game film rests on an operating-model choice: automate the deterministic work and keep a person on the one ambiguous decision. Five stages run in sequence, from discovery through filing, and all of them run without attention for any game the team's public match history on GotSport lists, league or tournament. Classification is where the data sources differ in reliability, so the pipeline treats that history as its authority. The trade-off is explicit. Games that appear nowhere on GotSport, such as friendlies and scrimmages, have no authoritative source, so any automatic label would be a guess, while a small pending queue costs a minute of attention now and then. Earlier versions needed manual tournament labels; switching the lookup to the team's own match history removed that step. Sequencing matters too: build the fetch-and-file path first, then schedule matching, then the queue and notifications last. Each layer is useful alone, and the archive is already valuable before the smart parts exist, so each stage can be tested in isolation. Structure and naming conventions are worth settling before the first game is filed, because renaming a whole library later is the expensive mistake, one Melson made himself when he renumbered 132 files after a media-server change. AI sits on the build side only: coding agents wrote and debug the pipeline, and no model makes a run-time decision about the family archive.",
        engineer: "Christopher Melson's pipeline runs from a systemd timer using OnCalendar with Persistent set, so a missed night fires after downtime. Each game arrives as two halves that are fetched, then joined into a single file. The game record supplies opponent, date and score. The pipeline reads the team's public match history on GotSport, which lists every league and tournament match with its event name, and matches each game by date and nearest kickoff time to identify the competition. Matched games are filed directly under the event name, while games absent from GotSport, such as friendlies and scrimmages, land in a small pending-queue file where a person adds a label before release. Files go into a TV Shows style library, one folder per team, one small sequential season per soccer season, and episodes named SxxEyy - YYYY-MM-DD - vs Opponent with unique episode numbers so Jellyfin never merges items into versions. Notifications cover a missing half, no match-history entry, a rejected token and an aging queue. The writer records every filename it produces in a manifest, so later runs never parse names back. Reruns skip already-filed games, and credentials live outside the repo with overlapping tokens for rotation. Production surfaced edge failures that no unit test caught: a per-game storage prefix the code had hardcoded, an upstream list that began returning 401, and a Jellyfin 12.1 parser that rejects season numbers from 200 to 1927 or above 2500. AI coding agents built the pipeline and diagnosed those failures from third-party source, while run-time classification stays deterministic code."
    },
    geoHighlights: [
        { label: "Core Argument", value: "A nightly pipeline can file youth soccer game film into Jellyfin automatically, league and tournament games alike, because the team's public match history on GotSport supplies the competition, and only games missing from it go to a person." },
        { label: "Target Audience", value: "Technical parents and homelab operators who already pay for a game-recording account and run their own Jellyfin server." },
        { label: "Key Insight", value: "Jellyfin behaves predictably when games are episodes named SxxEyy - date - opponent with small sequential season numbers and unique episode numbers, and when the writer records each filename it produces instead of parsing it later." },
        { label: "AI Boundary", value: "AI coding agents built the pipeline and diagnose its failures by reading third-party code, but no model makes run-time decisions: classification is deterministic code on date and kickoff time, and unplaceable games go to a person." }
    ],
    content: `A nightly job on a homelab node can copy every recorded youth soccer game from the family's camera account into Jellyfin, match it to the team's public match history on GotSport, and file it with the right opponent, date and event, without anyone touching it. League and tournament games both file themselves. The one step that stays manual is labeling games that do not appear on GotSport at all, such as friendlies, and that is a deliberate design decision.

> **Key Takeaways**
> - Every pipeline stage runs unattended for games on GotSport, league and tournament alike; only games missing from it, such as friendlies, need a person, by design.
> - Match each game to the team's public match history by date and nearest kickoff time to learn which event it belongs to.
> - Name games \`SxxEyy - YYYY-MM-DD - vs Opponent\`, keep season numbers small and episode numbers unique.
> - Record every filename the writer produces instead of parsing names back later.
> - In production, every failure came from the edges: per-game storage paths, an upstream site changing its rules, and Jellyfin's parser.
> - AI coding agents built and debug the pipeline; no model runs inside it, by design.

## What does the pipeline actually do, start to finish?

Five stages run in order: discover new games, fetch and join the two halves, enrich and match to the team's match history, classify as league or tournament, and file into Jellyfin. All five run unattended on a timer for games that appear on GotSport. A game that does not appear there pauses in a small queue until a person adds one label, then the same run completes it.

This is written as a layout, not a tutorial. I am a Homelab Architect by temperament as much as title, and I run this the way I run the rest of my self-hosted stack: small pieces, explicit contracts between them, and a human only where judgment is actually needed. The problem is ordinary. The camera platform, [Trace](https://www.traceup.com/), records games automatically and keeps the film in its own app. The schedule and competition context live in [GotSport](https://home.gotsport.com/scheduling/), which handles scheduling, live scoring and public pages. The family wants every game in its own Jellyfin library, with correct metadata, without a parent doing it by hand every weekend.

### The five stages at a glance

The stages below show where automation runs and where a person sits. Blue stages never need attention. The amber segment is the only human checkpoint, and it applies only to games that do not appear on GotSport.

<figure style="margin:1.5rem 0;padding:0;">
<div role="img" aria-label="Every pipeline stage runs unattended for games on GotSport; only games missing from it need a person" style="display:grid;gap:8px;">
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">1</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Discover new games <em>(automated, nightly timer)</em></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">2</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Fetch and join the two halves <em>(automated)</em></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">3</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Enrich and match to the team's match history <em>(automated)</em></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">4</span><div style="flex:1;display:flex;gap:6px;"><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">Classify: league or tournament <em>(automated)</em></div><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(245,158,11,0.75);">Classify: not on GotSport <em>(human label)</em></div></div></div>
<div style="display:flex;align-items:center;gap:12px;"><span style="flex:0 0 2rem;font-weight:600;">5</span><div style="flex:1;padding:10px 14px;border-radius:6px;background:rgba(59,130,246,0.75);">File into Jellyfin <em>(automated)</em></div></div>
</div>
<figcaption style="margin-top:8px;font-size:0.875rem;opacity:0.8;">Source: author's pipeline design, 2026. Blue = automated, amber = human review for games not on GotSport.</figcaption>
</figure>

Automation covers the whole path for any game on GotSport, and the single amber segment is where I deliberately kept a person in the loop, only for games with no authoritative source.

## How does a nightly job find and assemble new games?

A systemd timer wakes the job each night, asks the family's camera account for recently processed games, and skips anything already filed. Each new game is fetched as two halves and joined into one file.

### Discovery from the account the family already pays for

The trigger is a systemd timer, not cron and not a long-running daemon. Per the [systemd.timer documentation](https://man7.org/linux/man-pages/man5/systemd.timer.5.html), \`OnCalendar=\` defines wall-clock schedules, and \`Persistent=true\` stores the last trigger time on disk so a run missed during downtime fires when the machine returns. The same page documents \`RandomizedDelaySec=\`, which spreads start times so a job does not hit a remote service at an identical second every night.

Discovery itself is deliberately boring: list what the account says is newly processed, compare against what I have already filed, and work only on the difference. A recording is not available until the platform has finished processing it, so a game played in the afternoon may not show up until a later night.

### Two halves, one file

Each game arrives as two halves. I fetch both and join them into a single file before anything else touches it. The [Jellyfin TV Shows documentation](https://jellyfin.org/docs/general/server/media/shows/) describes multi-part episodes through part-style separators, and I would rather hand the server one unambiguous episode than rely on it stitching parts together. One game, one file, one library item.

If only one half exists, the run does not file a partial game. It marks the game as incomplete, notifies me, and tries again the next night. A half-game in the library is worse than a missing one, because nobody notices it is half until someone goes looking for the second period.

## How is each game matched to a competition?

The game record supplies opponent, date and score. The pipeline then looks up the team's public match history on GotSport, which lists every match the team plays, league and tournament, with the event name. It picks the entry on the same local date whose kickoff is nearest the recorded start, within a 60-minute window, and that entry supplies the event name the file is filed under.

### Enrichment from the game record

The camera platform already knows who the game was against, when it was played and how it ended. I treat that record as the source of truth for opponent, date and score and do not try to improve on it. Everything downstream, from the episode title to the notification text, is built from those fields.

### Matching to the match history by date and nearest kickoff

Youth schedules are messy. Kickoff times shift, and a team can play twice in a day during a tournament. Matching on date alone would misfire on double-header days, and matching on exact time would miss every game that started ten minutes late. So the rule is two-step: filter the history to the game's date, then choose the entry whose kickoff is nearest the recorded start.

When the match is clear, the game inherits its competition and moves on. When it is not, because no entry exists for that date or two entries sit almost equally close, the pipeline does not guess. It routes the game to the human step and says why. A wrong automatic label is more expensive than a short wait, since a mislabeled game sits quietly in the library and looks correct.

## Which games still need a human?

Games that appear in the team's match history, league and tournament alike, resolve cleanly, so they file themselves. Only games that do not appear on GotSport at all, such as friendlies and scrimmages, have no authoritative source for the event. I park those in a small queue file where a person adds a label and releases them. Earlier versions of the pipeline needed a manual label for every tournament game; switching the lookup to the team's own match history is what removed that step.

### League and tournament games file themselves

For any game in the match history the match is enough. The event is known, the season is known, and the filing stage takes over with no prompt to me.

### The pending queue: one small file, one label, then release

Games missing from GotSport go into a pending queue, a small plain file with one entry per waiting game. Each entry already carries everything the pipeline knows: opponent, date, score, the joined video. The only blank is the event label. I fill it in, mark the entry released, and the next run files the game like any other.

I want to be direct about why this exists. For a friendly or scrimmage there is no authoritative source to ask, so any automatic label would be a guess. The honest design is to acknowledge the limit and put a person at that one point. The cost is a minute or two now and then. The benefit is that the archive never contains a confident wrong answer.

The queue has one more job: it ages. If an entry sits unreleased for too long, I get a notification, so a forgotten game does not become a permanent hole.

## How should games be named and filed so Jellyfin behaves?

Use a TV Shows style library: one folder per team, one season per soccer season, and each game an episode named \`SxxEyy - YYYY-MM-DD - vs Opponent\`. Keep season numbers small and sequential, and make every episode number unique. Games then sort chronologically and show opponent and date in the interface.

### One folder per team, one season per soccer season

The [Jellyfin TV Shows documentation](https://jellyfin.org/docs/general/server/media/shows/) asks for season folders named with a number, recommends zero-padding, and describes episodes as \`SxxEyy\`. Each team is a show, each soccer season a season, each game an episode. A parent browsing the library sees a team, opens a season, and scrolls through games in order.

### Why never the year as the season number

It is tempting to derive the season number from the year, such as 20252 for fall 2025. I would not. The Jellyfin documentation does not describe year-based seasons, and the Jellyfin 12.1 episode parser discards an \`SxxEyy\` match when the season number is between 200 and 1927 or above 2500. A year-and-term code lands above 2500 every time. A plain year like 2025 happens to pass today, but only because it sits in a narrow gap of an undocumented rule, so I would not rely on it. The range comes from reading the parser in [Jellyfin's open-source repository](https://github.com/jellyfin/jellyfin) at the 12.1 release, not from the documentation, so it could change in a later release. I learned it the hard way, as the production section below describes. Small sequential numbers sit safely below it, and a soccer season that straddles two calendar years makes the year a poor key anyway.

The second trap is versions. Jellyfin supports multiple versions of the same item, and per the [Jellyfin Movies documentation](https://jellyfin.org/docs/general/server/media/movies/), files that share one base name are grouped as versions of a single item. In my own Jellyfin library I saw the same thing happen to episodes that shared an episode number, and to same-date items. A double-header, or two games on one tournament Saturday, is exactly the case that triggers it. The defense is simple: give every game its own episode number within the season, and never let two files share one.

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

A file lock prevents overlapping runs, and one failing game never blocks the others. I track four failures, each with a notification that says what happened and what to do:

- A missing half: one of the two recordings has not appeared yet. The game is held and retried.
- No match-history entry: no entry for that date, or an ambiguous one. The game goes to the pending queue.
- An expired or rejected token: the run stops early and tells me, instead of reporting an empty night as success.
- An aging pending queue: a waiting entry has sat unlabeled too long.

The third one matters most. A run that silently finds nothing because it could not authenticate looks identical to a quiet week. Distinguishing "nothing new" from "could not look" is most of what monitoring means here.

## What did running it in production actually teach?

The pipeline has run on its timer since the end of August 2026. Every real problem in that time came from the edges, not the core logic: a storage path that differed per game, an upstream site that changed its rules twice, a media server that read my filenames differently than I expected, and a download path that had never run because there was nothing to download. No unit test caught any of them. Some surfaced as a failed run and a notification. The Jellyfin problems and the stale classification cache did not: they showed up only when I read the library and its logs.

### A pipeline with nothing to do proves nothing

At first deploy I seeded the state file with all 36 games the team's camera account already held, every one of them already in the library, so the first run would not download history again. That was the right call, and it also meant that for two weeks every run reported success while doing nothing. The download path had never executed in production. The first new game of the fall season failed two nights in a row.

The cause was a guess baked into the code. I built media URLs from a template with one storage region in it, because the games I tested against lived there. Trace actually stores games in several regions, and each game record carries its own path prefix, which is what Trace's own web player builds its URLs from. The fix reads the prefix from the API and keeps the template only as a fallback.

Two lessons came out of it. A green run that processed zero items is not evidence the pipeline works, so after seeding state, push one real game through end to end. And on object storage that denies listing, a 403 can simply mean the key does not exist, so a wrong path looks exactly like being locked out. I told the two apart by requesting a thumbnail stored beside the video under the old path. The thumbnail served, the video did not, so the path was wrong and access was fine.

### Upstream sources change their rules without notice

GotSport changed under the pipeline twice. First, its schedule pages stopped working for automated requests, so the earliest version classified from schedule dates I typed into config each season. Later, classification moved to the public match feed that GotSport's own rankings pages use, which carries every match with its event name. Then, in early October, the upcoming-matches list started requiring a login while past matches stayed public. My code fetched both lists as one unit, so a single 401 threw away the half it actually needed, and classification quietly pinned itself to a stale cache.

The fix split them: past matches are required, upcoming matches are best effort and only logged when they fail. The run also stopped calling GotSport at all unless there is a new game or a waiting queue entry. A site I depend on but do not control gets the lightest touch I can manage. If GotSport is unreachable, the run classifies from its cached copy, and with no cache it falls back to the pending queue. It degrades to asking a person, never to guessing.

### The media server is a dependency too

Jellyfin read my files differently than I assumed, three separate times.

- **Season folders vanished.** Folders named year-first, like "2025 Fall", fail Jellyfin's season-name check, so the resolver re-reads the folder name as if it were an episode filename, sees season 20, episode 25, and discards the folder. Across four teams, 74 episodes sat orphaned under "Season Unknown", and every 15-minute library scan logged hundreds of remove-and-recreate events. Trailing the year ("Fall 2025") fixed it. The displayed title comes from each season's metadata file, so nobody browsing the library saw anything change.
- **Same-day games merged.** After the upgrade to Jellyfin 12.1, episodes named only by date were grouped by air date, so two tournament games on one Saturday collapsed into one item with a version picker. Adding \`SxxEyy\` only half worked, because my season numbers were year-and-term codes like 20252, above the 2500 cutoff the 12.1 parser enforces, described under "Why never the year as the season number" above. I renumbered every season from 1 upward, 132 files across four teams.
- **One bad file, probed forever.** A game copied by hand before the pipeline existed had never been finalized, so it had no index for the player to read. Jellyfin 12.1 began probing it again on every scan, about 85 failed probes a day, where the previous version had left it alone.

The lesson is to check the library after a server upgrade, not just the server. The question is whether every file still resolves to the item you think it is. One more trap for anyone renaming at scale: a rename gives Jellyfin a new item, so watched and resume state has to be snapshotted before and restored after.

### Small operational choices that paid off

- **Pin the timer's time zone.** The nodes run on UTC, so the first schedule fired at a different local hour than I intended. The timer now fires at 06:00 with the time zone written into the timer itself, so a daylight saving change does not move it. I still call it the nightly run.
- **Gate on readiness, not presence.** A game files only when the platform marks it ready and each half's playlist ends with the \`#EXT-X-ENDLIST\` tag that says the stream is complete.
- **Verify what is deployed.** The running copy lives on shared storage and is updated in place, so after each change I compare its checksums against the commit before trusting the next run.
- **Drop features the data cannot support.** The platform tags key moments in each game, and I tried turning them into Jellyfin chapters for goals. Older games had no tags, the tag count matched the final score in only about three of seven tagged games, and the timestamps did not line up with the joined file. I removed the feature rather than ship chapters that point at the wrong minute, and each episode now carries the result, event and venue in its metadata instead.

## Where does AI fit, and where is it kept out?

AI coding agents designed and built this pipeline and still debug it, and no model runs inside it. Every nightly decision is made by plain code from dates and kickoff times, and the one judgment that code cannot make goes to a person. That split is the most transferable part of the project.

### Agents on the build side, under rules

I built the pipeline with coding agents from the first design spec onward: the spec, the architecture decision records, the code, the tests and the how-to guides for rotating a token or labeling a friendly. They work under rules I set and do not relax. Credentials never enter the repo or a transcript. Anything that rewrites the library defaults to a dry run, and the scope of a change to the family archive is my call. Nobody triggers a library scan by hand; the scheduled scan picks changes up.

### Where agents earned their keep: diagnosis

The hardest production problems were diagnosed in agent sessions, and each meant reading someone else's code, which is where an agent is patient and I am not.

- **The per-game path prefix.** The fix depended on knowing where each game's video actually lives. The agent worked out how Trace's own web player builds its playback URLs and found that each game record already carries its storage path, so the pipeline now uses that same field instead of a template.
- **The vanishing season folders.** The agent pulled the episode-matching rules out of Jellyfin's source and ran Jellyfin's own resolver logic over my real folder names. Its prediction of which folders would be dropped matched the live library folder for folder, and changing only the name order flipped the result. That turned a confusing log pattern into a one-line rename with a known outcome. The same source reading produced the season-number range the parser rejects.

Both followed one pattern: a hypothesis that can be checked against the real system before anything changes.

### Where I kept AI out on purpose

There were two obvious places to put a model at run time, and I declined both.

- **Matching games across systems.** Team names differ between the camera platform and GotSport, with abbreviations, age groups and club prefixes. A model would match them correctly most of the time. The code never compares names at all, only the date-and-kickoff rule described earlier, and a tie means no match. It is deterministic and testable, and when it fails it fails into the queue.
- **Labeling friendlies.** A model could invent a plausible event name for a game that appears nowhere. That confident wrong answer is exactly what the pending queue prevents.

The rule I would hand to another builder: use AI on the build side, where every output is reviewed, tested and reversible, and plain code on the run side, where the output lands in a family archive that nobody re-checks.

## What are the trade-offs of this design?

The design trades a little convenience for trustworthiness. A person handles labels for games not on GotSport, games can appear a day after they are played, and the layout is tied to a TV Shows library. In return, nothing is mislabeled, nothing is filed twice, and the archive stays correct with almost no maintenance.

The human step is the obvious cost, and I accept it. The less obvious one is that naming is a commitment. Changing the season convention after a few years of games means touching every file and every manifest entry. I know because I did it: the renumbering described above touched 132 files and needed watched state carried across. Settle the pattern before filing the first game, and check it against the media server's parser, not just its documentation.

The infrastructure side is light. It needs a node that is usually on, enough storage for video and a Jellyfin server. If you are building the serving side from scratch, my [Jellyfin Live TV setup with Dispatcharr](/guide/operational-architecture/blog/jellyfin-live-tv-dispatcharr-antenna-cable-dvr) covers the server end, and my write-up on [macvlan in Docker Swarm](/guide/operational-architecture/blog/macvlan-docker-swarm-networking-deep-dive) explains how I give containerized services their own network identity. Neither is required for this pipeline. The ingest job only needs somewhere to write files that Jellyfin can read.

What I would tell another builder is to start with the two boring stages, fetch and file, and get naming right. Add schedule matching next and the pending queue after that. The archive is useful long before the smart parts exist, and the smart parts are far easier to trust once the boring ones have run for a month without surprises.

## Frequently Asked Questions

### How do I get youth soccer game video into Jellyfin automatically?

Run a scheduled job on a homelab machine that fetches new recordings from the account your family already pays for, joins any split files, and writes them into a Jellyfin TV Shows library with a consistent naming pattern. A systemd timer with catch-up enabled makes the job survive downtime. Add a notification path so failures are visible rather than silent.

### Can Jellyfin show the opponent and date for each game?

Yes, if you treat each game as an episode and put both in the episode title, such as SxxEyy - YYYY-MM-DD - vs Opponent. Jellyfin reads the season and episode numbers from the SxxEyy part and shows the rest as the title. Sorting by episode number then gives you chronological order.

### Why not use the year as the season number for sports in Jellyfin?

Jellyfin's documentation asks for season folders with a number but does not describe year-based seasons. The Jellyfin 12.1 episode parser discards an SxxEyy match when the season number is between 200 and 1927 or above 2500, so a year-and-term code like 20252 breaks episode matching and same-day games can merge. A plain year passes today only because it falls in a gap of that undocumented rule. I use small sequential numbers, one per soccer season. The range comes from the parser's source, not the documentation.

### How was AI used to build this pipeline?

Coding agents wrote the design spec, decision records, code, tests and how-to guides, and diagnosed the hardest production problems by working out how the camera platform's own player loads video and by reading Jellyfin's source. No model runs inside the pipeline. Classification is plain code that matches on date and kickoff time, and games it cannot place go to a person.

### What breaks when a game-film pipeline runs in production?

In my case it was the edges, not the core logic: a storage path that differed per game, an upstream site that stopped serving automated requests and later required a login for part of its data, and Jellyfin parsing folder and file names differently than expected. Some were caught because the run reported a failure. The quiet ones, like Jellyfin's changed parsing, only showed up when I checked the library and its logs.

### Do tournament games need manual labeling?

No. The pipeline reads the team's public match history on GotSport, which lists league and tournament games with the event name, and matches each game by date and nearest kickoff time, so both file themselves. Only games that do not appear on GotSport at all, such as friendlies and scrimmages, go to a small queue where a person types a label and releases them. It costs seconds per game and avoids guessing.

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
- [6] Jellyfin. "jellyfin/jellyfin" source repository (episode resolver, 12.1 release). GitHub, 2026. [github.com](https://github.com/jellyfin/jellyfin)
`
};
