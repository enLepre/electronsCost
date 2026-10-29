const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

// DOM-free interaction harness: verifies state changes, not visual rendering.
function boot(saved=null,hash=''){
  class Element{
    constructor(){this.value='';this.children=[];this.listeners={};this.attributes={};this.hidden=false;this.textContent='';}
    append(...x){this.children.push(...x);}
    replaceChildren(...x){this.children=x;}
    addEventListener(event,fn){this.listeners[event]=fn;}
    setAttribute(k,v){this.attributes[k]=v;}
  }
  const elements={};
  const get=id=>elements[id]??=new Element();
  const storage=new Map(saved?[['electron-cost-scenario',JSON.stringify(saved)]]:[]);
  const sessionStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
  const context=vm.createContext({document:{getElementById:get,createElement:()=>new Element(),querySelectorAll:()=>[],documentElement:{dataset:{}}},location:{hash,href:'https://example.test/electronsCost/index.html',pathname:'/electronsCost/index.html'},sessionStorage,localStorage:{getItem:()=>null,setItem:()=>{}},window:{addEventListener:()=>{}},URL});
  for(const file of ['model.js','data.js','navigation.js','compare.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
  return {get,storage,context,change:(id,value,event='change')=>{get(id).value=value;get(id).listeners[event]();}};
}
test('initial view has no chosen sources or fabricated prices',()=>{
  const {get}=boot();assert.equal(get('reagent').value,'');assert.equal(get('energy').value,'');assert.equal(get('chemical-price').children.length,0);assert.equal(get('energy-price').children.length,0);assert.equal(get('voltage-slider').disabled,true);assert.equal(get('graph-area').hidden,true);
});
test('each choice reveals only its own price; slider changes the winner and graph',()=>{
  const b=boot();b.change('reagent','h2-grey');assert.equal(b.get('chemical-price').children[1].textContent,'USD / mol e⁻');assert.equal(b.get('energy-price').children.length,0);assert.equal(b.get('graph-area').hidden,true);
  b.change('energy','eu');assert.equal(b.get('energy-price').children[0].textContent,'0.3108');assert.equal(b.get('voltage-slider').disabled,false);assert.equal(b.get('comparison-status').textContent,'The chemical reagent is cheaper.');
  const previous=b.get('comparison-chart').innerHTML;b.change('voltage-slider','0.01','input');assert.equal(b.get('comparison-status').textContent,'Electricity is cheaper.');assert.notEqual(b.get('comparison-chart').innerHTML,previous);
  const stored=JSON.parse(b.storage.get('electron-cost-scenario'));assert.equal(stored.voltage,.01);
  const restored=boot(stored);assert.equal(restored.get('reagent').value,'h2-grey');assert.equal(restored.get('energy').value,'eu');assert.equal(restored.get('voltage-value').textContent,'0.01 V');
});
test('shared custom input and efficiency values survive navigation',()=>{
  const s={reagent:'custom',energy:'custom',price:8,mass:50,electrons:4,utilization:60,tariff:.22,voltage:2,faradaic:75,supply:90,amount:100,legacy:false,plotMax:10};
  const b=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)));
  assert.equal(b.get('energy-price').children[0].textContent,'0.22');assert.equal(b.get('voltage-slider').max,10);assert.deepEqual(JSON.parse(b.storage.get('electron-cost-scenario')),s);
});
test('invalid shared state leaves the initial selectors empty',()=>{
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
    const header=html.match(/<header[\s\S]*?<\/header>/)[0];
    assert.ok(header.includes('sources.html'));assert.ok(!header.includes('github.com'));
    assert.ok(html.match(/<footer[\s\S]*?github.com[\s\S]*?<\/footer>/));
    assert.ok(header.includes('class="theme-moon"'));assert.ok(header.includes('class="theme-sun"'));
  }
  const home=fs.readFileSync('index.html','utf8');assert.ok(home.includes('<h1>what electron is cheaper?</h1>'));assert.ok(!home.includes('id="inputs"'));assert.ok(!home.includes('id="method"'));
});
test('theme icon retains accessible action labels and toggles both ways',()=>{
  const b=boot();const theme=b.get('theme');assert.equal(theme.attributes['aria-label'],'Switch to dark mode');
  theme.listeners.click();assert.equal(theme.attributes['aria-label'],'Switch to light mode');assert.equal(theme.attributes['aria-pressed'],'true');
  theme.listeners.click();assert.equal(theme.attributes['aria-label'],'Switch to dark mode');assert.equal(theme.attributes['aria-pressed'],'false');
});
test('source catalogue has referenced defaults, no retired costs, and working search filters',()=>{
  const b=boot();vm.runInContext(fs.readFileSync('sources.js','utf8'),b.context);
  const rows=JSON.parse(vm.runInContext('JSON.stringify(SourceCatalogue.rows)',b.context));
  assert.equal(rows.filter(r=>r.status==='Referenced').length,15);
  assert.equal(rows.filter(r=>r.status==='Unavailable').length,0);
  assert.ok(rows.filter(r=>r.status==='Referenced').every(r=>r.references.length&&r.source.startsWith('https://')&&r.period&&r.reported&&r.conversion));
  assert.ok(rows.filter(r=>r.status==='Unavailable').every(r=>r.value===undefined));
  assert.equal(rows.find(r=>r.id==='solar').value,.043);
  assert.equal(rows.find(r=>r.id==='bh4-lab').value,265/.5);
  assert.equal(rows.find(r=>r.id==='li').value,101.5/.025);
  assert.equal(rows.find(r=>r.id==='eu').value,.2872*1.082);
  assert.equal(rows.find(r=>r.id==='gas').value,(48+109)/2/1000);
  b.change('source-search',' IRENA 2024 ','input');assert.equal(b.get('source-rows').children.length,2);
  b.change('source-kind','Reagent');assert.equal(b.get('source-rows').children.length,0);assert.equal(b.get('source-empty').hidden,false);
  b.change('source-search','','input');assert.equal(b.get('source-rows').children.length,7);
  b.change('source-kind','');assert.equal(b.get('source-rows').children.length,15);
});
test('retired shared presets restore as custom without changing the numbers',()=>{
 const s={reagent:'adn',energy:'sudan',price:.6,mass:108.14,electrons:6,utilization:100,tariff:.008,voltage:1,faradaic:100,supply:100,amount:1,legacy:false,plotMax:5};
 const b=boot(null,'#scenario='+encodeURIComponent(JSON.stringify(s)));
 const saved=JSON.parse(b.storage.get('electron-cost-scenario'));
 assert.equal(saved.reagent,'custom');assert.equal(saved.energy,'custom');assert.equal(saved.price,.6);assert.equal(saved.tariff,.008);
 assert.equal(b.get('reagent').children.some(o=>o.value==='adn'),false);
});
test('choosing custom electricity fills the other side with current sourced defaults',()=>{
 const b=boot();b.change('energy','custom');
 const saved=JSON.parse(b.storage.get('electron-cost-scenario'));
 assert.equal(saved.reagent,'h2-grey');assert.equal(saved.price,1.5);assert.equal(saved.tariff,.1);
});

test('compare graph and reagent output use costs per mole',()=>{
 const b=boot();b.change('reagent','h2-grey');b.change('energy','eu');
 assert.equal(b.get('chemical-price').children[0].textContent,'0.0015');
 const graph=b.get('comparison-chart').innerHTML;
 assert.ok(graph.includes('dollars per mole of useful electron equivalents'));
 assert.ok(graph.includes('0.0015'));
 assert.ok(!graph.includes('e-27'));
 assert.ok(fs.readFileSync('index.html','utf8').includes('USD/mol e⁻'));
});
