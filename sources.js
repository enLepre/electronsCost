'use strict';
// The catalogue and calculator share one source of truth.
const SourceCatalogue = (() => {
  const rows=[...REAGENTS.filter(r=>r.source).map(r=>({...r,category:'Reagent',status:'Referenced',value:r.price,unit:'USD/kg'})),...ENERGY.filter(e=>e.source).map(e=>({...e,category:'Electricity',status:'Referenced',value:e.tariff,unit:'USD/kWh'})),...RETIRED_SOURCES];
  function search(query='',category='',status=''){
    const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter(r=>(!category||r.category===category)&&(!status||r.status===status)&&words.every(w=>JSON.stringify(r).toLocaleLowerCase().includes(w)));
  }
  return {rows,search};
})();
function sourceElement(tag,text,className){const e=document.createElement(tag);if(text)e.textContent=text;if(className)e.className=className;return e;}
function renderSources(){
  const get=id=>document.getElementById(id);
  const rows=SourceCatalogue.search(get('source-search').value,get('source-kind').value,get('source-status').value);
  get('source-rows').replaceChildren(...rows.map(r=>{
    const row=sourceElement('tr');row.id='source-'+r.id;
    const name=sourceElement('th');name.setAttribute('scope','row');name.append(sourceElement('strong',r.name),sourceElement('small',r.category+' · '+r.status));
    const published=sourceElement('td');published.append(sourceElement('strong',r.reported),sourceElement('small',r.period),sourceElement('small',r.region),sourceElement('small',r.basis));
    const cost=sourceElement('td');
    if(r.status==='Referenced'){
      const a=sourceElement('a',r.value.toLocaleString('en-US',{maximumFractionDigits:7})+' '+r.unit);a.href=r.source;a.setAttribute('aria-label',r.name+': '+r.value+' '+r.unit+'; open reference');cost.append(a);
    }else cost.append(sourceElement('span','Not used'));
    const evidence=sourceElement('td');for(const ref of r.references){const a=sourceElement('a',ref.label);a.href=ref.url;evidence.append(a);}
    evidence.append(sourceElement('p',r.conversion));
    row.append(name,published,cost,evidence);return row;
  }));
  get('source-count').textContent=rows.length+' of '+SourceCatalogue.rows.length+' entries';get('source-empty').hidden=rows.length!==0;
}
for(const id of ['source-search','source-kind','source-status'])document.getElementById(id).addEventListener(id==='source-search'?'input':'change',renderSources);
renderSources();
