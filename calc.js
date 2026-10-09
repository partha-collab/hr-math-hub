(function () {
  "use strict";
  var D = window.TAXDATA;
  var $ = function (id) { return document.getElementById(id); };
  var PERIODS = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
  var LABEL = { weekly: "weekly", biweekly: "every 2 weeks", semimonthly: "twice a month", monthly: "monthly" };
  var fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function num(v, min, max) {
    var n = parseFloat(v);
    if (!isFinite(n) || n < min) return min;
    return n > max ? max : n;
  }
  function bracketTax(taxable, table) {
    var tax = 0, prev = 0;
    for (var i = 0; i < table.length; i++) {
      if (taxable > prev) tax += (Math.min(taxable, table[i][0]) - prev) * table[i][1];
      prev = table[i][0];
    }
    return tax;
  }
  function compute(o) {
    var gross = o.gross, pre = gross * o.pretaxPct / 100;
    var fedTaxable = Math.max(0, gross - pre - D.standardDeduction[o.status]);
    var fed = bracketTax(fedTaxable, D.brackets[o.status]);
    var f = D.fica;
    var ficaWages = gross - o.fica125;
    var ss = Math.min(ficaWages, f.ssWageBase) * f.ssRate;
    var med = ficaWages * f.medicareRate;
    var addl = Math.max(0, ficaWages - f.addlThreshold[o.status]) * f.addlMedicareRate;
    var state = o.stateRate === null ? window.STATETAX.tax(o.stateCode, o.status, gross, pre, fed) : Math.max(0, gross - pre) * o.stateRate / 100;
    var net = gross - pre - fed - ss - med - addl - state;
    return { gross: gross, pre: pre, fed: fed, ss: ss, med: med + addl, state: state, net: net, fedTaxable: fedTaxable };
  }
  function addRow(tb, label, a, p, cls) {
    var tr = document.createElement("tr");
    if (cls) tr.className = cls;
    [label, fmt.format(p), fmt.format(a)].forEach(function (t, i) {
      var td = document.createElement(i ? "td" : "th");
      td.textContent = t; if (i === 0) td.scope = "row"; tr.appendChild(td);
    });
    tb.appendChild(tr);
  }
  function render() {
    var type = $("paytype").value;
    var annualGross = type === "hourly"
      ? num($("amount").value, 0, 10000) * num($("hours").value, 0, 168) * 52
      : num($("amount").value, 0, 100000000);
    var n = PERIODS[$("freq").value];
    var st = $("state").value;
    var rate = $("stateRate").value === "" ? null : num($("stateRate").value, 0, 20);
    var r = compute({
      gross: annualGross, status: $("status").value, pretaxPct: num($("pretax").value, 0, 100),
      fica125: 0, stateRate: rate, stateCode: st
    });
    $("takehome").textContent = fmt.format(r.net / n);
    $("takehomeNote").textContent = "estimated take-home per paycheck, paid " + LABEL[$("freq").value] + " (" + fmt.format(r.net) + " per year)";
    var tb = $("rows"); tb.textContent = "";
    addRow(tb, "Gross pay", r.gross, r.gross / n);
    if (r.pre) addRow(tb, "Pre-tax retirement (401k)", -r.pre, -r.pre / n);
    addRow(tb, "Federal income tax", -r.fed, -r.fed / n);
    addRow(tb, "Social Security", -r.ss, -r.ss / n);
    addRow(tb, "Medicare", -r.med, -r.med / n);
    addRow(tb, "State income tax (estimate)", -r.state, -r.state / n);
    addRow(tb, "Take-home pay", r.net, r.net / n, "total");
    $("stateHint").textContent = window.STATETAX.noTax(st)
      ? D.states[st][0] + " has no state income tax on wages."
      : rate === null ? "Uses " + D.states[st][0] + "'s 2026 tax brackets and standard deduction. Local taxes and state payroll programs are not included."
      : "Using your own flat rate of " + rate + "% instead of the " + D.states[st][0] + " brackets.";
  }
  function init() {
    var sel = $("state");
    Object.keys(D.states).sort(function (a, b) { return D.states[a][0] < D.states[b][0] ? -1 : 1; })
      .forEach(function (k) { var o = document.createElement("option"); o.value = k; o.textContent = D.states[k][0]; sel.appendChild(o); });
    sel.value = "TX";
    $("paytype").addEventListener("change", function () {
      var h = $("paytype").value === "hourly";
      $("hoursWrap").hidden = !h;
      $("amountLabel").textContent = h ? "Hourly rate ($)" : "Annual salary ($)";
      $("amount").value = h ? 25 : 60000; render();
    });
    ["amount","hours","freq","status","pretax","state","stateRate"].forEach(function (id) {
      $(id).addEventListener("input", render); $(id).addEventListener("change", render);
    });
    $("year").textContent = D.year;
    render();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
