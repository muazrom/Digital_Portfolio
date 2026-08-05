## Objective

This activity examines how Network Address Translation (NAT) operates on a home wireless router, and verifies that the router's WAN-facing and LAN-facing interfaces sit in genuinely different IP address spaces (public vs. private). Four PCs are connected to the router and assigned addresses via DHCP, after which simulated HTTP traffic is generated from a PC to an external web server. By comparing the packet's Inbound and Outbound header details at the router, the activity confirms that NAT actively rewrites the source IP address — translating a private LAN address into the router's single public WAN address — before the packet is allowed onto the internet.

## Scenario

The topology consists of a home-style wireless router bridging a private LAN to a simulated ISP/WAN. Four PCs (PC1–PC4) are connected to the router via straight-through cables and configured for DHCP, drawing addresses from the router's pool (192.168.1.100–192.168.1.149). The router's WAN interface separately obtains a public address from the ISP's DHCP server. Because private addresses like 192.168.1.x cannot be routed across the public internet, anything a PC sends outbound has to pass through the router's NAT process first. The activity verifies this at each hop: the WAN-side config, the LAN-side config, the DHCP assignment to all four hosts, and finally a live packet capture comparing the packet before and after it crosses the router.

---

## Part 1: Verify the External (WAN) Configuration

- Opened the router's web-based configuration utility from PC1's browser by entering the default gateway address, logging in with username `admin` / password `admin`.
- Navigated to **Status → Internet Connection** (the WAN-side status page).
- Recorded the address information assigned to the router's WAN interface by the ISP's DHCP server.

**Key idea:** The Internet IP Address is the one address the outside world (the ISP and everything beyond it) actually associates with this network. It's the router's identity on the public internet — not any individual PC's identity.

**Observation:**

| Field | Value |
|---|---|
| Internet IP Address | 209.165.200.227 |
| Subnet Mask | 255.255.255.224 |
| Default Gateway (ISP-side) | 209.165.200.225 |

209.165.200.227 falls outside all RFC 1918 private ranges, confirming it is a **public**, internet-routable address.

---

## Part 2: Verify the Internal (LAN) Configuration

- Clicked **Local Network** within the Status sub-menu.
- Reviewed the router's LAN-side IP and the DHCP server settings that will assign addresses to connected hosts.

**Key idea:** The Router IP Address here is the *default gateway* every internal device will use — a completely separate address, in a completely separate (private) address space, from the WAN IP recorded in Part 1.

**Observation:**

| Field | Value |
|---|---|
| Router IP Address (LAN) | 192.168.1.1 |
| Subnet Mask | 255.255.255.0 |
| DHCP Server | Enabled |
| DHCP Start Address | 192.168.1.100 |
| DHCP End Address | 192.168.1.149 |

192.168.1.1 falls inside the 192.168.0.0/16 private range (RFC 1918), confirming it is **private** and non-routable on the public internet — the opposite of the Part 1 result.

---

## Part 3: Connect Additional Hosts and Verify DHCP Assignment

- Added 3 more PCs (4 total), connecting each to the wireless router with straight-through cables.
- Enabled DHCP on each via **Desktop → IP Configuration**.
- Verified each host's assigned address using `ipconfig /all` at the Command Prompt.

**Key idea:** All four hosts pull from the same private DHCP pool defined in Part 2, so each gets a unique address on the internal network — but none of these addresses mean anything outside it.

**Observation:**

| Device | IP Address |
|---|---|
| PC1 | 192.168.1.100 |
| PC2 | 192.168.1.101 |
| PC3 | 192.168.1.102 |
| PC4 | 192.168.1.103 |

All four addresses fall within the DHCP pool (192.168.1.100–192.168.1.149) confirmed in Part 2.

---

## Part 4: Generate NAT Traffic

- Entered Simulation mode and filtered visible events down to TCP and HTTP only.
- Created a Complex PDU sourced from PC1, destined for the web server `ciscolearn.nat.com`, using: Select Application = HTTP, Source Port = 1000, Simulation Setting = Periodic every 120 seconds.
- Played the simulation and observed the PDU travel from PC1, through the wireless router, out toward the server.

**Key idea:** Every outbound packet from a LAN host has to physically pass through the router before it can leave the network — which makes the router the single point where NAT translation can (and must) happen.

---

## Part 5: Compare Inbound vs. Outbound Headers at the Router

- Selected an event in the Simulation Panel and opened the PDU Information window at the Wireless Router device.
- Compared the **Inbound PDU Details** tab against the **Outbound PDU Details** tab for the same packet.

**Key idea:** This is the direct evidence of NAT in action — the same packet, captured on either side of one device, with a different source address depending on which side you look from.

**Observation:**

| | Source IP | Destination IP |
|---|---|---|
| Inbound (LAN side, entering router) | 192.168.1.100 | 209.165.200.228 |
| Outbound (WAN side, leaving router) | **209.165.200.227** | 209.165.200.228 |

The destination IP (the server, 209.165.200.228) stayed identical in both directions. The source IP changed from PC1's private address (192.168.1.100) to the router's own public WAN address (209.165.200.227) — the exact address recorded in Part 1 — confirming NAT rewrote the packet's source before forwarding it to the WAN.

---

## Troubleshooting Log (What Actually Went Wrong)

While experimenting beyond the guided steps, I tried building a Complex PDU sourced *from* the server (`ciscolearn.nat.com`) destined for the wireless router — and separately, from the server directly to a PC — expecting the router's public IP to be involved somewhere. Instead, Packet Tracer showed the private LAN address (e.g., 192.168.1.1 or 192.168.1.100) as the endpoint, even though the packet was framed as originating "outside."

**Diagnosis:** Packet Tracer's PDU builder doesn't simulate real-world routing rules — when you click a device to set it as a PDU endpoint, it just reads whatever IP is actually configured on that device's interface and drops it straight into the packet. It doesn't check whether that address would actually be reachable from "outside" in a real network.

**Root cause:** 192.168.1.x is private (RFC 1918) address space. On a real network, no public router would ever forward a packet addressed to a private IP — those addresses aren't globally unique, and ISPs/backbone routers filter them out entirely. So a real external host could never actually address an internal PC by its private IP the way the simulator allowed.

**Fix:** No configuration change was needed — this was a conceptual gap rather than a lab error. The actual mechanism that lets return traffic find the correct internal PC is the router's **NAT/PAT translation table**: when PC1 sends a packet out, the router logs a mapping between its private IP:port and the router's own public IP:port. Only replies matching an existing table entry get translated back and forwarded inward; unsolicited traffic from outside — like the test PDU I tried — has no matching entry, so a real router would simply drop it.

**Lesson learned:** Private IP addresses only have meaning *within* their own local network, and NAT is inherently asymmetric — it only translates traffic in response to a connection that started from the inside. This is also why NAT incidentally behaves like a basic firewall against unsolicited inbound connections.

---

## Key Concepts Reinforced

- **NAT (Network Address Translation):** Rewrites the source IP address of outbound packets, allowing many internal, privately-addressed hosts to share one public IP when communicating with the internet.
- **Private vs. Public IP Addressing (RFC 1918):** Private ranges (e.g., 192.168.0.0/16) are reserved for internal use and are not routable on the public internet; only public addresses like the router's WAN IP are.
- **DHCP:** Automatically assigns IP configuration (address, gateway, subnet mask) to hosts, both on the router's WAN side (from the ISP) and LAN side (to internal PCs), removing the need for manual configuration.
- **PAT / NAT Translation Table:** Because multiple internal hosts share a single public IP, the router distinguishes their sessions using port numbers, tracked in a translation table that maps private IP:port pairs to public IP:port pairs — that table is what allows return traffic to reach the correct internal host.

---

## Conclusion

By the end of the activity, the router's dual identity was directly confirmed: a public WAN address (209.165.200.227) reachable from the internet, and a private LAN address (192.168.1.1) plus DHCP-assigned addresses for all four PCs, reachable only internally. The Part 5 header comparison provided direct proof of NAT — the same packet showed PC1's private address on the inbound side and the router's public address on the outbound side, with the destination unchanged throughout. The most valuable takeaway was the troubleshooting discovery that NAT is directional and stateful: it only translates traffic that originated from inside the network, tracked via a port-based translation table, which is also why an outside host can't simply address an internal device directly.
