---
title: The switch wasn't frozen — IOS was resolving my typo as a hostname
date: 2026-08-29
summary: >
  Bringing up two switches over console before either had an IP address, and
  finding that a mistyped command stalls the CLI on a DNS lookup rather than
  failing outright.
tags: [console, ios, hardening, svi, vlan]
platform: Cisco NetAcad
course: Networking Basics — Packet Tracer
credential: cr-cisco-netbasics
---

## Objective

Configure hostnames, secured administrative access, and IP addressing on two Cisco IOS switches (Room-145 and Room-146) using the CLI, then configure IP addressing on two end devices (Manager and Reception) and verify Layer 3 end-to-end connectivity between them. This confirms that Layer 2 switching, out-of-band management access, and basic host addressing are all correctly in place — three separate things that a single successful ping doesn't automatically prove on its own.

## Scenario

Acting as a newly hired LAN technician, the task was to bring up a small LAN consisting of two switches (Room-145, Room-146) and two hosts (Manager, Reception) on a cabled and powered network. Manager connects to Room-145, Reception connects to Room-146, and the two switches are linked directly to each other — all on the same VLAN 1 broadcast domain, no routing involved.

**Addressing Table:**

| Device | Interface | IP Address | Subnet Mask |
|---|---|---|---|
| Room-145 | VLAN 1 | 10.10.10.100 | 255.255.255.0 |
| Room-146 | VLAN 1 | 10.10.10.150 | 255.255.255.0 |
| Manager | NIC | 10.10.10.4 | 255.255.255.0 |
| Reception | NIC | 10.10.10.5 | 255.255.255.0 |

Before assuming the switches were configurable at all, the topology first needed a working out-of-band management path — a console connection to each switch — since a factory-default switch has no IP address and cannot yet be reached over the network.

---

## Part 1: Configure and Secure the Switches via Console

- Opened the topology and found a console cable already present between Reception and Room-146, but **no console cable between Manager and Room-145**. Added the missing console cable (Manager's RS-232 port → Room-145's console port) before proceeding, since the requirement was to console into *each* switch.
- Accessed each switch via **Terminal** on its attached PC's Desktop tab, and ran the following on both switches (values below shown for Room-145; Room-146 identical except hostname and VLAN 1 IP):

```
Switch>enable
Switch#configure terminal
Switch(config)#hostname Room-145
Room-145(config)#enable secret C9WrE
Room-145(config)#line console 0
Room-145(config-line)#password 8ubRu
Room-145(config-line)#login
Room-145(config-line)#exit
Room-145(config)#line vty 0 15
Room-145(config-line)#password 8ubRu
Room-145(config-line)#login
Room-145(config-line)#exit
Room-145(config)#service password-encryption
Room-145(config)#banner motd #Authorized access only!#
Room-145(config)#interface vlan 1
Room-145(config-if)#ip address 10.10.10.100 255.255.255.0
Room-145(config-if)#no shutdown
Room-145(config-if)#exit
Room-145(config)#exit
Room-145#copy running-config startup-config
```

- Verified the result by pulling `show running-config` from Room-146, which confirmed the hostname, hashed enable secret, encrypted line passwords, banner, and VLAN 1 addressing all took effect as configured.

**Key idea:** Console access is out-of-band management — it works independently of the switch's Layer 2 forwarding and Layer 3 addressing, which is exactly why it's the only way in *before* any of that is configured. The VLAN 1 IP address exists purely so the switch itself can later be reached over the network (e.g., via Telnet); it has nothing to do with how the switch forwards frames between Manager and Reception, which happens at Layer 2 regardless of whether VLAN 1 has an IP at all.

**Observation:** The saved running-config confirms `enable secret 5 $1$mERr$SaNwwC5v8zEgCJlbT5gY8.` — a one-way Type 5 hash, unaffected by `service password-encryption` since it's already irreversibly hashed at entry. By contrast, the console and VTY lines show `password 7 0879594C3B0C` — the same Type 7 (reversible, weak) encoding applied retroactively by `service password-encryption`, which is why enable secret and line passwords are stored so differently even though both were "encrypted."

---

## Part 2: Configure Host Devices and Verify Connectivity

- Opened **IP Configuration** from each PC's Desktop tab.
- Set Manager to `10.10.10.4 / 255.255.255.0` and Reception to `10.10.10.5 / 255.255.255.0`, leaving the default gateway blank on both.
- From Reception's Command Prompt, ran `ping 10.10.10.4` and received four successful replies; repeated `ping 10.10.10.5` from Manager with the same result.

**Key idea:** Since Manager and Reception sit in the same subnet, delivery between them relies entirely on Layer 2 switching (MAC learning and ARP) — no default gateway or routing is needed. A successful ping here confirms Layers 1 through 3 are functioning end to end, but it says nothing on its own about whether the switches' management configuration (passwords, banner, hostname) is correct — that had to be verified separately by re-entering each switch's CLI and confirming it prompted for the expected credentials.

---

## Troubleshooting Log (What Actually Went Wrong)

While configuring Room-145, a mistyped command (intending `enable`) caused the switch's CLI to appear to hang, displaying: `Translating "ebable"...domain server (255.255.255.255)`.

**Diagnosis:** The prompt didn't return an "invalid command" error immediately — it sat there for close to a minute before recovering on its own.

**Root cause:** Cisco IOS doesn't reject unrecognized input right away. Its default behavior assumes an unrecognized word at the prompt might be a hostname you're trying to Telnet to, so it attempts a DNS lookup. With no DNS server configured, that lookup broadcasts to `255.255.255.255` and has to time out before IOS gives up and returns control — which is exactly the delay observed.

**Fix:** Waited for the lookup to time out naturally, after which the CLI returned to normal and the correct command was re-entered. (A faster fix for next time: **Ctrl+Shift+6** aborts the lookup immediately instead of waiting for the timeout; `no ip domain-lookup` in global config disables this behavior entirely.)

**Lesson learned:** An apparently frozen CLI isn't necessarily a fault — it can be IOS silently attempting a DNS resolution in the background as a side effect of a typo. Recognizing the specific "Translating..." message saves time versus assuming something is broken.

---

## Key Concepts Reinforced

- **Out-of-band console access:** A console connection reaches the switch's CLI independently of any Layer 2/3 configuration, which is why it's required before any other configuration is possible on a factory-default device.
- **Password storage differences:** `enable secret` is stored as a one-way hash (Type 5) regardless of other settings, while console/VTY `password` lines are stored in plain text until `service password-encryption` applies a reversible Type 7 encoding — a materially weaker form of protection.
- **VLAN 1 as a management interface, not a switching requirement:** Giving VLAN 1 an IP address enables remote management of the switch itself; it is entirely separate from the switch's Layer 2 frame-forwarding, which functions with or without it.
- **Ping as a Layer 3 (not full-stack) verification:** A successful ping confirms reachability up through Layer 3 but does not validate application-layer services or, in this case, the switches' administrative security settings — those require independent verification.
- **Implicit DNS lookup on unrecognized IOS commands:** A mistyped command isn't always rejected outright; IOS may first attempt to resolve it as a hostname, producing a delay that can be mistaken for a hang.

---

## Conclusion

Both switches (Room-145, Room-146) were successfully configured with hostnames, encrypted line passwords, a hashed enable secret, an MOTD banner, and VLAN 1 management addressing, then saved to startup-config. Both end devices (Manager, Reception) were addressed correctly and confirmed full bidirectional connectivity via ping. The most valuable takeaway was diagnosing the "Translating..." delay correctly rather than assuming the switch had failed — recognizing IOS's implicit DNS-lookup behavior turned a confusing dead-end into a quick, confident recovery.
