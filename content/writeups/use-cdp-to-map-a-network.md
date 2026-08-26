---
title: Mapping a branch office with CDP, which was switched off on purpose
date: 2026-08-18
summary: >
  Chaining SSH sessions hop by hop to map a remote branch and find a switch
  with no IP address — using a Layer 2 discovery protocol that had been left
  disabled, correctly, on a router facing the ISP.
tags: [cdp, ssh, discovery, layer-2]
platform: Cisco NetAcad
course: Network Support and Security — Packet Tracer
---

## Objective

Map the topology of a Remote Branch Office network using SSH for remote access and Cisco Discovery Protocol (CDP) for device discovery, in order to record every device's hostname, interfaces, IP addresses, and subnet masks — and specifically locate a recently installed switch that had not yet been assigned an IP address. The activity tests two independent layers: SSH confirms Layer 3/application-level reachability into each device, while CDP operates at Layer 2 and can discover neighbors regardless of whether they have an IP configured at all. Getting from one end of the branch network to the other required chaining SSH sessions device-by-device, using CDP at each hop to find the next device to connect to.

## Scenario

A senior network administrator needed the Remote Branch Office network mapped, including the name of a newly installed switch still missing its IP address. The simulated topology:

- **Admin-PC** — starting point on the local network
- **S1** — local switch connecting Admin-PC to Edge1
- **Edge1** (192.168.1.1/24 on G0/0) — local gateway router
- **ISP** — WAN link between the local network and the branch (Edge1 S0/0/0 209.165.200.5/30 ↔ Branch-Edge S0/0/1 209.165.200.10/30)
- **Branch-Edge** (192.168.3.249/29 on G0/0) — Remote Branch Office edge router
- **Branch-Firewall** (192.168.3.253/29 on G0/0, 192.168.4.129/25 on G0/1) — router positioned between Branch-Edge and the branch's internal switches
- **sw-br-floor2** (SVI 192.168.4.132/25) — floor switch
- **sw-br-floor3** (SVI 192.168.4.133/25) — floor switch
- **sw-br-floor1** — floor switch with **no IP address configured** — the device the admin needed identified

Credentials provided: `admin01` / `S3cre7P@55` for the local network, and `branchadmin` / `S3cre7P@55` for the branch office network. Because the branch network sits behind the WAN link and CDP hadn't been enabled yet, nothing about its internal layout — including the unaddressed switch — could be assumed without actively discovering it first.

---

## Part 1: Use SSH to Remotely Access Network Devices

- Opened a **command prompt** on **Admin-PC** via the Desktop tab.
- Connected to the local gateway: `ssh -l admin01 192.168.1.1`, authenticated with `S3cre7P@55`.
- Landed directly at `Edge1#` — privileged EXEC mode, with no separate `enable` step needed, since the `admin01` account is provisioned at privilege level 15.
- Ran `show ip interface brief` and `show interfaces` on Edge1 to record its G0/0 (192.168.1.1/24) and S0/0/0 (209.165.200.5/30) addressing in the table.
- From Edge1, chained a second SSH session into the branch: `ssh -l branchadmin 209.165.200.10`, authenticated with the same password.
- Landed at `Branch-Edge#` — this connection itself revealed the Branch-Edge router's hostname, which wasn't known beforehand.

**Key idea:** SSH gives encrypted remote access and, critically, can be chained — an SSH session opened from inside another device's CLI reaches networks with no direct route back to the original host. This is what makes it possible to work your way into the branch office from Admin-PC despite there being no direct path.

**Observation:** Edge1 confirmed as 192.168.1.1/24 (G0/0) and 209.165.200.5/30 (S0/0/0). The hop into the branch confirmed its edge router's hostname is **Branch-Edge**, reachable at 209.165.200.10.

---

## Part 2: Use CDP to Discover Neighboring Devices

- From `Branch-Edge#`, ran `show ip interface brief` and `show interfaces` to record its own addressing: G0/0 192.168.3.249/29, S0/0/1 209.165.200.10/30.
- Ran `show cdp` to check protocol status — returned `% CDP is not enabled`.
- Enabled CDP globally and immediately restricted it on the WAN-facing link:
  ```
  configure terminal
  cdp run
  interface s0/0/1
  no cdp enable
  exit
  ```
- Ran `show cdp neighbors` — found one neighbor: a router named **Branch-Firewall**, connected via G0/0 (no IP shown at this level).
- Ran `show cdp neighbors detail` — revealed Branch-Firewall's IP (192.168.3.253) and, incidentally, its IOS software version.
- SSH'd into the newly found neighbor: `ssh -l branchadmin 192.168.3.253`, landing at `Branch-Firewall#`.
- Repeated `show cdp neighbors` / `show cdp neighbors detail` from Branch-Firewall — found Branch-Edge (already known) and a new switch, **sw-br-floor2**, at 192.168.4.132 via G0/1.
- Continued the same pattern — SSH into each new device, run both CDP commands, record anything unseen — until a hop returned no unrecorded neighbors.
- This traced out **sw-br-floor3** (SVI 192.168.4.133) and finally **sw-br-floor1**, which CDP found despite it having **no IP address configured at all** — answering the admin's original question.

**Key idea:** CDP is a Cisco-proprietary Layer 2 protocol, so it discovers directly connected Cisco devices independent of IP addressing. That's precisely why it could locate sw-br-floor1 when nothing at Layer 3 could have — there was no IP to route to or ping in the first place.

---

## Troubleshooting Log (What Actually Went Wrong)

Running `show cdp` on Branch-Edge returned `% CDP is not enabled` instead of any status or neighbor information — the discovery process couldn't proceed as written.

**Diagnosis:** CDP wasn't broken or misconfigured; it simply hadn't been turned on. This is a Cisco security best practice — CDP broadcasts hostname, platform, and IOS version to anything listening, so it's commonly left disabled until it's actually needed.

**Root cause:** Default-secure posture on the branch devices, combined with the fact that this device also had a link facing the ISP (an external, less-trusted network) — CDP left on unrestricted here would leak the same internal topology and version info outward.

**Fix:** Enabled CDP globally with `cdp run`, then immediately disabled it specifically on the WAN-facing interface (`interface s0/0/1` → `no cdp enable`), so it would still map internal Cisco neighbors without advertising anything toward the ISP.

**Lesson learned:** Don't assume a discovery protocol is active just because a command exists for it — check status first. And when enabling something for visibility, scope it as narrowly as the task requires; global "on" and "off" aren't the only two options.

---

## Key Concepts Reinforced

- **CDP (Cisco Discovery Protocol):** A Layer 2, Cisco-proprietary protocol that discovers directly connected devices without needing IP reachability — the only reason an unaddressed switch could be found at all.
- **SSH session chaining:** SSH sessions launched from within another device's CLI let you reach networks with no direct route from your starting point, one authenticated hop at a time.
- **IOS privilege levels:** Level 15 grants immediate privileged EXEC access on login, skipping the separate `enable` step.
- **CDP hardening:** Enabling CDP globally but disabling it per-interface on external-facing links limits information disclosure (hostname, platform, IOS version) to trusted internal neighbors only.

---

## Conclusion

By the end of the activity, SSH access confirmed reachability into every device on the branch path, and CDP — enabled deliberately and scoped away from the external WAN link — mapped the full internal topology, including a switch (**sw-br-floor1**) that had no IP address and so was invisible to any Layer 3 discovery method. The most useful takeaway was seeing CDP's Layer 2 discovery in practice: it's the tool that answers "what's out there" when IP addressing alone can't tell you.
