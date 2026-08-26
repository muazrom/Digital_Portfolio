## Objective

Replace Telnet with SSH for remote management of a Cisco switch. This confirms three things: that locally stored passwords can be encrypted so they aren't sitting in plain text in the running config, that SSH can be enabled by generating RSA keys and creating a local user database, and that Telnet access can be fully disabled on the VTY lines in favor of SSH. Telnet sends all traffic — including passwords — in plain text, so this activity demonstrates why SSH is the standard for any real remote-management connection.

## Scenario

The topology consists of one switch, **S1** (VLAN 1 interface, IP 10.10.10.2/24), and one PC, **PC1** (NIC, IP 10.10.10.10/24), directly connected. PC1 starts out managing S1 over Telnet with a shared plain-text password (`cisco`). The task is to verify that Telnet access can be locked down and replaced with SSH before assuming the switch is securely configured — plain Telnet access should never be treated as "good enough" for a production device.

---

## Part 1: Secure Passwords

- Opened the **Command Prompt** on **PC1** via the Desktop tab.
- Telnetted into S1 with `telnet 10.10.10.2`, then authenticated with the user EXEC password (`cisco`) and escalated to privileged EXEC with `en` and the same password.
- Saved a checkpoint of the working configuration with `copy running-config startup-config`, so any later mistakes could be undone by reloading instead of restarting the lab.
- Ran `show running-config` and confirmed the line and enable passwords were stored in **plain text**.
- Entered global configuration mode and ran `service password-encryption`.
- Re-ran `show running-config` and confirmed the passwords now displayed as encrypted strings instead of plain text.

**Key idea:** `service password-encryption` applies a weak, reversible (Type 7) encoding to passwords stored in the config. It stops someone from reading the password at a glance if they see the config file, but it is not strong cryptographic protection — it's a baseline hygiene step, not real security.

**Observation:** `copy running-config startup-config` returned `[OK]` confirming the checkpoint saved successfully; the before/after `show running-config` output confirmed the encryption took effect immediately with no reload needed.

---

## Part 2: Encrypt Communications

- Configured the IP domain name on S1: `ip domain-name netacad.pka`.
- Generated the RSA key pair for SSH: `crypto key generate rsa`, using a 1024-bit modulus when prompted.
- Created a local user account for SSH login: `username administrator secret cisco`.
- Entered the VTY line range with `line vty 0 15`, then set `login local` (authenticate against the local username database), `transport input ssh` (accept SSH connections only), and removed the old shared line password with `no password cisco`.

**Key idea:** SSH depends on an identity for the device (the RSA key pair, named from hostname + domain name) and on per-user authentication (the local username database) rather than a single shared line password. Restricting `transport input` to `ssh` is what actually disables Telnet on those lines — generating keys alone doesn't block Telnet.

---

## Troubleshooting Log (What Actually Went Wrong)

Ran `crypto key generate rsa` before setting the domain name. The command was rejected instead of generating keys.

**Diagnosis:** IOS names an RSA key pair using the pattern `hostname.domain-name` (in this case, it should have become `S1.netacad.pka`). With no domain name configured, there was nothing to build that name from.

**Root cause:** RSA key generation on IOS has an implicit dependency on the domain name being set first — it's not a standalone command, even though it's easy to assume it is.

**Fix:** Ran `ip domain-name netacad.pka`, then re-ran `crypto key generate rsa` with a 1024-bit modulus. It generated successfully on the second attempt, with no need to reload the earlier checkpoint.

**Lesson learned:** Command order matters when one configuration step depends on another being in place first. A rejected command doesn't always mean the syntax was wrong — sometimes it means a prerequisite hasn't been configured yet.

---

## Key Concepts Reinforced

- **Password encryption vs. hashing:** `service password-encryption` (Type 7, reversible) protects passwords set with `password`, while `secret` (used for the local user and enable secret) stores a stronger hash — they are not the same level of protection.
- **SSH vs. Telnet:** Telnet transmits everything, including credentials, in plain text; SSH encrypts the session, which is why `transport input ssh` combined with disabling Telnet is the correct production configuration.
- **RSA key dependency:** Key generation for SSH depends on the domain name being configured first, since the key pair is named using hostname + domain.
- **VTY line authentication modes:** `login local` shifts authentication from a single shared line password to per-user credentials in the local database, which is a prerequisite for meaningful SSH access control.

---

## Conclusion

By the end of the activity, S1 had its stored passwords encrypted, SSH fully enabled with a locally authenticated administrator account, and Telnet access explicitly disabled on the VTY lines. Attempting Telnet afterward failed as expected, while SSH login with the `-l administrator` flag succeeded, confirming the switch was reachable only over an encrypted management channel. The most useful takeaway was the RSA key generation error — it reinforced that some IOS commands have hidden prerequisites, and that reading the error message is often faster than assuming the syntax is wrong.
