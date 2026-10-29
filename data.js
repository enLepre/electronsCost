/* Transcribed from Cost of electricity.xlsx, Chemical and Electricity sheets.
   Prices are undated workbook examples, not live quotations. */
const REAGENTS = [
  {id:'h2-grey',name:'Hydrogen · grey',type:'Reducing agent',price:1,mass:2,n:2,row:4,note:'H₂ → 2 H⁺ + 2 e⁻. Workbook molar mass retained (2 g/mol).'},
  {id:'h2-green',name:'Hydrogen · green',type:'Reducing agent',price:4,mass:2,n:2,row:5,note:'H₂ → 2 H⁺ + 2 e⁻. Workbook molar mass retained (2 g/mol).'},
  {id:'o2',name:'Oxygen · bulk, Europe',type:'Oxidizing agent',price:.15,mass:31.9988,n:4,legacyMass:16,row:3,note:'O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O. O₂ mass corrected from the workbook’s 16 to 31.9988 g/mol. A peroxide pathway would use 2 e⁻ instead.',source:'https://www.imarcgroup.com/oxygen-pricing-report'},
  {id:'bh4-lab',name:'Sodium borohydride · lab',type:'Reducing agent',price:673,mass:37.83,n:8,row:6,note:'NaBH₄ mass basis, as implied by 37.83 g/mol in the workbook. Eight electron equivalents assumes full utilization; adjust for your reaction.'},
  {id:'bh4-market',name:'Sodium borohydride · market',type:'Reducing agent',price:50,mass:37.83,n:8,row:7,note:'NaBH₄ mass basis. Eight electron equivalents assumes full utilization; adjust for your reaction.'},
  {id:'adn',name:'Adiponitrile · workbook assumption',type:'Reaction unspecified',price:.6,mass:108.14,n:6,row:8,note:'The workbook specifies 6 e⁻ but no reaction. This value is unverified. Define the transformation and edit electron equivalents before interpreting this comparison.'},
  {id:'li',name:'Lithium · Merck',type:'Reducing agent',price:3320,mass:6.94,n:1,row:9,note:'Li → Li⁺ + e⁻. Workbook supplier price; package size and quotation date are unspecified.',source:'https://www.sigmaaldrich.com/CH/en/substance/lithium6947439932'},
  {id:'nh3-green',name:'Ammonia · green, USA',type:'Reducing agent',price:.815,mass:17.03,n:3,legacyN:6,row:10,note:'2 NH₃ → N₂ + 6 H⁺ + 6 e⁻: 3 e⁻ per NH₃ for oxidation to nitrogen. Workbook uses 6 per NH₃. Other products require a different electron count.',source:'https://www.imarcgroup.com/green-ammonia-price-trend'},
  {id:'nh3-us',name:'Ammonia · grey, USA',type:'Reducing agent',price:.51,mass:17.03,n:3,legacyN:6,row:11,note:'2 NH₃ → N₂ + 6 H⁺ + 6 e⁻: 3 e⁻ per NH₃ for oxidation to nitrogen. Workbook uses 6 per NH₃.',source:'https://www.imarcgroup.com/ammonia-pricing-report'},
  {id:'nh3-eu',name:'Ammonia · grey, Europe',type:'Reducing agent',price:.65,mass:17.03,n:3,legacyN:6,row:12,note:'2 NH₃ → N₂ + 6 H⁺ + 6 e⁻: 3 e⁻ per NH₃ for oxidation to nitrogen. Workbook uses 6 per NH₃.',source:'https://www.imarcgroup.com/ammonia-pricing-report'},
  {id:'custom',name:'Custom reagent',type:'User-defined reaction',price:1,mass:100,n:2,note:'Enter your purchase price, molar mass and reaction-specific electron equivalents. All prices must use the same currency.'}
];
const ENERGY = [
  ['eu','EU market',.3,3],['industry','EU industry',.06,5],['us','US market',.1,9],
  ['solar','Solar · LCOE',.04,11],['solar-value','Solar · VALCOE',.06,13],['wind','Onshore wind · LCOE',.04,15],
  ['sudan','Sudan · unverified workbook estimate',.008,16],['gas','Gas · LCOE',.07,17],['coal','Coal · LCOE',.088,18],
  ['coal-value','Coal · VALCOE',.095,19],['nuclear-new','New nuclear · LCOE',.141,20],
  ['nuclear-value','New nuclear · VALCOE',.105,21],['nuclear-old','Existing nuclear · LCOE',.032,22],['custom','Custom electricity tariff',.1,null]
].map(([id,name,tariff,row])=>({id,name,tariff,row}));
