// All tax figures live here so they can be updated once a year.
// Federal + FICA: IRS Rev. Proc. 2025-32 and SSA 2026 announcements (tax year 2026).
// State names only: the real state brackets are in statetax.js.
window.TAXDATA = {
  year: 2026,
  standardDeduction: { single: 16100, married: 32200, head: 24150 },
  brackets: {
    single:  [[12400,0.10],[50400,0.12],[105700,0.22],[201775,0.24],[256225,0.32],[640600,0.35],[Infinity,0.37]],
    married: [[24800,0.10],[100800,0.12],[211400,0.22],[403550,0.24],[512450,0.32],[768700,0.35],[Infinity,0.37]],
    head:    [[17700,0.10],[67450,0.12],[105700,0.22],[201775,0.24],[256200,0.32],[640600,0.35],[Infinity,0.37]]
  },
  fica: { ssRate: 0.062, ssWageBase: 184500, medicareRate: 0.0145, addlMedicareRate: 0.009,
          addlThreshold: { single: 200000, married: 250000, head: 200000 } },
  k401: { deferral: 24500, catchUp: 8000, superCatchUp: 11250, compLimit: 360000 },
  // rate = estimated effective state income tax rate on wages (percent). approx:false only for no-tax states.
  states: {
    AL:["Alabama",4.0],AK:["Alaska",0],AZ:["Arizona",2.5],AR:["Arkansas",3.9],CA:["California",5.0],
    CO:["Colorado",4.4],CT:["Connecticut",4.5],DE:["Delaware",5.0],DC:["District of Columbia",6.5],
    FL:["Florida",0],GA:["Georgia",4.99],HI:["Hawaii",6.5],ID:["Idaho",5.3],IL:["Illinois",4.95],
    IN:["Indiana",2.95],IA:["Iowa",3.8],KS:["Kansas",4.8],KY:["Kentucky",3.5],LA:["Louisiana",3.0],
    ME:["Maine",5.5],MD:["Maryland",4.5],MA:["Massachusetts",5.0],MI:["Michigan",4.25],MN:["Minnesota",6.0],
    MS:["Mississippi",4.0],MO:["Missouri",4.2],MT:["Montana",5.0],NE:["Nebraska",4.5],NV:["Nevada",0],
    NH:["New Hampshire",0],NJ:["New Jersey",4.0],NM:["New Mexico",4.0],NY:["New York",5.0],
    NC:["North Carolina",3.99],ND:["North Dakota",1.5],OH:["Ohio",2.75],OK:["Oklahoma",4.0],
    OR:["Oregon",7.5],PA:["Pennsylvania",3.07],RI:["Rhode Island",4.5],SC:["South Carolina",5.0],
    SD:["South Dakota",0],TN:["Tennessee",0],TX:["Texas",0],UT:["Utah",4.5],VT:["Vermont",5.5],
    VA:["Virginia",5.0],WA:["Washington",0],WV:["West Virginia",4.0],WI:["Wisconsin",5.0],WY:["Wyoming",0]
  }
};
