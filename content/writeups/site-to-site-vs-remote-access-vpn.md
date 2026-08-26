---
title: Site-to-site vs remote access VPN, and the overlap that breaks both
date: 2026-08-19
summary: >
  Working out what each VPN type actually connects — network-to-network vs
  host-to-network — then the routing-table mechanics underneath, including why
  two LANs using the same subnet can never be tunnelled together.
tags: [vpn, ipsec, routing, subnetting]
platform: Cisco NetAcad
course: Network Support and Security — Concepts
---

## Objective

Understand the structural difference between a site-to-site VPN and a remote access VPN — what each connects, who needs client software, and when each is the right tool. Then go one level deeper: understand *how* a site-to-site VPN actually makes two separate LANs reachable to each other. The goal isn't just naming the two VPN types, but being able to explain the routing-table mechanics behind "device on Network A can reach device on Network B."

## Scenario

Two networks, used as a running example throughout:

- **Office (Network A):** `192.168.2.0/24`, behind a router acting as the local VPN gateway.
- **Home (Network B):** `172.16.0.0/16`, behind a router at home acting as the other VPN gateway.

The two gateway routers are connected by a site-to-site VPN tunnel across the internet (the WAN), replacing what would once have required a dedicated leased line between the two locations.

---

## Part 1: Site-to-Site VPN vs Remote Access VPN

- **Site-to-site VPN** connects two entire networks together via their gateway routers. The tunnel is established once between the two routers (always up, or brought up automatically when traffic needs it) — no individual device or user has to "connect." Any device on either LAN is reachable to the other side automatically, scoped by whatever rules the admin configures.
- **Remote access VPN** connects a single device to a network. The user runs VPN client software on that device, which tunnels into a VPN gateway/concentrator at the network's edge. This is the case for someone reaching a corporate LAN from a laptop at a coffee shop — they are *not* already on either network, so they need the client to punch in.

**Key idea:** The distinction is about *what* is being connected — network-to-network vs. host-to-network — not about which protocol is used. Both commonly rely on IPsec; remote access can also use SSL/TLS for a "clientless," browser-based connection.

**Observation:** For a home/office setup where I want to reach my homelab from my office desk, site-to-site is the correct fit *if* I'm always connecting from the office LAN itself — no manual VPN client step required once the tunnel exists. Remote access would be the fit if I were roaming off both networks entirely (e.g. a coffee shop).

---

## Part 2: How Reachability Actually Works (Routing, Not Merging)

- A site-to-site VPN does **not** merge the two networks into one. It adds a specific entry to each router's routing table that says, in effect: *"traffic destined for [the other network] gets sent down the VPN tunnel interface, encrypted, instead of out to the regular internet."*
- Example entry on the office router:
  ```
  Destination: 172.16.0.0/16  →  send via: VPN tunnel interface (encrypted)
  ```
- This can be implemented two ways:
  - **Policy-based VPN** — an access list defines "interesting traffic" that triggers encryption and tunneling.
  - **Route-based VPN** — a virtual tunnel interface simply sits in the routing table like any other interface. This is how WireGuard and most modern IPsec setups work, and it's generally easier to reason about.
- Because `192.168.2.0/24` and `172.16.0.0/16` don't overlap, this works cleanly with **no NAT needed** — packets keep their real source and destination IPs the entire way, so traffic across the tunnel looks the same to both ends as local traffic would.

**Key idea:** Reachability is a routing decision made per-packet based on destination IP, not a network merge. The VPN tunnel is just another path in the routing table — the "magic" is ordinary routing logic pointed at an encrypted interface instead of the internet.

---

## Troubleshooting Log (What to Watch For)

**The pitfall:** Many home routers ship with the same default subnet (commonly `192.168.1.0/24`). If both sides of a site-to-site VPN happened to use the same subnet, the tunnel itself would still come up fine — but routing would break.

**Diagnosis:** A router receiving traffic for `192.168.1.50` would have no way to tell "the local device at that address" apart from "the remote device at that same address on the other end of the tunnel." Both match the same routing entry.

**Root cause:** Overlapping address space is ambiguous to a router — routing tables work on destination IP ranges, and an overlapping range can't be uniquely resolved to one interface.

**Fix:** Either re-address one of the two networks so the subnets are distinct (the approach taken here — office on `192.168.2.0/24`, home on `172.16.0.0/16`), or configure NAT across the tunnel to translate one side's addresses into a non-conflicting range.

**Lesson learned:** Before standing up a site-to-site VPN between any two networks — home lab, office, cloud VPC, doesn't matter — check that the subnets don't overlap. It's the single most common gotcha in this kind of setup, and it's free to avoid by planning addressing up front.

---

## Key Concepts Reinforced

- **Site-to-site VPN:** Gateway-to-gateway tunnel connecting two full networks; no client software needed on individual devices.
- **Remote access VPN:** Host-to-gateway tunnel requiring client software on the connecting device; used when the device isn't already on either network.
- **Routing table:** The mechanism that actually makes cross-VPN reachability work — traffic is routed to the tunnel interface based on destination IP, not merged into a single broadcast domain.
- **Policy-based vs. route-based VPN:** Two implementation styles for deciding which traffic gets tunneled — access-list-driven vs. virtual-interface-driven.
- **Subnet overlap:** The classic site-to-site VPN pitfall; non-overlapping address ranges are what let traffic cross the tunnel without NAT.

---

## Conclusion

By the end of this session, the distinction between site-to-site and remote access VPNs is clear at both the conceptual level (what's being connected, who needs a client) and the mechanical level (how a router actually decides to route traffic across the tunnel rather than out to the internet). The most valuable takeaway is that a site-to-site VPN is fundamentally a routing decision, not network fusion — which is also exactly why subnet planning (avoiding overlap) matters before ever standing up the tunnel between an office and a home network.
