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
//   Cross-links use ids (`relatedCredential` -> credentials.ladder[].id in
//   defaults.js), never array positions.
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
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
    relatedCredential: 'cr-ccna',
  },
]

export const publishedWriteups = () =>
  writeups
    .filter((w) => w.status === 'published')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const writeupBySlug = (slug) =>
  publishedWriteups().find((w) => w.slug === slug) || null
