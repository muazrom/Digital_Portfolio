---
title: Telnet and SSH, and why one of them is the standard
date: 2026-08-02
summary: >
  Remote-managing a router over both protocols — and verifying Layer 3
  reachability first, because a failed remote-access attempt and a plain
  connectivity problem look identical until you rule one out.
tags: [ssh, telnet, remote-access, security]
platform: Cisco NetAcad
course: Networking Basics — Packet Tracer
---

## Objective

This activity confirms that a remote device can be managed over the network using two different remote-access protocols, Telnet and SSH, and demonstrates why SSH is the secure standard over Telnet. Before attempting any remote access, IP connectivity between the PC and the target router has to be verified at Layer 3 — otherwise a failed remote-access attempt can't be distinguished from a simple reachability problem.

## Scenario

The topology consists of a router named **HQ** with interface G0/0/1 configured at **64.100.1.1 / 255.255.255.0**, and two end devices, **PC0** and **PC1**, both receiving their addressing via DHCP. The task is to confirm the PCs have valid IP addresses, confirm they can reach HQ, and then attempt to remotely access HQ's CLI first via Telnet and then via SSH — observing how the router responds differently to each.

---

## Part 1: Verify Connectivity

- Opened the **Command Prompt** on **PC0** via the Desktop tab.
- Ran `ipconfig` to check the PC's DHCP-assigned IP address.
- Ran `ping 64.100.1.1` to test reachability to the HQ router.

**Key idea:** Verifying Layer 3 connectivity first isolates the variable being tested. If a later Telnet/SSH attempt fails, this step confirms in advance that the failure is about the remote-access protocol itself, not basic IP reachability.

**Observation:** DHCP assigned a valid address to the PC, and pings to 64.100.1.1 returned successful replies, confirming the path to HQ was up before any remote-access protocol was attempted.

---

## Part 2: Connect via the Application Layer

- From PC0's Command Prompt, ran `telnet 64.100.1.1`.
- Result: the connection was refused —
  ```
  C:\> telnet 64.100.1.1
  Trying 64.100.1.1 ...Open
  [Connection to 64.100.1.1 closed by foreign host]
  ```
- Ran `ssh -l admin 64.100.1.1` and entered the password `class` when prompted.
- Result: login succeeded, landing at the `HQ#` prompt — full remote CLI access to the router.

**Key idea:** Telnet and SSH provide the same functional access (a remote command-line session), but only SSH encrypts the session, including the username and password. A device hardened for security accepts SSH and rejects Telnet outright, which is exactly the behavior HQ showed.

---

## Troubleshooting Log (What Actually Went Wrong)

The Telnet attempt to HQ was refused immediately, with the connection closed by the router before any login prompt appeared.

**Diagnosis:** Since Layer 3 connectivity had already been confirmed by the successful ping in Part 1, the refusal wasn't a reachability problem — it pointed to the router deliberately rejecting the protocol itself.

**Root cause:** HQ's VTY lines are configured with `transport input ssh`, allowing only SSH connections and blocking Telnet. This is expected, correct behavior for a securely configured device, not a fault.

**Fix:** No configuration change was needed. Switching to `ssh -l admin 64.100.1.1` with the correct credentials succeeded and reached the `HQ#` prompt.

**Lesson learned:** A failed connection attempt isn't automatically a problem to fix — it can be evidence that a security control is working as intended. The job of troubleshooting here was to confirm *why* it failed (protocol policy) rather than assume something was broken and try to force Telnet through.

*A secondary hiccup occurred entering the SSH command from the PC prompt, which returned an "invalid command" error — resolved by re-entering the exact syntax `ssh -l admin 64.100.1.1` from PC0's Command Prompt. It served as a reminder that CLI syntax errors and device/protocol errors look different and shouldn't be diagnosed the same way.*

---

## Key Concepts Reinforced

- **Telnet vs. SSH:** Both provide remote CLI access, but Telnet transmits credentials and session data in plaintext while SSH encrypts the entire session.
- **transport input (VTY lines):** Router VTY line configuration determines which remote-access protocols are permitted; setting it to `ssh` only is a standard hardening step.
- **Connectivity verification before remote access:** Confirming Layer 3 reachability (ping) before attempting application-layer access isolates whether a failure is a network issue or a protocol/policy issue.
- **Expected vs. actual failure:** Not every failed connection is a misconfiguration — recognizing intentional security behavior is itself a troubleshooting skill.

---

## Conclusion

By the end of the activity, connectivity to HQ was confirmed via IP addressing and ping, and remote CLI access was tested through both Telnet and SSH. The Telnet attempt was correctly rejected due to the router's `transport input ssh` policy, while the SSH attempt succeeded using the provided credentials. The most valuable takeaway was recognizing that the Telnet failure was a sign of proper security configuration rather than a fault to fix — a distinction that matters directly for the network security engineer career path, where distinguishing "broken" from "correctly restricted" is a core diagnostic skill.
