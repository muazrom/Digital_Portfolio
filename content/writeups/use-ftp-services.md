---
title: FTP opens two connections, and "Transfer complete" is not proof
date: 2026-08-02
summary: >
  Uploading and downloading against an FTP server, confirming each step with a
  directory listing instead of trusting the success message — output can read
  as successful while a file lands somewhere else.
tags: [ftp, application-layer, ports]
platform: Cisco NetAcad
course: Networking Basics — Packet Tracer
---

## Objective

Verify that a client (PC-A) can both upload and download files to/from an FTP server (`ftp.pka`, 209.165.200.226) using the standard FTP client command set. The activity confirms functional file transfer at the Application layer while also demonstrating FTP's two-channel design — a control connection (port 21) for authentication and commands, and a data connection (port 20) for the actual file bytes.

## Scenario

The topology consists of **PC-A** and an **FTP Server** (hostname `ftp.pka`, IP 209.165.200.226, subnet mask 255.255.255.224). Before assuming a transfer worked, each step is verified with a `dir` listing on the appropriate side (local PC or remote server) rather than just trusting the "Transfer complete" message — output can look successful while a file lands in the wrong directory or under the wrong name, so confirming the listing closes that gap.

| Device | Interface | IP Address | Subnet Mask |
|---|---|---|---|
| FTP Server (ftp.pka) | NIC | 209.165.200.226 | 255.255.255.224 |

---

## Part 1: Upload a File to an FTP Server

- Opened the **Command Prompt** on **PC-A** via the Desktop tab.
- Ran `dir` on the local `C:` drive and confirmed `sampleFile.txt` (26 bytes) was present.
- Connected to the server with `ftp 209.165.200.226`, logging in as `student` / `class`.
- Ran `dir` on the FTP session to view existing server contents (several Cisco IOS/ASA images already present).
- Ran `put sampleFile.txt` to push the file to the server.
- Ran `dir` again to confirm `sampleFile.txt` now appeared in the server's file listing.

**Key idea:** `put` opens FTP's data connection to transfer a file **from client to server**, while the control connection (port 21) stays open throughout to carry the commands and responses. The upload doesn't close the FTP session — it just adds a temporary data channel.

**Observation:** `230- Logged in (passive mode On)` on login; upload reported `Transfer complete - 26 bytes copied in 0.08 secs (325 bytes/sec)`.

---

## Part 2: Download a File from an FTP Server

- Renamed the uploaded file on the server: `rename sampleFile.txt sampleFile_FTP.txt`, then ran `dir` to confirm the new name.
- Ran `get sampleFile_FTP.txt` to pull the file back down to PC-A.
- Ran `quit` to close the FTP session, then `dir` on PC-A's local `C:` drive to confirm the downloaded copy was present.

**Key idea:** `get` is the reverse of `put` — a **server-to-client** pull over the same type of temporary data connection. Renaming first was necessary to distinguish the downloaded copy from the original local file and to prove the bytes genuinely came back from the server rather than already existing locally.

**Observation:** Download reported `Transfer complete - 26 bytes copied in 0.013 secs (2000 bytes/sec)` — noticeably faster than the upload, though the file size was identical, illustrating that transfer time in the simulation isn't purely a function of file size.

---

## Part 3: Remove the File from the FTP Server (Cleanup)

- Logged back into the FTP server with the same credentials.
- Ran `delete sampleFile_FTP.txt` to remove the file from the server.
- Confirmed removal by running `dir` and verifying the file no longer appeared.
- Ran `quit` to close the session.

**Key idea:** `delete` operates over the control connection directly (no data channel needed, since no file content is transferred) — a reminder that not every FTP command requires the data connection, only ones that move file bytes (`put`, `get`) do.

---

## Troubleshooting Log (What Actually Went Wrong)

**No issues encountered.** Both the upload and download completed on the first attempt with no connection failures or authentication errors, and each step was confirmed with a `dir` listing before moving on.

---

## Key Concepts Reinforced

- **Control vs. data connections:** FTP uses port 21 for login/commands and a separate port 20 (or a passive-mode negotiated port) for actual file transfer — one protocol, two connections.
- **Passive mode:** The client's FTP session used passive mode, meaning the client initiates the data connection to the server rather than the server connecting back to the client — relevant for how FTP behaves through firewalls/NAT.
- **Plaintext authentication:** The `student`/`class` credentials were sent unencrypted, a good contrast point for why FTPS/SFTP exist in production environments.
- **Verify, don't assume:** Running `dir` after each `put`/`get`/`rename`/`delete` confirmed the actual server or client state rather than relying solely on the client's success message.

---

## Conclusion

The activity confirmed that PC-A could both upload and download files to/from the FTP server, and that file management commands (`rename`, `delete`) work over the same control connection used for login. The most valuable takeaway was seeing FTP's control/data connection split in practice — commands and file transfer aren't the same channel, which explains a lot of FTP's real-world firewall and NAT quirks.
