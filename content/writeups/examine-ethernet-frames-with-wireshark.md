---
title: The destination MAC never changed. Only the destination IP did.
date: 2026-08-31
summary: >
  Capturing live ICMP on a MacBook against the default gateway and then a
  remote host, and confirming the frame stays addressed to the gateway either
  way while only the packet's destination changes.
tags: [wireshark, ethernet, arp, layer-2, layer-3, packet-capture]
platform: Cisco NetAcad
course: Networking Basics — Lab
credential: cr-cisco-netbasics
---

## Objective

To review the structure of an Ethernet II frame header, then use Wireshark on a live macOS system to capture and analyze real ICMP (ping) traffic to a local default gateway. The goal is to confirm how Layer 2 (Ethernet) addressing and Layer 3 (IP) addressing work together — specifically, that Ethernet frames are addressed hop-by-hop using MAC addresses, while the IP addresses inside the frame's data field represent the true end-to-end source and destination.

## Scenario

**Device:** MacBook (Wi-Fi interface `en0`)
**Default Gateway:** router at `10.221.63.254`
**PC IP Address:** `10.221.32.30`

Before any capture could run, macOS blocked Wireshark with a "You don't have permission to capture on local interfaces" warning. This had to be resolved by running the `ChmodBPF.pkg` installer bundled inside Wireshark's app package (`Wireshark.app/Contents/Resources/Extras/ChmodBPF.pkg`) and logging out/back in so the new permission group (`access_bpf`) took effect — a macOS-specific prerequisite the original lab guide (written for Windows) doesn't cover.

---

## Part 1: Examine the Header Fields in an Ethernet II Frame

- Reviewed the Ethernet II header field table provided in the lab (Preamble 8B, Destination Address 6B, Source Address 6B, Frame Type 2B, Data 46–1500B, FCS 4B).
- Reviewed the lab's provided Wireshark reference screenshots of an ARP request/reply exchange (not a live capture — this part uses the lab's own sample data to confirm field-reading skills before doing a real capture).
- Worked through the reference questions:
  - **Destination address in the ARP request:** Broadcast (`ff:ff:ff:ff:ff:ff`) — ARP has to ask everyone on the segment since it doesn't yet know who owns the target IP.
  - **Why the PC sends an ARP first:** Ethernet frames can only be addressed by MAC, not IP, so the IP-to-MAC mapping has to be resolved before the first ping frame can be built.
  - **Source MAC in the ARP request:** `f0:1f:af:50:fd:c8`
  - **OUI of the source NIC in the ARP reply:** `30:46:9a` (resolves to Netgear)
  - **Portion of the MAC that is the OUI:** the first 3 octets / 24 bits (manufacturer-assigned)
  - **NIC serial number of the source:** `99:c5:72` (last 3 octets)

**Key idea:** Everything in the Ethernet II header operates strictly at Layer 2 — the frame doesn't know or care what protocol is riding inside its Data field. That separation is the whole point of encapsulation.

**Observation:** The reference capture also showed the OUI-to-vendor-name lookup: Wireshark displays `Dell_50:fd:c8` and `Netgear_99:c5:72` instead of raw hex, because it cross-references the OUI against IEEE's public manufacturer registry.

---

## Part 2: Live Capture — Verify Connectivity to the Default Gateway

- Opened Wireshark, selected **Wi-Fi: en0** as the capture interface (the active adapter on this MacBook).
- Applied the display filter `icmp` to narrow the packet list to ping traffic only.
- From Terminal, ran `ping -c 4 10.221.63.254` and captured the resulting Echo Request/Reply pairs (ICMP id `0x230b`, sequence `0` through `3`).
- Stopped the capture and inspected **Frame 2510** (the first Echo Request) in detail.

**Result (Frame 2510):**

| Field | Value |
|---|---|
| Frame type | Ethernet II |
| Source MAC | `10:b5:88:5e:3e:b6` (Apple_5e:3e:b6) |
| Destination MAC | `9c:09:71:3b:f6:01` (NewH3CTechno_3b:f6:01) |
| Source IP | `10.221.32.30` |
| Destination IP | `10.221.63.254` |
| TTL (request) | 64 |
| TTL (reply) | 255 |
| Last two ASCII payload octets | `67` |

**Key idea:** No ARP request appeared in this capture, unlike the reference example in Part 1. This isn't a failure — it means the Mac's ARP cache already held the gateway's MAC address from earlier network activity, so no resolution step was needed. The gateway's MAC address is still what every Layer 2 frame gets addressed to, whether it was just resolved or already cached.

---

## Part 2, Step 7: Capture Packets for a Remote Host

- Started a fresh capture on **Wi-Fi: en0**, clicked "Continue without Saving" on the previous-capture prompt.
- From Terminal, ran `ping -c 4 www.cisco.com`.
- Stopped the capture and inspected **Frame 1123** (the first Echo Request of the new session).

**Result (Frame 1123):**

| Field | Value |
|---|---|
| Source MAC | `10:b5:88:5e:3e:b6` (Apple_5e:3e:b6) |
| Destination MAC | `9c:09:71:3b:f6:01` (NewH3CTechno_3b:f6:01) |
| Source IP | `10.221.32.30` |
| Destination IP | `23.0.221.56` |

**Comparison against Step 6:** The source and destination MAC addresses are **identical** to the gateway ping in Step 6. The source IP is also unchanged. Only the **destination IP** changed — from the gateway's `10.221.63.254` to Cisco's resolved address `23.0.221.56` (a CDN-served IP, so this exact value would differ for anyone else running the same command).

**Key idea:** This is the core Layer 2 vs. Layer 3 distinction the whole lab builds toward. The destination MAC address stays the gateway's MAC because Ethernet framing only ever addresses the *next hop*, not the final destination — the frame doesn't know or need to know anything beyond the local segment. The destination IP address changes because IP addressing is end-to-end: it identifies the actual remote host, however many routers sit between here and there. The gateway is responsible for stripping the frame, re-framing the packet, and forwarding it onward — the PC never builds a frame addressed directly to a device outside its own subnet.

---

## Troubleshooting Log (What Actually Went Wrong)

**Issue 1 — Ping ran indefinitely.**
The first attempt at Step 4 was run as a plain `ping 10.221.63.254` with no count flag.

**Diagnosis:** The command kept sending Echo Requests with no end in sight.

**Root cause:** Unlike Windows Command Prompt, which defaults to sending exactly 4 pings and stopping, macOS `ping` runs continuously until manually interrupted. The lab's instructions were written for Windows and don't call this out.

**Fix:** Interrupted the ping (Ctrl+C), quit and reopened Wireshark to start from a clean capture, then re-ran the command as `ping -c 4 10.221.63.254`, explicitly limiting it to 4 packets.

**Lesson learned:** Default command behavior isn't universal across operating systems — always check the platform-specific flags before assuming a Windows-written lab guide translates directly to macOS/Linux.

**Issue 2 — Unrelated ICMP entries showed up under the `icmp` filter.**
Three frames (`Destination unreachable, Port unreachable`, addressed to `17.253.61.133`) appeared in the filtered view before the actual ping traffic, despite the filter being applied correctly.

**Diagnosis:** These weren't part of the ping session at all — they were background traffic (an Apple service on the Mac generating UDP traffic that triggered an ICMP error response from somewhere upstream).

**Root cause:** The `icmp` display filter matches on *protocol type*, not on a specific traffic session. Any ICMP message — including error responses to totally unrelated background traffic — will pass the filter as long as it's ICMP.

**Fix:** No fix needed for the capture itself; the actual ping frames (Echo Request/Reply) were still clearly identifiable further down the list. Distinguished the two groups by their `Info` column content (`Echo (ping) request/reply` vs `Destination unreachable`) rather than relying on the filter alone.

**Lesson learned:** A display filter narrows by protocol, not by conversation. Isolating one specific exchange sometimes needs a more specific filter (e.g., `icmp.type==8 or icmp.type==0`, or filtering by IP address) rather than the broad protocol name alone.

---

## Key Concepts Reinforced

- **Layer 2 vs. Layer 3 addressing:** Ethernet frames are always addressed to the next hop's MAC (the gateway, for anything off-subnet), while the IP addresses inside the Data field represent the true end-to-end source and destination.
- **MAC address structure:** The first 3 octets (OUI) identify the manufacturer; the last 3 octets are the NIC's unique serial number. Wireshark resolves the OUI to a vendor name automatically.
- **ARP caching:** A missing ARP exchange in a capture doesn't mean resolution didn't happen — it may just mean the OS already had the mapping cached from earlier traffic.
- **Display filters vs. capture filters:** Filtering by protocol name (`icmp`) shows every packet of that protocol, including ones unrelated to the traffic you're actually trying to observe — filters narrow by category, not by intent.
- **Platform differences matter:** Command defaults (like `ping` running forever vs. stopping at 4) differ between Windows and macOS, and a lab guide written for one doesn't always translate directly.
- **TTL as an OS clue:** Even without deep inspection, the reply's TTL of 255 vs. the request's TTL of 64 hints at different underlying operating systems/platforms on each end of the exchange.

---

## Reflection Question

**Wireshark doesn't display the preamble field of a frame header. What does the preamble contain?**

The preamble is 7 bytes of an alternating `10101010` bit pattern, used to let the receiving NIC's clock synchronize with the sender's timing before any real data arrives. It's immediately followed by a 1-byte Start Frame Delimiter (`10101011`), which signals "the actual frame starts now." Wireshark doesn't show it because the NIC hardware itself strips the preamble before the frame is ever handed up to software — by the time Wireshark sees the frame, that field is already gone.

## Conclusion

Part 1 confirmed the theoretical structure of an Ethernet II frame using the lab's reference material. Part 2 verified that same structure against two real, live captures on a MacBook — a ping to the local default gateway (Step 6) and a ping to a remote host, `www.cisco.com` (Step 7). Comparing the two confirmed the lab's central point directly: the destination MAC address stayed identical across both captures (the gateway's), while the destination IP address changed to match whichever host was actually being pinged. This is the clearest possible demonstration that Ethernet addressing is local/hop-by-hop while IP addressing is end-to-end. The most valuable takeaway wasn't a single networking fact, though, but a troubleshooting one: display filters and OS command defaults both narrow *what you asked for*, not necessarily *what you meant*, and reading the actual frame details carefully is what closes that gap.
