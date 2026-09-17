import { BlogPost } from "../office_blog_posts";

export const jellyfinLiveTvDispatcharr: BlogPost = {
    id: "jellyfin-live-tv-dispatcharr-antenna-cable-dvr",
    slug: "jellyfin-live-tv-dispatcharr-antenna-cable-dvr",
    title: "Jellyfin Live TV From Antenna or Cable: Dispatcharr, EPG and DVR",
    author: "Christopher Melson",
    role: "Homelab Architect",
    date: "2026-09-24",
    lastUpdated: "2026-09-24",
    ogImage: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&h=630&fit=crop&q=80&auto=format",
    summary: "A how-to for turning an antenna or cable feed into a Jellyfin Live TV lineup that looks like real TV: a network tuner, Dispatcharr for channel numbers, logos, failover and a free guide from epgshare01, Jellyfin for playback and DVR, and an AI agent prompt to automate the setup.",
    polymorphicSummary: {
        executive: "Cord-cutting households already pay for a broadband connection and often still have an antenna on the roof or a cable line in the wall. The gap is not the signal, it is the software: an open source media server can play live television and record it, but out of the box the channel list is a raw dump with no logos, no guide data and no resilience. This guide closes that gap with three free pieces: a network tuner that turns broadcast into a stream, a lineup manager that curates it, and Jellyfin as the front door with a DVR. The end state is a family-grade TV experience with no subscription beyond the cable bill you already have, and a maintenance routine small enough to hand to an AI agent.",
        strategist: "The design principle is separation of concerns. The tuner only tunes. Dispatcharr only owns the lineup: which channels exist, what they are numbered, what logo and guide entry each carries, which stream to try first and which to fall back to, and which profile a given consumer sees. Jellyfin only plays and records. Each layer can be swapped or scaled without touching the others, which is why the same pattern survives a tuner upgrade, a second antenna, or a move from one media server to another. The operational payoff is that lineup health becomes a checklist of numbers (no channel without a stream, no channel without guide data, no dead stream in first position) that a script or an agent can verify daily.",
        engineer: "An HDHomeRun on an antenna or clear-QAM cable exposes lineup.m3u and one MPEG-TS URL per channel on port 5004. Dispatcharr ingests that M3U as an account, auto-creates channels per group, maps each to an XMLTV entry from a free epgshare01 pack (or Schedules Direct), attaches multiple streams per channel in priority order, and publishes a per-profile M3U and XMLTV URL plus an HDHomeRun emulation endpoint. Jellyfin adds Dispatcharr as an M3U Tuner and an XMLTV guide provider with the simultaneous stream limit set to the tuner count. The DVR records to a mounted path and a post-processing hook runs comskip to chapter-mark commercials. Everything Dispatcharr does in the UI is also reachable through its REST API with an X-API-Key header, which is what makes the setup scriptable and agent-driven."
    },
    geoHighlights: [
        { label: "Pipeline", value: "Antenna or cable feed into a network tuner (HDHomeRun), Dispatcharr as the lineup manager (numbers, logos, guide mapping, failover, profiles), Jellyfin as the player and DVR" },
        { label: "Free Guide Data", value: "epgshare01.online publishes gzipped XMLTV packs per region (US1, US2, US_LOCALS and more) that Dispatcharr ingests directly; Schedules Direct is the paid alternative for exact local lineups" },
        { label: "Automation", value: "Dispatcharr's REST API accepts an admin API key in an X-API-Key header, so channel mapping, stream attachment and plugin runs can be scripted or handed to an AI coding agent with a single starter prompt" }
    ],
    content: `### Key Takeaways

- **You do not need an IPTV subscription to have good live TV in Jellyfin.** An antenna on the roof or the cable line already in the wall is a source. What you need is a device that turns that signal into a network stream, and a layer that makes the resulting channel list look like television instead of a spreadsheet.
- **That layer is [Dispatcharr](https://github.com/Dispatcharr/Dispatcharr).** It ingests the tuner's playlist, gives you channel numbers, logos, guide mapping, failover streams and per-device profiles, then publishes a clean M3U and XMLTV pair that Jellyfin reads.
- **Guide data is the difference between "it works" and "my family uses it."** [epgshare01.online](https://epgshare01.online/epgshare01/) publishes free XMLTV packs by region. Schedules Direct is the paid, exact-lineup option. Both plug straight into Dispatcharr.
- **Jellyfin's DVR is real once you give it a recording path**, and the [Jellyfin RFFMPEG Swarm](https://github.com/mels0n/jellyfin-rffmpeg-swarm) project I maintain adds distributed transcoding plus automatic commercial detection on every recording.
- **The whole thing is an API.** Everything you click in Dispatcharr is a REST call with an API key, which means the tedious part (mapping eighty channels to guide entries and logos) is a job for a script or an AI coding agent. The last section has a starter prompt.

---

### 1. What You Are Building

The finished pipeline has three layers, and the reason it stays maintainable is that each one does exactly one job.

<figure><svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;display:block;margin:0 auto;font-family:system-ui,-apple-system,sans-serif" role="img" aria-label="Diagram of the live TV pipeline: antenna or cable feed into a network tuner, the tuner's M3U into Dispatcharr alongside XMLTV guide data, and Dispatcharr's curated M3U and EPG into Jellyfin for playback and DVR"><rect width="680" height="300" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/><text x="340" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">Three Layers, One Job Each</text><rect x="24" y="70" width="150" height="110" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><text x="99" y="94" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">Signal + Tuner</text><text x="99" y="114" text-anchor="middle" font-size="9.5" fill="#64748b">Antenna (ATSC) or</text><text x="99" y="128" text-anchor="middle" font-size="9.5" fill="#64748b">cable (QAM / CableCARD)</text><text x="99" y="150" text-anchor="middle" font-size="9" fill="#475569">HDHomeRun exposes</text><text x="99" y="163" text-anchor="middle" font-size="9" fill="#475569">lineup.m3u + TS streams</text><rect x="265" y="70" width="150" height="110" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><text x="340" y="94" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">Dispatcharr</text><text x="340" y="114" text-anchor="middle" font-size="9.5" fill="#64748b">Channel numbers, logos</text><text x="340" y="128" text-anchor="middle" font-size="9.5" fill="#64748b">Guide mapping (XMLTV)</text><text x="340" y="142" text-anchor="middle" font-size="9.5" fill="#64748b">Failover, profiles, plugins</text><text x="340" y="163" text-anchor="middle" font-size="9" fill="#475569">Publishes M3U + EPG per profile</text><rect x="506" y="70" width="150" height="110" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><text x="581" y="94" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">Jellyfin</text><text x="581" y="114" text-anchor="middle" font-size="9.5" fill="#64748b">M3U Tuner + XMLTV guide</text><text x="581" y="128" text-anchor="middle" font-size="9.5" fill="#64748b">Live playback on every client</text><text x="581" y="142" text-anchor="middle" font-size="9.5" fill="#64748b">DVR + commercial chapters</text><text x="581" y="163" text-anchor="middle" font-size="9" fill="#475569">Distributed transcoding (Swarm)</text><line x1="174" y1="125" x2="261" y2="125" stroke="#2563eb" stroke-width="2"/><polygon points="261,125 253,121 253,129" fill="#2563eb"/><text x="218" y="117" text-anchor="middle" font-size="9" font-weight="600" fill="#1d4ed8">raw M3U</text><line x1="415" y1="125" x2="502" y2="125" stroke="#2563eb" stroke-width="2"/><polygon points="502,125 494,121 494,129" fill="#2563eb"/><text x="459" y="117" text-anchor="middle" font-size="9" font-weight="600" fill="#1d4ed8">curated M3U + EPG</text><rect x="240" y="210" width="200" height="40" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.2"/><text x="340" y="227" text-anchor="middle" font-size="9.5" font-weight="600" fill="#334155">Free guide data: epgshare01 XMLTV</text><text x="340" y="241" text-anchor="middle" font-size="9" fill="#64748b">or Schedules Direct (paid)</text><line x1="340" y1="210" x2="340" y2="184" stroke="#16a34a" stroke-width="2"/><polygon points="340,184 336,192 344,192" fill="#16a34a"/><text x="340" y="278" text-anchor="middle" font-size="9" fill="#64748b">Every Dispatcharr action is also a REST call: script it, or hand it to an agent.</text></svg><figcaption>The tuner only tunes. Dispatcharr only owns the lineup. Jellyfin only plays and records. Swapping any one layer never touches the other two.</figcaption></figure>

The rest of this guide walks the three layers in order, then covers the plugins that keep the lineup healthy without you, and closes with the automation angle.

### 2. Layer One: Turn the Signal Into a Stream

**Antenna (over the air).** The device that does this job well is a network tuner, and the HDHomeRun line from SiliconDust is the one most media servers understand natively. An HDHomeRun FLEX 4K has four tuners (two ATSC 3.0, two ATSC 1.0) and also handles clear-QAM cable. A two-tuner model is fine for a household that records one thing while watching another. Put it on the LAN, plug in the coax, run the channel scan from its web page, and it is done.

**Cable.** Two honest options. The HDHomeRun PRIME used a CableCARD to decrypt a cable feed, and it was the cleanest path, but it is no longer manufactured and cable providers are phasing CableCARD out, so it is a used-market purchase now. The other path is a cable box feeding an HDMI-to-IP encoder, a small appliance that captures the HDMI output and serves it as an MPEG-TS stream over HTTP or RTSP. It is one stream per box, so it suits "the one premium channel we actually watch" rather than a full lineup, and you drive channel changes on the box itself. Either way the output is a network stream with a URL, which is all the next layer needs.

**What the tuner gives you.** An HDHomeRun publishes its scanned lineup at these paths on the device's own IP address:

| Path | What it returns |
|---|---|
| \`/lineup.m3u\` | An M3U playlist, one entry per channel, ready for import |
| \`/lineup.json\` | The same lineup as structured data (guide number, name, URL) |
| \`:5004/auto/v<channel>\` | The live MPEG-TS stream for one channel, for example \`/auto/v4.1\` |

That M3U is the handoff. Copy the URL, because the next layer takes it as its source.

### 3. Layer Two: Dispatcharr Owns the Lineup

You could point Jellyfin straight at the tuner. It even auto-detects HDHomeRun devices. The result is a channel list with the broadcaster's own names, no artwork, no guide data unless you pay for the tuner's DVR service, and no way to say "try the other antenna if this one is weak." Dispatcharr is the layer that fixes all of that, and it runs as one container.

#### Install

The all-in-one image runs its own Redis, Postgres and Celery workers inside the container, which is the right choice for a single household. Persist \`/data\`, and if you want to try hardware transcoding later, pass the GPU device through now so you do not have to redeploy for it.

\`\`\`yaml
services:
  dispatcharr:
    image: ghcr.io/dispatcharr/dispatcharr:latest
    environment:
      - DISPATCHARR_ENV=aio
      - DISPATCHARR_TRUSTED_PROXIES=10.0.0.0/8   # only if you put it behind a reverse proxy
    ports:
      - "9191:9191"
    volumes:
      - dispatcharr_data:/data
    devices:
      - /dev/dri:/dev/dri   # optional, Intel Quick Sync for transcoding profiles
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
volumes:
  dispatcharr_data:
\`\`\`

The file descriptor limit is there because Docker's default of 1024 is low for a proxy that holds several long-lived streams open, and the error you get when it bites ("too many open files") does not look like a limits problem.

#### Add the tuner as a source

In **M3U & EPG Manager**, add an M3U account with the tuner's \`lineup.m3u\` URL. Set its **max streams** to the number of physical tuners. This is the single most important setting in the whole stack: it is how Dispatcharr knows the antenna can only tune two or four things at once, and it is what lets it queue or refuse a third stream instead of handing Jellyfin a broken one. Set a refresh schedule so a channel rescan on the tuner shows up in Dispatcharr without a manual step.

#### Build channels, not just streams

Dispatcharr separates **streams** (a URL that plays video) from **channels** (the thing a viewer picks). A channel has a number, a name, a logo, a guide entry and an ordered list of streams. The first stream is what plays; the rest are failover, tried in order if the first one fails. On a tuner this matters more than it sounds:

- Two HDHomeRuns on two antennas pointed at different towers give you a second stream for every channel, and the fallback fires automatically when the primary signal drops.
- An antenna and a cable box both carrying the local affiliates lets the antenna be primary (better picture, no compression) with cable behind it.
- Even with one tuner, the structure is what lets you renumber, rename and re-logo without touching the source.

For a tuner lineup, the fastest path is **Auto Channel Sync** on the group: point it at the tuner's group, set a starting channel number, and let it create one channel per stream. Broadcast subchannels come in as numbers like 4.1 and 4.2; give the auto-sync a start number that keeps them together and the guide will feel like the one on a real TV.

#### Guide data, for free

This is the step most people skip and then wonder why nobody in the house uses the thing. Under **EPG sources**, add an XMLTV URL. [epgshare01.online](https://epgshare01.online/epgshare01/) publishes free gzipped packs per region with a predictable URL shape:

\`\`\`text
https://epgshare01.online/epgshare01/epg_ripper_US1.xml.gz
https://epgshare01.online/epgshare01/epg_ripper_US2.xml.gz
https://epgshare01.online/epgshare01/epg_ripper_US_LOCALS.xml.gz
\`\`\`

Browse the directory listing for your region and add the pack that carries your affiliates; US_LOCALS plus one of the national packs covers a typical American antenna lineup. Dispatcharr downloads the file on a schedule, parses it, and offers each entry as a mapping target. If you want exact local lineups by postal code, Dispatcharr is also an approved [Schedules Direct](https://www.schedulesdirect.org/) application, which is a modest annual fee and worth it if the free packs miss a subchannel you care about.

Then map. Each channel gets an **EPG entry**; the built-in search matches on name and call sign, and for a US antenna lineup the Channel Mapparr plugin (next section) does most of it in one pass. Two things to know before you trust the result:

- Dispatcharr only stores programmes for guide entries that are mapped to a channel. A mapped entry with zero programmes shows as a blank row. Re-import the source after mapping and check the grid.
- Channels with no guide at all get Dispatcharr's built-in placeholder EPG, which fills the row with joke titles so the grid is never empty. Cute once, annoying on channel 4.1. Map everything real.

#### Logos and names

The broadcaster's own channel name is rarely what you want on screen ("KXXX-DT" versus "NBC 5"). Rename channels to what your family calls them, and attach a logo per channel. Dispatcharr accepts an uploaded image or a URL; for US broadcast the guide packs often carry a logo URL you can adopt in the same pass.

#### Profiles: one lineup, several audiences

A **channel profile** is a named subset of channels with its own M3U and EPG URL. Make one called Main that holds everything Jellyfin should see, and leave the raw tuner dump out of it. Later you can add a Kids profile that only carries the children's subchannels for a bedroom device, without duplicating anything.

A **stream profile** is how Dispatcharr hands the bytes onward: redirect the player straight to the tuner, proxy the stream through Dispatcharr untouched (\`-c copy\`), or run it through ffmpeg for a transcode. For a tuner lineup, proxy with copy is the right default. It costs almost no CPU, it gives Dispatcharr the visibility to fail over, and it keeps one connection to the tuner per viewer instead of one per client device. Save transcoding for Jellyfin, which does it per client anyway.

### 4. Layer Three: Jellyfin Plays It and Records It

Open the Channel Profiles page in Dispatcharr and copy the two URLs for Main: one M3U, one EPG. Then in Jellyfin:

1. **Dashboard, Live TV, Tuner Devices, Add.** Type: **M3U Tuner**. URL: the Main profile's M3U. Set the **simultaneous stream limit** to your tuner count so Jellyfin never asks for a fifth stream from a four-tuner box. Leave hardware transcoding off here; that toggle is for HDHomeRun devices connected directly and it does not apply to an M3U source.
2. **TV Guide Data Providers, Add.** Type: **XMLTV**. URL: the Main profile's EPG. Jellyfin reads the gzipped file directly.
3. **Scheduled Tasks, Refresh Guide.** The default is once a day. Set it to match Dispatcharr's own EPG refresh so the two never drift by more than a few hours.

Dispatcharr also exposes an HDHomeRun emulation endpoint, so a client that only speaks HDHomeRun can be pointed at Dispatcharr and see the curated lineup as if it were a tuner. Jellyfin does not need it, but it is a useful escape hatch for other players in the house.

At this point the Live TV tab shows numbered channels with logos and a real guide, and any Jellyfin client can tune them.

#### DVR

Jellyfin's recorder is built in and only needs a **recording path** (Dashboard, Live TV, DVR settings). Point it at persistent storage the server container can write to, and recordings, series timers and guide-driven scheduling all work. Two operational notes that took me longer than they should have:

- **Recording plus live viewing shares one tuner stream.** If someone is already watching the channel when a recording starts, Jellyfin joins the existing stream rather than opening a second one. That is good for tuner budget, but the recording starts wherever that stream's buffer happens to be, which is why the first second of a file can look rough. Not a bug, just something to know before you chase it.
- **Repeated live events share a folder.** Every non-series program with the same guide title records into one folder with one poster, so "Live: U.S. Open Cup Soccer" becomes a single tile no matter how many games you record. My Jellyfin image (below) moves each finished recording into its own folder after processing.

#### Transcoding and commercial skipping

Live TV is the workload that finds the limits of a single small server. Four family members on four devices, two of them on a phone that needs a transcode, plus a recording in flight, is a real load. [Jellyfin RFFMPEG Swarm](https://github.com/mels0n/jellyfin-rffmpeg-swarm) is the project I built for exactly this: it runs Jellyfin in Docker Swarm and offloads every transcode to a pool of worker nodes over SSH, so adding capacity means adding a mini PC, not replacing the server.

It also ships the DVR post-processing that makes recordings feel like a real DVR. Every finished recording runs through [comskip](https://github.com/erikkaashoek/Comskip), which detects commercial breaks; the default mode adds chapter markers so any client can skip a break with one tap, and an optional mode cuts them out entirely. It is preconfigured in the image, the recording path is already wired to a \`/livetv\` volume, and the post-processor command line is editable from the Jellyfin dashboard if you want verbose logs or the destructive mode. If you are running Jellyfin on a single box today, the README covers the node setup, and the pattern works with any Intel CPU that has Quick Sync.

### 5. Keeping It Healthy: The Plugins Worth Installing

A tuner lineup drifts. A broadcaster repacks and a subchannel vanishes. A guide pack renames an entry. A logo URL dies. Dispatcharr's plugin system, installed from **Find Plugins** in the UI, is how the lineup stays true without weekly hand-checks. These are the ones I run and what each one does for an antenna or cable source:

| Plugin | What it does for a tuner lineup |
|---|---|
| [Channel Mapparr](https://github.com/PiratesIRC/Dispatcharr-Channel-Maparr-Plugin) | Standardizes US broadcast and cable channel names using FCC data and assigns logos in bulk. Run it once after Auto Channel Sync and most of the naming is done. |
| [Stream-Mapparr](https://github.com/PiratesIRC/Stream-Mapparr) | Matches streams to channels by name with OTA call-sign recognition, and re-sorts each channel's stream list by quality. With two tuners this is what keeps the better signal in first position. |
| [IPTV Checker](https://github.com/PiratesIRC/Dispatcharr-IPTV-Checker-Plugin) | Probes every stream on a schedule with ffprobe and marks the dead ones. On an antenna that means catching a repacked or lost subchannel before a viewer does. |
| EPG Janitor | Finds channels whose guide entry has no programmes (the blank-row problem) and can re-match them. |
| [Event Channel Managarr](https://github.com/PiratesIRC/Dispatcharr-Event-Channel-Managarr-Plugin) | For sources that carry event-style channels (sports packages, pay-per-view slots on cable): shows a channel only while it has a scheduled event and hides it otherwise, with a generated guide block for the event. Skip it on a pure antenna lineup. |
| Could Not Dispatch | Attaches a "channel temporarily unavailable" slate as the last stream of every channel, so a lost signal shows a message instead of a black screen or a client error, and returns the channel to its real stream when it recovers. |
| [Underfed](https://github.com/PilaScat/underfed) | Watches per-stream bitrate and switches to the next stream when a feed is delivering far less than the picture needs. Optional; most useful with a weak second antenna or a flaky encoder. |
| [EPG & Sports Editor](https://github.com/jstevenscl/epg-and-sports-editor) | Matches sports channel names against live league schedules and writes real pregame, live and postgame guide blocks. Optional, and one league per channel group. |

Set the schedules so they run in order: the checker first, then Stream-Mapparr's sort so dead streams move to the back, then anything that hides or shows channels. And keep the "act on dead streams" toggles off in the checker: a channel with one dead stream and one live failover should stay in the lineup, not get renamed or moved to a graveyard.

**Connect.** Since 0.31, Dispatcharr's Connect page fires webhooks on events like an M3U refresh finishing or an EPG import failing. Pointing one at a notifier means you hear about a broken guide source the morning it breaks, not the evening someone complains.

**Backups.** Dispatcharr writes its own backups into \`/data\` on a schedule you set. Keep three, and keep the volume on storage you already back up.

### 6. The Health Check: What "Done" Looks Like

The lineup is healthy when a short list of numbers is right, and every one of them is readable from the API. This is the checklist I run after any upgrade, any plugin update, and weekly otherwise:

- Zero EPG sources in error, zero M3U accounts in error.
- Zero channels in the Main profile with no stream attached.
- Zero channels in Main with no guide mapping, and zero whose mapped entry has no programmes.
- Zero dead streams in first position (the checker marks them, the sorter moves them).
- If you run event channels: zero visible ones without a timed event block, and zero whose event ended hours ago.
- Zero plugins with pending updates, and no duplicate plugin entries after an update.

When all of those are zero, Jellyfin is showing exactly what you intended. When one is not, the fix is always local to that line. That shape, a fixed list of measurable criteria with a known procedure per failure, is what makes the next section possible.

### 7. The Agentic Angle: Let an Agent Do the Tedious Part

Everything above that happens in the Dispatcharr UI is also a REST call. The admin user has an **API key** (Users page), and sending it as an \`X-API-Key\` header authenticates every endpoint. The pattern that works from any script or agent:

\`\`\`bash
curl -s -H "X-API-Key: $DISPATCHARR_API_KEY" \\
  "http://dispatcharr.local:9191/api/channels/channels/?page_size=500"
\`\`\`

The endpoints that cover the whole setup are small in number: \`/api/m3u/accounts/\` for sources, \`/api/epg/sources/\` and \`/api/epg/import/\` for guide packs, \`/api/channels/channels/\`, \`/api/channels/groups/\` and \`/api/channels/profiles/\` for the lineup, \`/api/channels/streams/?search=\` to find a stream by name, and \`/api/plugins/plugins/<key>/run/\` to trigger a plugin action with a JSON body. A channel's stream list is an ordered array of stream ids, so failover priority is just array order. An unmapped guide entry is a null \`epg_data_id\`. That is the entire vocabulary an agent needs.

I run the health check from Section 6 as a fifty-line Python script against those endpoints, and the reason it exists is that the first time through, an AI coding agent built the lineup with me: it read the tuner's channel list, searched the guide pack for each call sign, proposed the mappings in a table, attached them on approval, and then wrote the check that proves the result. Two rules made that safe. First, **read-only until a human says go**: the agent lists what it would change and waits. Second, **never let the agent hold the key in the transcript**: it lives in an env file the script reads, and the script redacts URLs and tokens from anything it prints.

If you want to start there instead of clicking through eighty channels, here is a starter prompt. Paste it into an AI coding agent that can run shell commands on a machine that can reach your Dispatcharr instance, fill in the three bracketed values, and let it work through the phases.

\`\`\`text
You are helping me set up Dispatcharr as the lineup manager between my
network tuner and Jellyfin. Work in phases, and stop for my approval at
the end of every phase before making any change.

Environment:
- Dispatcharr URL: [http://dispatcharr.local:9191]
- Admin API key is in the env var DISPATCHARR_API_KEY. Send it as the
  X-API-Key header on every request. Never print it, never write it to
  a file, and redact any URL that contains a token before showing me
  output.
- Tuner playlist: [http://192.168.1.50/lineup.m3u] (an HDHomeRun with
  [2] physical tuners on an antenna).
- Guide source: the free epgshare01 packs. Start with
  https://epgshare01.online/epgshare01/epg_ripper_US_LOCALS.xml.gz and
  https://epgshare01.online/epgshare01/epg_ripper_US1.xml.gz
- Jellyfin should see one channel profile named "Main".

Phase 1, discover (read-only). Call /api/core/version/ to confirm
access. List existing M3U accounts, EPG sources, channel groups,
channel profiles and plugins. Summarize what already exists so we do
not duplicate anything.

Phase 2, sources. Propose the M3U account for the tuner with max_streams
equal to the tuner count and a daily refresh, and the two EPG sources.
Show me the exact requests. On approval, create them and trigger an
import of each EPG source with POST /api/epg/import/ {"id": <source>}.

Phase 3, channels. Propose an Auto Channel Sync configuration for the
tuner's group with a start number that keeps broadcast subchannels
together (4.1, 4.2 ...). On approval, apply it, refresh the account,
and list the channels it created.

Phase 4, guide mapping. For every channel with a null epg_data_id,
search the imported guide data by call sign and by plain name and
propose a mapping in a table: channel, proposed entry, confidence. Flag
anything below high confidence for me to decide. On approval, PATCH
each channel's epg_data_id, re-import the sources, and report any
channel whose mapped entry still has zero programmes.

Phase 5, names and logos. Propose viewer-friendly names (network and
number, not call signs) and a logo for each channel, using logo URLs
from the guide data where present. Apply on approval.

Phase 6, profile and output. Ensure every real channel is enabled in
the "Main" profile and nothing else is. Give me the Main profile's M3U
and EPG URLs to paste into Jellyfin as an M3U Tuner and an XMLTV guide
provider.

Phase 7, health check. Write a small script that reads the API and
prints, one per line with a pass or fail flag: EPG sources in error,
M3U accounts in error, channels in Main with no stream, channels in
Main with no guide mapping, channels whose guide entry has no
programmes. Exit non-zero on any failure. Run it and show me the
result.

Rules: prefer GET over guessing. If an endpoint returns HTML instead of
JSON, the path is wrong; find the right one rather than retrying. Keep a
running log of every change you made so I can reverse it.
\`\`\`

The prompt is deliberately phased and deliberately boring. An agent that is allowed to make eighty changes in one unsupervised pass will eventually make a wrong one in bulk; an agent that proposes a table and waits is a junior engineer with perfect patience. What you get at the end is not just a configured Dispatcharr, it is the check that proves it stays configured, which is the part I would not want to write by hand a second time.

### 8. Where This Goes Next

The pipeline described here is the one my household watches every evening, with the tuner-specific details swapped for the source that fits your house. Once it exists, the extensions are incremental: a second profile for a specific room, a second tuner for failover, sports guide enrichment for the channels that carry games, notifications on guide failures. None of those require touching the layers below them, which is the whole reason to build it this way in the first place.

#### Do I need an HDHomeRun specifically?

No, but it is the path of least resistance. Any device that turns your antenna or cable feed into an M3U with per-channel network streams works: a different network tuner, a TV card in a small Linux box exposing streams through TVHeadend, or an HDMI encoder on a cable box. Dispatcharr only needs a playlist URL.

#### Is the free guide data good enough?

For a typical American antenna lineup, US_LOCALS plus one national pack covers the affiliates and most subchannels. If your market has an obscure subchannel the packs miss, or you want exact postal-code lineups, Schedules Direct is a small annual fee and Dispatcharr supports it natively.

#### Can Jellyfin talk to the tuner directly and skip Dispatcharr?

Yes, and it will work. You lose curated numbers and names, logos, failover between tuners, per-device profiles, the health plugins, and the API that makes it all scriptable. If your lineup is six channels and one tuner, that trade might be fine. Past that, the middle layer pays for itself the first time a subchannel disappears.

#### Does DVR need anything beyond Jellyfin?

A writable recording path is the only requirement. Commercial detection and distributed transcoding are extras, and the [Jellyfin RFFMPEG Swarm](https://github.com/mels0n/jellyfin-rffmpeg-swarm) image bundles both so you do not assemble them yourself.
`
};
