// Study writeups — the learning-in-public evidence engine.
//
// DELIBERATELY OUTSIDE DataContext. Publishing here must not touch defaults.js,
// because bumping CONTENT_VERSION wipes every visitor's localStorage snapshot,
// including your own admin edits. Publishing weekly would mean self-wiping
// weekly. These are git-authored: no version coupling, no admin editor to
// corrupt them, and a verifiable public track record in the commit history.
//
// Metadata lives here; bodies live one-per-file in ./bodies/<slug>.md and load
// on demand, so the archive can grow without the index paying for it.
//
//   `slug` IS the id — permanent, URL-safe, never renamed, because it is both
//   the filename and the URL. This deliberately breaks the b1/e1/p7 convention
//   used in defaults.js.
//   Dates are ISO so they sort and a sitemap lastmod needs no parser.
//   Cross-links use ids (`relatedCredential` -> credentials[].id in defaults.js),
//   never array positions. Null until there's a credential worth pointing at.
//
// To publish: drop <slug>.md in ./bodies/, add an entry here with
// status: 'published'. Nothing else.

// Vite code-splits each body into its own chunk, fetched only when a reader
// opens that writeup — the index and homepage never download prose they don't show.
const bodies = import.meta.glob('./bodies/*.md', { query: '?raw', import: 'default' })

export function loadBody(slug) {
  const loader = bodies[`./bodies/${slug}.md`]
  return loader ? loader() : Promise.resolve(null)
}

export const writeups = [
  // ── Network Support and Security ──
  {
    slug: 'site-to-site-vs-remote-access-vpn',
    title: 'Site-to-site vs remote access VPN, and the overlap that breaks both',
    date: '2026-08-19',
    updated: null,
    summary:
      'Working out what each VPN type actually connects — network-to-network vs host-to-network — then the routing-table mechanics underneath, including why two LANs using the same subnet can never be tunnelled together.',
    tags: ['vpn', 'ipsec', 'routing', 'subnetting'],
    source: { platform: 'Cisco NetAcad', name: 'Network Support and Security — Concepts', url: null },
    minutes: 5,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'verify-address-with-a-subnet-calculator',
    title: 'Checking a subnet calculator against the host that produced the address',
    date: '2026-08-19',
    updated: null,
    summary:
      "Reading a device's own IPv4 address and mask, then deriving the network address, host range and broadcast with a calculator — and confirming the device actually falls inside the range the tool returned.",
    tags: ['subnetting', 'ipv4', 'cidr', 'addressing'],
    source: { platform: 'Cisco NetAcad', name: 'Network Support and Security — Lab', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'use-cdp-to-map-a-network',
    title: 'Mapping a branch office with CDP, which was switched off on purpose',
    date: '2026-08-18',
    updated: null,
    summary:
      'Chaining SSH sessions hop by hop to map a remote branch and find a switch with no IP address — using a Layer 2 discovery protocol that had been left disabled, correctly, on a router facing the ISP.',
    tags: ['cdp', 'ssh', 'discovery', 'layer-2'],
    source: { platform: 'Cisco NetAcad', name: 'Network Support and Security — Packet Tracer', url: null },
    minutes: 6,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'connect-a-network-based-on-a-network-diagram',
    title: "When the guide's own prose and its port table disagreed",
    date: '2026-08-18',
    updated: null,
    summary:
      'Cabling a physical topology from a logical diagram — Layer 1 only, no protocols — and deciding which source to trust when the instructions and the reference table named different ports for the same link.',
    tags: ['cabling', 'layer-1', 'topology', 'documentation'],
    source: { platform: 'Cisco NetAcad', name: 'Network Support and Security — Packet Tracer', url: null },
    minutes: 5,
    status: 'published',
    relatedCredential: null,
  },

  // ── Networking Devices and Initial Configuration ──
  {
    slug: 'troubleshoot-default-gateway-issues',
    title: 'Four broken devices, four unrelated causes, one variable at a time',
    date: '2026-08-09',
    updated: null,
    summary:
      'A two-LAN network that looked broadly broken turned out to be four independent mistakes — a wrong IP, a missing gateway, a missing address and a wrong mask — separated only by testing one thing at a time.',
    tags: ['troubleshooting', 'default-gateway', 'subnet-mask', 'routing'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Devices and Initial Configuration — Packet Tracer', url: null },
    minutes: 5,
    status: 'published',
    relatedCredential: 'cr-cisco-netdevices',
  },
  {
    slug: 'configure-ssh',
    title: "RSA keys won't generate until the router has a domain name",
    date: '2026-08-09',
    updated: null,
    summary:
      'Replacing Telnet with SSH on a switch — encrypting stored passwords, building a local user database, and finding out that key generation silently depends on a prerequisite nobody mentions first.',
    tags: ['ssh', 'rsa', 'hardening', 'telnet'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Devices and Initial Configuration — Packet Tracer', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: 'cr-cisco-netdevices',
  },
  {
    slug: 'configure-initial-router-settings',
    title: 'The console port is the one way in that needs no network at all',
    date: '2026-08-09',
    updated: null,
    summary:
      "Hardening a router over a rollover console cable rather than the simulator's CLI shortcut, and confirming that nothing survives a reload until it is copied out of RAM into NVRAM.",
    tags: ['console', 'ios', 'hardening', 'nvram'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Devices and Initial Configuration — Packet Tracer', url: null },
    minutes: 5,
    status: 'published',
    relatedCredential: 'cr-cisco-netdevices',
  },
  {
    slug: 'implement-basic-connectivity',
    title: "A switch doesn't need an IP to switch — so what is VLAN 1 for?",
    date: '2026-08-09',
    updated: null,
    summary:
      'Addressing two switches and two PCs on one flat subnet, and separating what a switch needs to forward frames from what it needs to be managed remotely.',
    tags: ['svi', 'vlan', 'addressing', 'ping'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Devices and Initial Configuration — Packet Tracer', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: 'cr-cisco-netdevices',
  },

  // ── Networking Basics ──
  {
    slug: 'use-telnet-and-ssh',
    title: 'Telnet and SSH, and why one of them is the standard',
    date: '2026-08-02',
    updated: null,
    summary:
      'Remote-managing a router over both protocols — and verifying Layer 3 reachability first, because a failed remote-access attempt and a plain connectivity problem look identical until you rule one out.',
    tags: ['ssh', 'telnet', 'remote-access', 'security'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'observe-traffic-flow-in-a-routed-network',
    title: 'Why a flat 150-host LAN slows down, and what segmentation actually fixes',
    date: '2026-08-02',
    updated: null,
    summary:
      'Comparing ARP and broadcast behaviour on a flat network against a routed one, then splitting three departments into their own subnets to demonstrate the difference rather than assert it.',
    tags: ['arp', 'broadcast-domain', 'segmentation', 'routing'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 7,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'create-a-lan',
    title: 'An APIPA address that looked like DHCP, but was a cable in the wrong port',
    date: '2026-08-02',
    updated: null,
    summary:
      'Building a branch-office LAN and verifying each layer separately — which is exactly what caught a Layer 1 mistake presenting as a Layer 3 symptom.',
    tags: ['lan', 'dhcp', 'apipa', 'dns', 'troubleshooting'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 6,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'use-ftp-services',
    title: 'FTP opens two connections, and "Transfer complete" is not proof',
    date: '2026-08-02',
    updated: null,
    summary:
      'Uploading and downloading against an FTP server, confirming each step with a directory listing instead of trusting the success message — output can read as successful while a file lands somewhere else.',
    tags: ['ftp', 'application-layer', 'ports'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'the-client-interaction',
    title: 'A browser cannot reach a hostname — only an IP address',
    date: '2026-08-02',
    updated: null,
    summary:
      'Tracing a page request in simulation mode to watch the DNS lookup resolve first and the HTTP request follow, because the second step depends entirely on the first.',
    tags: ['dns', 'http', 'application-layer'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'examine-nat-on-a-wireless-router',
    title: 'Watching NAT rewrite a source address at the router',
    date: '2026-08-01',
    updated: null,
    summary:
      'Capturing the same packet either side of a home router to confirm the private LAN address is translated to the single public WAN address before anything reaches the internet.',
    tags: ['nat', 'dhcp', 'wan', 'packet-capture'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 8,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'identify-mac-and-ip-addresses',
    title: 'MAC addresses get rewritten at every hop. IP addresses do not.',
    date: '2026-08-01',
    updated: null,
    summary:
      'Inspecting each PDU at every device along a local ping and then a routed one, confirming Layer 2 addressing is only meaningful on a single segment while Layer 3 addressing survives end to end.',
    tags: ['mac', 'arp', 'layer-2', 'layer-3', 'packet-capture'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 8,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'configure-dhcp-on-a-wireless-router',
    title: 'Moving a router off its default address and repointing the DHCP scope',
    date: '2026-08-01',
    updated: null,
    summary:
      "Changing a wireless router's default IP and address pool, then confirming three clients pick up leases from the new range instead of the old one.",
    tags: ['dhcp', 'addressing', 'wireless'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'connect-to-a-web-server',
    title: 'Verifying a web server at Layer 3 before trusting the browser',
    date: '2026-07-27',
    updated: null,
    summary:
      'Confirming reachability by ping first and loading the page second — so that a browser failure can be attributed to the application rather than the network path.',
    tags: ['http', 'icmp', 'troubleshooting'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 4,
    status: 'published',
    relatedCredential: null,
  },
  {
    slug: 'configure-a-wireless-router-and-clients',
    title: 'Wiring and securing a home network end to end',
    date: '2026-07-25',
    updated: null,
    summary:
      'Cabling a modem, wireless router, two wired PCs and a laptop, then configuring the wireless LAN and its security before verifying every client actually reaches the internet.',
    tags: ['wireless', 'wlan-security', 'home-network', 'dhcp'],
    source: { platform: 'Cisco NetAcad', name: 'Networking Basics — Packet Tracer', url: null },
    minutes: 5,
    status: 'published',
    relatedCredential: null,
  },
]

export const publishedWriteups = () =>
  writeups
    .filter((w) => w.status === 'published')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const writeupBySlug = (slug) =>
  publishedWriteups().find((w) => w.slug === slug) || null
