(function () { "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function num(v, min, max) { var n = parseFloat(v); if (!isFinite(n) || n < min) return min; return n > max ? max : n; }
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  var dec = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
  function row(tb, label, val, cls) { var tr = document.createElement("tr"); if (cls) tr.className = cls;
    var th = document.createElement("th"); th.scope = "row"; th.textContent = label; var td = document.createElement("td"); td.textContent = val;
    tr.appendChild(th); tr.appendChild(td); tb.appendChild(tr); }
  function wire(ids, fn) { ids.forEach(function (id) { $(id).addEventListener("input", fn); $(id).addEventListener("change", fn); }); document.addEventListener("DOMContentLoaded", fn); }
  var N = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
  function render() {
    var days = num($("days").value, 0, 365), hpd = num($("hpd").value, 1, 24), n = N[$("freq").value];
    var done = Math.min(num($("done").value, 0, n), n), used = num($("used").value, 0, 10000), carry = num($("carry").value, 0, 10000);
    var cap = $("cap").value === "" ? Infinity : num($("cap").value, 0, 100000);
    var annual = days * hpd, per = annual / n;
    var earned = Math.min(cap, carry + per * done - used);
    var capped = carry + per * done - used > cap;
    $("result").textContent = dec.format(Math.max(0, earned)) + " hours";
    $("resultNote").textContent = "estimated PTO balance after " + done + " pay period" + (done === 1 ? "" : "s") + " (about " + dec.format(Math.max(0, earned) / hpd) + " days)";
    var tb = $("rows"); tb.textContent = "";
    row(tb, "PTO per year", dec.format(annual) + " hours"); row(tb, "Accrued each paycheck", dec.format(per) + " hours");
    row(tb, "Carried over", dec.format(carry) + " hours"); row(tb, "Accrued so far", dec.format(per * done) + " hours");
    row(tb, "Used so far", "-" + dec.format(used) + " hours");
    if (capped) row(tb, "Balance cap applied", dec.format(cap) + " hours");
    row(tb, "Current balance", dec.format(Math.max(0, earned)) + " hours", "total");
  }
  wire(["days","hpd","freq","done","used","carry","cap"], render);
})();
