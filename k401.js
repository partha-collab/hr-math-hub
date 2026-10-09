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
  function stateRate() { return $("stateRate").value === "" ? null : num($("stateRate").value, 0, 20); }
  var N = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
  function render() {
    var age = num($("age").value, 16, 100), sal = num($("salary").value, 0, 1e9), pct = num($("pct").value, 0, 100),
        mRate = num($("mrate").value, 0, 100), mCap = num($("mcap").value, 0, 100), bal = num($("bal").value, 0, 1e10),
        yrs = num($("years").value, 0, 70), ret = num($("ret").value, 0, 20) / 100, st = $("status").value, n = N[$("freq").value], sr = stateRate();
    var L = D.k401, limit = L.deferral + (age >= 60 && age <= 63 ? L.superCatchUp : age >= 50 ? L.catchUp : 0);
    var comp = Math.min(sal, L.compLimit), want = comp * pct / 100, contrib = Math.min(want, limit);
    var match = Math.min(contrib, comp * mCap / 100) * mRate / 100;
    var sd = D.standardDeduction[st], tbl = D.brackets[st];
    var fed0 = bracketTax(Math.max(0, sal - sd), tbl), fed1 = bracketTax(Math.max(0, sal - contrib - sd), tbl), fedSave = fed0 - fed1;
    var sc = $("state").value;
    var stSave = sr === null ? window.STATETAX.tax(sc, st, sal, 0, fed0) - window.STATETAX.tax(sc, st, sal, contrib, fed1) : contrib * sr / 100;
    var cost = contrib - fedSave - stSave;
    var yearly = contrib + match, fv = bal * Math.pow(1 + ret, yrs) + (ret === 0 ? yearly * yrs : yearly * (Math.pow(1 + ret, yrs) - 1) / ret);
    $("result").textContent = money.format(fv);
    $("resultNote").textContent = "estimated 401(k) balance in " + yrs + " years at " + dec.format(ret * 100) + "% a year (not adjusted for inflation)";
    var tb = $("rows"); tb.textContent = "";
    row(tb, "2026 limit for your age", money.format(limit));
    row(tb, "Your yearly contribution", money.format(contrib) + (want > limit ? " (capped at limit)" : ""));
    row(tb, "Employer match", money.format(match));
    row(tb, "Federal tax saved", money.format(fedSave));
    row(tb, "State tax saved (estimate)", money.format(stSave));
    row(tb, "Real cost to you, per year", money.format(cost));
    row(tb, "Lower take-home per paycheck (before tax savings)", money.format(contrib / n));
    row(tb, "Projected balance", money.format(fv), "total");
  }
  fillStates($("state"));
  wire(["age","salary","pct","mrate","mcap","bal","years","ret","status","freq","state","stateRate"], render);
})();
