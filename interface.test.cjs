const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

// DOM-free interaction harness: verifies state changes, not visual rendering.
function boot(saved=null,hash='',page='index.html'){
  class Element{
    constructor(){this.value='';this.children=[];this.listeners={};this.attributes={};this.hidden=false;this.textContent='';}
    get value(){return this._value;}
    set value(v){this._value=String(v);}
    append(...x){this.children.push(...x);}
    replaceChildren(...x){this.children=x;}
    addEventListener(event,fn){this.listeners[event]=fn;}
    setAttribute(k,v){this.attributes[k]=v;}
  }
  const elements={};
  const get=id=>elements[id]??=new Element();
  if(page==='details.html'){
    const html=fs.readFileSync(page,'utf8');
    get('inputs').reset=()=>{for(const [,id,value] of html.matchAll(/<input id="([^"]+)"[^>]*?value="([^"]+)"/g))get(id).value=value;get('legacy').checked=false;};
    // Browser forms expose descendants by id/name, which must not mask reset().
    for(const [,id] of html.matchAll(/<(?:button|input|select) id="([^"]+)"/g))get('inputs')[id]=get(id);
  }
  const storage=new Map(saved?[['electron-cost-scenario',JSON.stringify(saved)]]:[]);
  const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
  const context=vm.createContext({document:{getElementById:get,createElement:()=>new Element(),querySelectorAll:()=>[],documentElement:{dataset:{}}},location:{hash,href:'https://example.test/electronsCost/index.html',pathname:'/electronsCost/index.html',replace(url){this.replacedWith=url;}},history:{replaceState(a,b,url){context.location.hash='';context.location.replacedWith=url;}},sessionStorage,localStorage:{getItem:()=>null,setItem:()=>{}},window:{addEventListener:()=>{}},URL});
  for(const file of ['model.js','data.js','navigation.js','chart.js',page==='details.html'?'app.js':'compare.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
  return {get,storage,context,change:(id,value,event='change')=>{get(id).value=value;get(id).listeners[event]();}};
}
function readyBoot(saved=null,hash='',page='index.html'){
 const b=boot(saved,hash,page);
 if(page==='index.html'&&!saved&&!hash){b.change('reagent','h2-green');b.change('energy','solar');}
 return b;
}

test('fresh Compare reveals costs independently and comparison only after both selections',()=>{
 for(const first of ['reagent','energy']){
  const b=boot();assert.equal(b.get('reagent').value,'');assert.equal(b.get('energy').value,'');assert.equal(b.get('voltage-comparison').hidden,true);
  assert.equal(b.get('chemical-price').hidden,true);assert.equal(b.get('energy-price').hidden,true);assert.equal(b.get('metric-control').hidden,true);
  b.change(first,first==='reagent'?'h2-green':'solar');
  assert.equal(b.get(first==='reagent'?'chemical-price':'energy-price').hidden,false);assert.equal(b.get(first==='reagent'?'energy-price':'chemical-price').hidden,true);
  assert.equal(b.get('voltage-comparison').hidden,true);assert.equal(b.get('comparison-status').textContent,'');assert.equal(b.storage.has('electron-cost-scenario'),false);
  b.change(first==='reagent'?'energy':'reagent',first==='reagent'?'solar':'h2-green');assert.equal(b.get('voltage-comparison').hidden,false);assert.equal(b.get('graph-area').hidden,false);
 }
 const html=fs.readFileSync('index.html','utf8');assert.ok(html.indexOf('id="comparison-status"')<html.indexOf('class="voltage-heading"'));assert.ok(html.indexOf('id="voltage-slider"')<html.indexOf('id="graph-area"'));assert.ok(!html.includes('id="metric-note"'));
});

test('selected green hydrogen and solar show comparable populated results',()=>{
  const {get}=readyBoot();assert.equal(get('reagent').value,'h2-green');assert.equal(get('energy').value,'solar');
  for(const id of ['chemical-price','energy-price'])assert.equal(get(id).children[1].textContent,'USD / mol e⁻');
  assert.equal(get('chemical-price').children[0].textContent,'0.005');assert.equal(get('energy-price').children[0].textContent,'0.001152');
  assert.equal(get('tariff-price').textContent,'0.043 USD / kWh');assert.equal(get('voltage-slider').disabled,false);assert.equal(get('graph-area').hidden,false);
  assert.match(get('comparison-status').textContent,/Electricity is ~4.3× cheaper at 1 V · break-even at 4.3 V/);
  assert.ok(!fs.readFileSync('index.html','utf8').includes('basis-warning')); 
});
test('source choices and voltage change result and preserve scenario',()=>{
  const b=readyBoot();b.change('reagent','h2-grey');b.change('energy','eu');
  assert.match(b.get('comparison-status').textContent,/chemical reagent.*cheaper/);
  const previous=b.get('comparison-chart').innerHTML;b.change('voltage-slider','0.01','input');
  assert.match(b.get('comparison-status').textContent,/Electricity.*cheaper/);assert.notEqual(b.get('comparison-chart').innerHTML,previous);
  const stored=JSON.parse(b.storage.get('electron-cost-scenario'));assert.equal(stored.voltage,.01);
  const restored=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(stored)));assert.equal(restored.get('reagent').value,'h2-grey');assert.equal(restored.get('energy').value,'eu');assert.equal(restored.get('voltage-value').textContent,'0.01 V');
});
test('Details direct load initializes presets, results, chart and ranking',()=>{
  const b=boot(null,'','details.html');
  for(const [id,value] of Object.entries({price:'1.5',mass:'2',electrons:'2',tariff:String(.2872*1.082)}))assert.equal(b.get(id).value,value);
  assert.equal(b.get('error').hidden,true);assert.equal(b.get('results').hidden,false);assert.equal(b.get('ranking').children.length,16);
  assert.match(b.get('chart').innerHTML,/break-even/);
  b.get('price').value='99';b.get('inputs').reset(); // native reset remains callable
});
test('Details restores edited shared scenarios after initializing defaults',()=>{
  const s={reagent:'custom',energy:'custom',price:8,mass:50,electrons:4,utilization:60,tariff:.22,voltage:2,faradaic:75,supply:90,amount:100,legacy:false,plotMax:10};
  const b=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)),'details.html');
  assert.equal(b.get('price').value,'8');assert.equal(b.get('tariff').value,'0.22');assert.equal(b.get('error').hidden,true);
  assert.deepEqual(JSON.parse(b.storage.get('electron-cost-scenario')),s);
});
test('max V updates and clamps voltage; invalid ranges do not corrupt the scenario',()=>{
  const b=readyBoot();b.change('max-voltage','0.5','input');assert.equal(b.get('voltage-slider').max,.5);assert.equal(b.get('voltage-value').textContent,'0.5 V');
  b.change('max-voltage','','input');assert.equal(b.get('simple-error').hidden,false);assert.equal(JSON.parse(b.storage.get('electron-cost-scenario')).plotMax,.5);
  b.change('max-voltage','10','input');assert.equal(b.get('simple-error').hidden,true);assert.equal(b.get('voltage-slider').max,10);
});
test('zero-cost comparisons avoid infinite ratios and label zero crossings',()=>{
  const b=readyBoot();b.change('voltage-slider','0','input');assert.match(b.get('comparison-status').textContent,/Electricity has zero cost/);
  const s=JSON.parse(b.storage.get('electron-cost-scenario'));s.tariff=0;
  assert.match(boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s))).get('comparison-status').textContent,/no unique break-even/);
  s.price=0;s.tariff=.043;s.voltage=1;
  assert.match(boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s))).get('comparison-status').textContent,/chemical reagent has zero cost.*break-even at 0 V/);
});

test('shared custom input and efficiency values survive navigation',()=>{
  const s={reagent:'custom',energy:'custom',price:8,mass:50,electrons:4,utilization:60,tariff:.22,voltage:2,faradaic:75,supply:90,amount:100,legacy:false,plotMax:10};
  const b=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)));
  assert.equal(b.get('tariff-price').textContent,'0.22 USD / kWh');assert.equal(b.get('voltage-slider').max,10);assert.deepEqual(JSON.parse(b.storage.get('electron-cost-scenario')),s);
});
test('invalid shared state shows useful defaults and an error',()=>{
  const b=boot(null,'#scenario=invalid');assert.equal(b.get('reagent').value,'');assert.equal(b.get('simple-error').hidden,false);assert.equal(b.get('graph-area').hidden,true);
});
test('all four pages and their scripts are included in deployment',()=>{
  const workflow=fs.readFileSync('.github/workflows/pages.yml','utf8');
  for(const page of ['index.html','details.html','assumptions.html','sources.html']){
    assert.ok(workflow.includes(page));const html=fs.readFileSync(page,'utf8');assert.ok(!html.includes('Enrico Lepre'));
    for(const [,file] of html.matchAll(/<script defer src="([^"]+)"/g)){
      if(file==='https://cdn.jsdelivr.net/npm/katex@0.19.1/dist/katex.min.js'){assert.ok(html.includes('sha384-a1WQdjRj162i159OYq041X6I4K8NenkrI09LlPmiHg0YOb7CR+wJOraXwK9abpnE'));continue;}
      const asset=file.split('?')[0];assert.ok(fs.existsSync(asset));assert.ok(workflow.includes(asset));
    }
    const header=html.match(/<nav id="main-menu"[\s\S]*?<\/nav>/)[0];
    assert.ok(header.includes('sources.html'));assert.ok(!header.includes('github.com'));
    assert.ok(html.match(/<footer[\s\S]*?github.com[\s\S]*?<\/footer>/));
    assert.ok(header.includes('class="theme-moon"'));assert.ok(header.includes('class="theme-sun"'));
  }
  const home=fs.readFileSync('index.html','utf8');assert.ok(home.includes('<h1>Which electron is cheaper?</h1>'));assert.ok(!home.includes('id="inputs"'));assert.ok(!home.includes('id="method"'));
});
test('theme icon retains accessible action labels and toggles both ways',()=>{
  const b=readyBoot();const theme=b.get('theme');assert.equal(theme.attributes['aria-label'],'Switch to dark mode');
  theme.listeners.click();assert.equal(theme.attributes['aria-label'],'Switch to light mode');assert.equal(theme.attributes['aria-pressed'],'true');
  theme.listeners.click();assert.equal(theme.attributes['aria-label'],'Switch to dark mode');assert.equal(theme.attributes['aria-pressed'],'false');
});
test('source catalogue has referenced defaults, no retired costs, and working search filters',()=>{
  const b=readyBoot();vm.runInContext(fs.readFileSync('sources.js','utf8'),b.context);
  const rows=JSON.parse(vm.runInContext('JSON.stringify(SourceCatalogue.rows)',b.context));
  assert.equal(rows.filter(r=>r.status==='Referenced').length,37);
  assert.equal(rows.filter(r=>r.status==='Unavailable').length,0);
  assert.ok(rows.filter(r=>r.status==='Referenced').every(r=>r.references.length&&r.source.startsWith('https://')&&r.period&&r.reported&&r.conversion));
  assert.ok(rows.filter(r=>r.status==='Unavailable').every(r=>r.value===undefined));
  assert.equal(rows.find(r=>r.id==='solar').value,.043);
  assert.equal(rows.find(r=>r.id==='bh4-lab').value,265/.5);
  assert.equal(rows.find(r=>r.id==='li').value,101.5/.025);
  assert.equal(rows.find(r=>r.id==='eu').value,.2872*1.082);
  assert.equal(rows.find(r=>r.id==='gas').value,(48+109)/2/1000);
  b.change('source-search',' IRENA 2024 ','input');assert.equal(b.get('source-rows').children.length,7);
  b.change('source-kind','Reagent');assert.equal(b.get('source-rows').children.length,0);assert.equal(b.get('source-empty').hidden,false);
  b.change('source-search','','input');assert.equal(b.get('source-rows').children.length,14);
  b.change('source-kind','');assert.equal(b.get('source-rows').children.length,37);
});
test('retired shared presets restore as custom without changing the numbers',()=>{
 const s={reagent:'adn',energy:'sudan',price:.6,mass:108.14,electrons:6,utilization:100,tariff:.008,voltage:1,faradaic:100,supply:100,amount:1,legacy:false,plotMax:5};
 const b=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)));
 const saved=JSON.parse(b.storage.get('electron-cost-scenario'));
 assert.equal(saved.reagent,'custom');assert.equal(saved.energy,'custom');assert.equal(saved.price,.6);assert.equal(saved.tariff,.008);
 assert.equal(b.get('reagent').children.some(o=>o.value==='adn'),false);
});
test('choosing custom electricity fills the other side with current sourced defaults',()=>{
 const b=readyBoot();b.change('energy','custom');
 const saved=JSON.parse(b.storage.get('electron-cost-scenario'));
 assert.equal(saved.reagent,'h2-green');assert.equal(saved.price,5);assert.equal(saved.tariff,.1);
});

test('compare graph and reagent output use costs per mole',()=>{
 const b=readyBoot();b.change('reagent','h2-grey');b.change('energy','eu');
 assert.equal(b.get('chemical-price').children[0].textContent,'0.0015');
 const graph=b.get('comparison-chart').innerHTML;
 assert.ok(graph.includes('dollars per mole of useful electron equivalents'));
 assert.ok(graph.includes('0.0015'));assert.ok(graph.includes('chemical-label'));assert.ok(graph.includes('electric-label'));assert.ok(graph.includes('crossing-label'));
 assert.ok(!graph.includes('e-27'));
 assert.ok(fs.readFileSync('index.html','utf8').includes('USD/mol e⁻'));
});

test('added renewable presets select, calculate and persist on Compare and Details',()=>{
  for(const page of ['index.html','details.html']) {
    const b=readyBoot(null,'',page);
    for(const [id,tariff] of [['hydro',.057],['geothermal',.060],['wind-offshore',.079],['bioenergy',.087],['csp',.092]]) {
      if(page==='details.html') { b.get('energy').value=id;b.get('inputs').listeners.input({target:{id:'energy'}}); }
      else b.change('energy',id);
      const saved=JSON.parse(b.storage.get('electron-cost-scenario'));
      assert.equal(saved.energy,id);assert.equal(saved.tariff,tariff);
      const restored=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(saved)),page);assert.equal(restored.get('energy').value,id);
      if(page==='details.html') assert.equal(Number(b.get('tariff').value),tariff);
      else assert.equal(b.get('tariff-price').textContent,tariff+' USD / kWh');
    }
  }
});

test('VALCOE choices retain their sourced scenario and restore on both calculator pages',()=>{
 for(const page of ['index.html','details.html']){
  const b=readyBoot(null,'',page);
  for(const [id,value] of [['solar',.070],['wind',.060],['wind-offshore',.050],['gas',.115],['coal',.165]]){
   const preset=id+'-eu2030-valcoe';
   if(page==='details.html'){b.get('energy').value=preset;b.get('inputs').listeners.input({target:{id:'energy'}});}else b.change('energy',preset);
   const saved=JSON.parse(b.storage.get('electron-cost-scenario'));
   assert.equal(saved.energy,preset);assert.equal(saved.tariff,value);
   assert.equal(boot(null,'#scenario='+encodeURIComponent(JSON.stringify(saved)),page).get('energy').value,preset);
   const record=JSON.parse(vm.runInContext('JSON.stringify(ENERGY.find(e=>e.id==='+JSON.stringify(preset)+'))',b.context));
   assert.match(record.basis,/VALCOE; not a tariff/);assert.match(record.period,/2030 Stated Policies/);
  }
 }
});

test('metric checkbox switches prices and ranking without metric words in source names',()=>{
 for(const page of ['index.html','details.html']){
  const b=readyBoot(null,'',page);
  const select=id=>{if(page==='details.html'){b.get('energy').value=id;b.get('inputs').listeners.input({target:{id:'energy'}});}else b.change('energy',id);};
  const toggle=checked=>{b.get('valcoe').checked=checked;if(page==='details.html')b.get('inputs').listeners.input({target:{id:'valcoe'}});else b.get('valcoe').listeners.change();};
  select('solar');toggle(true);
  assert.equal(b.get('energy').value,'solar-eu2030-valcoe');
  let s=JSON.parse(b.storage.get('electron-cost-scenario'));assert.equal(s.tariff,.07);
  assert.equal(b.get('valcoe').checked,true);
  assert.ok(b.get('energy').children.every(o=>!/LCOE|VALCOE/.test(o.textContent)));
  assert.ok(!b.get('energy').children.some(o=>o.value==='hydro'||o.value==='eu'));
  if(page==='details.html')assert.equal(b.get('ranking').children.length,7);
  const restored=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)),page);assert.equal(restored.get('valcoe').checked,true);
  toggle(false);assert.equal(b.get('energy').value,'solar');
  assert.equal(JSON.parse(b.storage.get('electron-cost-scenario')).tariff,.043);
  select('hydro');toggle(true);assert.equal(b.get('energy').value,'solar-eu2030-valcoe');assert.match(b.get('metric-status').textContent,/no verified VALCOE/);
  toggle(false);select('nuclear-old');toggle(true);toggle(false);
  s=JSON.parse(b.storage.get('electron-cost-scenario'));assert.equal(boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)),page).get('energy').value,'nuclear-old');
 }
});
test('custom VALCOE values and metric survive sharing and restore',()=>{
 const s={reagent:'custom',energy:'custom',energyMetric:'valcoe',price:8,mass:50,electrons:4,utilization:60,tariff:.22,voltage:2,faradaic:75,supply:90,amount:100,legacy:false,plotMax:10};
 for(const page of ['index.html','details.html']){const b=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)),page);assert.equal(b.get('valcoe').checked,true);assert.equal(JSON.parse(b.storage.get('electron-cost-scenario')).tariff,.22);}
});

test('EU and China industrial tariffs select and restore with transparent provenance',()=>{
 for(const page of ['index.html','details.html']){
  const b=readyBoot(null,'',page);
  for(const [id,tariff] of [['eu-industry',.11],['china-industry',.07]]){
   assert.ok(b.get('energy').children.some(o=>o.value===id));
   if(page==='details.html'){b.get('energy').value=id;b.get('inputs').listeners.input({target:{id:'energy'}});}else b.change('energy',id);
   const s=JSON.parse(b.storage.get('electron-cost-scenario'));assert.equal(s.tariff,tariff);assert.equal(boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)),page).get('energy').value,id);
   const e=JSON.parse(vm.runInContext('JSON.stringify(ENERGY.find(e=>e.id==='+JSON.stringify(id)+'))',b.context));
   assert.match(e.reported,/rounded chart reading/);assert.match(e.period,/preliminary/);assert.match(e.basis,/tariff/);
  }
  b.get('valcoe').checked=true;
  if(page==='details.html')b.get('inputs').listeners.input({target:{id:'valcoe'}});else b.get('valcoe').listeners.change();
  assert.ok(!b.get('energy').children.some(o=>['eu-industry','china-industry'].includes(o.value)));
  assert.match(b.get('metric-status').textContent,/no verified VALCOE/);
 }
});

test('Start over clears saved and shared inputs and opens a clean default comparison',()=>{
 const s={reagent:'custom',energy:'custom',energyMetric:'valcoe',price:8,mass:50,electrons:4,utilization:60,tariff:.22,voltage:2,faradaic:75,supply:90,amount:100,legacy:false,plotMax:10};
 const b=boot(s,'#scenario='+encodeURIComponent(JSON.stringify(s)));
 b.get('start-over').listeners.click();
 assert.equal(b.storage.has('electron-cost-scenario'),false);
 assert.equal(b.context.location.replacedWith,'/electronsCost/index.html');
 assert.equal(b.get('reagent').value,'');assert.equal(b.get('energy').value,'');assert.equal(b.get('voltage-comparison').hidden,true);assert.equal(b.get('chemical-price').hidden,true);assert.equal(b.get('energy-price').hidden,true);
 const fresh=boot();assert.equal(fresh.get('reagent').value,'');assert.equal(fresh.get('energy').value,'');assert.equal(fresh.get('voltage-comparison').hidden,true);assert.equal(fresh.get('valcoe').checked,false);assert.equal(fresh.get('voltage-value').textContent,'1 V');assert.equal(fresh.get('max-voltage').value,'5');
});

test('share previews use a deployed 1200 by 630 image and the visible title and subtitle',()=>{
 const home=fs.readFileSync('index.html','utf8');
 const title=home.split('<h1>')[1].split('</h1>')[0],subtitle=home.split('<p class="subtitle">')[1].split('</p>')[0];
 for(const page of ['index.html','details.html','assumptions.html','sources.html']){
  const html=fs.readFileSync(page,'utf8');
  assert.ok(html.includes('property="og:title" content="'+title+'"'));
  assert.ok(html.includes('property="og:description" content="'+subtitle+'"'));
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  const url=new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
  assert.equal(url.origin,'https://enlepre.github.io');
  const asset=url.pathname.split('/').pop(),png=fs.readFileSync(asset);
  assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
  assert.ok(fs.readFileSync('.github/workflows/pages.yml','utf8').includes(asset));
 }
});

test('rhombus navigation opens, closes, and restores keyboard focus',()=>{
 const handlers={},attributes={};let open=false,focused=false;
 const toggle={setAttribute:(k,v)=>attributes[k]=v,addEventListener:(k,f)=>handlers['toggle:'+k]=f,focus:()=>{focused=true;}};
 const nav={inert:true,getBoundingClientRect:()=>({width:220,height:280})};
 const menu={style:{setProperty:()=>{}},querySelector:s=>s==='.menu-toggle'?toggle:nav,classList:{toggle:(k,v)=>open=v,contains:()=>open},contains:target=>target===toggle||target===nav,addEventListener:(k,f)=>handlers[k]=f};
 const header={inert:false};let scrolled=false;
 const document={querySelector:s=>s==='.site-header'?header:menu,body:{classList:{toggle:(k,v)=>scrolled=v}},addEventListener:(k,f)=>handlers[k]=f};
 const window={scrollY:0,addEventListener:(k,f)=>handlers[k]=f};
 vm.runInNewContext(fs.readFileSync('menu.js','utf8'),{document,window});
 handlers['toggle:click']();assert.equal(open,true);assert.equal(nav.inert,false);assert.equal(attributes['aria-expanded'],'true');
 handlers.keydown({key:'Escape'});assert.equal(open,false);assert.equal(nav.inert,true);assert.equal(focused,true);
 handlers['toggle:click']();handlers.pointerdown({target:{}});assert.equal(open,false);
 handlers['toggle:click']();handlers.focusout({relatedTarget:nav});assert.equal(open,true);
 handlers.focusout({relatedTarget:null});assert.equal(open,false);
 handlers['toggle:click']();window.scrollY=49;handlers.scroll();assert.equal(scrolled,true);assert.equal(header.inert,true);assert.equal(open,false);assert.equal(nav.inert,true);
 window.scrollY=48;handlers.scroll();assert.equal(scrolled,false);assert.equal(header.inert,false);
 window.scrollY=100;handlers.pageshow();assert.equal(scrolled,true);assert.equal(header.inert,true);
 window.scrollY=0;handlers.pageshow();assert.equal(scrolled,false);assert.equal(header.inert,false);
 for(const page of ['index.html','details.html','assumptions.html','sources.html']){
  const html=fs.readFileSync(page,'utf8');assert.ok(html.includes('aria-controls="main-menu"'));assert.match(html,/<header class="site-header shell">[\s\S]*?class="menu-outline"[\s\S]*?<\/header>/);assert.ok(html.includes('styles.css?v=20261118-personal-menu'));assert.ok(html.includes('src="menu.js?v=20261118-personal-menu"'));
 }
 assert.ok(fs.readFileSync('.github/workflows/pages.yml','utf8').includes('menu.js'));
});

test('ordinary opening ignores earlier saved selections',()=>{
 const chosen=readyBoot();const saved=JSON.parse(chosen.storage.get('electron-cost-scenario'));
 const fresh=boot(saved);assert.equal(fresh.get('reagent').value,'');assert.equal(fresh.get('energy').value,'');assert.equal(fresh.get('voltage-comparison').hidden,true);assert.equal(fresh.storage.has('electron-cost-scenario'),false);
});

test('reagent price per kilogram appears independently and clears on reset',()=>{
 const b=boot();assert.equal(b.get('reagent-mass-price').hidden,true);
 b.change('reagent','li');assert.equal(b.get('reagent-mass-price').textContent,'4,060 USD / kg');assert.equal(b.get('reagent-mass-price').hidden,false);assert.equal(b.get('voltage-comparison').hidden,true);
 b.change('reagent','h2-green');assert.equal(b.get('reagent-mass-price').textContent,'5 USD / kg');
 b.change('energy','solar');b.change('voltage-slider','2','input');assert.equal(b.get('reagent-mass-price').textContent,'5 USD / kg');
 b.get('start-over').listeners.click();assert.equal(b.get('reagent-mass-price').hidden,true);assert.equal(b.get('reagent-mass-price').textContent,'');
});
