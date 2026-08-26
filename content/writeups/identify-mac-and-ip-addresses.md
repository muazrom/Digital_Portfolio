---
title: MAC addresses get rewritten at every hop. IP addresses do not.
date: 2026-08-01
summary: >
  Inspecting each PDU at every device along a local ping and then a routed
  one, confirming Layer 2 addressing is only meaningful on a single segment
  while Layer 3 addressing survives end to end.
tags: [mac, arp, layer-2, layer-3, packet-capture]
platform: Cisco NetAcad
course: Networking Basics — Packet Tracer
---

## Objective

This activity verifies how Layer 2 (MAC) and Layer 3 (IP) addressing behave differently depending on whether two communicating devices sit on the same local network or on separate networks connected by a router. Using Packet Tracer's Simulation mode, each PDU (frame/packet) was captured and inspected at every device along its path — first for a local ping (same subnet, switch-only path), then for a remote ping (different subnets, router in the path). The goal was to confirm two things: (1) that MAC addresses are only meaningful on a single physical segment and are rewritten by any Layer 3 device the traffic passes through, while (2) IP addresses remain constant from source to final destination regardless of how many hops the traffic takes.

## Scenario

The simulated topology consists of host **172.16.31.3** connected through **Switch 2** to a **Router**, and host **10.10.10.2** connected wirelessly through an **Access Point** and **Switch 1** to the same Router. The Router's two interfaces sit on the two different IP networks: **FastEthernet1/0** on the `172.16.31.0/24` network, and **FastEthernet0/0** on the `10.10.10.0/24` network. No device configuration was required — the activity is purely observational, using `ping` and Simulation mode to capture PDU details at each hop. Before assuming a ping's behavior is "normal," each PDU's In Layers/Out Layers were compared at every device to confirm whether that device altered the frame, the packet, or neither.

---

## Part 1: Verify Connectivity to a Local Host (172.16.31.3 → 172.16.31.2)

- Opened the **Command Prompt** on host **172.16.31.3** via the Desktop tab.
- Ran `ping 172.16.31.2` in Realtime mode to confirm basic connectivity, then switched to **Simulation** mode and repeated the same `ping 172.16.31.2` command.
- Clicked the resulting PDU icon at each hop and used **Capture/Forward** to step it through the path, recording the OSI Model tab's Layer 2 and Layer 3 addressing at every device until the echo reply returned.

**Key idea:** Because both hosts share the same subnet, no default gateway is involved. The frame is switched, not routed — Switch 2 reads only the destination MAC address, looks it up in its MAC address table, and forwards the frame out the matching port unchanged. It has no visibility into Layer 3 at all, which is why its row shows `N/A` for IP addresses.

**Observation:**

| At Device | Src MAC | Dest MAC | Src IPv4 | Dest IPv4 |
|---|---|---|---|---|
| 172.16.31.3 | 0060.7036.2849 | 000C.85CC.1DA7 | 172.16.31.3 | 172.16.31.2 |
| Switch 2 | 0060.7036.2849 | 000C.85CC.1DA7 | N/A | N/A |
| 172.16.31.2 (inbound) | 000C.85CC.1DA7 | 000C.85CC.1DA7 | 172.16.31.3 | 172.16.31.2 |
| 172.16.31.2 (outbound / echo-reply) | 0060.7036.2849 | 0060.7036.2849 | 172.16.31.2 | 172.16.31.3 |

The source and destination MAC/IP pairs reverse on the outbound (echo-reply) frame, since the replying host is now acting as the source.

---

## Part 2: Gather PDU Information for a Remote Network Communication (172.16.31.3 → 10.10.10.2)

- Returned to the **Command Prompt** on **172.16.31.3** and ran `ping 10.10.10.2`. The first ping timed out.
- Switched to **Simulation** mode and repeated `ping 10.10.10.2`, then stepped the PDU through the path with **Capture/Forward**, recording both the **inbound** and **outbound** addressing at the Router specifically, since it is the one device expected to rewrite Layer 2 headers.
- Repeated the process for the return echo-reply originating from 10.10.10.2.

**Key idea:** Since 10.10.10.2 is outside 172.16.31.3's own subnet, the source host does not attempt to resolve 10.10.10.2's MAC address directly. Instead it hands the frame off to its default gateway (the Router), using the Router's own interface MAC as the destination MAC while keeping the true destination IP (10.10.10.2) in the packet. At the Router, the packet is routed based on its routing table, and an entirely new Layer 2 header is built for the outgoing interface — new source MAC (the Router's outbound interface) and new destination MAC (the next device on that segment). This happens once in each direction. The IP source/destination pair never changes anywhere along the path — only the MAC addressing is rewritten, and only at the Router.

**Observation — request (172.16.31.3 → 10.10.10.2):**

| At Device | Src MAC | Dest MAC | Src IPv4 | Dest IPv4 |
|---|---|---|---|---|
| 172.16.31.3 | 0060.7036.2849 | 00D0.BA8E.741A | 172.16.31.3 | 10.10.10.2 |
| Switch 2 | 0060.7036.2849 | 00D0.BA8E.741A | N/A | N/A |
| Router (inbound, Fa1/0) | 0060.7036.2849 | 00D0.BA8E.741A | 172.16.31.3 | 10.10.10.2 |
| Router (outbound, Fa0/0) | 00D0.588C.2401 | 0060.2F84.4AB6 | 172.16.31.3 | 10.10.10.2 |
| Switch 1 | 00D0.588C.2401 | 0060.2F84.4AB6 | N/A | N/A |
| Access Point | N/A | N/A | N/A | N/A |
| 10.10.10.2 (inbound) | 0060.2F84.4AB6 | 00D0.588C.2401 | 172.16.31.3 | 10.10.10.2 |

**Observation — echo-reply (10.10.10.2 → 172.16.31.3):**

| At Device | Src MAC | Dest MAC | Src IPv4 | Dest IPv4 |
|---|---|---|---|---|
| 10.10.10.2 | 0060.2F84.4AB6 | 00D0.588C.2401 | 10.10.10.2 | 172.16.31.3 |
| Access Point | N/A | N/A | N/A | N/A |
| Switch 1 | 0060.2F84.4AB6 | 00D0.588C.2401 | N/A | N/A |
| Router (inbound, Fa0/0) | 0060.2F84.4AB6 | 00D0.588C.2401 | 10.10.10.2 | 172.16.31.3 |
| Router (outbound, Fa1/0) | 00D0.BA8E.741A | 0060.7036.2849 | 10.10.10.2 | 172.16.31.3 |
| Switch 2 | 00D0.BA8E.741A | 0060.7036.2849 | N/A | N/A |
| 172.16.31.3 (inbound) | 00D0.BA8E.741A | 0060.7036.2849 | 10.10.10.2 | 172.16.31.3 |

---

## Troubleshooting Log (What Actually Went Wrong)

The very first `ping 10.10.10.2` timed out, even though the topology and addressing were correct. In Simulation mode, capturing the PDU at that first attempt showed the Router's **Out Layers panel completely empty** — Layer 1, 2, and 3 all blank on the outbound side — even though the **In Layers** panel showed the packet had arrived correctly and the Router's own log confirmed it had already checked the CEF table, missed, and fallen back to the routing table.

**Diagnosis:** The routing table lookup itself had succeeded — the Router knew which interface (Fa0/0) to send the packet out. But the Layer 2 frame for that outgoing interface couldn't be built yet, because the Router had no ARP entry mapping the next-hop IP to a MAC address. Re-running the exact same ping a second time produced a Router capture with the Out Layers panel fully populated (`00D0.588C.2401 >> 0060.2F84.4AB6`, out FastEthernet0/0) — identical routing decision, just now with the MAC resolved.

**Root cause:** This is expected ARP behavior, not a misconfiguration. Routing (Layer 3, "which interface does this go out") and address resolution (Layer 2, "what MAC do I write on the frame for that interface") are two separate steps. The first ping triggers an ARP request in the background; while that request is still outstanding, the Router has nowhere to send the frame and drops it — the ping to `10.10.10.2` times out. By the second ping, the ARP reply has been received and cached, and the frame can be built and forwarded normally.

**Fix:** No configuration change was needed. Re-sending the ping (or simply waiting) resolved it, since the ARP exchange completes on its own.

**Lesson learned:** A successful routing table match does not guarantee immediate delivery. Reachability at Layer 3 and address resolution at Layer 2 are independent processes, and the classic "first ping or two times out" behavior after a topology comes up is a normal symptom of ARP still resolving — not a sign of a routing or connectivity problem.

---

## Key Concepts Reinforced

- **Layer 2 vs. Layer 3 addressing:** MAC addresses are only meaningful on the local physical segment; IP addresses are meaningful end-to-end, from true source to true final destination, regardless of how many hops separate them.
- **Switches only look at MAC addresses:** A switch's job is identical whether the traffic is purely local or just passing through on its way to a router — it forwards based on its MAC address table and never inspects or alters IP addressing.
- **Routers rewrite Layer 2 on every interface:** The Router is the only device in the path that builds an entirely new Ethernet header per outgoing interface, using its own interface MAC as the new source and the resolved next-hop MAC as the new destination — while leaving the IP header's source/destination untouched.
- **Default gateway usage:** A host decides whether a destination is local or remote by comparing it against its own subnet. Local destinations get ARP'd for directly; remote destinations get sent to the default gateway's MAC address instead, with the true destination IP preserved in the packet.
- **ARP resolution is a separate step from routing:** A correct routing decision can still result in a dropped or delayed frame if the next-hop MAC address hasn't been resolved yet, which explains the "first ping times out" pattern seen when traffic to a new destination begins.

---

## Conclusion

Both parts of the activity confirmed the same underlying principle from two different angles: MAC addressing is local and disposable, rebuilt at every Layer 3 boundary, while IP addressing is the constant that travels unchanged from the real source to the real destination. Part 1 showed the simple case — no router involved, so no MAC rewriting occurs at all. Part 2 showed the general case — a Router in the path rewrites the Layer 2 header exactly once per direction, on each of its two interfaces, while the IP header stays identical the entire way. The most valuable takeaway came from the troubleshooting log: the initial ARP-driven ping timeout wasn't a fault to fix, but direct, capturable proof that routing and address resolution are two separate mechanisms working together — and that watching a Router's Out Layers panel go from empty to populated, one ping apart, is the clearest possible illustration of that.
