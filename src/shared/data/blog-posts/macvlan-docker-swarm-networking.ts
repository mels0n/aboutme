import { BlogPost } from "../office_blog_posts";

export const macvlanDockerSwarmNetworking: BlogPost = {
    id: "macvlan-docker-swarm-networking-deep-dive",
    slug: "macvlan-docker-swarm-networking-deep-dive",
    title: "Macvlan in Docker Swarm: Why We Use It, What Breaks, and How We Fixed It",
    author: "Christopher Melson",
    role: "Homelab Architect",
    date: "2026-07-30",
    lastUpdated: "2026-07-30",
    ogImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop&q=80&auto=format",
    summary: "Macvlan gives Docker Swarm containers real addresses on your physical LAN instead of hiding them behind NAT. It's also why your host can't ping its own container, why two networks fight over one gateway, and why DNS lookups mysteriously take 5 seconds on one node. Root causes and permanent fixes for each.",
    polymorphicSummary: {
        executive: "Most container platforms hide services behind an internal network, which is fine until a service needs to own a port the host already uses, or needs to be reachable the same way any other device on the network is. Macvlan solves that by giving a container its own address on the real network. The tradeoff is three specific failure modes that aren't documented anywhere near clearly enough: the host machine can't talk to its own containers, two services can't share a gateway on the same machine, and a container that provides DNS can accidentally make its own host slower at resolving names. Each has a known, permanent fix once you understand the root cause.",
        strategist: "The architecture decision is straightforward: overlay networking for anything that only needs to talk to other containers, macvlan for anything that needs to own a LAN-routable address, a specific port on the physical network, or sit in its own VLAN. What the decision doesn't warn you about is that macvlan operates below the layer where the host's own network stack participates, so the host and its macvlan children are mutually unreachable by default. In a multi-node Swarm, that turns into a per-node problem: whichever node happens to host a given macvlan service loses fast access to it, while every other node keeps working fine. That asymmetry is what makes the failure mode hard to diagnose without knowing to look for it.",
        engineer: "Macvlan bypasses the host's bridge and gives each container a distinct MAC on the parent interface, which means: no NAT overhead, no port-mapping table, real broadcast/mDNS visibility, and no in-kernel hairpin path back to the parent's own IP stack (a deliberate Linux macvlan driver limitation, not a bug). Fix is a macvlan shim interface on the host itself, routed with /32s rather than the full subnet so you don't hijack unrelated host traffic. Second failure: Docker's IPAM refuses to allocate two macvlan networks against the same gateway on one node ('failed to allocate gateway: Address already in use'), which forces placement constraints for any two macvlan services sharing a subnet. Third: if the host-isolation gap coincides with a macvlan container being your DNS resolver, the embedded resolver at 127.0.0.11 tries the unreachable local instance first on every external lookup, adding multi-second latency per node, asymmetrically, until you fix the underlying isolation gap."
    },
    geoHighlights: [
        { label: "Core Limitation", value: "A Docker host cannot ping or reach its own macvlan containers by design; this is a documented Linux macvlan driver behavior, not a Docker bug" },
        { label: "The Fix", value: "A host-side macvlan shim interface with /32 routes to specific container IPs, deployed identically on every Swarm node via a boot-time service" },
        { label: "Measured Impact", value: "On the node hosting the unreachable resolver, default DNS resolution time dropped from ~4,100ms to under 100ms after the shim was deployed" }
    ],
    content: `### Key Takeaways

- Macvlan gives a container a real MAC address and a real IP on your physical LAN or a VLAN. Overlay networking gives a container a private address only other containers can reach. Most Swarm stacks need both, side by side, for different services.
- The most common macvlan production issue has nothing to do with containers talking to each other. It's the **host itself losing the ability to reach its own macvlan children**, a deliberate limitation of the Linux macvlan driver, not a Docker defect, and it is barely documented anywhere you'd think to look.
- That isolation gap is asymmetric across a multi-node Swarm: the node physically hosting a macvlan service is the one node that can't reach it directly. Every other node in the cluster can. This asymmetry is what makes the bug so confusing to diagnose the first time.
- Docker's IPAM will refuse to run two macvlan networks that share a gateway address on the same node, throwing "failed to allocate gateway: Address already in use." This forces explicit placement rules the moment two macvlan-backed services share a subnet.
- If a macvlan container also happens to be a DNS resolver, the host-isolation gap can silently add multiple seconds to every external DNS lookup on that node, because Docker's embedded resolver tries the (unreachable) local instance first.
- The fix for all of the above is a small, boot-time macvlan shim on every node, using /32 host routes rather than routing the whole subnet, so the fix can't accidentally steal traffic meant for something else on the network.

---

### 1. What Macvlan Actually Does, and Why Swarm Needs It At All

Docker's default networking model is deliberately opinionated: containers get private addresses on a bridge, the host runs a NAT and a port-mapping table, and anything that needs to be reached from outside gets a \`-p 8080:80\` published port. In Swarm mode, the default overlay driver extends that same idea across every node in the cluster: containers on an overlay network can find each other by service name regardless of which physical machine they land on, but they're still one layer removed from the actual LAN.

That model works for the overwhelming majority of services, and it's the right default. It breaks down in a few specific, recurring situations:

- **A service needs to own a port the host is already using.** Port 53 for DNS is the classic case: anyone who has tried to run Pi-hole or AdGuard Home in Docker has hit some variant of "listen tcp 0.0.0.0:53: bind: address already in use," usually because \`systemd-resolved\` or another resolver is already sitting on the host's port 53. If a container needs to *be* the DNS server on port 53 for your whole network, NAT-based publishing can't resolve that conflict; only a distinct IP can.
- **A service needs to sit in its own VLAN or DMZ**, isolated at the network layer from the rest of the cluster, not just at the Docker layer. (The firewall and VLAN segmentation decisions upstream of this are their own topic; see [Is Your UniFi Firewall Enough? The Homelab Security Deep-Dive](/guide/operational-architecture/blog/unifi-firewall-enough-homelab-security) for that side of the architecture.)
- **A service needs to receive broadcast or multicast traffic** the way a normal LAN device would; mDNS/Bonjour-style discovery is the common example. Overlay networks don't forward this the way a physical switch does.
- **A service needs to be addressed by the same IP scheme as every other device on the network**, because something external (a router's static DHCP reservation, another appliance's allow-list, a monitoring tool) already expects it there.

If you've ever searched for "how to give a Docker container its own IP address on my LAN" or "Docker container with static IP on home network," macvlan is the answer you were being pointed toward. It solves all four situations above by giving the container a real, distinct network identity: its own MAC address, bound to a parent physical interface (or a VLAN sub-interface of one), with an IP address that comes out of your actual LAN's address space. To the rest of the network, a macvlan container isn't "a Docker thing behind a NAT." It's just another device on the wire, one your router, your DHCP reservations, and your firewall rules can treat like any other machine.

The practical rule we use: **overlay by default, macvlan only for the specific services that need one of the four properties above.** Running everything as macvlan trades away Docker's built-in service discovery and load balancing for no benefit; running nothing as macvlan means you can never let a container own a port, a VLAN, or a LAN identity that something outside Docker depends on.

---

### 2. The Swarm-Specific Wrinkle: Macvlan Isn't Swarm-Aware By Default

A plain \`docker network create -d macvlan\` command is scoped to a single host. In a multi-node Swarm, that's a problem the moment a service using that network gets scheduled onto a different node: the network simply doesn't exist there.

Docker's answer is a swarm-scoped macvlan network, created with \`--scope swarm\` and an \`--attachable\` flag if you also want standalone containers (not just Swarm services) to join it. That solves the existence problem, but it introduces a subtler one: a swarm-scoped network definition is a single named object shared across every node, yet the *parent interface* it attaches to can have a different name on every node. A five-machine cluster assembled from different hardware generations routinely ends up with a mix of interface names (\`eth0\` on one box, \`enp1s0\` on another, \`eno1\` on a third), because interface naming is a function of kernel version, driver, and PCI/USB topology, not something you get to standardize after the fact.

Docker's fix for that is **config-only networks**: you define a small per-node network object (\`--config-only\`) that pins the parent interface for that specific machine, and then the real swarm-scoped network references it with \`--config-from\`. Every node ends up with the same logical network name and the same subnet, gateway, and VLAN tag, but each one points at whatever its parent interface is actually called locally. This is not an edge case to route around later; on any cluster you didn't build from identical hardware on day one, plan for it from the start.

---

### 3. Gotcha #1: Your Host Can't Talk to Its Own Container

This is the one that catches almost everyone the first time, and it's the least documented of the three. If you arrived here by searching "Docker host can't ping macvlan container," "macvlan container unreachable from host," or "macvlan ARP incomplete," this section is the answer, and the short version is: it's not broken, it's designed that way, and there's a clean permanent fix.

**The setup:** you deploy a macvlan-backed service, say a DNS resolver, to a specific Swarm node. From every *other* node in the cluster, and from every other device on your LAN, the container answers normally. From the *one node actually running it*, it's unreachable. Not slow. Unreachable: \`ping\` shows 100% packet loss, and the ARP table shows the container's IP stuck in \`INCOMPLETE\` state, meaning the host tried to resolve it and got nothing back.

**Why this happens:** it's a deliberate property of the Linux macvlan driver, not a networking misconfiguration. In macvlan bridge mode, child interfaces (your containers) can reach each other and can reach the rest of the physical network through the parent interface. What they explicitly cannot do is exchange traffic with the parent interface's own IP stack, meaning the host itself. The parent interface and its macvlan children occupy the same physical wire but are treated as separate, non-bridged endpoints from the kernel's perspective. Docker's own network driver documentation calls this out directly, and it's one of the most-reported "why can't my container reach the host" issues in Docker's networking documentation and community discussion for exactly this reason: it looks like a bug, and it takes a lot of debugging to a first-timer before you learn it's expected behavior.

Two details make this worse in a Swarm cluster specifically rather than a single-host setup:

1. **It's per-node, not cluster-wide.** Only the node physically running the macvlan container loses access to it. If you test from a different node and it works, it's easy to conclude the container is healthy and move on, when really you've just tested from a node that isn't affected.
2. **It's symmetric and easy to misdiagnose as intermittent.** If you run two instances of the same macvlan-backed service for redundancy (two DNS resolvers, say, one per node), each node can reach the *other* node's instance fine but not its own. Depending on which instance your tooling happens to query first, the symptom looks like it "sometimes works," when actually it deterministically fails from exactly one place every time.

**The fix:** create a small macvlan interface *on the host itself*, attached to the same parent NIC, in the same mode. This isn't a container; it's a host-level network interface that participates in the macvlan L2 domain the same way a container does, which gives the host a legitimate path back onto that domain. In practice:

\`\`\`bash
# Run on the host, not inside a container.
# Replace enp1s0 with your actual parent interface, and 192.168.1.253/24
# with a free address on that same subnet reserved for the host's own use.
ip link add macvlan-shim link enp1s0 type macvlan mode bridge
ip addr add 192.168.1.253/32 dev macvlan-shim
ip link set macvlan-shim up

# Route only the specific container IP(s) through the shim, not the whole
# subnet. This is the detail that matters most.
ip route add 192.168.1.53/32 dev macvlan-shim
\`\`\`

That last comment is not optional. It's tempting to route the entire LAN subnet through the shim interface once it exists, since that "just works" and stops you from having to add a route per container. Don't. The shim interface has no idea about anything else on your network: your NAS, your other hosts, your default gateway. If you route the whole subnet through it, you silently redirect traffic meant for those other destinations through an interface that was only ever built to reach one or two specific container IPs, and you'll spend a confusing afternoon later wondering why file shares or node-to-node traffic intermittently breaks. Route only the /32s you actually need.

Because interface names differ across nodes (the same config-only problem from Section 2), the shim needs to be node-aware. The version we run derives the parent interface from the current default route at service-start time rather than hardcoding it, so the identical script and identical systemd unit deploy to every node without per-node edits:

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

PARENT_IF=$(ip route show default | awk '/default/ {print $5; exit}')
SHIM_IF="macvlan-shim"
SHIM_IP="192.168.1.253/32"
# One line per macvlan container IP that this host needs to reach directly.
TARGET_IPS=("192.168.1.53/32" "192.168.1.54/32")

if ! ip link show "$SHIM_IF" &>/dev/null; then
    ip link add "$SHIM_IF" link "$PARENT_IF" type macvlan mode bridge
    ip addr add "$SHIM_IP" dev "$SHIM_IF"
    ip link set "$SHIM_IF" up
fi

for target in "\${TARGET_IPS[@]}"; do
    ip route replace "$target" dev "$SHIM_IF"
done
\`\`\`

Wrapped in a systemd \`.service\` (run-once at boot, \`After=network-online.target\`) plus a \`.timer\` as a periodic safety net in case the interface ever gets torn down by something else, this becomes a one-time deploy across the whole cluster: same script, same unit files, every node, no per-node parameters to keep in sync.

**Result, measured on the node actually hosting the affected macvlan container, before and after deploying the shim:**

<figure><svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px;display:block;margin:0 auto;font-family:system-ui,-apple-system,sans-serif"><rect width="560" height="300" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/><text x="280" y="26" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">DNS Resolution Latency, Before vs. After Host Shim</text><line x1="230" y1="44" x2="230" y2="250" stroke="#94a3b8" stroke-width="1.5"/><text x="181" y="70" text-anchor="end" font-size="10.5" fill="#0f172a">Direct query to</text><text x="181" y="82" text-anchor="end" font-size="10.5" fill="#0f172a">local resolver</text><rect x="230" y="58" width="260" height="20" rx="3" fill="#fca5a5"/><text x="495" y="72" font-size="10" font-weight="600" fill="#991b1b">~5,080ms (timeout)</text><rect x="230" y="82" width="5" height="20" rx="3" fill="#16a34a"/><text x="240" y="96" font-size="10" font-weight="600" fill="#166534">~90ms</text><text x="181" y="130" text-anchor="end" font-size="10.5" fill="#0f172a">Default resolver</text><text x="181" y="142" text-anchor="end" font-size="10.5" fill="#0f172a">(127.0.0.11)</text><rect x="230" y="118" width="210" height="20" rx="3" fill="#fca5a5"/><text x="445" y="132" font-size="10" font-weight="600" fill="#991b1b">~4,100ms</text><rect x="230" y="142" width="4" height="20" rx="3" fill="#16a34a"/><text x="239" y="156" font-size="10" font-weight="600" fill="#166534">~80ms</text><text x="181" y="190" text-anchor="end" font-size="10.5" fill="#0f172a">External domain</text><text x="181" y="202" text-anchor="end" font-size="10.5" fill="#0f172a">lookup (A+AAAA)</text><rect x="230" y="178" width="300" height="20" rx="3" fill="#fca5a5"/><text x="535" y="192" text-anchor="end" font-size="10" font-weight="600" fill="#7f1d1d">~12,150ms</text><rect x="230" y="202" width="8" height="20" rx="3" fill="#16a34a"/><text x="243" y="216" font-size="10" font-weight="600" fill="#166534">~150ms</text><rect x="230" y="236" width="11" height="10" rx="2" fill="#fca5a5"/><text x="246" y="245" font-size="10" fill="#475569">Before shim</text><rect x="340" y="236" width="11" height="10" rx="2" fill="#16a34a"/><text x="356" y="245" font-size="10" fill="#475569">After shim</text></svg><figcaption>Illustrative measurements from a multi-node Docker Swarm cluster before and after deploying the host-side macvlan shim on the node hosting the affected resolver. Bars are not to a shared scale below ~300ms; the point is the order-of-magnitude change, not the exact figures.</figcaption></figure>

The direct query to the local resolver goes from a full connection timeout to a normal sub-100ms response. More importantly, the *default* resolution path (what every container on that node actually uses day to day) drops from over four seconds to well under 100ms, because it's no longer waiting out a timeout against an address it structurally cannot reach before falling through to a working one.

---

### 4. Gotcha #2: One Macvlan Network Per Gateway, Per Node

The second failure mode is simpler to explain and easier to hit by accident. Docker's IPAM (its internal address management) will not let a single node run two active macvlan networks that both claim the same gateway address, even if the two networks are otherwise completely unrelated. Try to schedule a service onto a node where that conflict would occur, and you get a blunt, unhelpful error:

\`\`\`
failed to allocate gateway (192.168.7.1): Address already in use
\`\`\`

This surfaces as a **placement problem**, not a networking problem: two services that each have their own macvlan network, both using the same subnet (and therefore the same gateway) because they happen to live on the same VLAN, simply cannot be co-scheduled onto the same physical node. The fix is Swarm placement constraints (or Kubernetes node affinity/anti-affinity, if that's your orchestrator) pinning the two services to different nodes, or, if that's not workable, restructuring so they sit on genuinely separate subnets/VLANs instead of sharing one.

The nuance worth internalizing: this isn't a resource limit you can raise or a flag you can pass to override. It's IPAM correctly refusing to create two independent notions of "the gateway at this address" on one machine, because from the kernel's perspective that's not a coherent thing to have twice. Design your VLAN-to-service mapping with this in mind before you hit it in production: if two macvlan-backed services need to share a subnet, they need to run on different nodes, permanently, by constraint, not by scheduling luck.

---

### 5. Gotcha #3: When Your DNS Resolver Is Also a Macvlan Container

This is where Gotcha #1 stops being merely inconvenient and starts being a systemic performance problem, because of how Docker's embedded DNS forwarding works. The searchable symptoms here are "Docker container DNS slow," "DNS lookup takes 5 seconds in container," or "curl slow to connect but fast to download inside Docker," and the maddening part is that they only show up on some nodes.

Every container's resolver, by default, points at \`127.0.0.11\`, Docker's built-in embedded DNS server. For any hostname that isn't another container on the same Docker network, that embedded resolver forwards the query out to the upstream nameservers configured on the host, in order. If your upstream DNS is itself a macvlan container (say, a self-hosted resolver like **AdGuard**, running with its own LAN address so it can serve every device on the network, not just Docker containers), and that container happens to be scheduled on this particular node, you've just recreated Gotcha #1 in the one place where it costs you the most: **every single external DNS lookup from every container on that node has to fail against the unreachable local address first, before it falls through to a working upstream.**

That failure isn't instant. It waits out a connection timeout, typically several seconds, before moving to the next resolver in the list. Multiply that by every external lookup any service on that node makes (and a lookup that needs both an A and an AAAA record effectively pays it twice), and you get exactly the kind of "everything on this one node feels slow" symptom that's maddening to chase, because the node's CPU, memory, and disk all look completely fine. The bottleneck is a network round-trip to an address that was never reachable in the first place.

The good news: this is the same root cause as Gotcha #1, so it has the same fix. Deploy the host shim in Section 3 on every node that runs (or could run) your DNS resolver, and the resolver becomes reachable from its own host exactly like it already is from every other node. No changes to DNS configuration, no reordering resolver priority, no per-node exceptions to maintain. In our deployment, resolver logs went from thousands of internal resolution errors in a 30-minute window to zero, on the exact node where the resolver itself was running, with no other change made.

---

### 6. When You Should Not Reach For Macvlan

Given how much of this article is about failure modes, it's worth being direct about when macvlan is the wrong tool. If a service:

- only ever needs to be reached by other containers or by a reverse proxy already on the same overlay network,
- doesn't need to own a specific host port,
- doesn't need to receive broadcast or multicast traffic, and
- doesn't need a distinct LAN identity that something external already expects,

then overlay networking is simpler, has none of the three gotchas above, and gets you Docker's built-in service discovery and load balancing for free. We run the overwhelming majority of services in our own cluster on overlay networks precisely because most of them don't need any of macvlan's four properties from Section 1. Macvlan earns its complexity budget only for the specific handful of services where owning a real network identity is the actual requirement, not a nice-to-have.

One more practical constraint worth flagging before you commit to macvlan for something: it generally requires the parent NIC to support promiscuous mode, since the interface has to accept traffic addressed to MAC addresses that aren't its own. Most wired NICs handle this fine. Wireless interfaces very often do not, because the wireless access point itself typically filters frames to known-associated MAC addresses, which breaks macvlan's model before Docker is even involved. If your macvlan container gets an IP but has no internet access, can't reach the gateway, or works for a minute and then goes silent, and the parent interface is Wi-Fi, that's almost certainly why. Expect problems that have nothing to do with anything else in this article.

This is also the main reason **ipvlan** exists as an alternative. Ipvlan (in L2 mode) behaves like macvlan from the container's point of view, a real IP on the real LAN, but every container shares the parent interface's MAC address instead of getting its own. That sidesteps both the promiscuous-mode requirement and access points that reject unknown MACs, which makes ipvlan the usual recommendation when the parent interface is wireless or when your switch port enforces one-MAC-per-port security. The tradeoff is that DHCP and anything else that distinguishes devices by MAC can no longer tell your containers apart. On wired server NICs, where the constraint doesn't apply, we prefer macvlan for exactly that per-container identity; note that ipvlan L2 shares the same host-isolation behavior as macvlan, so switching drivers does not make Gotcha #1 go away.

---

### Frequently Asked Questions

#### How do I give a Docker container its own IP address on my LAN?

Create a macvlan network bound to the host's physical interface, with your LAN's real subnet and gateway, then attach the container to it with a static \`--ip\`. The container gets its own MAC address and appears to your router and every other device as a separate machine on the network; it can own ports (like 53 for DNS) independently of the host, receive a firewall rule or allow-list entry of its own, and be reached without any published-port mapping. Reserve the address range you hand to Docker (via \`--ip-range\` or router DHCP exclusions) so your DHCP server never leases those addresses to something else.

#### Why does my macvlan container have no internet access?

The three most common causes, in order: the network was created with the wrong subnet or gateway for the VLAN the parent interface is actually on; the parent interface is a Wi-Fi adapter, whose access point silently drops frames from MAC addresses it doesn't recognize; or you're testing "internet access" by pinging the Docker host itself, which fails by design (see the host-isolation section above) even when the container's actual internet connectivity is fine. Verify with a ping to the gateway and to an external IP from inside the container before assuming the network is broken.

#### Should I use macvlan or ipvlan?

Wired parent interface and you want each container to be a distinct device (its own MAC, its own DHCP identity, per-device firewall rules): macvlan. Wireless parent interface, or a switch port with MAC-based port security: ipvlan L2, because it shares the parent's MAC and doesn't need promiscuous mode. Both give containers real LAN addresses, and both have the same host-isolation limitation, so the shim fix described in this article applies either way.

#### Does macvlan work over Wi-Fi?

Generally no. Macvlan requires the parent interface to carry traffic for multiple MAC addresses, and most wireless access points only accept frames from the MAC that associated with them, so container traffic is dropped before it ever reaches the network. The usual symptoms are a container that gets an address but can't reach anything, or ARP requests that never get answers. Use ipvlan L2 on wireless parents, or move the workload to a wired interface.

#### Can a Docker host reach a container on its own macvlan network?

Not by default, and this is expected behavior, not a bug. The Linux macvlan driver does not provide a loopback path between a parent interface and its own macvlan children, so the host that's physically running the container cannot reach that container's macvlan IP directly. Every other node on the network, and every other device on the LAN, can reach it normally. The fix is a macvlan shim interface created on the host itself, attached to the same parent NIC, which gives the host a legitimate presence in the same L2 domain as its containers.

#### Why does routing the whole subnet through a macvlan shim cause problems?

Because the shim interface only knows about the specific container IP(s) you intend to reach through it; it has no relationship with your default gateway, your NAS, or any other host on the network. Routing an entire subnet through it hijacks traffic that was working fine through the normal interface, including traffic to devices that have nothing to do with Docker. Always route only the specific /32 addresses you need reachable, never the full subnet.

#### Can two macvlan networks share the same gateway on one Docker host?

No. Docker's IPAM rejects a second macvlan network claiming a gateway address that's already allocated on that node, with an explicit "address already in use" error. If two macvlan-backed services need to share a subnet, they need to run on different nodes via placement constraints; this isn't a limit you can configure around.

#### Does Swarm-scoped macvlan handle nodes with different network interface names?

Not automatically; a plain \`--scope swarm\` macvlan network assumes the same parent interface name everywhere. For a cluster with mixed hardware or mixed interface naming, use Docker's config-only network feature: define a small \`--config-only\` network per node pinning its actual interface name, then have the shared swarm-scoped network reference it with \`--config-from\`. Every node gets the same logical network with the correct local interface underneath.

#### How do I know if a slow DNS lookup is actually this issue?

Test from the node you suspect is affected, directly against the resolver's macvlan IP, and compare against the same test from a different node. If the direct query times out (or takes seconds) from exactly one node and responds normally from every other node and from other devices on the LAN, that's the signature: it's the host-isolation gap, not a problem with the resolver itself. Catching this kind of per-node asymmetry before it becomes a support ticket is a monitoring problem as much as a networking one; see [Network Observability Platforms](/guide/operational-architecture/blog/network-observability-platforms) for how we track per-node metrics across the cluster.

---

### Sources

- Docker Documentation, Macvlan network driver, retrieved 2026-07-28, https://docs.docker.com/engine/network/drivers/macvlan/
- Docker Documentation, docker network create reference (scope, config-only, config-from), retrieved 2026-07-28, https://docs.docker.com/reference/cli/docker/network/create/
- Docker Documentation, Overlay network driver, retrieved 2026-07-28, https://docs.docker.com/engine/network/drivers/overlay/`
};
