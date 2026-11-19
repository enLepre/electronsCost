const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function setup(){
 const context=vm.createContext({URL,URLSearchParams});
 for(const file of ['model.js','data.js','share-links.js','result-image.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
 return vm.runInContext('({ShareLinks,ResultImage,REAGENTS,ENERGY})',context);
}
test('all source pairs have unique readable links that restore their IDs',()=>{
 const {ShareLinks,REAGENTS,ENERGY}=setup(),seen=new Set();
 for(const reagent of REAGENTS)for(const energy of ENERGY){
  const slug=ShareLinks.slug({reagent:reagent.id,energy:energy.id});assert.ok(!seen.has(slug));seen.add(slug);
  const scenario=ShareLinks.decode('#'+slug);assert.equal(scenario.reagent,reagent.id);assert.equal(scenario.energy,energy.id);
  assert.equal(ShareLinks.encode(scenario),'#'+slug);
 }
});
test('short links preserve every edited input, legacy chemistry, and custom VALCOE',()=>{
 const {ShareLinks}=setup();
 for(const pair of ['lithium-vs-us-grid','custom-chemical-vs-custom-electricity','green-hydrogen-vs-solar-valcoe']){
  const s=ShareLinks.decode('#'+pair);
  Object.assign(s,{price:8.123456789,mass:50,electrons:4,utilization:60,tariff:.22,voltage:2.75,faradaic:75,supply:90,amount:250,legacy:true,plotMax:12,energyMetric:'valcoe'});
  const link=ShareLinks.encode(s);assert.deepEqual(ShareLinks.decode(link),s);
  const url=ShareLinks.url(s,'https://enlepre.github.io/electronsCost/?old=1#old');assert.equal(url.search,'');assert.equal(url.hash,link);
 }
});
test('readable links reject unknown sources and malformed inputs; old shared links still decode',()=>{
 const {ShareLinks}=setup();
 for(const link of ['#unknown-vs-solar','#lithium-vs-us-grid?v=no','#lithium-vs-us-grid?v=Infinity','#lithium-vs-us-grid?l=0','#lithium-vs-us-grid?metric=no','#lithium-vs-us-grid?v=','#lithium-vs-us-grid?typo=1'])assert.equal(ShareLinks.decode(link),null);
 const old={reagent:'li',energy:'us',voltage:2};assert.deepEqual(JSON.parse(JSON.stringify(ShareLinks.decode('#scenario='+encodeURIComponent(JSON.stringify(old))))),old);
});
test('result image reports source costs, voltage, efficiencies and zero-cost verdicts',()=>{
 const {ShareLinks,ResultImage}=setup();const words=[];
 const ctx={fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},setLineDash(){},arc(){},fill(){},fillText:text=>words.push(text),measureText:text=>({width:text.length*12})};
 const canvas={getContext:()=>ctx};const s=ShareLinks.decode('#lithium-vs-us-grid?v=2.5&u=80');
 ResultImage.draw(canvas,s);assert.equal(canvas.width,1200);assert.equal(canvas.height,1050);
 assert.ok(words.includes('Cell voltage (V)'));assert.ok(words.includes('Reagent'));assert.ok(words.includes('Electricity'));assert.ok(words.includes('4 060 USD / kg'));assert.ok(words.some(text=>text.includes('at 2.5 V')));assert.ok(words.some(text=>text.includes('Utilization 80%')));
 words.length=0;s.voltage=0;ResultImage.draw(canvas,s);assert.ok(words.includes('Electricity has zero cost at 0 V'));
 words.length=0;s.price=0;ResultImage.draw(canvas,s);assert.ok(words.includes('The costs are equal at 0 V'));
});
