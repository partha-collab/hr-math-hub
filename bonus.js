(function () { "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var D = window.TAXDATA;
  function num(v, min, max) { var n = parseFloat(v); if (!isFinite(n) || n < min) return min; return n > max ? max : n; }
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  var dec = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
  function row(tb, label, val, cls) { var tr = document.createElement("tr"); if (cls) tr.className = cls;
    var th = document.createElement("th"); th.scope = "row"; th.textContent = label; var td = document.createElement("td"); td.textContent = val;
    tr.appendChild(th); tr.appendChild(td); tb.appendChild(tr); }
  function wire(ids, fn) { ids.forEach(function (id) { $(id).addEventListener("input", fn); $(id).addEventListener("change", fn); }); document.addEventListener("DOMContentLoaded", fn); }
  function bracketTax(taxable, table) { var tax = 0, prev = 0; for (var i = 0; i < table.length; i++) { if (taxable > prev) tax += (Math.min(taxable, table[i][0]) - prev) * table[i][1]; prev = table[i][0]; } return tax; }
  function fillStates(sel) { Object.keys(D.states).sort(function (a, b) { return D.states[a][0] < D.states[b][0] ? -1 : 1; }).forEach(function (k) { var o = document.createElement("option"); o.value = k; o.textContent = D.states[k][0]; sel.appendChild(o); }); sel.value = "TX"; }
  function stateRate() { return $("stateRate").value === "" ? D.states[$("state").value][1] : num($("stateRate").value, 0, 20); }
  function render() {
    var sal = num($("salary").value, 0, 1e9), bonus = num($("bonus").value, 0, 1e9), st = $("status").value, sr = stateRate();
    var flat = Math.min(bonus, 1e6) * 0.22 + Math.max(0, bonus - 1e6) * 0.37;
    var f = D.fica, tot = sal + bonus;
    var ss = (Math.min(tot, f.ssWageBase) - Math.min(sal, f.ssWageBase)) * f.ssRate;
    var med = bonus * f.medicareRate;
    var thr = f.addlThreshold[st], addl = (Math.max(0, tot - thr) - Math.max(0, sal - thr)) * f.addlMedicareRate;
    var state = bonus * sr / 100;
    var withheld = flat + ss + med + addl + state, net = bonus - withheld;
    var sd = D.standardDeduction[st], tbl = D.brackets[st];
    var actual = bracketTax(Math.max(0, tot - sd), tbl) - bracketTax(Math.max(0, sal - sd), tbl);
    $("result").textContent = money.format(net);
    $("resultNote").textContent = "estimated bonus you take home after withholding (" + dec.format(bonus ? net / bonus * 100 : 0) + "% of the bonus)";
    var tb = $("rows"); tb.textContent = "";
    row(tb, "Gross bonus", money.format(bonus));
    row(tb, "Federal withholding (flat 22%)", "-" + money.format(flat));
    row(tb, "Social Security", "-" + money.format(ss));
    row(tb, "Medicare", "-" + money.format(med + addl));
    row(tb, "State income tax (estimate)", "-" + money.format(state));
    row(tb, "Bonus take-home", money.format(net), "total");
    row(tb, "Federal tax your bonus really adds at filing", money.format(actual));
    var diff = flat - actual;
    row(tb, diff >= 0 ? "Federal over-withheld (refund at filing)" : "Federal under-withheld (you may owe)", money.format(Math.abs(diff)));
  }
  fillStates($("state"));
  wire(["salary","bonus","status","state","stateRate"], render);
})();
