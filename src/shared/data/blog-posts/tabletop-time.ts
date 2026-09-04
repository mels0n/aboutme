import { BlogPost } from "../office_blog_posts";

export const tabletopTime: BlogPost = {
    id: "tabletop-time-no-login-scheduler-open-api",
    slug: "tabletop-time-no-login-scheduler-open-api",
    title: "Tabletop Time: A No-Login Scheduler Other People Build On",
    author: "Christopher Melson",
    role: "Builder, Tabletop Time · Operational Architect",
    date: "2026-09-10",
    lastUpdated: "2026-09-10",
    ogImage: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=1200&h=630&fit=crop&q=80&auto=format",
    summary: "Tabletop Time is a no-login scheduler for game nights: magic links instead of accounts, quorum logic instead of meeting polls. Why it exists, how possession-based trust replaces authentication, and how its open API lets independent sites like gamethursday.win build on top of it.",
    polymorphicSummary: {
        executive: "Tabletop Time is a small free product with three deliberate bets. First, that removing sign-up entirely, rather than making it easier, is what actually gets a casual group to adopt a tool. Second, that privacy is a feature people can feel: no accounts, no tracking, and events that delete themselves. Third, that an open integration surface is the cheapest distribution a zero-budget product can buy, because every site that builds on the API becomes a channel you did not pay for. The proof is that an independent site, gamethursday.win, chose to route its own community's scheduling through Tabletop Time and carries the attribution link back. That is the whole growth model: be the reliable piece of plumbing someone else wants in their stack.",
        strategist: "The interesting decision in Tabletop Time is the trust model. There are no accounts and no API keys. Authority comes from possession: the device that created an event holds its manager token, a UUID magic link re-establishes that authority on another device, and Telegram or Discord act as optional recovery identities rather than mandatory logins. The integration contract follows the same shape. A third party can hand a user to a prefilled event-creation URL, register a callback address at that moment, and receive lifecycle webhooks when the event is created, finalized, or cancelled. No credential exchange, no OAuth dance, no partner onboarding. The licensing boundary is social rather than technical: free for non-commercial community projects with visible attribution, written agreement for commercial use.",
        engineer: "Next.js App Router, Prisma, Postgres on the hosted instance and SQLite for self-hosters, deployable with Docker. Identity is possession-based: manager tokens live in localStorage, cross-device recovery is a UUID magic link, and votes can optionally bind a Telegram or Discord id. The public surface is event-centric REST: POST /api/event creates an event and accepts a fromUrl callback, GET /api/event/:slug reads state, vote and slot-suggest endpoints are open to attendees, finalize accepts one slotId or an array of slotIds for campaign mode, and there is an ics export. Webhooks fire on CREATED, FINALIZED with attendee and waitlist rosters, and CANCELLED, retrying every 5 minutes for up to an hour. gamethursday.win integrates with nothing but a prefilled /new URL and a webhook receiver."
    },
    geoHighlights: [
        { label: "Core Design", value: "Possession-based trust replaces authentication: device-local manager tokens and UUID magic links carry authority, with Telegram or Discord as optional recovery identities, so nobody ever creates an account" },
        { label: "Integration Model", value: "Third parties create events through a prefilled URL or POST /api/event, register a fromUrl callback, and receive CREATED, FINALIZED and CANCELLED webhooks carrying attendee and waitlist rosters" },
        { label: "Live Example", value: "gamethursday.win, an independent game-night site, hands event creation to Tabletop Time via a prefilled /new URL and receives finalization results at its own webhook endpoint, with attribution linking back" }
    ],
    content: `### Key Takeaways

- **Tabletop Time ([tabletoptime.us](https://www.tabletoptime.us)) is a scheduler built for one job:** getting a tabletop group from "we should play soon" to a locked date with enough players, without anyone creating an account.
- **The origin is personal.** My Magic: The Gathering group was dissolving, not from drama but from coordination failure. The general-purpose poll tools all wanted logins and felt like meeting software. So I built the tool I wanted.
- **The defining design decision is possession-based trust.** There is no authentication anywhere in the product. Manager rights live in a device-local token, magic links restore them across devices, and Telegram or Discord are optional recovery identities, never requirements.
- **The scheduling logic is gamer-native, not meeting-native.** Quorum thresholds, an "If Needed" vote, automatic waitlist promotion, and a campaign mode that locks a whole run of sessions at once. Doodle has none of these because meetings do not have minimum party sizes.
- **A free passion project ships a real developer API** because an integration surface is the cheapest distribution there is. Any site can create events with a prefilled URL or a POST, register a webhook, and get the results back.
- **The proof it works is that someone else built on it.** [gamethursday.win](https://gamethursday.win) routes its community's scheduling through Tabletop Time using exactly that surface, and did so without asking permission, exchanging credentials, or signing anything.

---

### 1. The Problem: Group Chat Is Where Game Nights Go to Die

Every recurring game night runs on the same failure loop. Someone posts "who's in for Thursday?" in the group chat. Four people react with a thumbs up, one says "maybe, depends on the kids' practice schedule," and two never answer. Thursday arrives, three people show up, and the game needs four. Repeat that cycle enough times and the group stops proposing dates at all, which is how a decade-old playgroup quietly ends.

The failure is not commitment. The people in that chat genuinely want to play. The failure is that a chat thread is a terrible data structure for the actual question, which is: **across these candidate time slots, which one clears our minimum player count, and who exactly is in?** That question has a shape. It has candidate slots, votes with three possible values rather than two, a quorum threshold, a capacity ceiling, and a decision moment after which the answer needs to be locked and pushed to calendars.

Scheduling tools existed, obviously. But the general-purpose ones are built for meetings, and it shows. They want an account before you can do anything, which is a real barrier when the person you need a vote from is the one who barely checks the chat. They treat every response as binary when game groups run on "I'll play if you need a fourth." And they have no concept of a minimum viable table, so they will happily declare a winner that two people can attend.

### 2. What Tabletop Time Is

Tabletop Time is a free, open source scheduler ([github.com/mels0n/tabletop_scheduler](https://github.com/mels0n/tabletop_scheduler)) that treats game night as the first-class use case. The flow is deliberately short:

1. **A host creates an event**: a title, candidate date and time slots, a minimum and maximum player count, an optional location.
2. **The host drops one magic link** into whatever chat the group already lives in: Discord, Telegram, a text thread.
3. **Players vote on slots** with three options: Yes, If Needed, or No. Nobody signs up for anything. Following the link is the whole onboarding.
4. **The system surfaces the winning slot**, the first one that clears the minimum player count, and shows exactly who makes it viable.
5. **The host finalizes.** The attendee list locks, capacity overflow lands on a waitlist, and everyone gets calendar output: Google Calendar links and an .ics file.
6. **If a confirmed player drops**, the first person on the waitlist is promoted automatically. Nobody has to notice, chase, or re-poll.

There is also a campaign mode for the D&D case, where the question is not "when can we play once" but "lock the next six sessions." One voting round, multiple finalized slots.

Two properties sit underneath all of it. The hosted instance tracks nothing and events purge themselves within about a day of wrapping up, because a scheduling tool does not need a memory. And the whole product is self-hostable with Docker and SQLite for groups that would rather run their own, which is also the honest proof that the privacy posture is real rather than a landing-page claim.

### 3. Why It Exists

I have been playing tabletop games my whole life, and the build was triggered by watching my own group hit the failure loop described above. The tools I tried first all had the same two defects: they required my least-online friend to create an account, and they felt corporate, like being invited to a stand-up rather than a game.

The design goal that fell out of that experience was specific: **the cost of participating had to be zero.** Not low. Zero. One tap on a link, three buttons, done. Everything else in the product is downstream of taking that constraint seriously, including the part that usually makes people flinch: there is no login system at all.

There is no venture money behind it and no plan for any. It runs on the same principle as the rest of my side projects, which is that the best way to keep a skill honest is to ship something real with it, the same reason the [homelab build notes](/guide/operational-architecture/blog/macvlan-docker-swarm-networking-deep-dive) on this blog exist.

### 4. The Core Design Decision: Possession, Not Accounts

Removing login is easy to say and uncomfortable to build, because accounts are how software normally answers three questions: who is allowed to manage this event, how does a person get their access back on a new device, and how do you recognize the same person twice. Tabletop Time answers all three with possession instead of identity.

**Management rights are a token, not a role.** When you create an event, your browser stores a manager token locally. Holding the token is what makes you the host. There is no user record to look up because there are no users, only events and the devices that hold their keys.

**Recovery is a magic link, not a password reset.** The obvious failure mode of device-local tokens is "I created the event on my laptop and I'm at work on my phone." The answer is a UUID magic link that re-establishes possession on the new device. Telegram and Discord slot in here as optional recovery rails: connect the event to the group's existing chat bot and your identity there can regenerate access, because you have already proven you are you by being inside the group's channel.

**Recognition is optional and additive.** A vote can bind a Telegram or Discord id, which is what lets a profile view assemble your events across devices. But a player who never links anything is a first-class citizen forever. The system degrades gracefully all the way down to "anonymous person with this browser," and every feature that can work at that level does.

This is a real trust-model tradeoff, not a free lunch. Possession-based systems trade away non-repudiation and account recovery guarantees in exchange for zero-friction entry. For a payments product that trade would be reckless. For "can Thursday work for six nerds," it is exactly right, and choosing trust machinery proportionate to what is actually being protected is a judgment call I care about professionally as much as personally. It is the same instinct as [right-sizing any operating model](/guide/operational-architecture/blog/operational-architect-definitive-guide): the control has to earn its friction.

### 5. Why a Free Tool Ships a Developer API

The less obvious decision is that a small free scheduler exposes a documented integration surface at [tabletoptime.us/developers](https://www.tabletoptime.us/developers). Most side projects never do this. The reasoning is worth spelling out, because it is a strategy decision dressed as a technical one.

A scheduling tool is plumbing. Plumbing wins by being embedded, not by being visited. The people best positioned to embed it are other builders: the person running a league site, a club's homepage, a community Discord with its own web presence. Every one of them who wires Tabletop Time in becomes distribution that a zero-marketing-budget product could never buy. The API is not a feature for users. It is the growth model.

The surface is event-centric REST, and it inherits the product's trust model wholesale, which means the thing every third-party developer dreads, credential onboarding, simply is not there. No API key, no OAuth application, no partner form. The core of it:

| Endpoint | What it does |
|---|---|
| \`POST /api/event\` | Create an event. Accepts an optional \`fromUrl\` callback address for lifecycle webhooks. |
| \`GET /api/event/:slug\` | Read event state: slots, votes, participant counts, status. |
| \`POST /api/event/:slug/vote\` | Cast or update a vote, optionally binding a Telegram or Discord identity. |
| \`POST /api/event/:slug/slot/suggest\` | Let an attendee propose a new time slot. |
| \`POST /api/event/:slug/finalize\` | Lock one \`slotId\`, or an array of \`slotIds\` in campaign mode. |
| \`DELETE /api/event/:slug/participant/:id\` | Drop a player. Triggers automatic waitlist promotion on full, finalized events. |
| \`GET /api/event/:slug/ics\` | Calendar export. |

Two conveniences matter more than the endpoint list. First, **deep-link prefill**: a site can skip the API entirely and send a user to \`tabletoptime.us/new?title=...&minPlayers=3&maxPlayers=8\` with slots pre-populated, which turns "integrate a scheduler" into "construct a URL." Second, **lifecycle webhooks**: whatever address arrives in \`fromUrl\` gets a POST when the event is \`CREATED\`, \`FINALIZED\` (with the full attendee and waitlist rosters, and a campaign flag for multi-session events), or \`CANCELLED\`, with retries every 5 minutes for up to an hour. Create with a callback, receive the outcome. That pair is the entire integration contract.

The licensing boundary is deliberately social rather than technical: the API is free for non-commercial community projects, with a visible "Powered by Tabletoptime.us" attribution link, and commercial use needs a written agreement. No enforcement middleware, just a clear norm, which is proportionate for the same reason the trust model is.

### 6. The Proof: What gamethursday.win Built

The reason I trust the reasoning in the previous section is that it stopped being a theory. [gamethursday.win](https://gamethursday.win) is an independent site built for a recurring Thursday game night, with its own branding, its own front door, and its own idea of how its community should feel. What it did not want to rebuild was scheduling mechanics, so it wired in Tabletop Time using exactly the surface described above.

The integration is compact enough to describe completely. When a member kicks off scheduling, the site takes its own event data (title, description, minimum and maximum players), constructs a prefilled \`tabletoptime.us/new\` URL, and appends a \`fromUrl\` pointing at its own endpoint, \`/api/integrations/tabletoptime/webhook\`, plus a correlation id so it can match the callback to the right internal record. The user lands on Tabletop Time with the event already built, the group votes through the normal magic-link flow, and when the host finalizes, the roster comes back to gamethursday.win's webhook. The site also carries a "Powered by Tabletop Time" card linking back, which is the attribution requirement working exactly as intended.

<figure><svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:640px;display:block;margin:0 auto;font-family:system-ui,-apple-system,sans-serif" role="img" aria-label="Diagram of the gamethursday.win integration: a prefilled creation URL flows from gamethursday.win to Tabletop Time, players vote via magic link, and lifecycle webhooks return the finalized roster"><rect width="640" height="320" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/><text x="320" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">One Integration, No Credentials: the gamethursday.win Flow</text><rect x="30" y="60" width="180" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><text x="120" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">gamethursday.win</text><text x="120" y="106" text-anchor="middle" font-size="9.5" fill="#64748b">Builds prefilled /new URL:</text><text x="120" y="120" text-anchor="middle" font-size="9" fill="#475569">title, players, description</text><text x="120" y="140" text-anchor="middle" font-size="9.5" fill="#64748b">Registers callback:</text><text x="120" y="154" text-anchor="middle" font-size="8.5" fill="#475569">fromUrl = .../tabletoptime/webhook</text><text x="120" y="182" text-anchor="middle" font-size="9" fill="#94a3b8">Powered by Tabletop Time</text><rect x="430" y="60" width="180" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><text x="520" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">Tabletop Time</text><text x="520" y="106" text-anchor="middle" font-size="9.5" fill="#64748b">Event created, prefilled</text><text x="520" y="126" text-anchor="middle" font-size="9.5" fill="#64748b">Group votes via magic link</text><text x="520" y="140" text-anchor="middle" font-size="9" fill="#475569">Yes / If Needed / No</text><text x="520" y="160" text-anchor="middle" font-size="9.5" fill="#64748b">Host finalizes the slot</text><line x1="210" y1="100" x2="426" y2="100" stroke="#2563eb" stroke-width="2"/><polygon points="426,100 418,96 418,104" fill="#2563eb"/><text x="318" y="92" text-anchor="middle" font-size="9.5" font-weight="600" fill="#1d4ed8">user sent to prefilled /new URL</text><line x1="426" y1="180" x2="210" y2="180" stroke="#16a34a" stroke-width="2"/><polygon points="210,180 218,176 218,184" fill="#16a34a"/><text x="318" y="172" text-anchor="middle" font-size="9.5" font-weight="600" fill="#166534">webhooks: CREATED, FINALIZED, CANCELLED</text><text x="318" y="196" text-anchor="middle" font-size="8.5" fill="#64748b">FINALIZED carries the attendee and waitlist rosters</text><rect x="180" y="238" width="280" height="52" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.2"/><text x="320" y="260" text-anchor="middle" font-size="9.5" font-weight="600" fill="#334155">No API keys. No OAuth. No partner onboarding.</text><text x="320" y="276" text-anchor="middle" font-size="9" fill="#64748b">The contract is a URL out and a webhook back.</text></svg><figcaption>The whole integration is a prefilled URL in one direction and lifecycle webhooks in the other. gamethursday.win keeps its own identity and front door; Tabletop Time does the scheduling mechanics underneath.</figcaption></figure>

I want to be precise about why this example matters more than a testimonial would. Nobody coordinated this with me before building it. The integration surface, the webhook retry behavior, and the attribution norm were all designed in advance for a consumer I could not see, and then a real one showed up and used them as designed. For anyone who designs systems for a living, that is the only test of an interface that counts: **it worked for someone who never attended your design meetings.**

### 7. The Professional Lesson Hiding in a Game-Night Tool

I write here mostly about [operational architecture](/guide/operational-architecture) at enterprise scale, and Tabletop Time is about as far from a regulated-markets integration program as software gets. But the reason I keep building small products like this is that they force the same disciplines with none of the institutional cover.

The trust model had to be argued from what is actually at stake, not copied from convention. The integration contract had to be small enough to describe in two sentences, because no third-party developer owes a side project their afternoon. The licensing boundary had to be enforceable by norms, because there is no legal department. Every one of those is a scaled-down version of a decision I have made at $100M+ program scale, and the small version is in some ways harsher: when the entire adoption budget is "one tap on a link," you find out immediately whether your friction was earning its keep.

#### Is Tabletop Time free?

Yes. The hosted instance at tabletoptime.us is free, there are no ads and no tracking, and the code is open source. If you want full control, you can self-host it with Docker. Donations exist for people who want the hosted instance to keep running, and that is the entire business model.

#### Do my players need to install or sign up for anything?

No. Players follow a link and vote. That is the whole flow. Linking a Telegram or Discord identity is available for people who want cross-device sync and profile history, but it is never required.

#### Can I use the API for my own community site?

Yes, that is what it is for. Non-commercial community projects can use it freely with a visible "Powered by Tabletoptime.us" attribution link, the way gamethursday.win does. Commercial integrations need a written agreement first. The developer documentation lives at [tabletoptime.us/developers](https://www.tabletoptime.us/developers).

#### What does the webhook integration actually require on my side?

One endpoint that accepts a POST. Pass its address as \`fromUrl\` when creating an event (or in the prefilled \`/new\` URL) and you will receive lifecycle callbacks for creation, finalization with the full roster, and cancellation, with automatic retries every 5 minutes for up to an hour if your endpoint is briefly down.
`
};
