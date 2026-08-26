---
title: A switch doesn't need an IP to switch — so what is VLAN 1 for?
date: 2026-08-09
summary: >
  Addressing two switches and two PCs on one flat subnet, and separating what
  a switch needs to forward frames from what it needs to be managed remotely.
tags: [svi, vlan, addressing, ping]
platform: Cisco NetAcad
course: Networking Devices and Initial Configuration — Packet Tracer
credential: cr-cisco-netdevices
---

## Objective

Verify basic Layer 3 connectivity across a small flat network by configuring management IP addressing on two switches (S1, S2) and IP addressing on two PCs (PC1, PC2), all on the same 192.168.1.0/24 subnet. The activity confirms that switches don't require an IP address to forward frames, but do need one for remote management, and it uses `ping` to test reachability at the network layer between every device pair.

## Scenario

The simulated topology consists of two switches (S1, S2) and two PCs (PC1, PC2), all sharing one subnet:

| Device | Interface | IP Address | Subnet Mask |
|---|---|---|---|
| S1 | VLAN 1 | 192.168.1.253 | 255.255.255.0 |
| S2 | VLAN 1 | 192.168.1.254 | 255.255.255.0 |
| PC1 | NIC | 192.168.1.1 | 255.255.255.0 |
| PC2 | NIC | 192.168.1.2 | 255.255.255.0 |

Because every device sits on the same subnet, no routing is involved — successful pings depend entirely on correct IP/mask configuration on each device and the VLAN 1 interface being administratively up on each switch. Before assuming the network "works," each device's addressing needs to be verified individually (via `show ip interface brief` on the switches and the IP Configuration window on the PCs) rather than just assumed from the topology.

---

## Part 1: Perform Basic Configuration on S1 and S2

- Opened the **CLI** tab on **S1** and entered privileged EXEC mode (`enable`) followed by global configuration mode (`configure terminal`).
- Set the hostname to `S1`, then configured the VLAN 1 interface with `interface vlan 1`, `ip address 192.168.1.253 255.255.255.0`, and `no shutdown`. Saved the configuration with `copy running-config startup-config`.
- Verified with `show ip interface brief` — output showed `Vlan1 192.168.1.253 YES manual up up`, confirming the interface was correctly addressed and active. Repeated the same steps on **S2** using hostname `S2` and IP `192.168.1.254 255.255.255.0`, with the same successful `up up` result.

**Key idea:** Switches forward frames based on MAC addresses alone and don't need an IP address to do their core job. The VLAN 1 Switch Virtual Interface (SVI) IP exists purely so the switch can be reached and managed remotely — it has nothing to do with the switch's forwarding function.

**Observation:** `show ip interface brief` on both S1 and S2 confirmed `Vlan1` in an `up/up` state with the correct IP address immediately after `no shutdown` was entered — no delay or retry needed.

---

## Part 2: Configure the PCs and Verify Connectivity

- Opened **IP Configuration** from each PC's Desktop tab and entered the addresses from the table: `192.168.1.1/255.255.255.0` for PC1, `192.168.1.2/255.255.255.0` for PC2.
- From PC1's Command Prompt, pinged S1 (`192.168.1.253`), S2 (`192.168.1.254`), and PC2 (`192.168.1.2`) — all replies came back successful. Repeated the same set of pings from PC2 to S1, S2, and PC1, also all successful.
- From S1 and S2 directly, pinged every other device (e.g., `S1>ping 192.168.1.1`), each returning `Success rate is 100 percent (5/5)` with round-trip times in the 0–1 ms range.

**Key idea:** `ping` (ICMP Echo) verifies reachability at the network layer — it confirms that IP addressing, subnetting, and interface state are all correct end-to-end, independent of what application might eventually run over that connectivity.

---

## Troubleshooting Log (What Actually Went Wrong)

**No issues encountered.** Every interface came up as `up/up` on the first `no shutdown`, all four devices were addressed exactly per the addressing table, and every ping — PC-to-switch, PC-to-PC, and switch-to-switch — returned a 100 percent success rate without needing a retry.

---

## Key Concepts Reinforced

- **Switch Virtual Interface (SVI):** The VLAN 1 IP address on a switch is a management-only interface, separate from the switch's MAC-address-based frame forwarding.
- **`no shutdown`:** Interfaces (physical or virtual) are administratively down by default in configuration and must be explicitly enabled before they'll pass traffic.
- **ICMP `ping`:** A simple, effective tool for verifying Layer 3 reachability between two IP-addressed endpoints, run from either PCs or switch CLIs.
- **Flat subnet addressing:** When all devices share one subnet, connectivity depends purely on correct IP/mask configuration on each endpoint — there's no routing logic to troubleshoot.

---

## Conclusion

By the end of the activity, both switches were correctly configured with management IP addresses on VLAN 1, both PCs were addressed per the addressing table, and full connectivity was confirmed in both directions — PC-to-PC, PC-to-switch, and switch-to-switch — all at 100 percent ping success. The most useful takeaway was seeing directly why a switch needs an IP address at all: not to forward traffic, but purely to be reachable for management, which is a distinction that's easy to gloss over until you've configured it yourself.
