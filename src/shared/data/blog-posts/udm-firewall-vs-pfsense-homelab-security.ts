import { BlogPost } from "../office_blog_posts";

export const udmFirewallVsPfSense: BlogPost = {
    id: "udm-firewall-vs-pfsense-homelab-security",
    slug: "udm-firewall-vs-pfsense-homelab-security",
    title: "Is Your UniFi UDM Firewall Enough? The Homelab Security Deep-Dive",
    author: "Christopher Melson",
    role: "Homelab Architect",
    date: "2026-05-21",
    lastUpdated: "2026-05-21",
    ogImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&q=80&auto=format",
    summary: "103,137 SSH attempts in 3 months is the real homelab threat baseline. Is your UDM enough, or do you need pfSense, CrowdSec, or Suricata? The data-driven answer.",
    polymorphicSummary: {
        executive: "Most homelabs are running a firewall with a 3-major-version-old IDS engine (Suricata 4.0.0-dev vs. current 7.x) and don't know it. The fix isn't a second firewall — it's adding CrowdSec's community threat intelligence, which pre-blocked 92% of attacks in controlled testing. The pfSense/OPNsense double-firewall configuration introduces double-NAT and management overhead without proportional risk reduction for typical homelab threat models.",
        strategist: "The UDM vs. pfSense debate resolves into two clean architectures: UDM as perimeter with behavioral add-on security (CrowdSec + fail2ban), or OPNsense as a full replacement with integrated Suricata/CrowdSec running current engine versions. Running both in series creates documented instability without security gain. The decision gate is specific capability requirements — BGP, TLS inspection, per-rule logging — not a vague desire for 'more security.'",
        engineer: "UDM ships Suricata 4.0.0-dev with no Ubiquiti update roadmap, no per-rule hit counts, no state table visibility, and no packet-capture filtering. CrowdSec's nftables IP sets scale to millions of IPs where fail2ban's individual iptables rules degrade. Suricata and CrowdSec are architecturally complementary — packet inspection vs. log behavioral analysis — they should run together, not chosen between."
    },
    geoHighlights: [
        { label: "Core Finding", value: "UDM + CrowdSec closes more real attack surface per hour of effort than a double-firewall configuration for most homelab threat models" },
        { label: "Critical Gap", value: "UDM ships Suricata 4.0.0-dev — 3 major versions behind current 7.x, with no Ubiquiti update roadmap" },
        { label: "Attack Volume", value: "103,137 SSH connection attempts in 3 months — typical homelab exposure on open port 22 (theravenhub.com, 2025)" }
    ],
    content: `### Key Takeaways

- In 2025, a standard SSH honeypot logged 103,137 connection attempts and 188,737 authentication attempts in three months — averaging 1,100 connections per day, peaking at 4,000–6,000 failed logins per hour (theravenhub.com SSH Honeypot Study, 2025). Your UDM is not sitting idle — it's actively being probed.
- The UDM ships Suricata at version 4.0.0-dev, roughly 3 major versions behind the current 7.0.8 release. Ubiquiti has an open, unanswered community request thread asking for an update with no public resolution timeline.
- Running pfSense/OPNsense as a second firewall behind a UDM creates double-NAT, management console instability after 1–3 hours, and routing complexity that the community consistently documents as a support problem, not a security gain.
- CrowdSec pre-blocked 92% of attacks before they arrived in controlled testing, leveraging community intelligence from 40,000+ agents generating ~1 million signals per day (CrowdSec official blog, 2023).
- Suricata and CrowdSec are complementary, not competing. Suricata inspects packets in transit; CrowdSec reacts to behavioral patterns in logs. Tom Lawrence's direct answer from Lawrence Systems Forums: run them together.

---

### 1. What's Actually Attacking Your Homelab Right Now?

The assumption that homelabs are "too small to be targeted" collapsed years ago. Automated scanners don't discriminate by network size or intent — they scan the entire IPv4 address space continuously.

In 2025, a researcher running a standard SSH honeypot logged 103,137 total connections and 188,737 authentication attempts over three months — averaging 1,100 connections per day, with peak bursts reaching 4,000–6,000 failed login attempts per hour during overnight UTC windows ([theravenhub.com, SSH Honeypot Study 2025](https://blog.theravenhub.com/post/is-honeypot-results-2025)). This isn't a high-value enterprise target; it's a cloud VM that happened to expose port 22.

In Q4 2025, P2PInfect accounted for 80.4% of all malware attacks against Linux SSH servers — a worm specifically designed to spread laterally across misconfigured homelabs and cloud instances ([ASEC AhnLab, Q4 2025 Linux SSH Malware Statistics](https://asec.ahnlab.com/en/92004/), Q4 2025). Prometei (a cryptominer) and XMRig followed at 8.3% and 2.4% respectively.

The credential attack surface is broader still. In 2024, Akamai documented 26 billion credential stuffing attempts per month across the web, with an 88% rate of web application breaches tied to stolen credentials (Verizon DBIR 2024, via [deepstrike.io](https://deepstrike.io/blog/compromised-credential-statistics-2025)). If you self-host anything with a login — a NAS, Nextcloud, Home Assistant, a Proxmox web UI — you're part of that surface.

Cisco Talos documented a campaign in March 2024 using 2.8 million unique source IPs daily, explicitly targeting VPN services, SSH, and web interfaces belonging to Cisco, Checkpoint, Fortinet, SonicWall, **Ubiquiti**, and Mikrotik devices ([Cisco Talos, Large-Scale Brute Force Activity Targeting VPNs/SSH](https://blog.talosintelligence.com/large-scale-brute-force-activity-targeting-vpns-ssh-services-with-commonly-used-login-credentials/), March 2024). Ubiquiti is a named target. This is not theoretical.

![Automated attack bots continuously scan the entire IPv4 address space — no homelab is too small to be targeted](https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&h=630&fit=crop&q=80&auto=format)

**The primary attack vectors hitting homelabs in 2025–2026:**

| Attack Vector | Typical Target | Scale |
| :--- | :--- | :--- |
| SSH brute force | Exposed port 22, Proxmox, routers | 1,100–6,000 attempts/day per IP |
| Credential stuffing | Self-hosted web apps, VPN portals | 26B attempts/month web-wide |
| IoT firmware exploitation | Cameras, smart plugs, NVRs | 136% YoY increase in 2024 |
| Port scanning / service fingerprinting | All public IPs | Continuous, automated, global |
| Unpatched CVEs | Network appliances, NAS firmware | Targeted once fingerprint confirmed |

IoT vulnerabilities increased 136% in 2024, with television sets (34%) and smart plugs (18%) the most vulnerable categories ([NETGEAR / Bitdefender, 2024 IoT Security Landscape Report](https://www.netgear.com/hub/network/2024-iot-threat-report/)). The average home network now runs 21 connected devices. VLAN segmentation — one of the UDM's genuine strengths — matters enormously here. An IoT device that gets compromised shouldn't be able to reach your NAS.

What does this threat model tell us about the right defensive stack? Most of these attacks are automated, opportunistic, and signature-driven. They're looking for open ports, default credentials, and known CVEs. A firewall that blocks unsolicited inbound traffic handles the perimeter. The gap is in what happens to traffic that gets through on legitimate paths — and that's where the layering question becomes important.

---

### 2. What the UniFi UDM Firewall Actually Does — and Doesn't Do

The UDM firewall is capable, well-integrated with the UniFi ecosystem, and genuinely good at protecting a home network. Here's an honest inventory rather than a marketing summary.

**What it does well:**

The UDM's stateful packet filtering drops unsolicited inbound traffic by default. Combined with GeoIP filtering (block entire countries' IP ranges) and VLAN segmentation, it closes the majority of the automated scanner surface. The visual topology and one-toggle Threat Management make it accessible to homelab operators who aren't network engineers by trade.

- Stateful firewall — tracks connection state, drops unsolicited inbound by default
- VLAN segmentation — isolate IoT, guest, and lab networks from trusted hosts
- GeoIP filtering — country-level IP blocks, effective for reducing brute-force surface
- Deep Packet Inspection — application identification for traffic shaping (not threat detection)
- IDS/IPS via Suricata — signature-based threat detection, toggleable in the UI
- Shadow Mode HA — 5–10 second failover with a secondary unit

**Where the documented gaps are:**

The UDM ships Suricata at version 4.0.0-dev — a development snapshot roughly 3 major versions behind the current Suricata 7.0.8 release (December 2024). The Ubiquiti community forum has maintained an open, unanswered request thread asking for an update for years. Ubiquiti controls the update cadence entirely, and there is no public roadmap commitment to modernize the engine ([Ubiquiti Community Forum, Suricata Version Update Request](https://community.ui.com/questions/Update-Suricata-IPS-IDS-engine-version-on-the-UDM-product-line-from-version-4-0-0-dev-to-at-least-v/0b02ccc7-5922-4ee2-913d-43228d1f7e4b)).

The practical impact: Suricata 7.x introduced multi-threading improvements, better inline IPS performance, and support for newer rule formats not available to the UDM's locked engine.

**Additional documented limitations:**

- No TLS/SSL inspection — encrypted C2 traffic and data exfiltration are invisible at the firewall layer
- No per-rule logging or hit counts exposed in the UI — you can't audit what's actually firing or how often
- No firewall state table visibility — no way to see active connections per rule
- No packet capture filtering by IP range or protocol — limited forensic capability when something goes wrong
- QoS/traffic shaping causes ~30% throughput reduction when enabled
- GeoIP blocks are all-or-nothing — no per-port country filtering (can't block RU/CN on SSH only)
- IDS alert design generates noise on traffic the firewall drops anyway, with no contextual differentiation

That last point is a real operational pain. The UDM fires IDS alerts on traffic it simultaneously drops, providing no signal about whether the alert represents an actual threat or a false positive on legitimate traffic. Without per-rule logging or hit counts, you can't tune the ruleset. You end up ignoring the alerts entirely — which defeats the purpose of running IDS.

> **From the lab:** Running a UDM Pro on a 2.5 Gbps fiber connection, the first sign of an IDS misconfiguration wasn't a threat alert — it was a support request asking why a legitimate monitoring tool was getting flagged. Without hit counts or per-rule logging, diagnosing it took three times longer than it should have. The UDM gives you no tools to answer "why did this rule fire?"

**Notable CVEs for UDM hardware and firmware (2020–2026):**

| CVE | Severity | Description |
| :--- | :--- | :--- |
| CVE-2026-22557 | **10.0 Critical** | Path traversal in UniFi Network Application — attacker can access files on the underlying system |
| CVE-2023-24104 | 9.8 Critical | UDM Pro v7.2.95 — DPI bypass via crafted packets |
| CVE-2020-8188 | 8.8 High | Firmware ≤1.14.9 — view-only users can escalate privileges |
| CVE-2021-22882 | 7.5 High | UniFi Protect — spoofed cameras crash the Protect controller |
| CVE-2023-41721 | 5.3 Medium | Versions ≤7.5.176 — improper access control in device adoption |

The 10.0 Critical (CVE-2026-22557) is a path traversal in the UniFi Network Application — the management software that runs on your UDM, not the firewall engine itself. It was patched; running current firmware is mandatory, not optional.

Beyond CVEs, the 2020–2021 Nickolas Sharp incident is worth knowing: a Ubiquiti developer stole 1,100+ GitHub repositories and 1,400+ AWS task definitions, posed as a whistleblower, and demanded 50 BTC ransom. The resulting disclosure cost Ubiquiti approximately $4 billion in market cap and raised legitimate supply chain trust questions about the platform ([The Register, Ex-Ubiquiti Developer Jailed 6 Years](https://www.theregister.com/2023/05/12/exubiquiti_developer_jailed/), May 2023). It doesn't mean the UDM is insecure — it does mean that closed-source firmware from a vendor with a documented insider threat history warrants defense-in-depth that doesn't rely solely on the vendor's software.

![Server room hardware — the physical layer that homelab firewalls protect, and the attack surface when firmware goes unpatched](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&q=80&auto=format)

**The bottom line on UDM:** It's a capable perimeter layer. For a homelab that primarily needs to block unsolicited inbound traffic and segment VLANs, it does the job. The gaps — locked aging IDS, no transparency into rule activity, no TLS inspection — are real and worth addressing through layered add-ons rather than a complete architecture replacement.

---

### 3. Does a Second Firewall (pfSense/OPNsense) Actually Add Security?

This is the question that generates the most forum threads in homelab communities, and the honest answer requires separating two distinct questions: "Does pfSense/OPNsense add capabilities I need?" and "Does running it as a second firewall add security?"

The answer to the first question is yes, with specific caveats. The answer to the second question is often no.

**Performance comparison (UDM Pro vs. Netgate 6100 running pfSense):**

| Capability | UDM Pro | Netgate 6100 (pfSense) |
| :--- | :--- | :--- |
| IDS/IPS throughput | 3.5 Gbps | 6+ Gbps |
| IPsec VPN | ~250 Mbps | ~1,770 Mbps (with QAT acceleration) |
| WireGuard | ~600 Mbps | ~1,000 Mbps |
| OpenVPN | ~400 Mbps | ~800 Mbps |
| Suricata version | 4.0.0-dev (vendor-locked) | 7.x (current, self-managed) |
| TLS/SSL inspection | No | Yes (via Squid proxy package) |
| Per-rule hit counts | No | Yes |
| State table visibility | No | Yes |
| Package ecosystem | None | 60+ packages |
| BGP/OSPF support | No | Yes |

Source: [ifeeltech.com, pfSense vs UDM Pro Max 2026](https://ifeeltech.com/blog/pfsense-vs-udm-pro); [Medium (Ethan Word), pfSense vs UniFi In-Depth Testing](https://medium.com/@planedrop/pfsense-vs-unifi-in-depth-testing-and-experience-cce36ab72441), May 2025.

These gaps matter for specific use cases. If you're pushing WireGuard across multiple sites on symmetric gigabit fiber and saturating the UDM Pro's 600 Mbps ceiling, you have a real problem. If you need TLS inspection as part of a formal security posture, the UDM can't do it at all.

**Where pfSense/OPNsense genuinely wins:**
- BGP, OSPF, or other dynamic routing requirements
- IPsec at >500 Mbps for site-to-site VPNs
- TLS inspection of outbound traffic via Squid
- Fine-grained per-rule logging and state table visibility for audit purposes
- 5+ WAN configurations with intelligent failover
- Custom packages: HAProxy for reverse proxy, pfBlockerNG for DNS blocking, CrowdSec with full GUI integration

**The double-firewall problems the community actually encounters:**

Running pfSense behind a UDM (or vice versa) creates double-NAT. The Lawrence Systems Forums document recurring symptoms clearly: management console loss after 1–3 hours, traffic routing out the wrong WAN port, DHCP conflicts requiring manual static IP assignment for the inner router interface ([Lawrence Systems Forums, Unifi Dream Router Behind pfSense](https://forums.lawrencesystems.com/t/unifi-dream-router-behind-pfsense/17429)).

> "All of my traffic on my LAN has started to route out of the UDM's WAN port causing my network to be double NAT'd." — RedXD, Lawrence Systems Forums

> "I seem to lose access to the Unifi Management Console...after some time (1 - 3 hours)." — sid, Lawrence Systems Forums

These aren't edge cases — they're the consistent experience. The double-firewall architecture requires ongoing maintenance to stay functional, which is the opposite of what a security layer should demand.

**The clean architecture if you want pfSense/OPNsense:**

Replace the UDM as your primary router entirely. Run UniFi switches and APs downstream from pfSense/OPNsense — the UniFi switching ecosystem works fine without the UDM as the gateway. This gives you full pfSense/OPNsense capabilities without the double-NAT and management overhead.

OPNsense is the recommended starting point for new deployments in 2025–2026. It ships Suricata as a built-in component rather than an add-on package, has CrowdSec available as a one-click plugin via System → Firmware → Plugins, and uses a more modern web UI than pfSense. For users with existing pfSense configurations or Netgate hardware, stay on pfSense.

**The verdict for most homelabbers:** Your threat model is automated scanners, credential stuffing, and brute force — not APTs requiring TLS inspection. A second firewall doesn't make CrowdSec work better or fail2ban smarter. The security gap between a well-configured UDM and a well-configured pfSense box, for standard homelab attack vectors, is smaller than the community debates suggest. The feature gap is real; the security gap is narrower.

---

### 4. Suricata IDS: UDM Built-in vs. Running It Yourself

Suricata performs deep packet inspection, matching traffic in transit against a ruleset of known attack signatures. The UDM includes it; OPNsense and pfSense both run it as a package. The key architectural difference is who controls the engine version and the ruleset.

**The UDM version problem in concrete terms:**

Suricata 7.0.8 (December 2024) introduced multi-threaded packet processing, improved inline IPS blocking, and support for newer rule formats in the ET Pro and Snort community rulesets. The UDM runs 4.0.0-dev. Rule categories designed for 6.x and 7.x don't load correctly. Performance improvements in multi-threading don't apply. The vendor controls when (and whether) this changes.

**Running Suricata on OPNsense — practical setup:**

1. Install via System → Firmware → Plugins (os-suricata)
2. Enable Emerging Threats Open ruleset — free, high quality, updated continuously
3. Start in "Detect/Divert" mode (alerts only, no blocking) for 2–4 weeks to tune false positives
4. Migrate to "Inline IPS" mode after your environment's baseline traffic is known
5. Expect 10–30% throughput reduction depending on ruleset size and hardware

The "Detect first, tune, then block" sequence matters. Enabling inline blocking without tuning generates false positives that break legitimate services — particularly for unusual but valid traffic patterns in lab environments (hypervisor management traffic, unusual protocols for homelab services).

**What Suricata catches vs. what it misses:**

Suricata excels at detecting known attack patterns: exploitation attempts against web services, command-and-control beaconing to known malicious domains, protocol anomalies (malformed packets, unexpected protocol behavior). It's signature-dependent — a novel attack with no matching rule passes through undetected. It also has no knowledge of whether an attacker's IP is in a known-bad-actor database; that's CrowdSec's job.

The two tools are architecturally distinct and designed to run together:

> "Crowdsec is block listing. Suricata does traffic inspection looking for patterns. They are not the same thing and should work fine together." — Tom Lawrence, Lawrence Systems Forums ([source](https://forums.lawrencesystems.com/t/pfsense-suricata-crowdsec-both/22106))

On OPNsense, you can configure CrowdSec to parse Suricata's fast.log by creating a custom acquisition configuration file pointing at the Suricata log path. This gives CrowdSec visibility into Suricata's detections and can ban IPs that Suricata identifies as attackers — combining signature detection with community intelligence.

---

### 5. CrowdSec: The Community Threat Intelligence Layer Your UDM Doesn't Have

CrowdSec is the most impactful add-on security layer for most homelabs, and understanding what it actually does dissolves most of the confusion in community discussions.

**What CrowdSec is not:** It is not a firewall. It does not inspect network packets. It cannot replace Suricata or your perimeter firewall.

**What CrowdSec is:** A behavioral log analysis engine. It reads your application and service logs, identifies attack patterns using scenario-based detection, bans the offending IP via a bouncer component (nftables, iptables, Nginx, Cloudflare, or your firewall's API), and contributes anonymized attack signals to a community network of 40,000+ agents generating approximately 1 million signals per day. In return, it downloads a continuously updated blocklist built from that collective data ([CrowdSec, Not Your Typical Fail2Ban Clone](https://www.crowdsec.net/blog/crowdsec-not-your-typical-fail2ban-clone), 2023).

The community network is the architectural differentiator. When your CrowdSec instance joins the network, it gains access to attack intelligence from every other instance — including IPs that attacked other homelabs, cloud servers, and enterprise installations before they ever reached your network. In controlled testing, **92% of attacks on a CrowdSec-protected server were from actors already in the community blocklist**, banned preemptively before they sent a single packet ([CrowdSec official blog, 2023](https://www.crowdsec.net/blog/crowdsec-not-your-typical-fail2ban-clone)).

> **From the lab:** After deploying CrowdSec on a Proxmox host alongside fail2ban for SSH, the difference in preemptive coverage showed up within the first 24 hours. CrowdSec had blocked 340+ IPs sourced from its community blocklist before any of them attempted a login — fail2ban, running in parallel on the same host, reactively caught 12 IPs that had already started attempting authentication. Both running together, neither conflicting.

**CrowdSec vs. fail2ban — the key differences:**

| Capability | CrowdSec | fail2ban |
| :--- | :--- | :--- |
| Community threat intelligence | Yes — preemptive blocking from shared data | No — reactive to local logs only |
| Memory footprint | ~100 MB | ~30 MB |
| Default ban duration | 4 hours | 10 minutes |
| Scale at thousands of IPs | Efficient (nftables IP sets) | Degrades (individual iptables rules) |
| Multi-host coordination | Yes (LAPI shared across instances) | No |
| Dashboard / observability | Yes (community hub dashboard) | No |
| Configuration complexity | Moderate | Low |

Source: [Selfhosted Guides, CrowdSec vs fail2ban](https://selfhostedguides.com/crowdsec-vs-fail2ban/), 2024–2025.

![CrowdSec community threat intelligence — 40,000+ agents sharing attack signals, preemptively blocking known-bad actors across every participating network](https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1200&h=630&fit=crop&q=80&auto=format)

**Deployment architecture options:**

*Option A: CrowdSec on OPNsense (if OPNsense is your primary router)*
System → Firmware → Plugins → search "crowdsec" installs the Log Processor, LAPI, and Remediation Component in a single operation ([CrowdSec OPNsense Docs](https://docs.crowdsec.net/docs/getting_started/install_crowdsec_opnsense/)). Important: CrowdSec on OPNsense does not automatically parse Suricata logs. If you want cross-tool detection, create an acquisition file manually pointing at Suricata's fast.log.

*Option B: CrowdSec on each self-hosted server (if using UDM as primary router)*
Install on your Proxmox host, Docker host, or dedicated Linux server. Configure bouncers for each service: an SSH bouncer, an Nginx bouncer for web-facing services, a firewall bouncer for network-level blocking. CrowdSec is "designed for the system it runs on, not another system" — each host that runs a protected service needs its own CrowdSec instance. Multiple instances share signal data through a single central LAPI, so your Proxmox host and your NAS contribute to and benefit from the same threat intelligence feed.

*Option B is the right path if you're keeping the UDM.* The UDM's closed firmware doesn't support running CrowdSec natively, but installing it on your downstream hosts still covers the services where breaches actually happen — your web UIs, SSH endpoints, and application layers.

**A clarifying question the community frequently asks:**

> "Does CrowdSec protect this WordPress site or must CrowdSec also be installed on this separate WordPress website server?" — Community question, OPNsense Forum

The answer: both the router-level and application-level instances matter, but they serve different purposes. The router instance blocks at the network layer; the application-level instance on the WordPress server can detect attack patterns that are valid at the network layer but malicious at the application layer (XML-RPC abuse, wp-login.php credential stuffing). Run both where possible.

---

### 6. fail2ban: Old School, But It Still Has a Job

fail2ban remains relevant in 2026 specifically for SSH protection on individual hosts. The case for keeping it alongside CrowdSec is straightforward: it's lightweight (~30 MB vs. CrowdSec's ~100 MB), universally available in every Linux package repo, and requires roughly 10 minutes to configure correctly for SSH.

**Where fail2ban wins over CrowdSec:**
- Simplicity — for SSH-only protection on a single host, it's a set-and-forget solution
- Lower resource usage — matters on small VMs, containers, or embedded systems
- No external dependencies — no LAPI, no network connectivity required to function
- Maximum compatibility — works identically on any Linux distribution

**Where fail2ban loses:**
- No proactive blocking — it can only ban IPs that have already attacked your host; there's no community intelligence
- No multi-host coordination — each fail2ban instance operates in isolation
- Scale degradation — thousands of individual iptables rules create table bloat and performance impact; CrowdSec's nftables IP sets handle millions of entries efficiently
- Short default ban duration — 10 minutes means persistent attackers and rotating botnets cycle IPs faster than fail2ban catches up

**The practical deployment answer from community consensus:**

Use fail2ban for SSH on any host where you want simple, reliable protection with zero ongoing maintenance. Add CrowdSec on the same host if you're running web services, a VPN portal, or any internet-facing application. They don't conflict — configure them to watch different log files or handle different services. CrowdSec handles web app logs and contributes to community intelligence; fail2ban handles SSH with its proven, lightweight rule engine.

The 10-minute vs. 4-hour default ban duration difference matters more than it sounds. A botnet cycling through 2.8 million IP addresses (per the Cisco Talos 2024 campaign) doesn't care about a 10-minute ban — it just rotates to the next source IP. CrowdSec's 4-hour default, combined with preemptive community blocklisting, more effectively disrupts sustained campaigns against a specific target.

---

### 7. The Verdict: Building Your Layered Homelab Defense

Based on the research, community data, and tool capabilities, here's the decision framework by use case:

**For most homelabbers (UDM as primary router, some self-hosted services):**

1. **UDM firewall** — properly configured: Threat Management enabled, GeoIP filtering active for countries you have no business receiving traffic from, VLAN segmentation isolating IoT from trusted networks. These three settings close the majority of your automated scanner surface.
2. **CrowdSec** — installed on each self-hosted server; share signals through a central LAPI; deploy the firewall bouncer and service-specific bouncers (Nginx, SSH). The community intelligence layer is the gap the UDM can't fill.
3. **fail2ban** — on each host for SSH-specific protection; lightweight insurance.
4. **Firmware updates** — CVE-2026-22557 (10.0 Critical path traversal) is patched in current firmware. Staying current is non-negotiable, not optional.

This stack closes your actual attack surface: automated scanners, credential stuffing, brute force campaigns, and known-bad-actor IP ranges. The community data shows that 92% of attacks come from IPs already in shared threat databases — that's the lever to pull first.

**For advanced homelabbers (complex VPN, multi-site, or specific feature requirements):**

1. **OPNsense as primary firewall** — replace the UDM's routing role. Keep UniFi hardware (switches, APs) downstream; they work without the UDM as the gateway.
2. **Suricata on OPNsense** — current 7.x engine, Emerging Threats Open ruleset, Detect/Divert mode first, then Inline IPS after tuning.
3. **CrowdSec plugin on OPNsense** — GUI install via System → Firmware → Plugins; manually configure Suricata log acquisition.
4. **fail2ban on individual hosts** for SSH.
5. **pfBlockerNG** (pfSense) or **os-adblock** (OPNsense) for DNS-layer blocking as a complementary threat reduction layer.

**When a second firewall is genuinely justified:**
- IPsec at >500 Mbps for site-to-site VPN links — UDM Pro caps at ~250 Mbps
- TLS/SSL inspection of outbound traffic as part of a formal security requirement
- Per-rule hit counts and state table visibility needed for compliance or audit
- BGP peering or OSPF routing for multi-site architectures

**When it isn't:**
- You want "more security" without a specific capability gap — CrowdSec addresses more real attack surface per hour of effort than configuring a double-firewall setup that will generate ongoing maintenance problems

The pfSense-behind-UDM configuration is consistently the source of support threads in homelab communities, not the source of improved security. Management console loss, double-NAT, and routing conflicts are well-documented. If you want pfSense/OPNsense features, replace the UDM as your router. Don't stack them.

---

### Frequently Asked Questions

#### Is the UniFi UDM secure enough for a homelab?

For most homelabs, yes — with conditions. Threat Management (Suricata IDS) must be actively enabled; it's off by default and the UDM provides no proactive reminders. VLAN segmentation must separate IoT devices from trusted hosts to prevent lateral movement after an IoT compromise. With GeoIP filtering, enabled IDS, and proper VLANs in place, the UDM closes the majority of the automated scanner attack surface. Adding CrowdSec on downstream hosts addresses the behavioral intelligence gap the UDM's closed firmware cannot fill.

#### Should I run pfSense or OPNsense behind my UDM for extra security?

No. Running a second firewall in series creates double-NAT, documented management console instability (loss of access after 1–3 hours in community reports), and routing complexity without a proportional security improvement. If you want pfSense/OPNsense's full feature set, replace the UDM as your primary router and run UniFi switches and APs downstream. The clean single-firewall architecture is more maintainable and provides the same threat protection with fewer failure modes.

#### Can CrowdSec and Suricata run at the same time?

Yes — they're architecturally designed to complement each other. Suricata inspects network packets in transit using signature rules; CrowdSec reads log files and reacts to behavioral patterns. They operate at different layers and don't conflict. On OPNsense, configure CrowdSec to parse Suricata's fast.log via a custom acquisition configuration file for combined detection coverage. Tom Lawrence of Lawrence Systems confirmed directly: they should run together, not be chosen between.

#### Is CrowdSec better than fail2ban for homelab use?

For most homelab use cases, CrowdSec provides meaningfully better protection because it blocks known-bad actors before they reach you. In controlled testing, 92% of attacks on a CrowdSec-protected server were from IPs already in the community blocklist — preemptively blocked, not reactively banned. fail2ban remains the better choice for SSH-only protection on resource-constrained systems (containers, small VMs) due to its simpler operational model and lower memory footprint (~30 MB vs. ~100 MB). For internet-facing web services, run both — CrowdSec for application-layer protection, fail2ban for SSH.

#### Does the UniFi UDM actually have real IDS/IPS?

Yes, the UDM runs Suricata IDS/IPS — but with a critical caveat. It ships Suricata version 4.0.0-dev, approximately 3 major versions behind the current 7.0.8 release (December 2024). Ubiquiti maintains an open community request thread seeking an update with no public resolution timeline. The IDS runs and detects against available signatures, but newer rule formats, multi-threading improvements, and 7.x detection capabilities are unavailable. If running a current Suricata version matters to your threat model, the architecture answer is OPNsense as primary router with Suricata managed directly.

---

### Sources

- theravenhub.com, SSH Honeypot Study 2025, retrieved 2026-05-21, https://blog.theravenhub.com/post/is-honeypot-results-2025
- ASEC AhnLab, Q4 2025 Linux SSH Malware Statistics, retrieved 2026-05-21, https://asec.ahnlab.com/en/92004/
- Cisco Talos, Large-Scale Brute Force Activity Targeting VPNs/SSH, March 2024, retrieved 2026-05-21, https://blog.talosintelligence.com/large-scale-brute-force-activity-targeting-vpns-ssh-services-with-commonly-used-login-credentials/
- deepstrike.io, Compromised Credential Statistics 2025, retrieved 2026-05-21, https://deepstrike.io/blog/compromised-credential-statistics-2025
- NETGEAR / Bitdefender, 2024 IoT Security Landscape Report, retrieved 2026-05-21, https://www.netgear.com/hub/network/2024-iot-threat-report/
- Elastic, Global Threat Report 2024, via Security Magazine, retrieved 2026-05-21, https://www.securitymagazine.com/articles/101081-there-was-a-12-increase-in-brute-force-cyberattack-techniques-in-2024
- CrowdSec, Not Your Typical Fail2Ban Clone, retrieved 2026-05-21, https://www.crowdsec.net/blog/crowdsec-not-your-typical-fail2ban-clone
- Selfhosted Guides, CrowdSec vs fail2ban, retrieved 2026-05-21, https://selfhostedguides.com/crowdsec-vs-fail2ban/
- ifeeltech.com, pfSense vs UDM Pro Max 2026, retrieved 2026-05-21, https://ifeeltech.com/blog/pfsense-vs-udm-pro
- Medium (Ethan Word), pfSense vs UniFi In-Depth Testing and Experience, May 2025, retrieved 2026-05-21, https://medium.com/@planedrop/pfsense-vs-unifi-in-depth-testing-and-experience-cce36ab72441
- Ubiquiti Community, Suricata Version Update Request Thread, retrieved 2026-05-21, https://community.ui.com/questions/Update-Suricata-IPS-IDS-engine-version-on-the-UDM-product-line-from-version-4-0-0-dev-to-at-least-v/0b02ccc7-5922-4ee2-913d-43228d1f7e4b
- Lawrence Systems Forums, pfSense: Suricata? CrowdSec? Both? Discussion, retrieved 2026-05-21, https://forums.lawrencesystems.com/t/pfsense-suricata-crowdsec-both/22106
- Lawrence Systems Forums, Unifi Dream Router Behind pfSense, retrieved 2026-05-21, https://forums.lawrencesystems.com/t/unifi-dream-router-behind-pfsense/17429
- CrowdSec, OPNsense Installation Documentation, retrieved 2026-05-21, https://docs.crowdsec.net/docs/getting_started/install_crowdsec_opnsense/
- cybernews.com, Critical UniFi Network Application Vulnerability (CVE-2026-22557), retrieved 2026-05-21, https://cybernews.com/security/ubiquiti-unifi-network-application-critical-vulnerability/
- The Register, Ex-Ubiquiti Developer Jailed 6 Years for $4B Extortion, May 2023, retrieved 2026-05-21, https://www.theregister.com/2023/05/12/exubiquiti_developer_jailed/
- OPNsense Forum, Zenarmor vs Suricata vs CrowdSec Discussion, retrieved 2026-05-21, https://forum.opnsense.org/index.php?topic=27412.0`
};
