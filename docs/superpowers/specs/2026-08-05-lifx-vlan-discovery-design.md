# Design: LIFX Discovery on a Segmented IoT VLAN

*Date: 2026-08-05 | Status: approved, ready for drafting*

## Purpose

A practitioner-lane blog post for chris.melson.us covering LIFX device discovery on a
VLAN-segmented IoT network: why segmentation breaks discovery, which of the eight known
discovery methods can cross a subnet boundary, and what actually works.

Source material: `notes/homelab/lifx-discovery-map.md` (three research passes, ~630 lines,
including a firmware-track map, a method/firmware availability matrix, an implementation
survey across 14 libraries, and an 18-entry conflict register). The note is the research
artifact; this post is a reader-facing subset of it.

## Positioning

| Field | Value |
|---|---|
| Lane | Homelab Architect practitioner-credibility side-lane (not Pillar 1-4) |
| `role` | `"Homelab Architect"` |
| Audience segment | Segment 3, Enterprise Practitioner (engineer mode) |
| Slot | `2026-08-13` |
| File | `src/shared/data/blog-posts/lifx-vlan-iot-discovery.ts` |
| Slug | `lifx-vlan-iot-discovery` |
| Target length | ~3,500 words |

### Slot derivation

Latest `date` across all posts in `src/shared/data/blog-posts/` is `2026-07-30`
(`macvlan-docker-swarm-networking`). Biweekly cadence: +14 days = `2026-08-13`, which is a
Thursday and is in the future relative to today (2026-08-05), so it is used directly rather
than snapping forward. Date-gating in `office_blog_posts.ts` keeps the post invisible
everywhere (list page, `[slug]` route, `generateStaticParams`, sitemap) until a build runs
on or after that date; `.github/workflows/biweekly-deploy.yml` provides that build.

## Title and search intent

**Title:** LIFX Bulbs on a Segmented IoT VLAN: Why Discovery Breaks, and Every Method That
Can Fix It

Primary intent is symptomatic: a reader who segmented IoT onto its own VLAN and lost their
bulbs in Home Assistant. Secondary intent is reference: the complete discovery-method map,
which has no single-page equivalent on the open web now that `community.lifx.com` is offline.

Query families targeted:

- `lifx vlan`, `lifx iot vlan home assistant`, `lifx separate subnet`
- `home assistant lifx not discovered`, `lifx bulbs missing after vlan`
- `lifx cross subnet discovery`, `lifx broadcast discovery`
- `lifx mdns`, `lifx firmware discovery`, `lifx GetService`

## Structure

Spine: the VLAN symptom opens and closes the article. The reference material sits inside it
as the explanation of why the obvious fixes do not work. A reader gets their answer by
section 2 and a complete map by section 10.

| Section | Content | Source in note |
|---|---|---|
| Key Takeaways | 6 bullets | - |
| 1 | The symptom: works on a flat network, vanishes after segmentation | framing |
| 2 | Why: discovery is a broadcast primitive and broadcasts stop at the router | M2 |
| 3 | The eight discovery methods and what each one actually requires | S1, M1-M8 |
| 4 | Firmware majors are hardware generations, not a version ladder | S0 |
| 5 | Master matrix: method x firmware track, including the all-false cross-subnet row | S2 |
| 6 | Four things that look like solutions and are not | M8, M4, relay, ARP sweep |
| 7 | What actually works across the boundary | M3, in-segment agent, multi-homed controller, M5b |
| 8 | If you are broadcasting, get the packet right | S4 + local incident |
| 9 | Where the sources disagree (6 entries) | C5, C6, C7, C12, C16, C18 |
| 10 | The selection ladder: five rules | S7 |
| FAQ | 5 `####` question headings | - |
| Sources | Retrieved-date citation list | - |

### Section 6 detail, the four non-solutions

1. **Cloud API enumeration.** `GET /v1/lights/all` returns `id, uuid, label, connected,
   power, color, group, location, product, last_seen`. No IP and no MAC, so it cannot seed
   a LAN connection with an address. Useful for inventory, useless for reaching a device.
2. **An mDNS reflector.** `_lifx._udp` exists only on firmware 4.110 and above, which lives
   inside the LCM4 hardware major. No 1.x, 2.x, or 3.x device will ever answer it, and a
   reflector cannot reflect a service that is never announced.
3. **A naive UDP broadcast relay.** Plain `udp-broadcast-relay-redux` fails in the common
   topology because relayed broadcasts create no conntrack state, so the unicast replies get
   dropped by the IoT-to-LAN return rule.
4. **ARP/OUI sweeping.** The LIFX OUI is `D0:73:D5` and sweeping works on every firmware, but
   no surveyed codebase automates it, and it is still segment-local.

### Section 9 detail, the six retained conflicts

Each stated in the same three-part shape: what the docs say, what the libraries do, what
measurement showed.

| # | Conflict | Resolution carried into the post |
|---|---|---|
| C5 | Broadcast address: global or per-interface directed | Send both. Measured 53 responders on `255.255.255.255` vs 58 on the directed subnet broadcast, same segment, same fleet. |
| C7 | May `source` be 0 or 1 | Never. Docs say no; aiolifx and Home Assistant can emit either. Floor of 2. |
| C6 | Retry rounds: 1 or 5 | At least 3. Defaults across libraries span an order of magnitude. |
| C12 | MAC+1: gated at 3.70 or at 2.90/3.90 | 3.x track only, resolved by measurement. Table included. |
| C16 | Does Matter replace the LAN protocol | Additive, not replacing. LIFX has issued no statement either way. |
| C18 | Use the cloud API to find your bulbs | Cannot work; the response carries no address. |

## Visuals

1. **Inline SVG figure** in the site's existing chart idiom (`<figure>` wrapping an SVG with
   an explicit `viewBox`, `width:100%`, a `<figcaption>`): the broadcast domain boundary,
   showing which methods reach the bulbs from inside the IoT segment versus from a
   controller on a different VLAN. Must render legibly on both light and dark backgrounds.
2. **Markdown table**, the method x firmware-track matrix (section 5).
3. **Markdown table**, the MAC+1 measurement (section 9), serials truncated.
4. **`ogImage`**, an Unsplash URL in the same query-string format as existing posts.

## Redaction rules

Follows the precedent set by the macvlan post: genericize identity, keep measurement.

**Genericized:** VLAN IDs, subnet addresses, gateway addresses, device labels and room
names, controller hostnames. Illustrative addresses only.

**Kept as measured:** the 53 vs 58 responder split between global and directed broadcast;
the MAC+1 offset table across 2.90, 3.90 and 1.22 devices with serials truncated; the
roughly once-per-minute unsolicited `LightState` broadcast from 1.22 devices; the
`source=0` incident in which a malformed probe made 15 healthy devices look dead and
invalidated a fleet baseline. Fleet size is stated as approximately 58 devices, because the
53 vs 58 measurement is meaningless without a denominator.

**Named products:** UniFi and Home Assistant, both already named in prior posts on this
site. LIFX obviously. Library names are all public open-source projects.

## Honesty requirements carried from the note

These are differentiators, not hedges, and must survive editing:

- The 4.110 mDNS gate rests on LIFX's documentation alone. No independent packet capture of
  `_lifx._udp` in the wild was found, and exactly one implementation supports it.
- SoftAP behaviour on 4.x hardware is untested by anyone, publicly or locally.
- `community.lifx.com` is offline, so the firmware history depends on Wayback snapshots.
- Firmware versions 2.75, 3.00, 3.10, 3.30, 3.41, 3.75 and 3.80 circulate in third-party
  discussion with no evidence of ever existing. Do not gate code on them.
- The local fleet has zero LCM4 hardware, so every 4.x claim is documentary, not measured.

## Cross-links

Five internal links, matching the strategy's minimum:

1. `/guide/operational-architecture/blog/udm-firewall-vs-pfsense-homelab-security` - the
   segmentation decision upstream of this problem
2. `/guide/operational-architecture/blog/macvlan-docker-swarm-networking-deep-dive` - the
   same broadcast-domain constraint one layer down
3. `/guide/operational-architecture/blog/network-observability-platforms` - detecting
   per-segment asymmetry
4. `/guide/operational-architecture/blog/operational-architect-definitive-guide` - lane
   cohesion
5. One further strategy-lane post selected at draft time

## Constraints

- **No em dashes** anywhere in rendered copy (`content`, `summary`, `polymorphicSummary`,
  `geoHighlights`). Verified by grep before completion. Code blocks and internal comments
  are exempt per the global rule, but there is no reason for one to appear there either.
- **Format is TypeScript, not markdown frontmatter.** One `BlogPost` object exported from
  its own file, imported and registered in `src/shared/data/office_blog_posts.ts`.
- **`content` is a template literal.** Backticks and `${` inside it must be escaped.
  Inline HTML and SVG are fine; the renderer is `react-markdown` with `remark-gfm` and
  `rehype-raw`.
- **Polymorphic summary** is required, all three personas.
- **`geoHighlights`** is required, three entries.
- FAQ is rendered as `####` headings inside `content`, followed by a `### Sources` section.
  This site builds no separate `FAQPage` JSON-LD; do not invent a field for it.
- Typecheck must pass. No browser verification unless explicitly requested.

## Out of scope

- Any change to the blog pipeline, date-gating, or deploy workflow.
- Any edit to already-published posts beyond adding a cross-link if one is warranted.
- A second, deeper firmware-reference post. It was considered and set aside; the full
  reference shape was chosen for this single article instead.
- Cross-posting to Untap Web. Already decided against for homelab content on 2026-07-28.
