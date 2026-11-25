# NEXCHAT public website

A standalone, static website for promoting NEXCHAT and publishing the official Android APK. It is kept separate from the Android source, the messaging backend, the Neon database and the private Admin Panel.

No build step, database, account system, server-side code or paid service is required.

## What is included

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero section, introduction, feature highlights, APK download button and clearly labelled ad slots |
| About | `about.html` | How NEXCHAT messaging works and what the server can/cannot see |
| Features | `features.html` | Implemented features and honest verification status |
| Download APK | `download.html` | APK variants, version, date, size, SHA-256, changelog and install instructions |
| Advertise With Us | `advertise.html` | Direct advertising enquiry page with no revenue promises |
| Contact | `contact.html` | Email-based contact and security-report guidance |
| Privacy Policy | `privacy.html` | Website-only privacy information |
| Terms and Conditions | `terms.html` | Website-only terms |

Shared files:

- `assets/site.config.js` — editable release details, site URL, contact email and ad slots.
- `assets/app.js` — renders shared header/footer, release data, contact links and ad slots.
- `assets/styles.css` — premium dark green responsive theme.
- `assets/nexchat-icon.png` and `assets/nexchat-icon-round.png` — copied from the existing app resources; no new logo was invented.
- `downloads/` — the signed NEXCHAT 1.1.0 APKs and `SHA256SUMS.txt`.
- `vercel.json` — security headers and APK content type for Vercel.
- `sitemap.xml` and `robots.txt` — basic SEO.

## 1. Files you will normally edit

Open `assets/site.config.js` in a text editor.

- `siteUrl`: change from the placeholder to your real `https://` domain after connecting it to Vercel. Until then the site still works on the generated `*.vercel.app` URL.
- `contactEmail`: already set to `shumanprdhn@gmail.com`. Change it only if that inbox changes. It is used on the Contact and Advertise pages and in the site footer.
- `release.version`, `versionCode`, `releaseDate`, `changelog`: update for each real release.
- `release.downloads`: update each APK URL, size and SHA-256 when a new APK is published.
- `adNetworkScripts` and `ads`: add real network snippets only when you have them. See section 5.

When the domain changes, also replace `REPLACE-WITH-YOUR-DOMAIN.example` in:

- `sitemap.xml`
- `robots.txt`

When an APK changes, also update:

- `downloads/SHA256SUMS.txt`
- the copied APK file in `downloads/`

Generate a SHA-256 on Windows PowerShell:

```powershell
Get-FileHash .\website\downloads\your-file.apk -Algorithm SHA256
```

The same APK files are deliberately re-included by `website/.gitignore`, even though the repository ignores `*.apk` globally. Do not remove those exception lines or the APKs will not be uploaded by Git-based deployment.

## 2. Local preview

No installation is needed if Python is available:

```powershell
cd S:\nexchat\website
python -m http.server 4173
```

Open <http://127.0.0.1:4173>. Check the desktop layout, then use browser developer tools to test a phone-sized screen.

If Python is unavailable, any static file server can serve this folder. Opening `index.html` directly as a `file://` page is not recommended because link paths are absolute from the site root.

## 3. Deploy to the existing Vercel account

This website should be a separate Vercel project from the existing NEXCHAT backend so backend routes and the private Admin Panel remain untouched.

1. Commit the `website/` folder to your Git repository, or push this repository to your Git host.
2. In Vercel, choose **Add New → Project**.
3. Select the repository.
4. Set **Root Directory** to `website`. This is important: it tells Vercel to deploy only the static site.
5. Framework Preset: **Other**.
6. Leave the build command empty. There is nothing to compile.
7. Output directory: `.` (the website folder root).
8. Click **Deploy**.
9. After deployment, open the generated `*.vercel.app` URL and test every page and APK download.

A manual drag-and-drop deployment of the `website/` folder also works, but Git-based deployment is easier to update.

This workspace did not have Vercel CLI access, so the site was prepared but **not deployed**. No deployment is claimed here.

## 4. Connect a custom domain

Beginner steps:

1. Buy a domain from any reputable registrar, for example `yourdomain.com`.
2. In Vercel, open the website project → **Settings** → **Domains**.
3. Add the exact domain, for example `nexchat.example.com` or `yourdomain.com`.
4. Vercel will show DNS records. At your registrar, add the records Vercel displays. Common examples are:
   - A record: `76.76.21.21` for a root domain, or
   - CNAME record: `cname.vercel-dns.com` for `www` or another subdomain.
5. Wait for DNS to propagate. Vercel normally issues HTTPS/SSL automatically.
6. Set `siteUrl` in `assets/site.config.js` to the final `https://` domain.
7. Replace the placeholder domain in `sitemap.xml` and `robots.txt`.
8. Redeploy the website. This is a small content update, not a rebuild of the Android app or backend.

DNS can take a few hours to update in some cases. You can change the domain later by updating Vercel Domains and the three config files, then redeploying.

## 5. Advertisements and external ad networks

Every slot is configured in `assets/site.config.js` and always renders a visible “Advertisement” label. No third-party script loads until you add one. Advertising enquiries go to `shumanprdhn@gmail.com` through `contactEmail`.

There are two configuration points:

1. `adNetworkScripts` — global scripts a network requires on every page. Loaded once per page before slots render.
2. `ads.<slot>.html` — the exact ad-unit markup and script the network gives you for that placement. `<script src>` and inline `<script>` tags are executed in order.

### Google AdSense example

1. Create your ad units in AdSense. This site does not promise approval, impressions or revenue.
2. Add the global loader from your account to `adNetworkScripts`:

```js
adNetworkScripts: [
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
],
```

3. Paste the unit code into a slot:

```js
"home-top": {
  enabled: true,
  label: "Advertisement",
  format: "Leaderboard",
  network: "Google AdSense",
  html: '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>',
  adsbygooglePush: false
},
```

If your snippet contains only the `<ins class="adsbygoogle">` tag and **not** its own `push({})` call, set `adsbygooglePush: true` and the site will push each unit once. Do not enable both, or a unit can be requested twice.

### Other networks and direct sponsors

Paste the complete snippet a network supplies into `html` exactly as given. Scripts, iframes, styled containers and required `id`/`class` names are all preserved. If the network needs a global loader, add its URL to `adNetworkScripts`. This works for networks such as Media.net, Adsterra, PropellerAds or a direct sponsor's tracked banner.

A simple direct-sponsor creative without a network script:

```js
"download-side": {
  enabled: true,
  label: "Advertisement",
  format: "Sidebar",
  network: "Direct sponsor",
  html: '<a href="https://sponsor.example/?utm_source=nexchat" target="_blank" rel="noopener noreferrer"><img src="/assets/sponsor-banner.png" alt="Sponsored message" style="max-width:100%;height:auto"></a>',
  adsbygooglePush: false
},
```

### Rules

- Only paste code from a network or sponsor you trust: it runs as JavaScript on your public site.
- Keep `label: "Advertisement"` on every enabled slot so ads stay clearly separated.
- Set `enabled: false` to hide a slot without deleting its configuration.
- Empty `html` shows an honest “space available” placeholder linking to `/advertise.html`.
- After any config change, redeploy/upload `website/` and test each page with ad blockers off.

## 6. Neon database and existing backend

This website does not connect to Neon or any database. It does not call private backend APIs and does not contain credentials. NEXCHAT accounts remain provisioned through the existing operator-controlled system. The messaging backend and Admin Panel stay on their existing deployment.

## 7. Verification checklist before publishing

- Replace the `siteUrl` placeholder in `site.config.js` and the domain in `sitemap.xml` and `robots.txt` after the domain is connected.
- Confirm Contact and Advertise links open a message addressed to `shumanprdhn@gmail.com`.
- Confirm the download page shows the expected version, date, size and checksums.
- Confirm every APK link returns the correct file and starts a download.
- If ads are enabled, confirm each slot shows the “Advertisement” label and the network creative renders on desktop and phone widths.
- Confirm all navigation links, legal pages and ad enquiries work on a phone screen.
- Confirm no private API, credential, `.env` file, keystore or backend source is inside the `website/` folder.
- Confirm Vercel Root Directory is `website`, not the repository root.

## Known limitations

- Contact email is configured to `shumanprdhn@gmail.com`; the site domain is still a placeholder until deployment.
- No ad network is enabled by default. Real network snippets can be added to the config at any time.
- Deployment was not performed from this workspace.
- The APKs are the signed 1.1.0 release files rebuilt from the current Android source; older 1.0.9 files remain in `downloads/` as an archive only.
- Physical-device installation and app feature verification remain separate operator/release tasks.
