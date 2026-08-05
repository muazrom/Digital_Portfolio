## Objective

Confirm that a client PC can reach a web server across the network — first at the IP layer, then at the application layer — by testing basic connectivity and then successfully loading the server's web page. This involved two parts: verifying reachability using ping, and confirming that the web browser could actually retrieve content from the server.

## Scenario

The setup simulates confirming that a newly deployed web server (`172.33.100.50`) is actually reachable and operational before assuming end users can access it. Before trusting an application (a browser) to work correctly, the network path between the client (PC0) and the server needs to be verified first.

---

## Part 1: Verify Connectivity to the Web Server

- Opened the **command prompt** on PC0 via the Desktop tab.
- Sent ICMP echo requests to the web server's IP address using `ping 172.33.100.50`.
- Received replies confirming a working path to the server, along with round-trip timing statistics (Sent/Received/Lost, Min/Max/Average).

**Key idea:** `ping` only tests IP-layer reachability — it confirms nothing about whether an application (like a web server) is actually running and listening for requests on the destination device. It's a first checkpoint, not a full connectivity test.

**Observation:** The ping output showed 1 packet lost out of 4 (25% loss), with all successful replies showing `0ms` round-trip time and `TTL=127`.

---

## Part 2: Connect to the Web Server via the Web Client

- Opened the **Web Browser** application from PC0's Desktop tab.
- Entered the server's IP address (`172.33.100.50`) directly into the URL bar — no domain name was used, since no DNS server was configured in this topology.
- The page loaded successfully, displaying a welcome message ("Welcome to the Learn IP Web Site") confirming the web server was reachable and responding to HTTP requests.

**Key idea:** Using an IP address instead of a domain name demonstrates that browsers fundamentally communicate using IP addresses — DNS name resolution is a convenience layer built on top, not a requirement for connectivity.

---

## Troubleshooting Log (What Actually Went Wrong)

The initial ping to `172.33.100.50` showed **1 packet lost out of 4 sent (25% loss)**, which at first glance looked like a connectivity problem.

**Diagnosis:** The lost packet was the *first* one sent, not a random one mid-sequence. This pattern is a strong indicator of ARP resolution delay rather than an actual network fault — PC0 didn't yet have the web server's MAC address cached, so the first ICMP packet was queued (and ultimately dropped) while ARP resolved the destination's hardware address.

**Root cause:** No ARP entry existed yet for `172.33.100.50` at the time the first ping was sent — expected behavior for any device that hasn't previously communicated on the local network.

**Fix:** No configuration change was needed. All subsequent replies succeeded, confirming the network path was fine — the first-packet loss was transient and Layer 2 in origin, not a sign of a misconfigured server or client.

**Lesson learned:** Not every dropped packet indicates a real problem. Distinguishing a one-time ARP-related drop from a genuine connectivity issue avoids chasing a "fault" that isn't actually there.

---

## Key Concepts Reinforced

- **Bottom-up troubleshooting:** Verify IP-layer reachability (ping) before assuming an application-layer problem (browser/web server) exists.
- **ARP:** Devices maintain a cache mapping IP addresses to MAC addresses; the first packet to a new destination may be delayed or dropped while this mapping resolves.
- **IP addresses vs. domain names:** Browsers communicate by IP address at the protocol level; domain names are only resolved to IPs via DNS, which wasn't present in this topology.
- **Client-server model:** A "web server" is simply a device with an HTTP service listening for requests — reachability (ping) and service availability (browser test) are two separate things worth confirming independently.

---

## Conclusion

By the end of the activity, PC0 had confirmed both IP-layer connectivity (via a successful ping, aside from an expected first-packet ARP delay) and application-layer connectivity (via a successfully loaded web page) to the web server at `172.33.100.50`. The most valuable part of the exercise was recognizing that the single lost ping packet wasn't a real fault — a distinction that reinforces how important it is to separate transient, expected network behavior from genuine connectivity problems.
