/*
 * NEXCHAT public website configuration.
 *
 * This is the only file most operators need to edit when the domain, contact
 * email, ad slots, APK files or release notes change. It intentionally contains
 * no secrets and no database credentials.
 */
window.NEXCHAT_SITE_CONFIG = {
  siteName: "NEXCHAT",
  // Public site URL. Update this if you later move the site to a custom domain.
  siteUrl: "https://shumanlalu.github.io",
  // Public inbox for support, advertising enquiries and security reports.
  contactEmail: "shumanprdhn@gmail.com",
  description:
    "NEXCHAT is an end-to-end encrypted Android messenger with private groups, offline queuing and a nearby Bluetooth Classic relay.",
  themeColor: "#071b15",

  release: {
    version: "1.1.0",
    versionCode: 11,
    releaseDate: "2026-11-25",
    changelog: [
      "Server-enforced registration, analytics and support-ticket feature flags",
      "In-app Help & Support with ticket history, replies and up to three screenshots",
      "Encrypted one-to-one audio and video calls with short-lived TURN credentials",
      "Admin deep reports with aggregate-only exports and audited feature controls",
      "Room database v5 migration fix and per-device key continuity",
      "Safe-area, gesture-bar, keyboard and narrow-screen layout fixes across every screen",
      "More reliable calls and file transfers with batched ACKs and request-safe file chunks",
      "Nearby relay delivery, retry and status fixes with Signal-identity checks",
      "Custom NEXCHAT branding in the launcher, splash screen, app logo and notifications"
    ],
    // Each URL is relative to this website and can be changed independently.
    downloads: [
      {
        abi: "arm64-v8a",
        label: "ARM64 (recommended)",
        deviceNote: "Most Android phones from 2017 onward",
        url: "/downloads/NexChat-1.1.0-LIVE-arm64-v8a.apk",
        sizeBytes: 13731807,
        sha256: "7cc086ff7b38ff8a0e4a64ad6fa438490d4a4af306090d44869f7180978fc5fe"
      },
      {
        abi: "armeabi-v7a",
        label: "ARMv7 (32-bit)",
        deviceNote: "Older 32-bit Android devices",
        url: "/downloads/NexChat-1.1.0-LIVE-armeabi-v7a.apk",
        sizeBytes: 11764206,
        sha256: "6cc0329ac7376e473d43f804b6d6226a7be6a11be4b945ce3a516aecd4974dc8"
      },
      {
        abi: "x86_64",
        label: "x86_64",
        deviceNote: "Emulators and 64-bit Intel devices",
        url: "/downloads/NexChat-1.1.0-LIVE-x86_64.apk",
        sizeBytes: 14283993,
        sha256: "683be256d8838ce7a98b93275fbb2a4cd7aa8ebdea3f4eb76cc40f42f4b7dca4"
      }
    ]
  },

  /*
   * External advertising integration.
   *
   * Every enabled slot keeps a visible "Advertisement" label. No third-party
   * code loads until you add it here.
   *
   * adNetworkScripts: optional global scripts the network requires on every
   * page. Each item is a URL string or a { src, async, ... } attribute object.
   * Example (Google AdSense):
   *   "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
   *
   * Slot fields:
   *   enabled         - false hides the slot completely.
   *   label           - visible label; keep "Advertisement" for transparency.
   *   format          - honest note shown while the slot is empty.
   *   network         - optional operator label recorded as data-ad-network.
   *   html            - exact HTML/JS snippet from the network. <script> tags
   *                     are executed in document order.
   *   adsbygooglePush - true only if `html` contains an <ins class="adsbygoogle">
   *                     unit WITHOUT its own push({}) call. The site then pushes
   *                     each unit once. Leave false if the snippet already does it.
   *
   * See website/README.md for complete AdSense and generic network examples.
   */
  adNetworkScripts: [],
  adsEnabled: true,
  ads: {
    "home-top": { enabled: true, label: "Advertisement", format: "Leaderboard", network: "", html: "", adsbygooglePush: false },
    "home-mid": { enabled: true, label: "Advertisement", format: "In-content", network: "", html: "", adsbygooglePush: false },
    "features-side": { enabled: true, label: "Advertisement", format: "Sidebar", network: "", html: "", adsbygooglePush: false },
    "download-side": { enabled: true, label: "Advertisement", format: "Sidebar", network: "", html: "", adsbygooglePush: false },
    "content-bottom": { enabled: true, label: "Advertisement", format: "Banner", network: "", html: "", adsbygooglePush: false }
  }
};
