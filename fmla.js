(function () { "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function num(v, min, max) { var n = parseFloat(v); if (!isFinite(n) || n < min) return min; return n > max ? max : n; }
  function li(ul, ok, text) { var l = document.createElement("li"); var s = document.createElement("span"); s.className = ok ? "ok" : "no"; s.textContent = ok ? "✔ Met: " : "✘ Not met: "; l.appendChild(s); l.appendChild(document.createTextNode(text)); ul.appendChild(l); }
  function render() {
    var months = num($("months").value, 0, 1200), hours = num($("hours").value, 0, 8760), emp = num($("emp").value, 0, 10000000);
    var gov = $("gov").checked;
    var c1 = months >= 12, c2 = hours >= 1250, c3 = gov || emp >= 50;
    var ul = $("checks"); ul.textContent = "";
    li(ul, c1, "worked for the employer for at least 12 months (you entered " + months + ")");
    li(ul, c2, "worked at least 1,250 hours in the past 12 months (you entered " + hours + ")");
    li(ul, c3, gov ? "public agency or school: covered regardless of size" : "employer has 50 or more employees within 75 miles (you entered " + emp + ")");
    var all = c1 && c2 && c3, r = $("result");
    r.textContent = all ? "Likely eligible for FMLA leave" : "Likely not eligible under the federal FMLA";
    r.className = "big " + (all ? "" : "no-big");
    $("resultNote").textContent = all ? "Up to 12 weeks of unpaid, job-protected leave in a 12-month period for a qualifying reason (26 weeks for military caregiver leave)." : "Your state may still give you leave rights, and your employer's policy may be more generous.";
  }
  ["months","hours","emp","gov"].forEach(function (id) { $(id).addEventListener("input", render); $(id).addEventListener("change", render); });
  document.addEventListener("DOMContentLoaded", render);
})();
