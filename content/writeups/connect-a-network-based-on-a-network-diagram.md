---
title: When the guide's own prose and its port table disagreed
date: 2026-08-18
summary: >
  Cabling a physical topology from a logical diagram — Layer 1 only, no
  protocols — and deciding which source to trust when the instructions and the
  reference table named different ports for the same link.
tags: [cabling, layer-1, topology, documentation]
platform: Cisco NetAcad
course: Network Support and Security — Packet Tracer
---

## Objective

Complete a physical topology in Packet Tracer's Physical Mode based on a provided logical network diagram, and confirm that every device in the wiring closet and on the table is cabled exactly as the diagram specifies. This tests Layer 1 (physical) connectivity only — it confirms cables are run to the correct ports, not that any protocol or addressing is working. Getting this step right matters because every later layer (Layer 2 switching, Layer 3 routing) depends on the physical topology being correct first; troubleshooting starts here.

## Scenario

The topology has two Cisco 4321 routers (R1, R2), two Catalyst 2960 switches (S1, S2), a Web Server, and two PCs (PC-A, PC-B). R1 and the Web Server sit with S1 in the equipment rack in the wiring closet; the PCs sit separately on the Table. Before any cable is run, the logical diagram has to be translated into a Device Table (device, port, and what it connects to) so nothing gets wired to the wrong port. The devices are:

| Device Name | Device Type |
|---|---|
| R1 | Router / Cisco 4321 |
| R2 | Router / Cisco 4321 |
| S1 | Switch / Catalyst 2960 |
| S2 | Switch / Catalyst 2960 |
| Web Server | Server |
| PC-A | PC |
| PC-B | PC |

---

## Part 1: Review the Logical Network Diagram

- Opened the **Network Diagram** provided with the activity.
- Traced each device's labeled interface and recorded the connected device/port in the Device Table.
- Completed table:

| Device Name | Local Interface | Connected Device and Port |
|---|---|---|
| R1 | G0/0/0 | Web Server Ethernet NIC |
| R1 | G0/0/1 | S1 G0/1 |
| S1 | G0/1 | R1 G0/0/1 |
| S1 | G0/2 | S2 G0/2 |
| S1 | F0/1 | PC-A Ethernet NIC |
| S2 | G0/1 | R2 G0/0/1 |
| S2 | G0/2 | S1 G0/2 |
| S2 | F0/1 | PC-B Ethernet NIC |
| R2 | G0/0/1 | S2 G0/1 |
| Web Server | Ethernet | R1 G0/0/0 |
| PC-A | Ethernet | S1 F0/1 |
| PC-B | Ethernet | S2 F0/1 |

**Key idea:** This step is pure documentation — no protocol or electrical connection is tested yet. It exists so the physical wiring in Part 2 has an authoritative reference, rather than relying on memory or re-reading the diagram mid-task.

**Observation:** All 12 rows resolved to a specific device and port with no ambiguity — the diagram fully specifies the topology.

---

## Part 2: Connect the Physical Devices

- Switched to **Physical Mode** and opened the main wiring closet.
- **Step 1 — Determine the cable type:** Inspected the Cable Pegboard. The straight-through Ethernet cable is colored **green**.
- **Step 2 — Connect the devices:** For each of the six links, selected the green straight-through cable, clicked the port on the first device, then the matching port on the second device, and verified the connection via Inspect Front → magnifying glass (blinking green LED = link up):
  - Web Server FastEthernet0 → R1 G0/0/0
  - R1 G0/0/1 → S1 G0/1
  - S1 G0/2 → S2 G0/2
  - S2 G0/1 → R2 G0/0/1
  - S1 F0/1 → PC-A Ethernet NIC (PC-A is on the Table, not the rack)
  - S2 F0/1 → PC-B Ethernet NIC (PC-B is on the Table, not the rack)

**Key idea:** A blinking green port LED confirms Layer 1 electrical/optical link integrity only — it says nothing about IP addressing, VLANs, or whether the devices can actually exchange data at higher layers. "The link light is up" and "the network works" are separate claims.

---

## Troubleshooting Log (What Actually Went Wrong)

While following the activity's own written instructions, Step 2c told me to connect the Web Server to "GigabitEthernet0/0/1 on R1." That conflicted with the completed Device Table, which shows the Web Server landing on R1's **G0/0/0**, with G0/0/1 reserved for the R1–S1 uplink.

**Diagnosis:** The instructional prose and the activity's own answer key disagreed on a specific port number for the same link.

**Root cause:** An inconsistency in the source guide itself — the worked example text doesn't match the reference Device Table it's paired with.

**Fix:** Followed the Device Table (R1 G0/0/0 → Web Server) rather than the example sentence, since the table is the authoritative, diagram-derived source and the prose was describing the same step in less precise terms.

**Lesson learned:** When a guide's descriptive instructions and its structured reference data disagree, trust the structured reference — prose is more prone to typos and drift than a table built directly from the diagram.

---

## Key Concepts Reinforced

- **Logical vs. physical diagrams:** A logical diagram shows how devices communicate and how data flows; a physical diagram shows the actual cabling, ports, and rack layout — both are needed, for different purposes, when documenting or troubleshooting a network.
- **Straight-through cabling and Auto-MDIX:** Every link in this topology — including the S1–S2 switch-to-switch uplink, which under the old straight-through/crossover rule would have needed a crossover cable — worked with a single straight-through cable. The Catalyst 2960 and Cisco 4321 Gigabit interfaces have Auto-MDIX enabled by default, so the interface auto-detects and internally swaps TX/RX pairs as needed, making the classic "similar vs. dissimilar devices" cable rule mostly a legacy/exam concept on modern Gigabit hardware.
- **Layer 1 verification via LEDs:** A green blinking port light confirms only that the physical medium is connected correctly — it is not evidence that addressing or higher-layer protocols are functioning.
- **Device Table as authoritative documentation:** Building and trusting a structured device table before making physical changes prevents miswiring and gives a single source of truth when instructions and diagrams disagree.

---

## Conclusion

By the end of the activity, all seven devices were connected exactly per the logical diagram, and all six physical links were confirmed up via blinking green port LEDs on both ends. The most valuable takeaway was the reminder that Layer 1 connectivity is a necessary but separate claim from a working network — and that when a guide's own instructions conflict with its reference data, the structured data (here, the Device Table) is the one to follow.
