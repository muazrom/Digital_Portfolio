## Objective

To determine a device's own IPv4 address and subnet mask using an OS-level command, then use an online subnet calculator to compute and verify the resulting network address, usable host range, broadcast address, and number of usable hosts. This confirms an understanding of Layer 3 addressing and CIDR-based subnetting — specifically, how a single address/mask pair defines an entire subnet's boundaries, not just one host.

## Scenario

A single end-device (PC) with an already-configured IPv4 address needed to be identified and analyzed. No topology or second device was required — the task was self-contained: read the device's own configuration, then hand that configuration to an external tool (a web-based subnet calculator) to derive the surrounding network's properties. Before trusting the calculator's output, the device's own address needed to be checked against the calculated host range to confirm it actually falls within it.

---

## Part 1: Determine the Device's IPv4 Address and Subnet Mask

- Opened the command-line interface appropriate to the device's operating system (e.g., **Command Prompt** on Windows via `ipconfig`, or **Terminal** on macOS/Linux via `ifconfig` / `ip addr`). *(Exact OS/command used isn't specified in the source activity — inferred as one of these standard options.)*
- Located the active network adapter's IPv4 configuration in the output.
- Recorded the following:

| Field | Value |
|---|---|
| IPv4 Address | 192.168.2.131 |
| Subnet Mask | 255.255.255.0 |

**Key idea:** This step operates at Layer 3 (Network layer). It confirms *what* the device believes its own address and subnet boundary to be — it doesn't yet confirm that this configuration is correct, only that it's what's currently assigned.

**Observation:** Device address `192.168.2.131` with mask `255.255.255.0` (a /24 network).

---

## Part 2: Use an Online Subnet Calculator to Determine Network Information

- Searched the web for "IP subnet calculator" and selected a calculator from the results.
- Entered the device's IPv4 address (`192.168.2.131`) and subnet mask (`255.255.255.0`) into the calculator.
- The calculator returned the following results:

| Field | Value |
|---|---|
| Network Address | 192.168.2.0 |
| Range of Host Addresses | 192.168.2.1 – 192.168.2.254 |
| Broadcast Address | 192.168.2.255 |
| Number of Usable Hosts | 254 |

- Verified that the device's own address (`192.168.2.131`) falls within the calculated host range (`192.168.2.1` – `192.168.2.254`), confirming the calculation is consistent with the device's actual configuration.

**Key idea:** A /24 mask (255.255.255.0) leaves 8 host bits, giving 2⁸ = 256 total addresses in the subnet. The first address (`.0`) is reserved as the network address and the last (`.255`) as the broadcast address, leaving 254 usable host addresses (2⁸ − 2). This is the arithmetic reason the calculator's "254 usable hosts" figure matches expectations. This information is also what determines whether two devices are on the same subnet (and can communicate directly) or on different subnets (requiring a router/default gateway for reachability).

---

## Troubleshooting Log (What Actually Went Wrong)

**No issues encountered.** The activity is a direct lookup-and-verify exercise rather than a live simulation, so there was no device configuration to fail or connectivity to test. The calculated network address, host range, and broadcast address all matched what would be expected from manually applying the /24 mask to the given address, and the device's own address fell correctly within the computed host range — confirming a clean, consistent result.

---

## Key Concepts Reinforced

- **Subnet mask function:** The mask divides an IPv4 address into network and host portions, determining subnet size and boundaries.
- **CIDR notation:** A 255.255.255.0 mask is equivalent to /24 — 24 network bits and 8 host bits — under Classless Inter-Domain Routing.
- **Classful addressing is obsolete:** Address classes (A/B/C) are no longer functionally relevant since CIDR replaced classful addressing in 1993; a calculator may still display a class, but it shouldn't factor into design decisions.
- **Network vs. broadcast address:** The first address in a subnet identifies the network itself; the last is reserved for broadcast traffic — neither is assignable to a host, which is why usable hosts = total addresses − 2.
- **Same-subnet vs. cross-subnet reachability:** Comparing a device's address against the calculated host range is a quick way to confirm whether another device is on the same network (direct communication) or a different one (requiring routing via a default gateway).

---

## Conclusion

This activity confirmed how a device's IPv4 address and subnet mask, taken together, fully define its network's boundaries. By pulling the device's live configuration and independently verifying it against a subnet calculator's output, the network address (192.168.2.0), host range (192.168.2.1–192.168.2.254), broadcast address (192.168.2.255), and usable host count (254) were all cross-checked and confirmed consistent. The most useful takeaway was the arithmetic behind "254 usable hosts" — seeing directly how the 2ⁿ − 2 formula falls out of the mask, rather than just accepting a tool's output at face value.
