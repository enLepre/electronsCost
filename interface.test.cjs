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
  const b=boot();b.change('reagent','h2-grey');assert.equal(b.get('chemical-price').children[1].textContent,'USD / e⁻');assert.equal(b.get('energy-price').children.length,0);assert.equal(b.get('graph-area').hidden,true);
  b.change('energy','eu');assert.equal(b.get('energy-price').children[0].textContent,'0.3');assert.equal(b.get('voltage-slider').disabled,false);assert.equal(b.get('comparison-status').textContent,'The chemical reagent is cheaper.');
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
test('all three pages and their scripts are included in deployment',()=>{
  const workflow=fs.readFileSync('.github/workflows/pages.yml','utf8');
  for(const page of ['index.html','details.html','assumptions.html']){
    assert.ok(workflow.includes(page));const html=fs.readFileSync(page,'utf8');assert.ok(!html.includes('Enrico Lepre'));
    for(const [,file] of html.matchAll(/<script defer src="([^"]+)"/g)){assert.ok(fs.existsSync(file));assert.ok(workflow.includes(file));}
  }
  const home=fs.readFileSync('index.html','utf8');assert.ok(home.includes('<h1>what electron is cheaper?</h1>'));assert.ok(!home.includes('id="inputs"'));assert.ok(!home.includes('id="method"'));
});
