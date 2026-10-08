(function () { "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function num(v, min, max) { var n = parseFloat(v); if (!isFinite(n) || n < min) return min; return n > max ? max : n; }
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  var dec = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
  function row(tb, label, val, cls) { var tr = document.createElement("tr"); if (cls) tr.className = cls;
    var th = document.createElement("th"); th.scope = "row"; th.textContent = label; var td = document.createElement("td"); td.textContent = val;
    tr.appendChild(th); tr.appendChild(td); tb.appendChild(tr); }
  function wire(ids, fn) { ids.forEach(function (id) { $(id).addEventListener("input", fn); $(id).addEventListener("change", fn); }); document.addEventListener("DOMContentLoaded", fn); }
  function render() {
    var rate = num($("rate").value, 0, 10000), hrs = num($("hours").value, 0, 168), thr = num($("thr").value, 0, 168),
        mult = num($("mult").value, 1, 3), wk = num($("weeks").value, 1, 52);
    var reg = Math.min(hrs, thr), ot = Math.max(0, hrs - thr);
    var regPay = reg * rate, otRate = rate * mult, otPay = ot * otRate, weekly = regPay + otPay;
    $("result").textContent = money.format(weekly);
    $("resultNote").textContent = "total gross pay for the week (" + money.format(weekly * wk) + " over " + wk + " week" + (wk === 1 ? "" : "s") + ")";
    var tb = $("rows"); tb.textContent = "";
    row(tb, "Regular hours", dec.format(reg)); row(tb, "Regular pay", money.format(regPay));
    row(tb, "Overtime hours", dec.format(ot)); row(tb, "Overtime rate", money.format(otRate) + " per hour");
    row(tb, "Overtime pay", money.format(otPay)); row(tb, "Total weekly gross pay", money.format(weekly), "total");
  }
  wire(["rate","hours","thr","mult","weeks"], render);
})();
