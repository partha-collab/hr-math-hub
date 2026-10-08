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
    var mode = $("mode").value, amt = num($("amount").value, 0, 100000000), hpw = num($("hpw").value, 1, 168), wpy = num($("wpy").value, 1, 52);
    var annual = mode === "hourly" ? amt * hpw * wpy : amt, hourly = annual / (hpw * wpy);
    $("amountLabel").textContent = mode === "hourly" ? "Hourly rate ($)" : "Annual salary ($)";
    $("result").textContent = mode === "hourly" ? money.format(annual) + " / year" : money.format(hourly) + " / hour";
    $("resultNote").textContent = "based on " + dec.format(hpw) + " hours a week, " + dec.format(wpy) + " weeks a year";
    var tb = $("rows"); tb.textContent = "";
    row(tb, "Hourly", money.format(hourly)); row(tb, "Daily (" + dec.format(hpw / 5) + " hrs)", money.format(hourly * hpw / 5));
    row(tb, "Weekly", money.format(hourly * hpw)); row(tb, "Every 2 weeks", money.format(hourly * hpw * 2));
    row(tb, "Twice a month", money.format(annual / 24)); row(tb, "Monthly", money.format(annual / 12));
    row(tb, "Yearly", money.format(annual), "total");
  }
  $("mode").addEventListener("change", function () { $("amount").value = $("mode").value === "hourly" ? 25 : 60000; render(); });
  wire(["amount","hpw","wpy"], render);
})();
