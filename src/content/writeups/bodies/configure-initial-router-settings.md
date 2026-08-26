## Objective

This activity confirms basic router configuration and hardening at Layer 1/CLI access level: establishing console access to a router, moving between IOS configuration modes, and configuring a hostname, MOTD banner, and encrypted passwords for both privileged EXEC and console access. It also verifies the distinction between a router's running configuration (in RAM) and startup configuration (in NVRAM), and confirms that changes are only persistent once explicitly saved.

## Scenario

Topology: PCA connected to R1 via a rollover **console cable** (PCA's RS232 port to R1's console port). No IP addressing was involved — this activity is entirely about local CLI access and device hardening before any network-layer configuration exists. The task was to verify R1's out-of-the-box state, apply initial security settings, and confirm those settings survive a reload by saving them to NVRAM.

---

## Part 1: Verify the Default Router Configuration

- Opened the **Terminal** application on **PCA** via the Desktop tab, connected through the console cable to **R1**, pressed ENTER to activate the session.
- Entered privileged EXEC mode with `enable`, then ran `show running-config` to inspect the router's out-of-the-box state.
- Result: default hostname `Router`, 0 FastEthernet interfaces, 2 GigabitEthernet interfaces, 2 Serial interfaces, and vty lines ranging `0 – 4`.
- Ran `show startup-config`, which returned `startup-config is not present`.

**Key idea:** A router's active configuration lives only in RAM (`running-config`) unless explicitly saved to NVRAM (`startup-config`). This confirms configuration state but nothing about persistence — a reboot at this point would lose everything.

**Observation:** `show startup-config` returning "not present" is expected on a fresh device; it doesn't indicate an error, just that nothing has ever been copied to NVRAM.

---

## Part 2: Configure and Verify the Initial Router Configuration

- From privileged EXEC, entered global config mode and applied the following:
  ```
  hostname R1
  banner motd #Unauthorized access is strictly prohibited.#
  enable secret itsasecret
  line console 0
   password letmein
   login
   exit
  service password-encryption
  ```
- Verified with `show running-config`, then closed and reopened the terminal session to confirm the MOTD banner displayed and a password prompt appeared before reaching user EXEC mode.

**Key idea:** `line console 0` governs the physical console port — local, out-of-band access, and the only way into a device with no IP configuration yet. `line vty 0 4` (the five virtual terminal lines) governs remote access via Telnet/SSH instead. The `login` command is what actually enforces the configured line password; without it, `password` alone is not enforced. `service password-encryption` retroactively encrypts plain-text passwords stored in the config.

---

## Troubleshooting Log (What Actually Went Wrong)

Initial point of confusion: an earlier switch in the same topology had been configurable directly, without ever attaching a console cable — but R1 required the full console-cable-and-Terminal-app process.

**Diagnosis:** Packet Tracer provides a **CLI tab** on any device that opens a command line instantly, with no cabling required — a simulator shortcut, not a reflection of real hardware behavior.

**Root cause:** In reality, a brand-new device has no IP address and no reachable network path, so the physical console port is the *only* way to access it. This activity deliberately routes through the console cable and Terminal app instead of the CLI tab shortcut, to mirror how initial device access actually works outside the simulator.

**Fix:** No fix needed — this was expected behavior once the CLI-tab-vs-console distinction was understood, not an actual error in the configuration.

**Lesson learned:** Simulator shortcuts (like Packet Tracer's CLI tab) can obscure real-world constraints. Console access is the baseline, "must always work" method for reaching any device, precisely because it doesn't depend on any prior network configuration.

---

## Part 3: Save the Running Configuration File

- Saved the configuration to NVRAM with `copy running-config startup-config`, accepting the default filename.
- Verified persistence with `show startup-config`.
- Optionally backed up the startup configuration to flash with `copy startup-config flash`, then confirmed with `show flash` (3 files present, with the `.bin`-style IOS image identifiable by its larger file size and filename pattern).

**Key idea:** `copy running-config startup-config` is the step that actually protects configuration changes against a reload or power loss — everything done in Part 2 was still volatile until this command ran.

---

## Key Concepts Reinforced

- **running-config vs. startup-config:** Active configuration lives in RAM and is lost on reload unless copied to NVRAM as the startup-config.
- **Console line vs. VTY lines:** `line console 0` is physical, local, out-of-band access; `line vty 0 4` is remote access via Telnet/SSH across up to five simultaneous sessions.
- **`login` vs. `password` alone:** A configured line password does nothing without `login` to enforce it.
- **`service password-encryption`:** Encrypts plain-text passwords currently in the config and any configured afterward — a baseline hardening step, not a substitute for `enable secret`'s stronger MD5-style hashing.

---

## Conclusion

By the end of this activity, R1 had a configured hostname, an MOTD banner warning against unauthorized access, an encrypted privileged EXEC password, a protected console line, and a running configuration confirmed saved to NVRAM (and optionally backed up to flash). The most valuable takeaway was the console-vs-CLI-tab distinction: it reframed the console cable step not as a simulator formality, but as the realistic, dependency-free way any device is accessed before it has any network configuration at all — which is also why `line console 0` and `line vty 0 4` serve fundamentally different roles (local baseline access vs. remote access that only works once the device is already reachable).
