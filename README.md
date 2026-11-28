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

## 3. Live deployment

The site is **published** at <https://shumanlalu.github.io/> using GitHub Pages.

- Repository: `Shumanlalu/shumanlalu.github.io`
- Branch: `main`, published from the repository root
- This is a separate public repository, so the messaging backend, Neon database and private Admin Panel are untouched.

To update the live site, copy the contents of this `website/` folder into that repository's root and commit/push to `main`. GitHub Pages rebuilds automatically in about a minute. There is no build command and no server-side code.

Verified on the live site: every page returns HTTP 200, and all three APK downloads match the SHA-256 values in `downloads/SHA256SUMS.txt`.

### Optional: Vercel instead

If you later prefer Vercel, create a **separate** project from the NEXCHAT backend:

1. Add a new Vercel project pointing at a repository that contains this website.
2. Set **Root Directory** to `website` (or point the repository root at these files).
3. Framework Preset: **Other**; leave the build command empty; output directory `.`.
4. Deploy and set `siteUrl`, `sitemap.xml` and `robots.txt` to the new URL.

## 4. Connect a custom domain (optional)

The site currently uses the free `shumanlalu.github.io` URL. To use your own domain:

1. Buy a domain from any reputable registrar, for example `yourdomain.com`.
2. In the `shumanlalu.github.io` repository, open **Settings → Pages → Custom domain** and enter the exact domain.
3. At your registrar, add the DNS records GitHub shows (A records for a root domain or a CNAME for `www`). GitHub issues HTTPS automatically.
4. Set `siteUrl` in `assets/site.config.js` to `https://yourdomain.com`.
5. Replace `https://shumanlalu.github.io` in `sitemap.xml` and `robots.txt`.
6. Commit and push those three files. This is a content update only; the Android app and backend do not change.

If you switch to Vercel instead, add the domain under that project's **Settings → Domains** and follow the same three-file update. DNS can take a few hours to propagate.

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

## 7. Security notes

A security scan of the static site reported missing response headers, no rate limiting and a visible `Server: GitHub.com` header.

- **Headers:** GitHub Pages does not allow custom HTTP response headers. `vercel.json` only has an effect if the site is deployed to Vercel. Every page therefore sets a `<meta name="referrer">` policy and a permissive Content-Security-Policy in the page markup. These are enforced by browsers and reduce referrer leakage, mixed content and cross-origin injection, but a header-based scanner will still report the headers as absent.
- **HSTS, `X-Frame-Options`, `X-Content-Type-Options`:** these cannot be set with HTML meta tags. Moving to a host that supports custom headers (Vercel, Cloudflare Pages with a custom domain) would be required to clear those checks.
- **Rate limiting:** this website is read-only static files. It has no login, password reset, form handler, API or database, so brute-force protection does not apply here. Rate limiting belongs on the separate messaging backend and Admin Panel.
- **`Server: GitHub.com`:** this identifies the free hosting provider, not a vulnerable software version. It cannot be changed on GitHub Pages.

If a future ad-network snippet needs `eval()`, the CSP in each HTML page may need `'unsafe-eval'` added. Test any snippet before enabling it.

## 8. Verification checklist before publishing

- Confirm `siteUrl` in `site.config.js` and the domains in `sitemap.xml` and `robots.txt` match the live URL.
- Confirm Contact and Advertise links open a message addressed to `shumanprdhn@gmail.com`.
- Confirm the download page shows the expected version, date, size and checksums.
- Confirm every APK link returns the correct file and starts a download.
- If ads are enabled, confirm each slot shows the “Advertisement” label and the network creative renders on desktop and phone widths.
- Confirm all navigation links, legal pages and ad enquiries work on a phone screen.
- Confirm no private API, credential, `.env` file, keystore or backend source is inside the `website/` folder.
- Confirm changes are pushed to the root of the `shumanlalu.github.io` repository and GitHub Pages finishes building.

## Known limitations

- Contact email is configured to `shumanprdhn@gmail.com` and the live site uses `https://shumanlalu.github.io/`.
- No ad network is enabled by default. Real network snippets can be added to the config at any time.
- No custom domain is connected yet; the free `shumanlalu.github.io` URL is the public address.
- The APKs are the signed 1.1.0 release files rebuilt from the current Android source; older 1.0.9 files remain in `downloads/` as an archive only.
- Physical-device installation and app feature verification remain separate operator/release tasks.
