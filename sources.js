'use strict';
// Render directly from calculator presets so displayed prices cannot drift.
const SourceCatalogue = (() => {
  const originalNames={
    'h2-grey':'Hydrogen Grey','h2-green':'Hydrogen Green','o2':'Oxygen bulk (europe)',
    'bh4-lab':'BH4- Lab depot','bh4-market':'BH4- Market','adn':'Adiponitrile market',
    'li':'Lithium (Merck)','nh3-green':'Ammonia (green, USA)','nh3-us':'Ammonia (grey, USA)','nh3-eu':'Ammonia (grey, Europe)'
  };
  const reagentRows=REAGENTS.filter(r=>r.row).map(r=>({...r,originalName:originalNames[r.id],cell:'Chemical!B'+r.row,
    reference:r.source?(r.id==='li'?'Merck / Sigma-Aldrich · Lithium':'IMARC Group · '+(r.id==='o2'?'Oxygen pricing report':r.id==='nh3-green'?'Green ammonia price trend':'Ammonia pricing report')):'No external reference recorded',
    sourceNote:r.source?'This link is recorded in the workbook. The exact quotation, date and price basis were not recorded; the displayed price has not been independently verified against the linked page.':'The workbook provides this price without a source URL or bibliographic reference. Its origin cannot be established from the file.'}));
  const energyRows=ENERGY.filter(e=>e.row).map(e=>({...e,cell:'Electricity!C'+e.row,
    basis:e.name.includes('VALCOE')?'Value-adjusted levelized cost (VALCOE)':e.name.includes('LCOE')?'Levelized cost of electricity (LCOE)':e.id==='sudan'?'Unverified estimate':'Market / industrial tariff label',
    sourceNote:e.id==='sudan'?'Workbook labels this entry “Sudan (GPT)”. No underlying publication, tariff schedule or URL is supplied.':e.row>=11?'The note at Electricity!K10 identifies LCOE and VALCOE estimates as originating from ChatGPT. No underlying report, model year, assumptions or URL is supplied.':'No provider, tariff schedule, publication or URL is recorded. The workbook gives only a broad market/industry label.'}));
  return {reagentRows,energyRows};
})();
function sourceElement(tag,text,className){const e=document.createElement(tag);if(text)e.textContent=text;if(className)e.className=className;return e;}
function sourceFact(list,label,value){list.append(sourceElement('dt',label),sourceElement('dd',value));}
for(const r of SourceCatalogue.reagentRows){
  const card=sourceElement('article',null,'source-entry');card.id='source-'+r.id;
  const heading=sourceElement('div',null,'source-heading');heading.append(sourceElement('h3',r.name),sourceElement('p',r.price.toLocaleString('en-US',{maximumFractionDigits:6})+' USD/kg','source-price'));card.append(heading);
  const facts=sourceElement('dl',null,'source-facts');sourceFact(facts,'Workbook entry',r.originalName);sourceFact(facts,'Price cell',r.cell);sourceFact(facts,'Date / grade / quantity','Not recorded');
  sourceFact(facts,'Molar mass',r.mass+' g/mol'+(r.legacyMass?' · workbook: '+r.legacyMass+' g/mol':'')+' · Chemical!C'+r.row);
  sourceFact(facts,'Electron equivalents',r.n+' mol e⁻/mol reagent'+(r.legacyN?' · workbook: '+r.legacyN:'')+' · Chemical!E'+r.row);
  card.append(facts);
  const reference=sourceElement('p',null,'source-reference');if(r.source){const a=sourceElement('a',r.reference);a.href=r.source;reference.append(a,document.createTextNode(' · Chemical!G'+r.row));}else reference.textContent=r.reference;
  card.append(reference,sourceElement('p',r.sourceNote),sourceElement('p',r.note,'caption'));document.getElementById('reagent-sources').append(card);
}
for(const e of SourceCatalogue.energyRows){
  const card=sourceElement('article',null,'source-entry');card.id='source-'+e.id;
  const heading=sourceElement('div',null,'source-heading');heading.append(sourceElement('h3',e.name),sourceElement('p',e.tariff+' USD/kWh','source-price'));card.append(heading);
  const facts=sourceElement('dl',null,'source-facts');sourceFact(facts,'Price cell',e.cell);sourceFact(facts,'Price category',e.basis);sourceFact(facts,'Date / external reference','Not recorded');card.append(facts,sourceElement('p',e.sourceNote));document.getElementById('electricity-sources').append(card);
}
