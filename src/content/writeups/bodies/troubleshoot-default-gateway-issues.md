## Objective

Complete the network documentation for a two-LAN topology (R1, S1, S2, PC1–PC4), then use a systematic connectivity-testing method to isolate and fix devices that could not communicate. The activity is meant to confirm end-to-end (Layer 3) reachability across both subnets by verifying, one variable at a time, that every device's IP address, subnet mask, and default gateway match the network documentation before trusting cross-subnet ping results.

## Scenario

The simulated network has R1 acting as the router for two separate LANs:

- **LAN A (192.168.10.0/24):** R1 G0/0 (192.168.10.1), S1 (192.168.10.2), PC1 (192.168.10.10), PC2 (192.168.10.11)
- **LAN B (192.168.11.0/24):** R1 G0/1 (192.168.11.1), S2 (192.168.11.2), PC3 (192.168.11.10), PC4 (192.168.11.11)

The addressing table initially had the default gateway field blank for every device except R1. Before any test could be trusted, the documentation had to be completed and then verified against what was actually configured on each device — since a ping failure could come from either a documentation gap or a real misconfiguration, and those needed to be told apart.

---

## Part 1: Verify Network Documentation and Isolate Problems

- Opened **IP Configuration** (Desktop tab) on each PC and the **VLAN 1 config** on each switch to complete the addressing table's missing default gateway entries (192.168.10.1 for LAN A devices, 192.168.11.1 for LAN B devices).
- Ran same-subnet ping tests from PC1 (→ PC2, → S1, → R1) and from PC3 (→ PC4, → S2, → R1) using the Command Prompt.
- Several tests failed, pointing to four separate, unrelated misconfigurations:

| Device | Issue found | Test that revealed it |
|---|---|---|
| PC1 | Incorrect IP address (didn't match documented 192.168.10.10) | PC1 → PC2 failed |
| S1 | No default gateway configured | S1 unreachable from off-subnet / gateway-dependent test failed |
| S2 | No IP address configured at all | PC3 → S2 failed, S2 unreachable |
| PC3 | Incorrect subnet mask | PC3 → PC4 / PC3 → S2 failed |

**Key idea:** A same-subnet ping only exercises Layer 3 reachability on that shared broadcast domain — it doesn't touch the default gateway at all. That's why PC1's bad IP and PC3's bad mask showed up here, while S1's missing gateway didn't cause a local-subnet failure by itself — it only breaks anything that has to leave the local segment.

**Observation:** Four independent "Request timed out" results across the two LANs, each traced to a different field (IP, mask, or gateway) rather than one shared root cause.

---

## Part 2: Implement, Verify, and Document Solutions

- **Fix 1 — PC1:** Corrected the IP address to match documentation (192.168.10.10 /24). Re-ran `ping 192.168.10.11` (PC1 → PC2) — successful.
- **Fix 2 — S1:** Configured the missing default gateway (192.168.10.1) on the VLAN 1 interface. Re-tested reachability from S1's subnet to R1 — successful.
- **Fix 3 — S2:** Configured the missing IP address (192.168.11.2 /24) on the VLAN 1 interface — S2 had no address at all, so it couldn't be reached or reach anything until this was set. Re-tested PC3 → S2 — successful.
- **Fix 4 — PC3:** Corrected the subnet mask to 255.255.255.0. Re-ran PC3 → PC4 and PC3 → S2 — successful.
- After each fix, only the specific failing test tied to that device was re-run before moving to the next row — issues weren't batched together.
- With all four local issues resolved, end-to-end (cross-subnet) testing — PC1 → PC3/PC4 and PC3 → PC1/PC2 — was retried and passed, confirming full network-wide connectivity.

**Key idea:** Fixing and verifying one device at a time is what made it possible to confirm each fix actually worked. Since the four faults were unrelated (a typo'd IP, a missing gateway, a missing IP, a wrong mask), batching the fixes would have made it impossible to tell which change fixed which symptom if something had still failed.

---

## Troubleshooting Log (What Actually Went Wrong)

At first glance, the network looked broadly broken — pings failing on both LANs. It could have looked like a single widespread issue (e.g., "the router is misconfigured").

**Diagnosis:** Testing systematically, device by device and layer by layer, showed the failures didn't share a cause. Each broken device had a different field missing or wrong, and none of the failures were caused by R1 or by the switches' forwarding behavior.

**Root cause:** Four separate, independent host/switch misconfigurations — a wrong IP (PC1), a missing default gateway (S1), a missing IP address entirely (S2), and a wrong subnet mask (PC3).

**Fix:** Corrected each field individually to match the network documentation, verifying with the exact test that had originally failed before moving to the next issue.

**Lesson learned:** A network that looks "broadly broken" isn't necessarily one bug — it can be several small, unrelated ones. Testing and fixing one variable at a time is what separates them out; fixing several things at once before retesting would have made it impossible to tell which change actually resolved which symptom.

---

## Key Concepts Reinforced

- **Default gateway function:** The address a host uses to send traffic off its own subnet — it has no effect on same-subnet communication, which is why S1's missing gateway didn't show up in local-only tests.
- **Subnet mask correctness:** A wrong mask (PC3) can make a device miscalculate which addresses are "local," breaking reachability even when the IP address itself looks fine.
- **Layer 3 troubleshooting methodology:** Working from local (same-subnet) tests outward to remote (cross-subnet) tests avoids false negatives caused by unresolved local issues.
- **Single-variable fix-and-verify:** Changing and retesting one thing at a time is what makes it possible to attribute a fix to its result with confidence.

---

## Conclusion

By the end of the activity, all four independent misconfigurations — PC1's wrong IP, S1's missing default gateway, S2's missing IP address, and PC3's wrong subnet mask — were identified through systematic same-subnet testing, corrected one at a time, and verified. Final end-to-end connectivity tests across both LANs passed, confirming the network matched its documentation. The most valuable takeaway was that a network with multiple simultaneous faults can look like one big problem at first glance, but a methodical, one-change-at-a-time approach is what reliably separates and resolves them.
