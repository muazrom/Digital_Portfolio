## Objective

Connect and configure a small home network — including a cable modem, a wireless router, two wired PCs, and a wireless laptop — so that every device on the network has working internet access. This involved three parts: physically wiring the devices, configuring the router (basic settings, wireless LAN, and security), and configuring/verifying IP addressing on each client.

## Scenario

The setup simulates helping a friend, Natsumi, connect her home to her cable provider's network and get every device online — both the wired PCs in her office and bedroom, and a laptop she wants to use over Wi-Fi.

---

## Part 1: Connecting the Devices

Before any configuration can happen, the physical (Layer 1) connections have to exist.

- Connected the coaxial cable from the wall outlet through a **splitter**, sending one leg to the **cable modem** (internet) and the other to the **TV** (video service). The splitter doesn't route data intelligently — it simply divides the incoming signal so each device can filter the frequency band it needs.
- Connected the **cable modem** to the **Internet (WAN) port** on the home wireless router using a straight-through Ethernet cable. The modem's job is to translate the ISP's cable signal into standard Ethernet data — it does not perform routing or IP addressing itself.
- Connected the **Office PC** and **Bedroom PC** to two of the router's LAN ports using straight-through cables.

**Key idea:** the router's WAN port and LAN ports are logically separate interfaces. The WAN side connects to the ISP; the LAN side (wired ports + Wi-Fi radio) forms the private home network. This separation is what makes NAT (Network Address Translation) possible later.

---

## Part 2: Configuring the Wireless Router

Accessed the router's configuration GUI from the Office PC's browser, using its default gateway IP address (obtained automatically via DHCP) and the factory default login (**admin / admin**).

**Basic settings:**
- Limited the DHCP pool to a **maximum of 10 users**, reducing how many addresses could be handed out automatically.
- Changed the default admin password to a strong custom password, since factory default credentials are widely known and a common real-world attack vector.

**Wireless LAN setup:**
- Enabled the **2.4 GHz** radio and renamed the network (SSID) from "Default" to **MyHome**.
- Set wireless security to **WPA2-Personal** and configured a pre-shared passphrase.

**Key idea:** the network *name* (SSID) is just a label for humans — it provides no real security. The actual protection comes from WPA2's authentication and encryption, which uses the passphrase to derive session keys during a handshake. A typo in the passphrase doesn't "partially" connect — the handshake either succeeds or fails outright.

---

## Part 3: IP Addressing and Connectivity Testing

- Set the **Bedroom PC** and **Office PC** IP configuration to DHCP and confirmed each received a `192.x.x.x` address from the router.
- Connected the **laptop** to the **MyHome** wireless network using the configured passphrase.
- Verified internet access on all three devices by loading an external test page (`skillsforall.srv`) in each device's browser.

---

## Troubleshooting Log (What Actually Went Wrong)

While connecting the laptop, the wireless link showed as successfully associated (correct SSID, WPA2-Personal security, authenticated), but the IP configuration was stuck at **0.0.0.0** for IP address, subnet mask, and gateway. Browsing to the test site failed with an "unresolved" error.

**Diagnosis:** The wireless *association* (Layer 2) and *IP addressing* (Layer 3) are two independent steps. Being "connected" to the access point only confirms the radio link and security handshake succeeded — it says nothing about whether the device has a usable IP address. Since there was no address, the browser had no way to reach the router, the DNS server, or the destination site, which is why the page never resolved.

**Root cause:** The laptop's IP Configuration was not set to DHCP, so it never actually sent out a DHCP request. No amount of waiting or "Fast Forward Time" would fix this, since the client wasn't asking for an address in the first place.

**Fix:** Switched the laptop's IP Configuration to **DHCP**, which triggered a proper DHCP request/response exchange with the router. The laptop received a valid `192.x.x.x` address, gateway, and subnet mask, and the test site loaded immediately afterward.

**Lesson learned:** A successful wireless "connected" status is not the same as having network connectivity. Always check the IP layer separately from the link layer when troubleshooting — a device can be fully associated to an access point and still be functionally offline.

---

## Key Concepts Reinforced

- **Layered networking:** Physical/link connectivity (cabling, Wi-Fi association) and IP-layer connectivity (addressing, routing) are separate concerns that can each fail independently.
- **DHCP:** Devices don't have addresses by default — they must request one from a DHCP server (discover → request → acknowledge) each time they join a network.
- **Default gateway:** The address a device sends traffic to when the destination is outside its local network — in this case, the router, which then forwards (and NATs) traffic to the internet.
- **DNS + connectivity testing:** Successfully loading an external website in a browser quietly verifies several things at once — valid IP address, reachable gateway, working DNS resolution, and functioning NAT/routing to the outside network.
- **Wireless security (WPA2-Personal):** Provides both authentication (only devices with the correct passphrase can join) and encryption (traffic is protected from casual eavesdropping) — unlike the SSID, which is just a visible label.
- **Default credentials as a security risk:** Leaving factory admin passwords unchanged is one of the most common real-world router vulnerabilities.

---

## Conclusion

By the end of the activity, all three client devices — the wired Office PC, wired Bedroom PC, and wireless laptop — had valid IP addresses and verified internet connectivity through the configured home wireless router. The most valuable part of the exercise wasn't the configuration steps themselves, but troubleshooting the laptop's failed connection, which reinforced the distinction between link-layer connectivity and IP-layer connectivity — a distinction that applies directly to real-world networking troubleshooting.
