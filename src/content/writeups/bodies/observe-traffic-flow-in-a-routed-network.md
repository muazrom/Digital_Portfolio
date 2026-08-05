## Objective

To confirm how ARP resolution and broadcast traffic behave differently on a flat (unrouted) network versus a routed network, and to demonstrate why splitting a large LAN into multiple routed subnets improves efficiency. The activity involves Layer 2 (MAC/ARP) and Layer 3 (IP/routing) behavior, and matters because ARP broadcasts consume resources on every device in a broadcast domain — the more hosts sharing one network, the more that overhead scales.

## Scenario

XYZ LLC currently runs about 150 hosts across Accounting, Finance, and Sales departments on a **single flat IPv4 network**, connected through switches to an Edge router that only handles traffic to the internet (ISP cloud). As the company grows, this flat design is starting to show network delays. The demonstration walks through connecting each department's switch directly to its own Edge router interface, giving each department its own subnet, to show whether routing between separate department networks actually improves efficiency before proposing it to the client.

---

## Part 1: Observe Traffic Flow in an Unrouted LAN

- Opened the **Command Prompt** on **Sales 1** via the Desktop tab and ran `arp -a` to confirm the ARP cache was empty (cleared any leftover entries with `arp -d`).
- Switched Packet Tracer to **Simulation** mode, then opened Sales 2's Command Prompt and ran `ping <Sales 1's IP address>`.
- Used **Capture then Forward** to step the PDU through the network one hop at a time, inspecting each envelope's contents.

**Key idea:** Because Sales 2's ARP cache was empty, it couldn't send the ping directly — it first had to broadcast an ARP request to learn Sales 1's MAC address. On a flat network with no subnet boundaries, that broadcast has nowhere to stop, so every host and the router interface all had to process it, even though only Sales 1 actually needed to respond.

**Observation:** The first PDU had a destination MAC of `FFFF.FFFF.FFFF` (broadcast) with Sales 2's real IP/MAC as the source — this was the ARP request, not the ping itself. Only after the ARP reply came back did a new, differently colored PDU appear at Sales 2, which turned out to be the actual first ICMP echo request.

---

## Part 2: Reconfigure the Network to Route Between LANs

- Detached the Accounting–Finance switch link and reconnected the Accounting side directly to the Edge router's `GigabitEthernet 1/0` port. Repeated the same process for the Finance–Sales link, connecting to the next available Gigabit port.
- On each of the four hosts in the Finance and Sales departments, opened Command Prompt and ran `ipconfig /renew` to request a new address from the router's DHCP service (Accounting kept its original `192.168.1.0/24` addressing).

**Key idea:** Splitting the flat LAN into router-connected segments means each department now sits on its own IPv4 network, with the router acting as the boundary between broadcast domains instead of just a gateway to the internet.

**Result:** Finance was assigned `192.168.2.0/24` and Sales was assigned `192.168.3.0/24`.

---

## Part 3: Observe Traffic Flow in the Routed Network

- Cleared Sales 2's ARP cache again, switched back to Simulation mode, and re-ran the ping to Sales 1, stepping through with Capture then Forward.
- **Result:** This time, only Sales 1 and the router interface facing the Sales network processed the ARP broadcast — Accounting and Finance never saw it at all.
- Repeated the test pinging a host on a different subnet (Accounting 2) from Sales 2 to see how traffic behaves when it has to cross the router.

**Key idea:** Segmenting the network into subnets contains ARP broadcast traffic to only the relevant segment, instead of flooding the entire company network for every unresolved address.

---

## Troubleshooting Log (What Actually Went Wrong)

### Issue 1: Blank IP address after `ipconfig /renew`

Right after rewiring the Finance/Sales switches to the router, running `ipconfig /renew` on the hosts returned no IP address at all.

**Diagnosis:** This happened while still in Simulation mode, and right after the cable was moved — both of which interfere with DHCP actually completing.

**Root cause:** Two things stack here — (1) a newly connected switch port doesn't start forwarding traffic immediately; it cycles through Spanning Tree states (blocking → listening → learning → forwarding), which takes roughly 30–50 seconds in Realtime mode, and (2) Simulation mode advances in discrete steps rather than continuous time, so a DHCP exchange that needs to complete in the background won't resolve properly while stepping through it.

**Fix:** Switched back to Realtime mode, waited for the link lights on the new cable to turn solid green (confirming the port had reached the forwarding state), then re-ran `ipconfig /release` followed by `ipconfig /renew`. The hosts picked up their correct addresses immediately after.

**Lesson learned:** DHCP negotiation and STP port transitions both need real elapsed time to finish. Issuing a command immediately after a topology change, or trying to watch it happen in Simulation mode, can produce a result that looks like a configuration error but is actually just a timing issue.

### Issue 2: First ping to a cross-subnet host fails, later pings succeed

When pinging Accounting 2 from Sales 2 (a cross-router ping), the very first echo request timed out and was dropped at the router, while the next three succeeded normally.

**Diagnosis:** This "first one fails, rest succeed" pattern pointed to an ARP resolution delay rather than an actual connectivity problem, since later pings on the exact same path worked fine.

**Root cause:** Reaching a host on another subnet requires **two independent ARP resolutions**, not one. Sales 2 first ARPs for its default gateway (the router) and only sends the ICMP packet once that resolves. But the router itself had never talked to Accounting 2 before, so when the packet arrived needing forwarding, the router had to pause, broadcast its own ARP request on the Accounting side, and wait for a reply — dropping the in-flight packet rather than queuing it. Once that reply came back, the router cached Accounting 2's MAC address, and Sales 2 already had the gateway's MAC cached from the first hop, so every subsequent echo request had nothing left to resolve.

**Fix:** No fix needed — this is expected behavior. The follow-up pings completed successfully with no changes made.

**Lesson learned:** ARP resolution overhead exists at every routed hop, not just at the sending host. A single dropped first packet when contacting a new destination is a normal side effect of ARP catching up — it mirrors the same "Request timed out" behavior seen on the very first line of a real-world `ping` command.

---

## Key Concepts Reinforced

- **ARP (Address Resolution Protocol):** Resolves an IP address to a MAC address via broadcast when the answer isn't already cached; every device in the broadcast domain has to process that broadcast.
- **Broadcast domains and segmentation:** Routing between subnets confines ARP broadcast traffic to only the relevant segment instead of the entire network, which is the core efficiency gain being demonstrated.
- **DHCP renewal:** Reconfiguring a network's topology can require hosts to request new addressing, and that renewal depends on the underlying link actually being up and forwarding first.
- **Multi-hop ARP resolution:** Routers maintain their own ARP cache per interface and must resolve it independently for each destination subnet, which can cause a brief, expected first-packet drop when forwarding to a previously unseen host.

---

## Conclusion

By the end of the activity, both parts of the comparison were confirmed directly: on the flat, unrouted network, a single ping forced an ARP broadcast that every host and the router had to process, while on the routed network the same kind of broadcast was contained to just the relevant subnet. The most valuable takeaway was the troubleshooting insight from Part 3 — that a dropped first packet when pinging across subnets isn't a fault, but the expected cost of the router resolving ARP independently on the destination network. That distinction is exactly the kind of detail that supports the sales team's proposal: routing reduces broadcast overhead network-wide, at the cost of a small, one-time ARP resolution delay per new destination.
