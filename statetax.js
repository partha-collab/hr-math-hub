// 2026 state income tax on wages. Source: Tax Foundation, "State Individual Income Tax Rates and Brackets, 2026"
// (as of Jan 1, 2026), with Georgia updated to 4.99% (H.B. 463, retroactive to Jan 1, 2026). Verify against each state's revenue department.
// Brackets are "from:rate%" pairs. Row: [name, singleBrackets, marriedBrackets ("=" means same as single), stdSingle, stdMarried, exemptSingle, exemptMarried, creditSingle, creditMarried, flags]
// flags: n = state does not exempt 401(k) deferrals from wages (PA, NJ); f = deducts federal income tax paid (AL, OR);
//        u = Utah credit phase-out; c = Connecticut exemption phase-out; w = Wisconsin standard deduction phase-out; p = flag unused
(function () {
  "use strict";
  var NONE = "none";
  function B(s) { return s.split(",").map(function (p) { var a = p.split(":"); return [+a[0], +a[1]]; }); }
  var S = {
    AL: ["Alabama", "0:2,500:4,3000:5", "0:2,1000:4,6000:5", 3000, 8500, 1500, 3000, 0, 0, "f"],
    AK: ["Alaska", NONE], AZ: ["Arizona", "0:2.5", "=", 8350, 16700, 0, 0, 0, 0, ""],
    AR: ["Arkansas", "0:2,4600:3.9", "=", 2470, 4940, 0, 0, 29, 58, ""],
    CA: ["California", "0:1,11079:2,26264:4,41452:6,57542:8,72724:9.3,371479:10.3,445771:11.3,742953:12.3,1000000:13.3",
         "0:1,22158:2,52528:4,82904:6,115084:8,145448:9.3,742958:10.3,891542:11.3,1000000:12.3,1485906:13.3", 5540, 11080, 0, 0, 153, 306, ""],
    CO: ["Colorado", "0:4.4", "=", 16100, 32200, 0, 0, 0, 0, ""],
    CT: ["Connecticut", "0:2,10000:4.5,50000:5.5,100000:6,200000:6.5,250000:6.9,500000:6.99",
         "0:2,20000:4.5,100000:5.5,200000:6,400000:6.5,500000:6.9,1000000:6.99", 0, 0, 15000, 24000, 0, 0, "c"],
    DE: ["Delaware", "0:0,2000:2.2,5000:3.9,10000:4.8,20000:5.2,25000:5.55,60000:6.6", "=", 3250, 6500, 0, 0, 110, 220, ""],
    FL: ["Florida", NONE],
    GA: ["Georgia", "0:4.99", "=", 12000, 24000, 0, 0, 0, 0, ""],
    HI: ["Hawaii", "0:1.4,9600:3.2,14400:5.5,19200:6.4,24000:6.8,36000:7.2,48000:7.6,125000:7.9,175000:8.25,225000:9,275000:10,325000:11",
         "0:1.4,19200:3.2,28800:5.5,38400:6.4,48000:6.8,72000:7.2,96000:7.6,250000:7.9,350000:8.25,450000:9,550000:10,650000:11", 4400, 8800, 1144, 2288, 0, 0, ""],
    ID: ["Idaho", "0:0,4811:5.3", "0:0,9622:5.3", 16100, 32200, 0, 0, 0, 0, ""],
    IL: ["Illinois", "0:4.95", "=", 0, 0, 2925, 5850, 0, 0, ""],
    IN: ["Indiana", "0:2.95", "=", 0, 0, 1000, 2000, 0, 0, ""],
    IA: ["Iowa", "0:3.8", "=", 16100, 32200, 0, 0, 40, 80, ""],
    KS: ["Kansas", "0:5.2,23000:5.58", "0:5.2,46000:5.58", 3605, 8240, 9160, 18320, 0, 0, ""],
    KY: ["Kentucky", "0:3.5", "=", 3360, 3360, 0, 0, 0, 0, ""],
    LA: ["Louisiana", "0:3", "=", 12875, 25750, 0, 0, 0, 0, ""],
    ME: ["Maine", "0:5.8,27399:6.75,64849:7.15", "0:5.8,54849:6.75,129749:7.15", 8350, 16700, 5300, 10600, 0, 0, ""],
    MD: ["Maryland", "0:2,1000:3,2000:4,3000:4.75,100000:5,125000:5.25,150000:5.5,250000:5.75,500000:6.25,1000000:6.5",
         "0:2,1000:3,2000:4,3000:4.75,150000:5,175000:5.25,225000:5.5,300000:5.75,600000:6.25,1200000:6.5", 3350, 6700, 3200, 6400, 0, 0, ""],
    MA: ["Massachusetts", "0:5,1083150:9", "=", 0, 0, 4400, 8800, 0, 0, ""],
    MI: ["Michigan", "0:4.25", "=", 0, 0, 5900, 11800, 0, 0, ""],
    MN: ["Minnesota", "0:5.35,33310:6.8,109430:7.85,203150:9.85", "0:5.35,48700:6.8,193480:7.85,337930:9.85", 15300, 30600, 0, 0, 0, 0, ""],
    MS: ["Mississippi", "0:0,10000:4", "=", 2300, 4600, 6000, 12000, 0, 0, ""],
    MO: ["Missouri", "0:0,1348:2,2696:2.5,4044:3,5392:3.5,6740:4,8088:4.5,9436:4.7", "=", 16100, 32200, 0, 0, 0, 0, ""],
    MT: ["Montana", "0:4.7,47500:5.65", "0:4.7,95000:5.65", 16100, 32200, 0, 0, 0, 0, ""],
    NE: ["Nebraska", "0:2.46,4130:3.51,24760:4.55", "0:2.46,8250:3.51,49530:4.55", 8850, 17700, 0, 0, 176, 352, ""],
    NV: ["Nevada", NONE], NH: ["New Hampshire", NONE],
    NJ: ["New Jersey", "0:1.4,20000:1.75,35000:3.5,40000:5.53,75000:6.37,500000:8.97,1000000:10.75",
         "0:1.4,20000:1.75,50000:2.45,70000:3.5,80000:5.53,150000:6.37,500000:8.97,1000000:10.75", 0, 0, 1000, 2000, 0, 0, "n"],
    NM: ["New Mexico", "0:1.5,5500:3.2,16500:4.3,33500:4.7,66500:4.9,210000:5.9", "0:1.5,8000:3.2,25000:4.3,50000:4.7,100000:4.9,315000:5.9", 16100, 32200, 0, 0, 0, 0, ""],
    NY: ["New York", "0:3.9,8500:4.4,11700:5.15,13900:5.4,80650:5.9,215400:6.85,1077550:9.65,5000000:10.3,25000000:10.9",
         "0:3.9,17150:4.4,23600:5.15,27900:5.4,161550:5.9,323200:6.85,2155350:9.65,5000000:10.3,25000000:10.9", 8000, 16050, 0, 0, 0, 0, ""],
    NC: ["North Carolina", "0:3.99", "=", 12750, 25500, 0, 0, 0, 0, ""],
    ND: ["North Dakota", "0:0,48475:1.95,244825:2.5", "0:0,80975:1.95,298075:2.5", 16100, 32200, 0, 0, 0, 0, ""],
    OH: ["Ohio", "0:0,26050:2.75", "=", 0, 0, 2400, 4800, 0, 0, ""],
    OK: ["Oklahoma", "0:0,3750:2.5,4900:3.5,7200:4.5", "0:0,7500:2.5,9800:3.5,14400:4.5", 6350, 12700, 1000, 2000, 0, 0, ""],
    OR: ["Oregon", "0:4.75,4550:6.75,11400:8.75,125000:9.9", "0:4.75,9100:6.75,22800:8.75,250000:9.9", 2910, 5820, 0, 0, 256, 512, "f"],
    PA: ["Pennsylvania", "0:3.07", "=", 0, 0, 0, 0, 0, 0, "n"],
    RI: ["Rhode Island", "0:3.75,82050:4.75,186450:5.99", "=", 11200, 22400, 5250, 10500, 0, 0, ""],
    SC: ["South Carolina", "0:0,3640:3,18230:6", "=", 8350, 16700, 0, 0, 0, 0, ""],
    SD: ["South Dakota", NONE], TN: ["Tennessee", NONE], TX: ["Texas", NONE],
    UT: ["Utah", "0:4.5", "=", 0, 0, 0, 0, 966, 1932, "u"],
    VT: ["Vermont", "0:3.35,49400:6.6,119700:7.6,249700:8.75", "0:3.35,82500:6.6,199450:7.6,304000:8.75", 7650, 15300, 5300, 10600, 0, 0, ""],
    VA: ["Virginia", "0:2,3000:3,5000:5,17000:5.75", "=", 8750, 17500, 930, 1860, 0, 0, ""],
    WA: ["Washington", NONE],
    WV: ["West Virginia", "0:2.22,10000:2.96,25000:3.33,40000:4.44,60000:4.82", "=", 0, 0, 2000, 4000, 0, 0, ""],
    WI: ["Wisconsin", "0:3.5,15110:4.4,51950:5.3,332720:7.65", "0:3.5,20150:4.4,69260:5.3,443630:7.65", 13960, 25840, 700, 1400, 0, 0, "w"],
    WY: ["Wyoming", NONE],
    DC: ["District of Columbia", "0:4,10000:6,40000:6.5,60000:8.5,250000:9.25,500000:9.75,1000000:10.75", "=", 16100, 32200, 0, 0, 0, 0, ""]
  };
  var T = {};
  Object.keys(S).forEach(function (k) {
    var r = S[k];
    if (r[1] === NONE) { T[k] = { name: r[0], none: true }; return; }
    var single = B(r[1]);
    T[k] = { name: r[0], none: false, single: single, married: r[2] === "=" ? single : B(r[2]),
      stdS: r[3], stdM: r[4], exS: r[5], exM: r[6], crS: r[7], crM: r[8], f: r[9] };
  });
  function bracketTax(x, br) {
    var tax = 0;
    for (var i = 0; i < br.length; i++) {
      var hi = i + 1 < br.length ? br[i + 1][0] : Infinity;
      if (x > br[i][0]) tax += (Math.min(x, hi) - br[i][0]) * br[i][1] / 100;
    }
    return tax;
  }
  function ramp(x, a, b) { return x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a); }
  // Annual state income tax on wages. status: single | married | head (head uses single brackets).
  // gross = annual wages, pre = pre-tax 401(k), fedTax = federal income tax (used where a state deducts it).
  function tax(code, status, gross, pre, fedTax) {
    var s = T[code]; if (!s || s.none) return 0;
    var m = status === "married", f = s.f || "";
    var wages = Math.max(0, f.indexOf("n") >= 0 ? gross : gross - pre);
    var std = m ? s.stdM : s.stdS;
    if (!m && status === "head" && std === 16100) std = 24150;
    if (f.indexOf("w") >= 0) std = Math.max(0, std - (m ? 0.19778 * Math.max(0, wages - 27630) : 0.12 * Math.max(0, wages - 19070)));
    var ex = m ? s.exM : s.exS;
    if (f.indexOf("c") >= 0) ex = ex * (1 - ramp(wages, m ? 48000 : 30000, m ? 72000 : 45000));
    var ded = std + ex;
    if (f.indexOf("f") >= 0) {
      var cap = s.name === "Oregon" ? 8250 * (1 - ramp(wages, m ? 250000 : 125000, m ? 290000 : 145000)) : Infinity;
      ded += Math.min(Math.max(0, fedTax || 0), cap);
    }
    var t = bracketTax(Math.max(0, wages - ded), m ? s.married : s.single);
    var cr = m ? s.crM : s.crS;
    if (f.indexOf("u") >= 0) cr = Math.max(0, cr - 0.013 * Math.max(0, wages - (m ? 36426 : 18213)));
    return Math.max(0, t - cr);
  }
  window.STATETAX = { tax: tax, names: T, noTax: function (c) { return !!(T[c] && T[c].none); } };
})();
