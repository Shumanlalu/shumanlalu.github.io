(function () {
  "use strict";

  var config = window.NEXCHAT_SITE_CONFIG || {};
  var release = config.release || {};
  var downloads = Array.isArray(release.downloads) ? release.downloads : [];

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatBytes(bytes) {
    var value = Number(bytes);
    if (!Number.isFinite(value) || value <= 0) return "—";
    var units = ["B", "KB", "MB", "GB"];
    var index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return value.toFixed(value >= 100 || index === 0 ? 0 : 1) + " " + units[index];
  }

  function formatDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return escapeHtml(value);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  function isPlaceholder(value) {
    return !value || /REPLACE/i.test(String(value));
  }

  function contactEmail() {
    return String(config.contactEmail || "").trim();
  }

  function renderHeader() {
    var host = document.querySelector("[data-site-header]");
    if (!host) return;
    var links = [
      ["/index.html", "Home"],
      ["/about.html", "About"],
      ["/features.html", "Features"],
      ["/download.html", "Download"],
      ["/advertise.html", "Advertise"],
      ["/contact.html", "Contact"],
    ];
    var path = window.location.pathname.replace(/\/+$/, "") || "/index.html";
    var nav = links
      .map(function (item) {
        var active = path === item[0] || (item[0] === "/index.html" && path === "/") ? ' aria-current="page"' : "";
        return '<a href="' + item[0] + '"' + active + ">" + escapeHtml(item[1]) + "</a>";
      })
      .join("");
    host.innerHTML =
      '<header class="site-header"><div class="container header-inner">' +
        '<a class="brand" href="/index.html" aria-label="NEXCHAT home">' +
          '<img src="/assets/nexchat-icon.png" width="38" height="38" alt="NEXCHAT app icon">' +
          "<span>" + escapeHtml(config.siteName || "NEXCHAT") + "</span>" +
        "</a>" +
        '<button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">☰</button>' +
        '<nav class="site-nav" id="main-nav" aria-label="Main navigation">' +
          nav +
          '<a class="btn btn-primary btn-small nav-cta" href="/download.html">Download APK</a>' +
        "</nav>" +
      "</div></header>";
  }

  function renderFooter() {
    var host = document.querySelector("[data-site-footer]");
    if (!host) return;
    var email = contactEmail();
    host.innerHTML =
      '<footer class="site-footer"><div class="container">' +
        '<div class="footer-grid">' +
          '<div><a class="brand" href="/index.html">' +
            '<img src="/assets/nexchat-icon.png" width="38" height="38" alt="NEXCHAT app icon">' +
            "<span>NEXCHAT</span></a>" +
            '<p class="small">' + escapeHtml(config.description || "") + "</p>" +
          "</div>" +
          '<div><h4>Product</h4><ul>' +
            '<li><a href="/about.html">About NEXCHAT</a></li>' +
            '<li><a href="/features.html">App features</a></li>' +
            '<li><a href="/download.html">Download APK</a></li>' +
          "</ul></div>" +
          '<div><h4>Business</h4><ul>' +
            '<li><a href="/advertise.html">Advertise with us</a></li>' +
            '<li><a href="/contact.html">Contact</a></li>' +
          "</ul></div>" +
          '<div><h4>Legal</h4><ul>' +
            '<li><a href="/privacy.html">Privacy policy</a></li>' +
            '<li><a href="/terms.html">Terms and conditions</a></li>' +
          "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom"><span>© <span data-year></span> NEXCHAT.</span>' +
          "<span>End-to-end encrypted messaging. No public sign-up on this website.</span>" +
          (email && !isPlaceholder(email) ? '<a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + "</a>" : "") +
        "</div>" +
      "</div></footer>";
  }

  function renderRelease() {
    var recommended = downloads[0];
    setText("[data-release-version]", release.version ? "v" + release.version : "Version unavailable");
    setText("[data-release-code]", release.versionCode ? "Version code " + release.versionCode : "");
    setText("[data-release-date]", release.releaseDate ? formatDate(release.releaseDate) : "Date unavailable");
    setText("[data-release-file-size]", recommended ? formatBytes(recommended.sizeBytes) : "—");

    document.querySelectorAll("[data-release-changelog]").forEach(function (host) {
      var items = Array.isArray(release.changelog) ? release.changelog : [];
      host.innerHTML = items.length
        ? '<ul class="feature-list">' + items.map(function (item) {
            return '<li class="feature-row"><span class="mark">◆</span><span>' + escapeHtml(item) + "</span></li>";
          }).join("") + "</ul>"
        : "<p>Release notes will be published with the next release.</p>";
    });

    document.querySelectorAll("[data-download-cards]").forEach(function (host) {
      if (!downloads.length) {
        host.innerHTML = '<div class="notice gold">No APK is configured yet. Edit website/assets/site.config.js.</div>';
        return;
      }
      host.innerHTML = downloads.map(function (item, index) {
        return (
          '<article class="download-card' + (index === 0 ? " recommended" : "") + '">' +
            '<div class="row"><h3>' + escapeHtml(item.label || item.abi) + "</h3>" +
              (index === 0 ? '<span class="pill">Recommended</span>' : "") +
            "</div>" +
            '<p class="small">' + escapeHtml(item.deviceNote || "") + "</p>" +
            '<div class="meta"><span>ABI: ' + escapeHtml(item.abi) + "</span>" +
              "<span>" + escapeHtml(formatBytes(item.sizeBytes)) + "</span></div>" +
            (item.sha256 ? '<div class="hash mono">SHA-256: ' + escapeHtml(item.sha256) + "</div>" : "") +
            '<a class="btn ' + (index === 0 ? "btn-primary" : "btn-secondary") + '" href="' +
              escapeHtml(item.url) + '" download>Download APK</a>' +
          "</article>"
        );
      }).join("");
    });

    document.querySelectorAll("[data-primary-download]").forEach(function (link) {
      if (recommended && recommended.url) link.setAttribute("href", recommended.url);
    });
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function renderContact() {
    var email = contactEmail();
    document.querySelectorAll("[data-contact-email]").forEach(function (node) {
      if (isPlaceholder(email)) {
        node.textContent = "Contact email not configured yet";
        node.classList.add("placeholder-value");
      } else {
        node.textContent = email;
        node.classList.remove("placeholder-value");
      }
    });
    document.querySelectorAll("[data-contact-link]").forEach(function (node) {
      if (isPlaceholder(email)) {
        node.setAttribute("aria-disabled", "true");
        node.classList.add("btn", "btn-secondary");
        node.removeAttribute("href");
      } else {
        node.setAttribute("href", "mailto:" + email + "?subject=NEXCHAT%20website%20enquiry");
        node.removeAttribute("aria-disabled");
      }
    });
    var notice = document.querySelector("[data-contact-notice]");
    if (notice && isPlaceholder(email)) notice.hidden = false;
  }

  function loadAdNetworkScripts() {
    var scripts = Array.isArray(config.adNetworkScripts) ? config.adNetworkScripts : [];
    scripts.forEach(function (entry) {
      if (!entry) return;
      var attrs = typeof entry === "string" ? { src: entry, async: true } : entry;
      var src = String(attrs.src || attrs.href || "").trim();
      if (!src) return;
      var installed = document.getElementsByTagName("script");
      for (var i = 0; i < installed.length; i += 1) {
        if (installed[i].getAttribute("src") === src || installed[i].src === src) return;
      }
      var script = document.createElement("script");
      Object.keys(attrs).forEach(function (key) {
        if (key === "src" || key === "href" || key === "async" || key === "text" || key === "content") return;
        script.setAttribute(key, attrs[key] === true ? "" : String(attrs[key]));
      });
      script.setAttribute("src", src);
      script.async = attrs.async !== false;
      document.head.appendChild(script);
    });
  }

  function appendAdContent(host, html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    var nodes = Array.prototype.slice.call(template.content.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 1 && node.tagName === "SCRIPT") {
        var script = document.createElement("script");
        Array.prototype.slice.call(node.attributes).forEach(function (attr) {
          script.setAttribute(attr.name, attr.value);
        });
        script.textContent = node.textContent;
        host.appendChild(script);
      } else {
        host.appendChild(node);
      }
    });
  }

  function renderAds() {
    loadAdNetworkScripts();
    document.querySelectorAll("[data-ad-slot]").forEach(function (host) {
      var id = host.getAttribute("data-ad-slot");
      var slot = (config.ads || {})[id] || {};
      if (!config.adsEnabled || slot.enabled === false) {
        host.remove();
        return;
      }
      host.setAttribute("data-ad-label", slot.label || "Advertisement");
      if (slot.network) host.setAttribute("data-ad-network", String(slot.network));

      var html = String(slot.html || "").trim();
      if (html) {
        var wrapper = document.createElement("div");
        wrapper.className = "ad-network-content";
        var inserted = true;
        try {
          appendAdContent(wrapper, html);
        } catch (error) {
          inserted = false;
        }
        if (inserted) {
          host.appendChild(wrapper);
          if (slot.adsbygooglePush === true) {
            var units = wrapper.querySelectorAll("ins.adsbygoogle");
            for (var i = 0; i < units.length; i += 1) {
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              } catch (error) {
                /* A network may reject a unit; keep the rest of the page working. */
              }
            }
          }
          return;
        }
      }

      var placeholder = document.createElement("div");
      placeholder.className = "ad-placeholder";
      placeholder.innerHTML =
        "<strong>" + escapeHtml(slot.format || "Advertisement") + " space available.</strong> " +
        "This area is reserved for clearly labelled advertising. " +
        '<a href="/advertise.html">Advertise with us</a>.';
      host.appendChild(placeholder);
    });
  }

  function setupNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    items.forEach(function (item) { observer.observe(item); });
  }

  function setupMetadata() {
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
    var siteUrl = String(config.siteUrl || "").trim().replace(/\/+$/, "");
    if (isPlaceholder(siteUrl)) return;
    var canonicalUrl = siteUrl + window.location.pathname;
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);
    var twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute("content", canonicalUrl);
  }

  renderHeader();
  renderFooter();
  renderRelease();
  renderContact();
  renderAds();
  setupNavigation();
  setupReveal();
  setupMetadata();
})();
