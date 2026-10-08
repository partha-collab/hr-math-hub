(function () {
  "use strict";
  var KEY = "tc_consent", mem = null;
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return mem; } }
  function write(v) { mem = v; try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }
  var gpc = navigator.globalPrivacyControl === true;   // Global Privacy Control = automatic opt-out
  function state() { return gpc ? "denied" : read(); }

  var adsLoaded = false;
  function loadAds() {
    var c = window.SITECFG || {};
    if (adsLoaded || !/^ca-pub-\d{10,20}$/.test(c.adsensePublisherId || "")) return;
    var slots = document.querySelectorAll(".adslot");
    if (!slots.length) return;
    adsLoaded = true;
    var s = document.createElement("script");
    s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + c.adsensePublisherId;
    document.head.appendChild(s);
    Array.prototype.forEach.call(slots, function (slot) {
      var ins = document.createElement("ins");
      ins.className = "adsbygoogle"; ins.style.display = "block";
      ins.setAttribute("data-ad-client", c.adsensePublisherId);
      if (/^\d{6,20}$/.test(c.adSlotId || "")) ins.setAttribute("data-ad-slot", c.adSlotId);
      ins.setAttribute("data-ad-format", "auto"); ins.setAttribute("data-full-width-responsive", "true");
      slot.appendChild(ins);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  var banner = null;
  function hide() { if (banner) { banner.remove(); banner = null; } }
  function show() {
    if (banner) return;
    banner = document.createElement("div");
    banner.className = "consent"; banner.setAttribute("role", "dialog"); banner.setAttribute("aria-label", "Cookie choices");
    var p = document.createElement("p");
    p.textContent = "We use cookies to show ads that keep this calculator free. You can accept or reject them; the calculator works either way. ";
    var a = document.createElement("a"); a.href = "privacy.html"; a.textContent = "Privacy Policy"; p.appendChild(a);
    var rej = document.createElement("button"); rej.type = "button"; rej.className = "btn ghost"; rej.textContent = "Reject";
    var acc = document.createElement("button"); acc.type = "button"; acc.className = "btn"; acc.textContent = "Accept";
    rej.addEventListener("click", function () { write("denied"); hide(); });
    acc.addEventListener("click", function () { write("granted"); hide(); loadAds(); });
    var row = document.createElement("div"); row.className = "consent-btns"; row.appendChild(rej); row.appendChild(acc);
    banner.appendChild(p); banner.appendChild(row); document.body.appendChild(banner);
  }
  document.addEventListener("DOMContentLoaded", function () {
    var st = state();
    if (st === "granted") loadAds(); else if (st !== "denied") show();
    var b = document.getElementById("cookie-settings");
    if (b) b.addEventListener("click", function () {
      var was = state(); if (!gpc) write(null);
      if (was === "granted") { location.reload(); } else { show(); }
    });
  });
})();
