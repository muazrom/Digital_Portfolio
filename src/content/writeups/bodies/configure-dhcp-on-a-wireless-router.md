## Objective

Configure a wireless router so that three connected PCs automatically obtain their IP addresses via DHCP — including changing the router's default IP address and DHCP address pool — and confirm all three clients receive valid addresses and can communicate with each other and the router.

## Scenario

A home user wants to connect three PCs to a wireless router, with all three PCs obtaining their address automatically rather than being configured manually. This involved building the topology, changing the router's default IP and DHCP scope, and enabling DHCP on each client to confirm correct address assignment.

---

## Part 1: Set Up the Network Topology

- Added three generic PCs and connected each to the wireless router's LAN ports using straight-through Ethernet cables.
- Waited for the link lights to move from amber to green before proceeding.

## Part 2: Observe the Default DHCP Settings

- Set PC0 to **DHCP** under IP Configuration and recorded the default gateway: `192.168.0.1`.
- Logged into the router's web GUI at `192.168.0.1` (`admin` / `admin`) and reviewed the Basic Setup page — DHCP enabled by default, with its default starting address and pool size.

## Part 3: Change the Router's Default IP Address

- Changed the Router IP under Router IP Settings to `192.168.5.1` and saved. The browser threw an error immediately after, as expected — it was still pointed at the router's old address.
- PC0 needed its IP Configuration toggled from **DHCP → Static → DHCP** to force it to drop its old lease and request a new one under the router's new subnet.

## Part 4: Change the Default DHCP Range of Addresses

- Changed the DHCP Server Starting IP Address to `192.168.5.126` and Maximum Number of Users to `75`, then saved settings.
- Renewed PC0's lease and ran `ipconfig` to confirm the new address.

## Part 5: Enable DHCP on the Other PCs

- Enabled DHCP on PC1 (received `192.168.5.127`) and PC2, following the same steps.

## Part 6: Verify Connectivity

- From PC2, ran `ipconfig`, then `ping 192.168.5.1` (router) and `ping 192.168.5.127` (PC1) — both succeeded.

---

## Troubleshooting Log (What Actually Went Wrong)

After changing the router's IP address in Part 3, I moved on to reconfiguring the DHCP pool in Part 4 without first toggling PC0's IP Configuration from DHCP to Static and back to DHCP. I didn't catch the mistake until I ran `ipconfig` on PC0 at the end of Part 4 — it wasn't showing the expected `192.168.5.126` address from the new pool.

**Diagnosis:** PC0 was still holding onto the lease it had obtained before the router's IP and DHCP scope were changed. Because I never manually released it, PC0 had no reason to know the router's addressing had changed underneath it — from the client's perspective, nothing had happened that would trigger a new DHCP request.

**Root cause:** DHCP clients don't automatically detect server-side reconfiguration. A router can change its own IP and DHCP pool freely, but any client that already holds a valid lease will keep using it until that lease expires or the client is manually told to release and renew. Saving new settings on the router does not push anything to already-connected clients.

**Fix:** Went back into PC0's IP Configuration, clicked **Static** to drop the stale configuration, then clicked **DHCP** again to issue a fresh request under the router's current settings. Running `ipconfig` afterward confirmed PC0 correctly picked up `192.168.5.126`.

**Lesson learned:** When troubleshooting a client that doesn't reflect a server-side change, check whether the client has actually been told to refresh before assuming the server-side configuration is wrong. In this case the router was configured correctly the whole time — PC0 was just still running on outdated information because I skipped its renewal step.

---

## Key Concepts Reinforced

- **DHCP lease persistence:** A client that has already obtained a lease keeps using it regardless of later server-side changes, until the lease expires or is manually released.
- **Release/renew workflow:** Toggling a client from DHCP to Static and back to DHCP in Packet Tracer mirrors `ipconfig /release` and `ipconfig /renew` on a real PC — it's the mechanism that forces a client to request a fresh address.
- **Client-server relationship in DHCP:** The DHCP server (router) and its clients are only synchronized at the moment a lease is requested or renewed — not continuously. Reconfiguring the server has no effect on clients until they check back in.
- **Troubleshooting order:** An unexpected result on a client doesn't always mean the server is misconfigured — verifying the client's own state (in this case, whether it had actually renewed) should come before assuming a deeper fault.

---

## Conclusion

The activity was completed successfully once PC0's stale lease was identified and manually renewed — all three PCs ended up correctly addressed within the `192.168.5.126–200` range, and connectivity between PC2, PC1, and the router was confirmed via ping. The most useful part of the exercise was catching that a "wrong" IP address on PC0 wasn't a router misconfiguration at all, but a missed renewal step on the client side — a reminder that DHCP is a request-driven handshake, not something the server can push out on its own.
