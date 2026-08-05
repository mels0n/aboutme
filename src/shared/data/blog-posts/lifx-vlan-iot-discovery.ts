import { BlogPost } from "../office_blog_posts";

export const lifxVlanIotDiscovery: BlogPost = {
    id: "lifx-vlan-iot-discovery",
    slug: "lifx-vlan-iot-discovery",
    title: "LIFX on a Segmented IoT VLAN: Why Discovery Breaks and How to Fix It",
    author: "Christopher Melson",
    role: "Homelab Architect",
    date: "2026-08-13",
    lastUpdated: "2026-08-13",
    ogImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=1200&h=630&fit=crop&q=80&auto=format",
    summary: "Segmenting IoT onto its own VLAN is the right security call, and the moment your LIFX bulbs vanish from Home Assistant. Discovery is a broadcast, and broadcasts stop at the router. The complete method map, the four fixes that fail, and the three that work.",
    polymorphicSummary: {
        executive: "Putting smart-home devices on an isolated network segment is standard security practice, because those devices are the least patchable, least trustworthy things on a network. The unadvertised cost is that most smart-home devices are found by shouting on the local network and listening for answers, and that shout does not cross the boundary you just created. The result is a controller that works perfectly while sitting on the same segment and finds nothing at all after segmentation, with no error message that explains why. The fix is not to abandon the segmentation. It is to replace automatic discovery with explicit addressing, which costs an afternoon of setup and then stays fixed.",
        strategist: "This is a general pattern rather than a vendor quirk: security segmentation and zero-configuration discovery are in direct architectural conflict, because the second is built on the broadcast semantics the first is designed to contain. LIFX is an unusually clear case study because the vendor's own documentation is incomplete, the community history that filled the gap has gone offline, and fourteen independent client libraries each made different choices about how to construct the same discovery packet. Choosing among the available methods is a real architecture decision with real tradeoffs: explicit addressing trades convenience for determinism, an in-segment agent trades one more moving part for keeping discovery intact, and a multi-homed controller trades a widened trust boundary for simplicity. There is no option that keeps automatic discovery and full isolation at the same time.",
        engineer: "LIFX discovery is a UDP broadcast of GetService (type 2) to port 56700, and every surveyed implementation in every language uses it as the primitive. It is therefore bounded by the broadcast domain and is not routable. Unicast GetService is ordinary routed UDP and crosses segments fine, but there is no discovery-by-serial in the protocol, so you must already hold the address. mDNS _lifx._udp exists only at firmware 4.110 and above, which sits inside the LCM4 hardware major, so no 1.x, 2.x or 3.x device will ever answer a reflector. A naive udp-broadcast-relay creates no conntrack state for the relayed datagram, so the unicast replies are dropped by the return-path rule. Practical fixes: DHCP reservations plus a static host list, an agent inside the segment, or a multi-homed controller broadcasting per interface. If you do broadcast, send to both the directed subnet address and 255.255.255.255, use source greater than or equal to 2, and run at least three retry rounds."
    },
    geoHighlights: [
        { label: "Core Constraint", value: "No LIFX discovery method crosses a subnet boundary unaided on any firmware generation; broadcast discovery is bounded by the broadcast domain and the protocol has no discovery-by-serial" },
        { label: "The mDNS Caveat", value: "mDNS _lifx._udp discovery exists only on firmware 4.110 and above, so an mDNS reflector finds nothing on LCM1, LCM2 or LCM3 hardware regardless of configuration" },
        { label: "Measured Finding", value: "On one segment, a global 255.255.255.255 broadcast drew 53 responders while a directed subnet broadcast drew 58 from the same fleet; sending only the global address silently under-discovers" }
    ],
    content: `### Key Takeaways

- **LIFX discovery is a UDP broadcast primitive.** Broadcasts are bounded by the broadcast domain, so the moment your bulbs live on an IoT VLAN and your controller lives anywhere else, discovery stops. Nothing is broken. The packets simply never arrive.
- **Of the eight discovery methods LIFX devices have supported across their history, none crosses a subnet boundary unaided.** Two get close and both are compromised: unicast works across routed networks but requires you to already know the address, and the cloud API works from anywhere but returns no IP and no MAC.
- **Firmware major numbers are hardware generations, not a version ladder.** Versions 2.90 and 3.90 shipped on the same day. A 2.x device will never gain mDNS discovery, because mDNS arrived at 4.110, inside a hardware generation that device cannot cross.
- **"Just use an mDNS reflector" fails on most fleets**, because \`_lifx._udp\` only exists on firmware 4.110 and above. A reflector cannot reflect an announcement that is never made.
- **A plain UDP broadcast relay also fails** in the usual firewall topology, because relayed broadcasts create no connection-tracking state, so the unicast replies get dropped on the way back.
- **What actually works:** DHCP reservations plus explicit unicast addressing, an agent running inside the segment, or a multi-homed controller with a leg in each VLAN. Each trades something real, and you should pick deliberately rather than discover the tradeoff later.

---

### 1. The Symptom: It Worked Yesterday, on a Flat Network

The setup that produces this problem is the setup everyone is told to build. Smart bulbs, plugs and cameras are the least patchable and least trustworthy devices on a home or small-office network, so you move them onto their own VLAN, write a firewall policy that lets your trusted network reach into the IoT segment while blocking the reverse, and feel appropriately responsible about it. That reasoning is correct, and the upstream decision is worth making carefully: see [Is Your UniFi Firewall Enough? The Homelab Security Deep-Dive](/guide/operational-architecture/blog/udm-firewall-vs-pfsense-homelab-security) for how the policy itself should be shaped.

Then you restart Home Assistant and the LIFX integration finds nothing.

The confusing part is that the bulbs are fine. They respond to the phone app. They hold their DHCP leases. The switch shows them online with normal traffic counters. You can even open a shell on the controller and reach a bulb's IP directly, because your firewall policy explicitly permits trusted-to-IoT traffic. Ping works. The port answers. And the integration still finds nothing, with no error that explains itself.

If you have searched any of "LIFX not discovered Home Assistant VLAN", "LIFX bulbs different subnet", "LIFX IoT VLAN discovery", or "LIFX cross subnet", this is the article for that. The short answer is in the next section. The rest of the article is the complete map, because the short answer immediately raises the question of what to do instead, and the honest response to that depends on which LIFX hardware you actually own.

---

### 2. Why It Breaks: Discovery Is a Broadcast, and Broadcasts Stop at the Router

Reaching a device and discovering a device are different operations, and only one of them is routable.

LIFX's LAN protocol discovers devices by sending a \`GetService\` message (message type 2, zero payload) as a UDP broadcast to port 56700, and listening for \`StateService\` replies that carry each device's serial number and port. Every implementation surveyed, across Python, JavaScript, Java, C#, Rust, Groovy and Go, uses this same primitive. It is not one option among many. It is the discovery mechanism.

A broadcast is bounded by the broadcast domain. The limited broadcast address \`255.255.255.255\` is never forwarded by a router, by design. A directed subnet broadcast (something like \`192.168.30.255\`) reaches more devices within its own segment, but RFC 2644 made forwarding of directed broadcasts default-off in 1999, and consumer and prosumer gear does not expose a setting to re-enable it. A VLAN boundary is a broadcast domain boundary. That is most of what a VLAN is.

So the controller shouts, the router declines to carry the shout, and nothing answers. The bulbs are reachable and undiscoverable at the same time, which is exactly why the symptom is so disorienting.

There is one further protocol fact that closes off the obvious workaround: **there is no discovery-by-serial.** The protocol offers no way to ask "where is device d073d5xxxxxx". You broadcast, and you read serial numbers out of whatever replies. Every "find this specific bulb" feature in every tool built on this protocol is broadcast-then-filter. This is why you cannot simply hand your controller a list of serials and let it locate them across the boundary.

<figure><svg viewBox="0 0 620 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:620px;display:block;margin:0 auto;font-family:system-ui,-apple-system,sans-serif" role="img" aria-label="Diagram showing broadcast discovery blocked at the VLAN boundary while unicast traffic passes through"><rect width="620" height="300" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/><text x="310" y="26" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">What Crosses the VLAN Boundary, and What Does Not</text><rect x="24" y="52" width="200" height="200" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><text x="124" y="74" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Trusted VLAN</text><rect x="54" y="88" width="140" height="34" rx="5" fill="#e0e7ff" stroke="#a5b4fc"/><text x="124" y="109" text-anchor="middle" font-size="10.5" fill="#3730a3">Home Assistant</text><text x="124" y="150" text-anchor="middle" font-size="9.5" fill="#64748b">Sends GetService</text><text x="124" y="164" text-anchor="middle" font-size="9.5" fill="#64748b">to 255.255.255.255</text><rect x="396" y="52" width="200" height="200" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><text x="496" y="74" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">IoT VLAN</text><rect x="426" y="88" width="140" height="34" rx="5" fill="#fef3c7" stroke="#fcd34d"/><text x="496" y="109" text-anchor="middle" font-size="10.5" fill="#92400e">LIFX bulbs</text><text x="496" y="150" text-anchor="middle" font-size="9.5" fill="#64748b">Listening on</text><text x="496" y="164" text-anchor="middle" font-size="9.5" fill="#64748b">UDP port 56700</text><rect x="266" y="120" width="88" height="64" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/><text x="310" y="147" text-anchor="middle" font-size="10.5" font-weight="600" fill="#334155">Router /</text><text x="310" y="161" text-anchor="middle" font-size="10.5" font-weight="600" fill="#334155">Firewall</text><line x1="224" y1="100" x2="262" y2="100" stroke="#dc2626" stroke-width="2"/><line x1="252" y1="92" x2="268" y2="108" stroke="#dc2626" stroke-width="2.5"/><line x1="268" y1="92" x2="252" y2="108" stroke="#dc2626" stroke-width="2.5"/><text x="310" y="96" text-anchor="middle" font-size="9.5" font-weight="600" fill="#991b1b">broadcast dropped</text><line x1="224" y1="214" x2="392" y2="214" stroke="#16a34a" stroke-width="2"/><polygon points="392,214 384,210 384,218" fill="#16a34a"/><text x="310" y="207" text-anchor="middle" font-size="9.5" font-weight="600" fill="#166534">unicast to a known IP passes</text><text x="310" y="240" text-anchor="middle" font-size="9" fill="#64748b">Reachability and discoverability are not the same property.</text><text x="310" y="276" text-anchor="middle" font-size="9.5" fill="#475569">The bulbs are reachable. They are simply never asked.</text></svg><figcaption>The controller can open a connection to any bulb whose address it already knows, because that is ordinary routed traffic permitted by the trusted-to-IoT policy. The discovery broadcast that would have told it those addresses is stopped at the boundary.</figcaption></figure>

---

### 3. The Eight Discovery Methods, and What Each One Actually Requires

LIFX devices have supported eight distinct discovery mechanisms across roughly twelve years of hardware. Most guidance discusses one or two of them and quietly assumes the rest do not exist, which is how people end up trying to reflect a service their hardware never announces.

**M1. PAN gateway over TCP, with an 802.15.4 mesh.** The original 2014 model, and genuinely gone. First-generation bulbs formed an 802.15.4 mesh with one WiFi "master" bulb acting as gateway, and clients opened a real TCP connection to it on port 56700. Firmware 1.5 (December 2014) moved control off TCP onto UDP broadcast; firmware 2.0 (March 2015) removed the mesh radio role entirely. These are two separate deprecations that are frequently compressed into one. The scar is still visible in the current specification: the service enumeration lists \`1 = UDP\` and \`2\` through \`5\` as reserved with no explanation. Value \`2\` is the retired TCP service.

**M2. UDP broadcast \`GetService\`.** Universal. Every device on every firmware answers it, and it is the discovery primitive in essentially every implementation. Segment-local by definition. Section 8 covers how to construct the packet correctly, which is less obvious than it should be.

**M3. Unicast \`GetService\`.** The same message sent to a known IP address. Works on every firmware and is **the only method that crosses subnets**, because it is ordinary routed UDP with no broadcast semantics at all. Its limitation is circular: you must already know the address you are trying to reach.

**M4. mDNS \`_lifx._udp\`.** LIFX's stated direction, described in their documentation as the preferred method going forward. The service advertises TXT records carrying the serial, the semantic firmware version and the product ID. It exists only on **firmware 4.110 and above**, and it is additive rather than replacing: 4.x hardware answers both mDNS and broadcast. Section 6 explains why this is a much narrower fix than it sounds.

**M5. Passive listening for unsolicited state broadcasts.** First-generation devices only. Firmware 1.22 devices broadcast an 88-byte \`LightState\` message to the subnet broadcast address unbidden, roughly once per minute, in a tight burst across the whole first-generation population. This is measurable with no probe sent at all, which makes it the only genuinely passive LIFX discovery method, and a trap when testing: a burst of first-generation broadcasts looks identical whether you solicited it or not. Any probe test on a mixed fleet needs a no-probe control capture to tell the two apart. Still segment-local.

**M6. Piggyback discovery.** Finding devices through signals they emit for other reasons. Three variants matter. **HomeKit mDNS** (\`_hap._tcp\`) requires the HomeKit chip, which is a hardware property rather than a firmware one, and it announces only on boot or first join, so a device that changes IP without rebooting announces nothing on any generation. **DHCP lease observation** matches the LIFX OUI on any lease your router sees, works on all firmware, and re-matches known devices to follow IP changes without any broadcast at all. **ARP or OUI sweeping** against \`D0:73:D5\` works on every firmware and appears in LIFX's own troubleshooting material as a manual technique, but no surveyed codebase automates it.

**M7. SoftAP setup mode.** A hardware-reset device broadcasts an open access point named like \`LIFX Mini D 5585fc\` and listens on \`172.16.0.1:56700\`. Discovery is a WiFi scan for SSIDs beginning with LIFX. This is a provisioning path, not a day-to-day discovery path, and its provisioning messages are reverse-engineered rather than documented. Worth knowing exists; not a solution to this problem.

**M8. Matter commissioning.** Firmware 4.100 and above on fifth-generation hardware and the LIFX Switch. Standard Matter commissioning, and it does **not** displace the LAN protocol: Matter-commissioned LIFX bulbs are still auto-discovered by the classic LAN integration, to the point of producing duplicate device-registry entries in Home Assistant. Matter also exposes considerably less than the LAN protocol does, with no multizone control and none of the LIFX-specific effects.

**M9. Cloud API enumeration.** \`GET https://api.lifx.com/v1/lights/all\` is server-mediated, so it works across any subnet or NAT, which makes it sound like the answer. It is not, for a reason covered in section 6.

---

### 4. Firmware Majors Are Hardware Generations, Not a Version Ladder

This is the single fact that makes the rest of the picture legible, and LIFX never states it plainly anywhere.

**The major number identifies the hardware generation. Minor numbers advance independently within each track, and the tracks overlap in time.**

| Track | Generation | Representative products | Terminal firmware | Era |
|---|---|---|---|---|
| 1.x | Gen1 and Gen2 | Original 1000, Color 1000, White 800 | 1.22 | 2014 to 2016 |
| 2.x | Gen3 (LCM2) | LIFX and LIFX+ A19/BR30, Downlight, LIFX Z, Beam | 2.90 | 2016 to 2022 |
| 3.x | Gen4 (LCM3) | Mini, GU10, Candle, Filament, Tile, Switch | 3.90 | 2018 to 2022 |
| 4.x | Gen5 (LCM4) | Ceiling, Luna, String, Tube, Permanent Outdoor | ongoing, 4.110 and up | 2023 onward |

The proof that these are parallel tracks rather than a sequence is that **2.77 and 3.42 shipped on the same day**, 11 January 2019. Version 3.60 (January 2020) predates 2.80 (March 2021). The Tile ran its own 3.50 in February 2019, distinct from the Mini's 3.50 in September 2019.

Two consequences bite immediately:

1. **Comparing firmware as a single ordered number across generations is wrong.** LIFX's own documentation says to treat it as a (major, minor) pair. Parsing it as a decimal is worse still, because 2.9 means minor 9, not minor 90.
2. **A device never crosses a major boundary.** No 1.x device will ever receive mDNS, extended multizone or Matter. Those are not features being withheld. They belong to hardware that shipped years later.

One caution while researching this yourself: the versions **2.75, 3.00, 3.10, 3.30, 3.41, 3.75 and 3.80** circulate in third-party discussion and have no evidence of ever existing. Searches across the archived official changelog pages, the archived community forum and every product-version table in every library turn up nothing for any of them. 3.41 is almost certainly a misremembering of 3.42. Do not gate code on a version that never shipped.

---

### 5. The Master Matrix

Availability of each method by firmware track. This is the table to check before adopting any fix.

| Method | 1.x (Gen1/2) | 2.x (Gen3) | 3.x (Gen4) | 4.x (Gen5) |
|---|---|---|---|---|
| M1 PAN gateway, TCP, 802.15.4 mesh | Partial: TCP dropped at 1.5, mesh at 2.0 | No | No | No |
| M2 UDP broadcast \`GetService\` | Yes, replies broadcast to :56700 | Yes, unicast reply | Yes, unicast reply | Yes, unicast reply |
| M3 Unicast \`GetService\` | Yes | Yes | Yes | Yes |
| M4 mDNS \`_lifx._udp\` | No | No | No | Yes, 4.110 and up, additive |
| M5 Passive state broadcast | Yes, about once per minute | No | No | No |
| M6a HomeKit \`_hap._tcp\` | No HomeKit chip | Yes, boot or join only | Yes, boot or join only | Yes, boot or join only |
| M6b DHCP lease observation | Yes | Yes | Yes | Yes |
| M6c ARP / OUI sweep | Yes | Yes | Yes | Yes |
| M7 SoftAP provisioning | Yes | Likely, untested | Yes, verified on 3.90 | Unknown |
| M8 Matter commissioning | No | No | Upgradeable to 4.x | Yes, 4.100 and up, coexists with LAN |
| M9 Cloud API enumeration | Yes | Yes | Yes | Yes |
| **Crosses a subnet, unaided** | **No** | **No** | **No** | **No** |

That last row is the whole problem in one line. Only M3 crosses a boundary, and it needs the address in advance. Only M9 works from anywhere, and it returns no address. Everything genuinely discovery-shaped is segment-local on every firmware generation ever shipped.

---

### 6. Four Fixes That Look Right and Are Not

Each of these is common advice. Each fails for a specific, checkable reason.

#### "Use the cloud API to enumerate your bulbs"

The response from \`/v1/lights/all\` contains \`id\`, \`uuid\`, \`label\`, \`connected\`, \`power\`, \`color\`, \`brightness\`, \`group\`, \`location\`, \`product\` and \`last_seen\`. It contains **no IP address and no MAC address**. It can seed an inventory of serials, labels and product IDs, and it is genuinely the only method that works across arbitrary NAT, but it cannot hand you something to connect to. Combined with the absence of discovery-by-serial in the LAN protocol, an inventory of serials gets you no closer to a connection. Useful for auditing what you own. Useless for reaching it.

#### "Run an mDNS reflector between the VLANs"

This is excellent advice for Chromecast, AirPlay, printers and HomeKit, and reflectors are a standard tool for exactly this class of problem. It fails here for a blunt reason: \`_lifx._udp\` was introduced at **firmware 4.110**, which lives inside the fifth-generation hardware major. If your fleet is Original, Mini, GU10, Candle, Filament, A19, BR30, Z or Beam, none of those devices announce the service, and a reflector cannot reflect an announcement that is never made.

Two further cautions if you do own fifth-generation hardware. First, exactly one client library implements \`_lifx._udp\` discovery at all, so your controller very likely does not use it even where the hardware supports it. Second, and worth stating plainly: **no independent packet capture of \`_lifx._udp\` in the wild could be found**. No third-party dump, no community capture. The 4.110 gate rests on LIFX's documentation alone. Enumerating every mDNS service type on an IoT segment with no fifth-generation hardware present found fifteen service types and no LIFX, which is consistent with the documentation but only confirms it in the negative.

The HomeKit variant of this idea is more useful, since far more LIFX hardware carries the HomeKit chip, but it has its own structural limit: HomeKit announces on boot or first join only. A device that changes IP without rebooting, which is exactly what happens on a lease renewal, announces nothing. In one measured test, fifteen rebooted bulbs all recovered, ten of them through HomeKit within about ten seconds, while **zero of fifteen** force-reconnected bulbs recovered. That gap is not firmware-specific. Third-generation and fourth-generation devices strand on lease renewal identically to first-generation ones.

#### "Relay the broadcasts across with udp-broadcast-relay"

Conceptually right, and it fails in practice in the most common topology. A plain \`udp-broadcast-relay-redux\` forwards the broadcast into the IoT segment, the bulbs receive it, and they reply by unicast to the controller's source port. Those replies then hit the firewall as **new inbound IoT-to-trusted connections**, because the relayed broadcast created no connection-tracking state that the replies could be matched against. Your IoT-to-trusted deny rule, the rule that is the entire point of the segmentation, drops them. The symptom is a relay that appears to be running correctly, forwards traffic you can see in a capture, and produces no discovered devices.

Making this work means a relay that preserves conntrack state, which is a meaningfully harder piece of engineering than the standard tool provides, and it means punching a return path through the exact rule you built the VLAN to enforce.

#### "Just ARP scan the subnet for the LIFX OUI"

The LIFX OUI is \`D0:73:D5\`, and it identifies LIFX hardware cleanly. One detail will cost you ten minutes if nobody warns you: the IEEE registry entry is filed under **LIFI LABS MANAGEMENT PTY LTD**, LIFX's corporate entity, so searching the registry for "LIFX" returns nothing at all. That single block is the only one registered to the company, so an OUI match is unambiguous. It works on every firmware. It even appears in LIFX's own network troubleshooting material as a manual technique. Two problems: **no surveyed codebase automates it**, so this is a script you are writing and maintaining yourself, and ARP is itself segment-local, so it must run inside the IoT VLAN anyway. At which point you have built a worse version of the agent described in the next section.

---

### 7. What Actually Works

Three approaches, in increasing order of how much they change your architecture.

#### Option A: DHCP reservations plus explicit unicast

Give every bulb a static DHCP reservation, then hand your controller the addresses directly rather than asking it to discover them. Unicast \`GetService\` is ordinary routed UDP, works on every firmware generation, and passes through your existing trusted-to-IoT allow rule without any new holes.

Most clients support this in some form. Home Assistant's LIFX integration accepts a host directly and unicast-connects to verify each device before creating a config entry, regardless of how it was found. Some libraries let you construct a device object from a MAC and IP pair, skipping discovery entirely. One C# library supports only this path and has no broadcast code at all.

This is the option I would start with in almost every case. It is the least clever thing on the list, and its determinism is the point: nothing depends on a broadcast arriving, so nothing intermittently fails. The costs are honest ones. You maintain a list, adding a bulb becomes a two-step operation, and you should confirm your reservations actually hold.

One trap specific to LIFX makes reservations less reliable than they look. On the fourth-generation track, starting at firmware 3.70, **devices report a MAC address one greater than their serial number**, which breaks reservations that were created against the serial. Section 9 covers the measurement.

#### Option B: An agent inside the segment

Run something small in the IoT VLAN that performs discovery locally, where broadcast works normally, and reports results outward over a single permitted connection. This preserves genuine discovery, including new devices appearing without manual work.

The tradeoff is that you now have a device inside your least-trusted segment that is allowed to talk to your trusted one, which is a narrower version of the hole a broadcast relay would open, but a hole nonetheless. Make it one direction, one destination, one port. If you are running containers, this is territory where a container can hold its own address directly on the IoT VLAN, which is a neighbouring problem with its own sharp edges: see [Macvlan in Docker Swarm](/guide/operational-architecture/blog/macvlan-docker-swarm-networking-deep-dive) for how that behaves and what breaks.

#### Option C: A multi-homed controller

Give the controller itself an interface in the IoT VLAN. Discovery then runs natively on that segment with no relay and no agent.

The mature client implementations compute per-interface directed broadcasts rather than sending to the global broadcast address, which is precisely what makes this work: the controller broadcasts out of each leg separately. Home Assistant does this across its enabled adapters, though its broadcast address is not user-configurable, the old YAML option for it having been removed years ago.

The tradeoff is the biggest of the three. A host with a leg in your least-trusted segment is a host that can bridge it, and it is usually the single most valuable machine on your network. If you take this route, treat that interface as hostile: no forwarding, tight firewall rules on the host itself.

#### And one addition worth making regardless

**Observe DHCP leases.** Home Assistant matches the LIFX OUI on any lease it observes and re-matches already-registered devices to follow IP changes without any broadcast at all. This works on every firmware generation and, unlike everything else on this list, it survives the lease-renewal case that strands HomeKit-based discovery. It needs a router integration as the data source, which you likely already have. It pairs well with Option A specifically: reservations pin the addresses, lease observation catches it when one moves anyway. Catching that kind of drift before it becomes a broken automation is a monitoring concern as much as a networking one, which is the subject of [Network Observability Platforms](/guide/operational-architecture/blog/network-observability-platforms).

---

### 8. If You Are Broadcasting, Construct the Packet Correctly

This section applies inside the segment, once you have chosen Option B or C. The official documentation and the working implementations do not agree with each other, and the implementations do not agree among themselves. **No two surveyed libraries construct the discovery packet identically.** The practical effect is that swapping libraries can change which devices you find.

| Field | What to send | Why |
|---|---|---|
| \`target\` | all zeros | Universal agreement |
| \`tagged\` | 1 | Two official pages disagree, one says 1 and one says 0. Every Python library forces 1. The most widely deployed JavaScript client never sets the bit, so it ships 0, and works. Send 1; do not assume devices enforce it. |
| \`source\` | 2 or greater, never 0 or 1 | Documented constraint. Some widely used libraries generate an unconstrained 32-bit random value and can emit 0 or 1. |
| \`res_required\` | 1 | The docs recommend 0 for Get messages. Three major Python libraries all send 1 anyway. Send 1; it is what the most-tested clients do and it is harmless. |
| \`ack_required\` | 0 | Universal agreement |
| Destination port | 56700 | Universal agreement |
| Source port | 56700 if you own first-generation hardware | The docs recommend binding 56700 for backward compatibility. Exactly one surveyed implementation actually does. See section 9. |
| Retry rounds | at least 3 | Defaults across libraries span an order of magnitude, from one attempt to five escalating rounds. |

Two field choices deserve emphasis, because getting them wrong produces a failure that looks like dead hardware.

**Send to both broadcast addresses.** On one segment, a global \`255.255.255.255\` broadcast drew **53 responders**, while a directed subnet broadcast on the same segment, same fleet, same minute, drew **58**, which was the entire fleet, sub-second, including every first-generation device. A client that only offers the global broadcast will silently under-discover, and at least one popular library hard-codes it with no way to configure around it.

**Never send \`source = 0\`.** A probe built with \`source = 0\` and \`res_required = 0\` was tolerated by third and fourth-generation devices and **rejected outright by every 1.22 device**, making fifteen perfectly healthy bulbs look dead and invalidating a whole fleet baseline before anyone noticed the packet was malformed. Since the JavaScript client demonstrably works while sending \`res_required = 0\`, \`source\` is the more likely culprit of the pair, though the two were changed together in that test so the attribution is not clean. The safe combination is \`source\` at 2 or greater, \`res_required = 1\`, \`tagged = 1\`.

---

### 9. Where the Sources Disagree

Six disagreements that change what you should do. Each is stated the same way: what the documentation says, what the implementations do, and what measurement showed.

**Broadcast address: global or per-interface directed?** The docs are silent on a preference. Implementations split roughly evenly, with several hard-coding \`255.255.255.255\` and several computing per-interface directed addresses. Measurement settles it: 53 responders versus 58 on the same segment. Send both.

**May \`source\` be 0 or 1?** The docs say never, because 0 may cause the device to broadcast its reply and 1 is ignored by some firmware. Some libraries obey with an explicit floor of 2; others generate an unconstrained random 32-bit value and can emit either. This is a real latent bug, occurring roughly once in two billion runs, which is to say effectively invisible until it is not. Set your own floor.

**How many retry rounds?** UDP discovery is lossy and the defaults span an order of magnitude: one attempt at one second in one library, a re-broadcast every 180 seconds in another, five escalating rounds in the most careful ones, and one Hubitat driver that makes five passes with an explicit comment about mitigating UDP loss. Anything below about three rounds will intermittently miss devices on a busy or large segment.

**MAC+1: which firmware introduced it?** This one is genuinely confusing in the source material, and it matters because it breaks DHCP reservations, which is Option A above. LIFX's 3.70 release notes introduce the behaviour on the fourth-generation track. LIFX's combined 2.90/3.90 page also describes it, which reads as though the third-generation track got it too. Measurement across both tracks resolves it:

| Firmware | Product | Serial, last three octets | MAC seen on the network | Offset |
|---|---|---|---|---|
| 1.22 | White 800 | \`10:53:8a\` | \`10:53:8a\` | 0 |
| 2.90 | A19 | \`40:7d:e9\` | \`40:7d:e9\` | 0 |
| 2.90 | A19 | \`2f:72:7d\` | \`2f:72:7d\` | 0 |
| 3.90 | Mini DD | \`38:b3:82\` | \`38:b3:83\` | +1 |
| 3.90 | Downlight | \`76:58:24\` | \`76:58:25\` | +1 |

MAC+1 is a fourth-generation behaviour introduced at 3.70. The third-generation track never adopted it. The combined release page documents the union of both tracks' changes, and reading it as a single release is what created the apparent conflict. The strongest evidence here is independent of any client library: on 3.90 devices the network controller's own record is internally inconsistent, with the DHCP hostname encoding the true serial while the MAC is one higher (\`LIFX-Mini-D-38B382\` against a MAC ending \`38:b3:83\`). On 2.90 devices the hostname and MAC agree. Confirmed across two different 3.90 product families, so it is a firmware behaviour rather than a per-model quirk.

**Does Matter replace the LAN protocol?** The assumption in circulation is that it does. The evidence says otherwise: Matter-commissioned LIFX bulbs are also auto-discovered by the classic LAN integration, producing duplicate device entries, with both integrations controlling the bulbs successfully. Matter is additive. LIFX has issued no statement either deprecating or guaranteeing the LAN protocol, which is silence rather than policy, and worth factoring into any long-horizon decision.

**Can the cloud API seed LAN discovery?** Common advice says enumerate through \`api.lifx.com\`. The response carries no IP and no MAC. It cannot.

One sourcing caveat that applies to everything above: **the official LIFX community forum is offline**, and it held the largest body of firmware and discovery-quirk reports. The firmware history in section 4 leans heavily on archived snapshots. The documentation changelog referenced in various places does not exist, and the version numbers in the public protocol repository are specification versions, not firmware versions, which are routinely confused for each other.

---

### 10. The Selection Ladder

Five rules, in order. Work down until one applies.

1. **Know the IP already?** Use unicast. Every firmware generation, crosses subnets, no discovery needed. Combined with DHCP reservations this covers an entire fleet, and it is the right default for a segmented network.
2. **Same broadcast domain?** Use broadcast, sent to **both** the directed subnet address and \`255.255.255.255\`, with \`source\` at 2 or greater, \`res_required = 1\`, \`tagged = 1\`, and at least three retry rounds. Bind source port 56700 if you own first-generation hardware.
3. **Different broadcast domain?** Nothing native works. Choose deliberately between an agent inside the segment, a multi-homed controller, or lease observation through your router. A naive broadcast relay is not on this list for the conntrack reason in section 6.
4. **Entire fleet on 4.110 or newer?** mDNS becomes available, with a reflector for cross-VLAN. Note that it is additive, so those devices still answer broadcast, and that the evidence for it is documentary rather than observed.
5. **Onboarding a factory-reset device?** SoftAP setup mode, which is a provisioning path rather than a discovery one.

The larger point generalises past LIFX. Zero-configuration discovery and network segmentation are in direct architectural conflict, because the first is built on precisely the broadcast semantics the second exists to contain. Any protocol that finds devices by shouting on the local wire will break the day you segment, and the fix is always the same shape: replace discovery with explicit addressing, move the discovering thing inside the segment, or give the controller a presence on both sides. Deciding which of those you are willing to live with is [an architecture decision](/guide/operational-architecture/blog/operational-architect-definitive-guide), and it is much cheaper made deliberately than discovered at two in the morning when the lights do not come on.

That is also the general case of a pattern worth naming: the constraint here is structural, not a bug to be worked around, and the workarounds that ignore the structure (reflectors for services that are never announced, relays that lose their return path) cost more than the explicit solution they were avoiding. Recognising which constraints are structural is most of what separates a system that scales from one that accumulates workarounds, a theme covered at greater length in [Scalability is an Engineering Problem](/guide/operational-architecture/blog/scalability-engineering).

---

### Frequently Asked Questions

#### Why does Home Assistant find my LIFX bulbs on a flat network but not after I create an IoT VLAN?

Because LIFX discovery is a UDP broadcast of \`GetService\` to port 56700, and broadcasts do not cross a router. A VLAN boundary is a broadcast domain boundary, so the discovery packet never reaches the bulbs. The bulbs remain fully reachable by unicast if your firewall permits trusted-to-IoT traffic, which is why you can ping a bulb that the integration insists does not exist. Reachability and discoverability are different properties.

#### Can an mDNS reflector fix LIFX discovery across VLANs?

Only if every device is on firmware 4.110 or newer, which means fifth-generation hardware such as the Ceiling, Luna, String or Tube. The \`_lifx._udp\` service does not exist on any earlier firmware, and a reflector cannot forward an announcement that is never made. A reflector for \`_hap._tcp\` helps for HomeKit-capable models, but HomeKit announces only on boot or first join, so it will not recover a device that changed IP on a lease renewal without rebooting.

#### Why does my udp-broadcast-relay forward packets but still discover nothing?

Because the relayed broadcast creates no connection-tracking state. The bulbs receive the broadcast and reply by unicast to your controller, but those replies arrive at the firewall as new inbound IoT-to-trusted connections rather than as replies to an established flow, so the IoT-to-trusted deny rule drops them. You will see the outbound relay working in a packet capture and receive nothing back. Fixing it requires a relay that preserves conntrack state, plus a return path through the rule the segmentation exists to enforce.

#### Do LIFX DHCP reservations break on some firmware?

Yes, on the fourth-generation track from firmware 3.70 onward. Those devices report a MAC address one greater than their serial number, so a reservation created against the serial never matches. Measured across two 3.90 product families, the offset is consistently +1, while 2.90 and 1.22 devices report a MAC identical to their serial. If a reservation is not being honoured on a Mini, GU10, Candle, Filament or Downlight, check the actual MAC on the switch rather than assuming it matches the serial printed in the app.

#### Does Matter solve cross-VLAN LIFX control?

Not in the way people expect. Matter commissioning is available on firmware 4.100 and above, on fifth-generation hardware and the LIFX Switch, so it does not apply to most existing fleets at all. Where it does apply, it coexists with the LAN protocol rather than replacing it, to the point of producing duplicate device entries in Home Assistant, and it exposes considerably less functionality, with no multizone control and none of the LIFX-specific effects. It is also still a local-network protocol with its own discovery requirements, so it does not remove the segmentation problem.

---

### Sources

- LIFX, Communicating with a device (LAN protocol documentation), retrieved 2026-08-04, https://lan.developer.lifx.com/docs/communicating-with-device
- LIFX, Querying the device for data, retrieved 2026-08-04, https://lan.developer.lifx.com/docs/querying-the-device-for-data
- LIFX, Packet contents (header field reference), retrieved 2026-08-04, https://lan.developer.lifx.com/docs/packet-contents
- LIFX, lifx-protocol-docs, device messages, retrieved 2026-08-04, https://github.com/LIFX/lifx-protocol-docs
- LIFX, products.json capability and upgrades registry, retrieved 2026-08-04, https://github.com/LIFX/products
- LIFX, public-protocol specification, retrieved 2026-08-04, https://github.com/LIFX/public-protocol
- RFC 2644, Changing the Default for Directed Broadcasts in Routers, IETF, 1999, https://www.rfc-editor.org/rfc/rfc2644
- Home Assistant, LIFX integration source (discovery entry points and firmware gates), retrieved 2026-08-04, https://github.com/home-assistant/core/tree/dev/homeassistant/components/lifx
- Home Assistant core issue 160109, Matter-commissioned LIFX bulbs also discovered by the LAN integration, retrieved 2026-08-04, https://github.com/home-assistant/core/issues/160109
- delfick, photons (per-family firmware capability modelling), retrieved 2026-08-04, https://github.com/delfick/photons
- Djelibeybi, lifx-async (the one surveyed implementation of \`_lifx._udp\` mDNS discovery), retrieved 2026-08-04, https://github.com/Djelibeybi/lifx-async
- mclarkk, lifxlan (per-interface directed broadcast via ifaddr), retrieved 2026-08-04, https://github.com/mclarkk/lifxlan
- IEEE Registration Authority, OUI public listing (\`D0:73:D5\`, registered to LIFI LABS MANAGEMENT PTY LTD), verified 2026-08-05, https://standards-oui.ieee.org/oui/oui.txt`
};
