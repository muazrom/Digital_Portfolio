---
title: A browser cannot reach a hostname — only an IP address
date: 2026-08-02
summary: >
  Tracing a page request in simulation mode to watch the DNS lookup resolve
  first and the HTTP request follow, because the second step depends entirely
  on the first.
tags: [dns, http, application-layer]
platform: Cisco NetAcad
course: Networking Basics — Packet Tracer
---

## Objective

Observe the client-server interaction that occurs when a PC requests a web page from a server offering both DNS and HTTP services. The activity confirms two things: that the browser's request for `www.example.com` is first resolved to an IP address via DNS, and that the actual page content is then retrieved over HTTP. Tracing both layers matters because a working HTTP session depends entirely on a successful DNS lookup happening first — if that step is skipped or fails, the browser has no destination to send its request to.

## Scenario

The simulated topology is a single PC connected directly to a Server. The server is configured to provide DNS service (resolving `www.example.com` to an IP address) and HTTP service (hosting the actual web page). Before assuming the page will load, it needs to be verified that the name resolution step completes and returns a valid IP — a browser can't reach a hostname directly, only an IP address, so this handoff between DNS and HTTP is the core thing being tested.

---

## Part 1: Enter Simulation Mode and Filter the Event List

- Opened **Simulation Mode** via the icon in the bottom-right corner of the logical workspace.
- In the **Event List Filters** section, clicked **Show All/None** to clear all checked event types, then opened **Edit Filters** and selected **DNS** (IPv4 tab) and **HTTP** (Misc tab).
- Result: the Event List updated to show only DNS and HTTP events, removing all the unrelated background traffic.

**Key idea:** Simulation Mode logs every event on the network by default, which makes it hard to isolate a specific exchange. Filtering to just DNS and HTTP narrows the view to exactly the two protocols involved in "a browser loading a page," so the sequence of events is easy to follow step by step.

**Observation:** With filters applied, the Event List showed a clean, short sequence rather than a flood of unrelated events — confirming the filters were applied correctly before running the simulation.

---

## Part 2: Connect via the Application Layer

- Opened the **Web Browser** from the PC's **Desktop** tab.
- Typed `www.example.com` into the URL box and clicked **Go**, then minimized the PC window.
- Clicked **Play** in the Play Controls section of the Simulation Panel. The Event List populated with the full exchange: the PC's DNS query, the server's DNS reply with the resolved IP, the PC's HTTP GET request, the server's response (delivered in two segments), and the PC's acknowledgment.
- Restored the PC window afterward — the requested page was displayed in the browser, confirming the exchange completed successfully.

**Key idea:** The browser (application layer) doesn't talk to the server by name — it depends on DNS to resolve the name to an address first, then hands that address down to the lower layers to actually establish the HTTP connection. This activity makes that normally-invisible handoff visible as two distinct, ordered phases in the Event List.

---

## Troubleshooting Log (What Actually Went Wrong)

**No issues encountered.** The activity completed cleanly on the first run — the Event List showed the expected DNS query/reply pair followed immediately by the HTTP GET, two-segment response, and acknowledgment, and the web page rendered successfully in the simulated browser. No filter adjustments, retries, or configuration changes were needed.

---

## Key Concepts Reinforced

- **DNS resolution:** Before any IP-based communication can happen, a hostname must be translated into an IP address — this is the first, mandatory step in loading any web page by domain name.
- **HTTP request/response cycle:** The browser sends a GET request; the server responds with the page content, which can be broken into multiple segments and must be acknowledged by the receiver.
- **PDU inspection across OSI layers:** Clicking through a PDU's layers (via Next Layer >>) shows how the same piece of data is encapsulated and interpreted differently at each layer, on both the outbound and inbound sides of the exchange.
- **Event filtering in Simulation Mode:** Selectively filtering the Event List by protocol makes it possible to isolate and study one specific exchange without noise from unrelated traffic.

---

## Conclusion

The activity confirmed the full client-server request cycle: the PC's browser request for `www.example.com` triggered a DNS lookup that resolved the name to an IP address, after which the PC used that address to complete an HTTP GET/response exchange with the server. Both parts ran without any errors or unexpected behavior. The most valuable takeaway was seeing, event by event, that DNS resolution is a hard prerequisite for HTTP — the two protocols aren't just running side by side, they're sequentially dependent on each other in a way that's easy to take for granted when a page "just loads" in real life.
