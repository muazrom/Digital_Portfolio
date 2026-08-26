---
title: An APIPA address that looked like DHCP, but was a cable in the wrong port
date: 2026-08-02
summary: >
  Building a branch-office LAN and verifying each layer separately — which is
  exactly what caught a Layer 1 mistake presenting as a Layer 3 symptom.
tags: [lan, dhcp, apipa, dns, troubleshooting]
platform: Cisco NetAcad
course: Networking Basics — Packet Tracer
---

## Objective

This activity verifies end-to-end connectivity across the physical, network, and application layers in a small branch-office LAN. It involves physically cabling devices, assigning IPv4 addressing (via DHCP for the PCs, static for the printer), and then confirming reachability using `ping`, a web browser, and the diagnostic commands `ipconfig` and `tracert`. Each layer matters separately: a working cable doesn't guarantee working addressing, and working addressing doesn't guarantee name resolution — each has to be confirmed on its own.

## Scenario

A new branch office LAN consists of an Office Router (connected to an ISP on one side and a Switch on the other), and three end devices hanging off the switch: Admin PC and Manager PC (addressed via DHCP), and a Printer (statically addressed at `192.168.1.100 /255.255.255.0`). A simulated remote web server (`www.cisco.pt`, IP `209.165.200.225`) sits out past the ISP. Before assuming the network "works," each layer needed to be checked in turn — a green link light only confirms a physical connection exists, not that traffic can actually pass end to end.

---

## Part 1: Verify Connectivity to the Printer via Ping

- Opened the **Command Prompt** on **Admin PC** via the Desktop tab.
- Ran `ping 192.168.1.100` (the printer's static address), then repeated the same ping from **Manager PC**.
- Both PCs received successful replies once addressing was corrected (see Troubleshooting Log).

**Key idea:** ICMP ping tests basic Layer 3 reachability. A successful ping confirms the target is powered on, correctly addressed, and reachable at the IP layer — but it says nothing about whether any application running on that device (like a print service) actually works.

**Observation:** Successful round-trip replies with 0% loss from both PCs to `192.168.1.100`.

---

## Part 2: Connect via the Application Layer (Web Browser + DNS)

- Opened the **Web Browser** app from **Admin PC**'s Desktop tab.
- Loaded the page first using the server's IP address (`209.165.200.225`) — successful.
- Loaded the same page again using the URL (`www.cisco.pt`) — also successful.

**Key idea:** Reaching a resource by IP address confirms routing and Layer 3 connectivity. Reaching it by name additionally requires DNS — an application-layer service that resolves the human-readable name into the IP address actually used to make the connection. If IP access works but URL access doesn't, DNS is the layer to suspect, not routing.

---

## Part 3: Diagnose with ipconfig and tracert

- Ran `ipconfig /all` on **Admin PC**'s Command Prompt.
- Ran `tracert` to `209.165.200.225` from **Admin PC**.

**Key idea:** `ipconfig /all` shows everything a host currently believes about its own configuration — address, mask, gateway, DHCP server, DNS server, and MAC address — useful for confirming a host actually got a real lease rather than an APIPA fallback. `tracert` shows the hop-by-hop path a packet takes to its destination, which pinpoints *where* along a route a failure sits rather than just whether the destination was reached at all.

**Observation (`ipconfig /all`, FastEthernet0):**

| Field | Value |
|---|---|
| Physical (MAC) Address | 00-0A-41-36-39-12 |
| IPv4 Address | 192.168.1.3 |
| Subnet Mask | 255.255.255.0 |
| Default Gateway | 192.168.1.1 |
| DHCP Server | 192.168.1.1 |
| DNS Server | 209.165.200.225 |

**Observation (`tracert` to 209.165.200.225):**

| Hop | IP Address | Identity |
|---|---|---|
| 1 | 192.168.1.1 | Office Router (LAN gateway) |
| 2 | 209.165.200.233 | ISP router |
| 3 | 209.165.200.225 | Destination web server |

Two router hops before reaching the destination, matching the topology: one hop inside the branch office, one hop out on the ISP side.

---

## Troubleshooting Log (What Actually Went Wrong)

Attempting to ping the printer from Admin PC failed. Checking the PC's IP configuration showed `169.254.66.145` with subnet mask `255.255.0.0` — not an address on the branch office's `192.168.1.0/24` network at all.

**Diagnosis:** The `169.254.x.x` range with a `255.255.0.0` mask is the telltale sign of an **APIPA (link-local) address** — the address a Windows/Packet Tracer host self-assigns when it sends a DHCP request and never gets a reply. This pointed to a failed DHCP exchange rather than a bad ping target.

**Root cause:** The Office Router had initially been powered off, which was fixed first — but the ping still failed afterward. Releasing and renewing the IP (`ipconfig /renew`) still returned APIPA. Checking the router's configuration showed `G0/1` correctly held the LAN gateway address `192.168.1.1`, but `G0/0` — which had no IP configured — was the interface actually cabled to the switch. The router had no addressed interface on the wire the PC's DHCP request was traveling over, so the request had nowhere to land.

**Fix:** Moved the cable from the router's `G0/0` port to `G0/1`, matching the interface that actually holds the LAN gateway address. Renewed DHCP on Admin PC, which then received a proper `192.168.1.x` address.

**Lesson learned:** A green link light only confirms a physical connection exists — not that it's plugged into the *correct* interface. A Layer 1 mistake (right cable, wrong port) can surface as a Layer 3 symptom (DHCP failure / APIPA) that looks like a configuration problem until you check the physical cabling and the interface configuration together.

---

## Key Concepts Reinforced

- **DHCP vs. static addressing:** End-user devices (PCs) benefit from automatic, centrally-managed DHCP addressing; devices other hosts need to reliably find at a fixed address (printers, servers) are usually addressed statically.
- **APIPA (link-local addressing):** A `169.254.x.x` address with mask `255.255.0.0` is not a sign of a working network — it's a host's fallback when DHCP fails, and a strong diagnostic clue in itself.
- **Default gateway:** The address a host sends traffic to when the destination isn't on its local network — derived from the router's LAN-facing interface, which is why it has to be correctly cabled *and* addressed.
- **DNS:** Translates human-readable names into IP addresses; IP-only access working while URL access fails isolates the problem to name resolution specifically.
- **tracert (path diagnostics):** Reveals each router hop along a path, which localizes failures to a specific segment instead of just an overall pass/fail result.

---

## Conclusion

By the end of the activity, connectivity was confirmed at every layer: physical links were up, both PCs received valid DHCP addressing on `192.168.1.0/24`, the printer's static address was reachable by ping, and the web server was reachable both by IP and by URL — confirming DNS was also functioning. The most valuable takeaway was the troubleshooting step in the middle: an APIPA address looked at first like a DHCP or router problem, but the actual root cause was a cable connected to the wrong (unaddressed) router interface. It's a good reminder that Layer 1 issues can masquerade as Layer 3 symptoms, and diagnosing them well means checking cabling and configuration together, not just one or the other.
